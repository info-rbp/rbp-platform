import { Query } from "node-appwrite";
import { createAuditEvent, persistAuditEvent } from "./audit";
import {
  collectionIds,
  createAdminContext,
  getHeader,
  isTrustedInternalInvocation,
  requireAdmin,
  resolveCurrentUser,
  type CurrentUserContext
} from "./appwriteAdmin";
import {
  grantTenantEntitlements,
  listTenantEntitlements,
  revokeTenantEntitlements
} from "./entitlements";
import {
  fail,
  forbidden,
  notFound,
  ok,
  parseJsonBody,
  unauthorized,
  validationError
} from "./response";
import {
  buildIdempotencyKey,
  createCheckoutSession,
  getStripeClient,
  isCheckoutAbandonmentEvent,
  mapStripeEventToStatus,
  verifyWebhookSignature
} from "./stripe";

type FunctionContext = {
  req?: {
    body?: string | Record<string, unknown> | null;
    headers?: Record<string, string | undefined>;
  };
};

const serviceConfig = {
  "decision-desk": { detailCollection: collectionIds.decisionDeskRequests, prefix: "RBP-DD" },
  docushare: { detailCollection: collectionIds.docushareBriefs, prefix: "RBP-DOC" },
  connectivity: { detailCollection: collectionIds.connectivityOrders, prefix: "RBP-NBN" },
  "risk-advisor": { detailCollection: collectionIds.riskAssessments, prefix: "RBP-RISK" },
  "the-fixer": { detailCollection: collectionIds.fixerRequests, prefix: "RBP-FIX" },
  "marketplace-listing": { detailCollection: collectionIds.marketplaceListings, prefix: "RBP-MKT" },
  "marketplace-enquiry": { detailCollection: collectionIds.marketplaceEnquiries, prefix: "RBP-MKT" },
} as const;

const CUSTOMER_NOTIFICATION_ACTIONS = new Set([
  "list_my_notifications",
  "mark_notification_read",
  "mark_all_notifications_read",
  "get_portal_dashboard",
  "register_application_interest",
]);

function requireFields(payload: Record<string, unknown>, fields: string[]) {
  const errors = fields
    .filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === "")
    .map((field) => ({ field, code: "required", message: `${field} is required.` }));

  if (errors.length) {
    throw Object.assign(new Error("validation"), { validationErrors: errors });
  }
}

function createReference(prefix: string) {
  const year = new Date().getFullYear();
  const suffix = String(Date.now()).slice(-4).padStart(4, "0");
  return `${prefix}-${year}-${suffix}`;
}

function stripSystemFields(record: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record).filter(([key]) => !key.startsWith("$")),
  );
}

function isTrustedInvocation(context: FunctionContext) {
  const configuredToken = process.env.APPWRITE_TRUSTED_FUNCTION_TOKEN || process.env.RBP_INTERNAL_FUNCTION_TOKEN;
  if (!configuredToken) {
    return false;
  }

  const presentedToken = getHeader(context, "x-rbp-trusted-invocation") || getHeader(context, "x-rbp-internal-token");
  return Boolean(presentedToken && presentedToken === configuredToken);
}

function resolveBootstrapAccountId(context: FunctionContext, payload: Record<string, unknown>) {
  const headerUserId = getHeader(context, "x-appwrite-user-id") || getHeader(context, "x-user-id");
  const payloadAccountId = payload.accountId ? String(payload.accountId) : "";

  if (headerUserId && payloadAccountId && headerUserId !== payloadAccountId) {
    throw new Error("Authenticated Appwrite user context does not match the requested account.");
  }

  if (headerUserId) {
    return headerUserId;
  }

  if (payloadAccountId && (isTrustedInternalInvocation(context) || isTrustedInvocation(context))) {
    return payloadAccountId;
  }

  throw new Error("Authenticated Appwrite user context is required to bootstrap a tenant.");
}

function toRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, unknown>;
  }

  return value as Record<string, unknown>;
}

function isFreePlan(plan: Record<string, unknown>) {
  return String(plan.plan_code || "") === "free" || Number(plan.amount ?? 0) <= 0;
}

async function createNotification(input: {
  tenantId?: string;
  userId?: string;
  title: string;
  message: string;
  status?: string;
  channel?: string;
}) {
  const admin = createAdminContext();
  return admin.createDocument(collectionIds.notifications, {
    tenant_id: input.tenantId || undefined,
    user_id: input.userId || undefined,
    title: input.title,
    message: input.message,
    status: input.status || "pending",
    channel: input.channel || "in_app",
  });
}

async function resolveTenantName(input: { businessName: string; accountId: string }) {
  const admin = createAdminContext();
  const listed = await admin.listDocuments<Record<string, unknown>>(
    collectionIds.tenants,
    [Query.equal("tenant_name", [input.businessName]), Query.limit(1)],
  );

  if (!listed.documents.length) {
    return input.businessName;
  }

  const suffix = input.accountId.replace(/[^a-zA-Z0-9]/g, "").slice(-8) || String(Date.now()).slice(-6);
  return `${input.businessName} (${suffix})`;
}

async function bootstrapTenant(context: FunctionContext) {
  const admin = createAdminContext();
  const payload = parseJsonBody(context);
  requireFields(payload, ["email", "name"]);

  const accountId = resolveBootstrapAccountId(context, payload);
  const email = String(payload.email).toLowerCase();
  const name = String(payload.name);
  const businessName = String(payload.businessName || `${name} Business`);
  const requestedPlanCode = String(payload.planCode || "free");
  const planCode = "free";
  const role = "owner";

  const existingProfile = await admin.findOne<Record<string, unknown> & { $id: string }>(
    collectionIds.userProfiles,
    [Query.equal("appwrite_user_id", [accountId])],
  );

  let tenantId = String(existingProfile?.tenant_id || "");
  let userProfileId = existingProfile ? String(existingProfile.$id) : "";

  if (!tenantId) {
    const tenantName = await resolveTenantName({ businessName, accountId });
    const tenant = await admin.createDocument(collectionIds.tenants, {
      tenant_name: tenantName,
      status: "active",
      plan_code: planCode,
    }) as { $id: string };
    tenantId = String(tenant.$id);
  }

  const businessProfileResult = await admin.upsertByQuery(
    collectionIds.businessProfiles,
    [Query.equal("tenant_id", [tenantId])],
    { tenant_id: tenantId, business_name: businessName, contact_email: email },
  );

  if (existingProfile) {
    await admin.updateDocument(collectionIds.userProfiles, userProfileId, {
      ...stripSystemFields(existingProfile),
      tenant_id: tenantId,
      appwrite_user_id: accountId,
      email,
      role: existingProfile.role === "admin" ? "admin" : "member",
    });
  } else {
    const userProfile = await admin.createDocument(collectionIds.userProfiles, {
      tenant_id: tenantId,
      appwrite_user_id: accountId,
      email,
      role,
    }) as { $id: string };
    userProfileId = String(userProfile.$id);
  }

  await admin.upsertByQuery(
    collectionIds.teamMemberships,
    [Query.equal("user_profile_id", [userProfileId])],
    { tenant_id: tenantId, user_profile_id: userProfileId, team_role: role === "admin" ? "admin" : "owner" },
  );

  await admin.upsertByQuery(
    collectionIds.subscriptions,
    [Query.equal("tenant_id", [tenantId])],
    { tenant_id: tenantId, plan_code: planCode, status: "active", stripe_subscription_id: undefined },
  );

  const entitlementSummary = await grantTenantEntitlements(tenantId, planCode);
  await createNotification({
    tenantId,
    userId: accountId,
    title: "Welcome to RBP",
    message: "Your tenant has been provisioned in Appwrite.",
    status: "sent",
  });

  await persistAuditEvent({
    eventName: "bootstrap_tenant",
    actorId: accountId,
    tenantId,
    payload: { accountId, email, businessName, planCode, requestedPlanCode, role },
  });

  return ok({
    tenantId,
    businessProfileId: String((businessProfileResult.document as { $id: string }).$id),
    userProfileId,
    entitlementSummary,
  }, "Tenant bootstrapped.");
}

async function createMembershipCheckout(context: FunctionContext) {
  const admin = createAdminContext();
  const currentUser = await resolveCurrentUser(context);
  const payload = parseJsonBody(context);
  requireFields(payload, ["planCode"]);

  const planCode = String(payload.planCode);
  const plan = await admin.findOne<Record<string, unknown> & { $id: string }>(
    collectionIds.membershipPlans,
    [Query.equal("plan_code", [planCode])],
  );
  if (!plan || plan.active === false) {
    return notFound("Membership plan not found or inactive.");
  }

  if (isFreePlan(plan)) {
    const subscriptionResult = await admin.upsertByQuery(
      collectionIds.subscriptions,
      [Query.equal("tenant_id", [currentUser.tenantId])],
      {
        tenant_id: currentUser.tenantId,
        plan_code: planCode,
        status: "active",
        stripe_subscription_id: undefined,
      },
    );

    const entitlementSummary = await grantTenantEntitlements(currentUser.tenantId, planCode);
    await createNotification({
      tenantId: currentUser.tenantId,
      userId: currentUser.userId,
      title: "Free membership activated",
      message: "Your tenant is now on the free membership plan. No Stripe checkout was required.",
      status: "sent",
    });
    await persistAuditEvent({
      eventName: "activate_free_membership",
      actorId: currentUser.userId,
      tenantId: currentUser.tenantId,
      payload: { planCode, subscriptionId: String((subscriptionResult.document as { $id: string }).$id) },
    });

    return ok({
      requires_checkout: false,
      checkout_url: null,
      checkout_session_id: null,
      plan_code: planCode,
      status: "active",
      entitlements: entitlementSummary,
    }, "Free membership activated.");
  }

  const priceId = String(plan.stripe_price_id || "");
  if (!priceId) {
    return fail("Selected plan is missing a Stripe price id.", 409);
  }

  const customerRecord = await admin.findOne<Record<string, unknown> & { $id: string }>(
    collectionIds.stripeCustomers,
    [Query.equal("tenant_id", [currentUser.tenantId])],
  );

  let customerId = String(customerRecord?.stripe_customer_id || "");
  if (!customerId) {
    const stripe = getStripeClient();
    const customer = await stripe.customers.create({
      email: String(currentUser.userProfile.email || ""),
      metadata: { tenant_id: currentUser.tenantId, appwrite_user_id: currentUser.userId },
    });
    customerId = customer.id;
    await admin.upsertByQuery(
      collectionIds.stripeCustomers,
      [Query.equal("tenant_id", [currentUser.tenantId])],
      {
        tenant_id: currentUser.tenantId,
        stripe_customer_id: customerId,
      },
    );
  }

  const session = await createCheckoutSession({
    customerId,
    email: String(currentUser.userProfile.email || ""),
    priceId,
    metadata: {
      tenant_id: currentUser.tenantId,
      appwrite_user_id: currentUser.userId,
      plan_code: planCode,
    },
  });

  await admin.createDocument(collectionIds.paymentEvents, {
    tenant_id: currentUser.tenantId,
    event_type: "checkout.session.created",
    stripe_event_id: session.id,
    status: "pending",
  });

  await persistAuditEvent({
    eventName: "create_membership_checkout",
    actorId: currentUser.userId,
    tenantId: currentUser.tenantId,
    payload: { planCode, checkoutSessionId: session.id },
  });

  return ok({
    requires_checkout: true,
    checkout_url: session.url,
    checkout_session_id: session.id,
    status: "pending",
  }, "Checkout session created.");
}

async function handleStripeWebhook(context: FunctionContext) {
  const admin = createAdminContext();
  const signature = getHeader(context, "stripe-signature");
  const rawBody = typeof context.req?.body === "string" ? context.req.body : JSON.stringify(context.req?.body || {});
  if (!signature) {
    return unauthorized("Missing Stripe signature.");
  }

  const event = verifyWebhookSignature(rawBody, signature);
  const eventFingerprint = buildIdempotencyKey(event.id);
  const existing = await admin.findOne<Record<string, unknown>>(collectionIds.paymentEvents, [Query.equal("stripe_event_id", [eventFingerprint])]);
  if (existing) {
    return ok({ received: true, idempotent: true }, "Event already processed.");
  }

  const object = toRecord(event.data.object);
  const metadata = toRecord(object.metadata);
  let tenantId = String(metadata.tenant_id || "");
  let planCode = String(metadata.plan_code || "");
  const stripeSubscriptionId = String(object.subscription || "");

  let currentSubscription = stripeSubscriptionId
    ? await admin.findOne<Record<string, unknown> & { $id: string }>(
      collectionIds.subscriptions,
      [Query.equal("stripe_subscription_id", [stripeSubscriptionId])],
    )
    : null;

  if (!currentSubscription && tenantId) {
    currentSubscription = await admin.findOne<Record<string, unknown> & { $id: string }>(
      collectionIds.subscriptions,
      [Query.equal("tenant_id", [tenantId])],
    );
  }

  if (!tenantId && currentSubscription?.tenant_id) {
    tenantId = String(currentSubscription.tenant_id);
  }

  if (!planCode && currentSubscription?.plan_code) {
    planCode = String(currentSubscription.plan_code);
  }

  const status = mapStripeEventToStatus(event.type);
  const paymentTenantId = tenantId || String(currentSubscription?.tenant_id || "unassigned");

  await admin.createDocument(collectionIds.paymentEvents, {
    tenant_id: paymentTenantId,
    event_type: event.type,
    stripe_event_id: eventFingerprint,
    status,
  });

  if (isCheckoutAbandonmentEvent(event.type)) {
    if (tenantId) {
      await createNotification({
        tenantId,
        title: "Premium checkout expired",
        message: "Premium checkout was not completed. Your tenant remains on its current membership plan.",
        status: "sent",
      });
    }

    await persistAuditEvent({
      eventName: "stripe_webhook_processed",
      tenantId: tenantId || undefined,
      payload: { eventType: event.type, eventId: event.id, planCode, status, subscriptionUnchanged: true },
    });
    return ok({ received: true, event: event.type, subscription_unchanged: true }, "Checkout expired without subscription changes.");
  }

  if (tenantId) {
    if (currentSubscription && "$id" in currentSubscription) {
      await admin.updateDocument(collectionIds.subscriptions, String(currentSubscription.$id), {
        tenant_id: tenantId,
        plan_code: planCode || String(currentSubscription.plan_code || "free"),
        status,
        stripe_subscription_id: stripeSubscriptionId || String(currentSubscription.stripe_subscription_id || ""),
      });
    }

    if (status === "active") {
      await grantTenantEntitlements(tenantId, planCode || "free");
    } else if (status === "revoked" || status === "suspended") {
      await revokeTenantEntitlements(tenantId);
    }

    await createNotification({
      tenantId,
      title: "Subscription updated",
      message: `Stripe event ${event.type} was processed.`,
      status: "sent",
    });
  }

  await persistAuditEvent({
    eventName: "stripe_webhook_processed",
    tenantId: tenantId || undefined,
    payload: { eventType: event.type, eventId: event.id, planCode, status },
  });
  return ok({ received: true, event: event.type }, "Webhook processed.");
}

async function getSubscriptionStatus(context: FunctionContext) {
  const admin = createAdminContext();
  const currentUser = await resolveCurrentUser(context);
  const payload = parseJsonBody(context);
  const subscription = await admin.findOne<Record<string, unknown>>(collectionIds.subscriptions, [Query.equal("tenant_id", [currentUser.tenantId])]);
  if (!subscription) {
    return ok({ status: "none", subscription: null, payments: [] }, "No subscription found.");
  }

  const response: Record<string, unknown> = { subscription };
  if (payload.includePayments) {
    const payments = await admin.listDocuments<Record<string, unknown>>(collectionIds.paymentEvents, [Query.equal("tenant_id", [currentUser.tenantId])]);
    response.payments = payments.documents;
  }
  if (payload.includeEntitlements) {
    response.entitlements = await listTenantEntitlements(currentUser.tenantId);
  }

  return ok(response, "Subscription returned.");
}

async function cancelSubscription(context: FunctionContext) {
  const admin = createAdminContext();
  const currentUser = await resolveCurrentUser(context);
  const subscription = await admin.findOne<Record<string, unknown> & { $id: string }>(collectionIds.subscriptions, [Query.equal("tenant_id", [currentUser.tenantId])]);
  if (!subscription) {
    return notFound("No subscription found for this tenant.");
  }

  const stripeSubscriptionId = String(subscription.stripe_subscription_id || "");
  if (stripeSubscriptionId) {
    await getStripeClient().subscriptions.update(stripeSubscriptionId, { cancel_at_period_end: true });
  }

  await admin.updateDocument(collectionIds.subscriptions, String(subscription.$id), {
    tenant_id: currentUser.tenantId,
    plan_code: String(subscription.plan_code || "free"),
    status: "suspended",
    stripe_subscription_id: stripeSubscriptionId || undefined,
  });
  await revokeTenantEntitlements(currentUser.tenantId);
  await createNotification({
    tenantId: currentUser.tenantId,
    userId: currentUser.userId,
    title: "Subscription cancellation requested",
    message: "Your subscription will be cancelled at the end of the billing period.",
    status: "sent",
  });
  await persistAuditEvent({ eventName: "cancel_subscription", actorId: currentUser.userId, tenantId: currentUser.tenantId });
  return ok({ cancelled: true, status: "suspended" }, "Subscription cancellation scheduled.");
}

async function listMyEntitlements(context: FunctionContext) {
  const currentUser = await resolveCurrentUser(context);
  const entitlements = await listTenantEntitlements(currentUser.tenantId);
  return ok({ entitlements }, "Entitlements returned.");
}

async function adminUpdateEntitlements(context: FunctionContext) {
  await requireAdmin(context);
  const payload = parseJsonBody(context);
  requireFields(payload, ["tenantId", "entitlementKey", "enabled"]);

  const admin = createAdminContext();
  await admin.upsertByQuery(
    collectionIds.tenantEntitlements,
    [Query.equal("tenant_id", [String(payload.tenantId)]), Query.equal("entitlement_key", [String(payload.entitlementKey)])],
    {
      tenant_id: String(payload.tenantId),
      entitlement_key: String(payload.entitlementKey),
      enabled: Boolean(payload.enabled),
    },
  );

  await createNotification({
    tenantId: String(payload.tenantId),
    title: "Entitlements updated",
    message: `Entitlement ${String(payload.entitlementKey)} was updated.`,
    status: "sent",
  });
  await persistAuditEvent({ eventName: "admin_update_entitlements", payload });
  return ok({ updated: true }, "Entitlements updated.");
}

async function createServiceRequest(context: FunctionContext) {
  const admin = createAdminContext();
  const currentUser = await resolveCurrentUser(context);
  const payload = parseJsonBody(context);
  const serviceType = String(payload.serviceType || payload.product || "");
  if (!(serviceType in serviceConfig)) {
    return validationError([{ field: "serviceType", code: "invalid", message: "Unsupported service type." }]);
  }

  const config = serviceConfig[serviceType as keyof typeof serviceConfig];
  const referenceId = createReference(config.prefix);
  const summary = String(payload.summary || payload.description || payload.title || "Submitted through portal");

  const serviceRequest = await admin.createDocument(collectionIds.serviceRequests, {
    tenant_id: currentUser.tenantId,
    user_id: currentUser.userId,
    request_type: serviceType,
    reference_id: referenceId,
    status: "submitted",
  });

  const serviceRequestId = String((serviceRequest as { $id: string }).$id);
  const detailPayload: Record<string, unknown> = { service_request_id: serviceRequestId };
  if (config.detailCollection === collectionIds.marketplaceEnquiries) {
    detailPayload.listing_id = String(payload.listingId || "listing-pending");
    detailPayload.tenant_id = currentUser.tenantId;
    detailPayload.message = summary;
  } else if (config.detailCollection === collectionIds.decisionDeskRequests) {
    detailPayload.business_name = String(payload.businessName || currentUser.userProfile.email || "RBP Client");
    detailPayload.summary = summary;
  } else {
    detailPayload.summary = summary;
  }
  await admin.createDocument(config.detailCollection, detailPayload);

  await createNotification({
    tenantId: currentUser.tenantId,
    userId: currentUser.userId,
    title: "Service request submitted",
    message: `${serviceType} request ${referenceId} was submitted.`,
    status: "sent",
  });
  await persistAuditEvent({ eventName: "create_service_request", actorId: currentUser.userId, tenantId: currentUser.tenantId, payload: { serviceType, referenceId } });

  return ok({
    id: serviceRequestId,
    reference: referenceId,
    reference_id: referenceId,
    title: String(payload.title || serviceType),
    description: summary,
    status: "submitted",
    href: "/portal/services",
    nextAction: "Await RBP review",
  }, "Service request submitted.");
}

async function listMyServiceRequests(context: FunctionContext) {
  const admin = createAdminContext();
  const currentUser = await resolveCurrentUser(context);
  const payload = parseJsonBody(context);
  const queries = [Query.equal("tenant_id", [currentUser.tenantId])];
  if (payload.status) {
    queries.push(Query.equal("status", [String(payload.status)]));
  }
  if (payload.type) {
    queries.push(Query.equal("request_type", [String(payload.type)]));
  }
  if (payload.limit) {
    queries.push(Query.limit(Number(payload.limit)));
  }

  const listed = await admin.listDocuments<Record<string, unknown>>(collectionIds.serviceRequests, queries);
  return ok({ requests: listed.documents }, "Service requests returned.");
}

async function adminListServiceRequests(context: FunctionContext) {
  await requireAdmin(context);
  const admin = createAdminContext();
  const payload = parseJsonBody(context);
  const queries: string[] = [];
  if (payload.status) queries.push(Query.equal("status", [String(payload.status)]));
  if (payload.type) queries.push(Query.equal("request_type", [String(payload.type)]));
  if (payload.tenant) queries.push(Query.equal("tenant_id", [String(payload.tenant)]));
  if (payload.limit) queries.push(Query.limit(Number(payload.limit)));
  const listed = await admin.listDocuments<Record<string, unknown>>(collectionIds.serviceRequests, queries);
  return ok({ requests: listed.documents }, "Admin service requests returned.");
}

async function adminUpdateServiceStatus(context: FunctionContext) {
  await requireAdmin(context);
  const admin = createAdminContext();
  const payload = parseJsonBody(context);
  requireFields(payload, ["serviceRequestId", "status"]);
  const existing = await admin.getDocument<Record<string, unknown> & { tenant_id?: string; request_type?: string }>(collectionIds.serviceRequests, String(payload.serviceRequestId));
  if (!existing) {
    return notFound("Service request not found.");
  }

  await admin.updateDocument(collectionIds.serviceRequests, String(payload.serviceRequestId), {
    tenant_id: String(existing.tenant_id || ""),
    user_id: existing.user_id,
    request_type: String(existing.request_type || ""),
    reference_id: String(existing.reference_id || ""),
    status: String(payload.status),
  });
  await createNotification({
    tenantId: String(existing.tenant_id || ""),
    title: "Service request updated",
    message: `Service request ${String(existing.reference_id || payload.serviceRequestId)} is now ${String(payload.status)}.`,
    status: "sent",
  });
  await persistAuditEvent({ eventName: "admin_update_service_status", payload });
  return ok({ updated: true }, "Service request updated.");
}

function isAllowedRecipient(email: string) {
  const allowlist = String(process.env.QA_EMAIL_ALLOWLIST || process.env.APPWRITE_QA_EMAIL_ALLOWLIST || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (!allowlist.length) {
    return false;
  }

  return allowlist.includes(email.toLowerCase());
}

async function sendNotification(context: FunctionContext) {
  const payload = parseJsonBody(context);
  requireFields(payload, ["title", "message"]);
  const notification = await createNotification({
    tenantId: payload.tenantId ? String(payload.tenantId) : undefined,
    userId: payload.userId ? String(payload.userId) : undefined,
    title: String(payload.title),
    message: String(payload.message),
    status: "pending",
    channel: String(payload.channel || "in_app"),
  });

  const admin = createAdminContext();
  const recipient = String(payload.recipient || "");
  let deliveryStatus = "skipped";
  if (recipient) {
    deliveryStatus = isAllowedRecipient(recipient) ? "pending" : "skipped";
    await admin.createDocument(collectionIds.notificationDeliveries, {
      notification_id: String((notification as { $id: string }).$id),
      delivery_type: String(payload.channel || "email"),
      status: deliveryStatus,
      recipient,
      provider_message_id: deliveryStatus === "pending" ? `fake-${Date.now()}` : undefined,
      error_message: deliveryStatus === "skipped" ? "Recipient is not on the QA email allowlist." : "",
      attempt_count: recipient ? 1 : 0,
      last_attempt_at: new Date().toISOString(),
      sent_at: "",
    });
  }

  await persistAuditEvent({
    eventName: "send_notification",
    payload: createAuditEvent("send_notification", payload).payload as Record<string, unknown>,
  });
  return ok({ notificationId: String((notification as { $id: string }).$id), deliveryStatus }, "Notification queued.");
}

async function processNotificationQueue(context: FunctionContext) {
  await requireAdmin(context);
  const admin = createAdminContext();
  const listed = await admin.listDocuments<Record<string, unknown> & { $id: string }>(
    collectionIds.notificationDeliveries,
    [Query.equal("status", ["pending"])],
  );

  let processed = 0;
  for (const delivery of listed.documents) {
    const recipient = String(delivery.recipient || "");
    const nextStatus = isAllowedRecipient(recipient) ? "sent" : "skipped";
    const attemptCount = Number(delivery.attempt_count || 0) + 1;
    await admin.updateDocument(collectionIds.notificationDeliveries, String(delivery.$id), {
      notification_id: String(delivery.notification_id || ""),
      delivery_type: String(delivery.delivery_type || "email"),
      status: nextStatus,
      recipient,
      provider_message_id: nextStatus === "sent" ? String(delivery.provider_message_id || `fake-${delivery.$id}`) : String(delivery.provider_message_id || ""),
      error_message: nextStatus === "skipped" ? "Recipient is not on the QA email allowlist." : "",
      sent_at: nextStatus === "sent" ? new Date().toISOString() : String(delivery.sent_at || ""),
      attempt_count: attemptCount,
      last_attempt_at: new Date().toISOString(),
    });
    processed += 1;
  }

  await persistAuditEvent({ eventName: "process_notification_queue", payload: { processed } });
  return ok({ processed }, "Notification queue processed.");
}

async function listNotificationsForUser(currentUser: CurrentUserContext) {
  const admin = createAdminContext();
  const seen = new Set<string>();
  const items: Array<Record<string, unknown> & { $id?: string }> = [];

  for (const queries of [
    [Query.equal("user_id", [currentUser.userId])],
    [Query.equal("tenant_id", [currentUser.tenantId])],
  ]) {
    const listed = await admin.listDocuments<Record<string, unknown> & { $id?: string }>(collectionIds.notifications, queries);
    for (const notification of listed.documents) {
      const notificationUserId = String(notification.user_id || "");
      const notificationTenantId = String(notification.tenant_id || "");
      const canRead = notificationUserId === currentUser.userId
        || (!notificationUserId && notificationTenantId === currentUser.tenantId);
      const id = String(notification.$id || "");
      if (canRead && id && !seen.has(id)) {
        seen.add(id);
        items.push(notification);
      }
    }
  }

  return items;
}

function canAccessNotification(currentUser: CurrentUserContext, notification: Record<string, unknown>) {
  const notificationUserId = String(notification.user_id || "");
  const notificationTenantId = String(notification.tenant_id || "");
  return notificationUserId === currentUser.userId
    || (!notificationUserId && notificationTenantId === currentUser.tenantId);
}

async function handleCustomerAdminOperation(context: FunctionContext, action: string, actionPayload: Record<string, unknown>) {
  const admin = createAdminContext();

  switch (action) {
    case "list_my_notifications": {
      const currentUser = await resolveCurrentUser(context);
      return ok({ items: await listNotificationsForUser(currentUser) });
    }
    case "mark_notification_read": {
      const currentUser = await resolveCurrentUser(context);
      const notificationId = String(actionPayload.notificationId || actionPayload.name || "");
      if (!notificationId) {
        return validationError([{ field: "notificationId", code: "required", message: "notificationId is required." }]);
      }

      const existing = await admin.getDocument<Record<string, unknown>>(collectionIds.notifications, notificationId);
      if (!canAccessNotification(currentUser, existing)) {
        return forbidden("Notification access is scoped to the current user or tenant.");
      }

      await admin.updateDocument(collectionIds.notifications, notificationId, {
        ...stripSystemFields(existing),
        status: "read",
      });
      return ok({ updated: true });
    }
    case "mark_all_notifications_read": {
      const currentUser = await resolveCurrentUser(context);
      const notifications = await listNotificationsForUser(currentUser) as Array<Record<string, unknown> & { $id?: string }>;
      let updated = 0;
      for (const notification of notifications) {
        if (!notification.$id || notification.status === "read") continue;
        await admin.updateDocument(collectionIds.notifications, String(notification.$id), {
          ...stripSystemFields(notification),
          status: "read",
        });
        updated++;
      }
      return ok({ updated });
    }
    case "get_portal_dashboard": {
      const currentUser = await resolveCurrentUser(context);
      const subscription = await admin.findOne<Record<string, unknown>>(collectionIds.subscriptions, [Query.equal("tenant_id", [currentUser.tenantId])]);
      const notifications = await listNotificationsForUser(currentUser);
      const activities = await admin.listDocuments<Record<string, unknown>>(collectionIds.serviceRequests, [Query.equal("tenant_id", [currentUser.tenantId]), Query.limit(10)]);
      return ok({
        membershipStatus: String(subscription?.status || "pending"),
        membershipPlan: String(subscription?.plan_code || "free"),
        customer: {
          id: currentUser.userId,
          name: String(currentUser.userProfile.email || currentUser.userId),
          email: String(currentUser.userProfile.email || ""),
          businessName: String(currentUser.userProfile.business_name || currentUser.userProfile.email || "RBP Client"),
        },
        activities: activities.documents,
        notifications,
      });
    }
    case "register_application_interest": {
      const currentUser = await resolveCurrentUser(context);
      requireFields(actionPayload, ["application_key"]);
      const application = await admin.findOne<Record<string, unknown> & { $id: string }>(collectionIds.applications, [Query.equal("application_key", [String(actionPayload.application_key)])]);
      if (!application) {
        return notFound("Application not found.");
      }

      const interest = await admin.createDocument(collectionIds.applicationInterest, {
        tenant_id: currentUser.tenantId,
        user_id: currentUser.userId,
        application_id: String(application.$id),
        business_name: String(actionPayload.business_name || currentUser.userProfile.business_name || ""),
        contact_name: String(actionPayload.contact_name || currentUser.userProfile.email || ""),
        email: String(actionPayload.email || currentUser.userProfile.email || ""),
        phone: String(actionPayload.phone || ""),
        interest_notes: String(actionPayload.interest_notes || ""),
        status: "submitted",
        source_channel: String(actionPayload.source_channel || "portal"),
      });

      await persistAuditEvent({ eventName: "register_application_interest", actorId: currentUser.userId, tenantId: currentUser.tenantId, payload: actionPayload });
      return ok({ ok: true, interest_id: String((interest as { $id: string }).$id), application: String(application.application_name || actionPayload.application_key) });
    }
    default:
      return validationError([{ field: "action", code: "invalid", message: `Unknown customer action: ${action || "<none>"}` }]);
  }
}

async function adminOperations(context: FunctionContext) {
  const payload = parseJsonBody(context);
  const action = String(payload.action || "");
  const actionPayload = (payload.payload && typeof payload.payload === "object" ? payload.payload : payload) as Record<string, unknown>;

  if (CUSTOMER_NOTIFICATION_ACTIONS.has(action)) {
    return handleCustomerAdminOperation(context, action, actionPayload);
  }

  await requireAdmin(context);
  const admin = createAdminContext();

  switch (action) {
    case "list_tenants":
      return ok({ items: (await admin.listDocuments(collectionIds.tenants)).documents });
    case "list_user_profiles":
      return ok({ items: (await admin.listDocuments(collectionIds.userProfiles)).documents });
    case "list_subscriptions":
      return ok({ items: (await admin.listDocuments(collectionIds.subscriptions)).documents });
    case "list_payment_events":
      return ok({ items: (await admin.listDocuments(collectionIds.paymentEvents)).documents });
    case "list_applications":
      return ok({ items: (await admin.listDocuments(collectionIds.applications)).documents });
    case "update_application": {
      requireFields(actionPayload, ["applicationId"]);
      const existing = await admin.getDocument<Record<string, unknown>>(collectionIds.applications, String(actionPayload.applicationId));
      await admin.updateDocument(collectionIds.applications, String(actionPayload.applicationId), {
        ...stripSystemFields(existing),
        ...stripSystemFields(actionPayload),
      });
      return ok({ updated: true });
    }
    case "list_application_interest":
      return ok({ items: (await admin.listDocuments(collectionIds.applicationInterest)).documents });
    case "update_application_interest_status": {
      requireFields(actionPayload, ["interestId", "status"]);
      const existing = await admin.getDocument<Record<string, unknown>>(collectionIds.applicationInterest, String(actionPayload.interestId));
      await admin.updateDocument(collectionIds.applicationInterest, String(actionPayload.interestId), {
        ...stripSystemFields(existing),
        status: String(actionPayload.status),
      });
      return ok({ updated: true });
    }
    case "list_service_requests":
      return ok({ items: (await admin.listDocuments(collectionIds.serviceRequests)).documents });
    case "update_service_request_status":
      return adminUpdateServiceStatus({ req: { body: JSON.stringify({ serviceRequestId: actionPayload.serviceRequestId, status: actionPayload.status }), headers: context.req?.headers } });
    case "list_notifications":
      return ok({ items: (await admin.listDocuments(collectionIds.notifications)).documents });
    case "list_notification_deliveries":
      return ok({ items: (await admin.listDocuments(collectionIds.notificationDeliveries)).documents });
    case "list_audit_events":
      return ok({ items: (await admin.listDocuments(collectionIds.auditEvents)).documents });
    default:
      return validationError([{ field: "action", code: "invalid", message: `Unknown admin action: ${action || "<none>"}` }]);
  }
}

export async function runNamedHandler(name: string, context: FunctionContext) {
  try {
    switch (name) {
      case "bootstrap-tenant":
        return await bootstrapTenant(context);
      case "create-membership-checkout":
        return await createMembershipCheckout(context);
      case "stripe-webhook":
        return await handleStripeWebhook(context);
      case "get-subscription-status":
        return await getSubscriptionStatus(context);
      case "cancel-subscription":
        return await cancelSubscription(context);
      case "list-my-entitlements":
        return await listMyEntitlements(context);
      case "admin-update-entitlements":
        return await adminUpdateEntitlements(context);
      case "create-service-request":
        return await createServiceRequest(context);
      case "list-my-service-requests":
        return await listMyServiceRequests(context);
      case "admin-list-service-requests":
        return await adminListServiceRequests(context);
      case "admin-update-service-status":
        return await adminUpdateServiceStatus(context);
      case "send-notification":
        return await sendNotification(context);
      case "process-notification-queue":
        return await processNotificationQueue(context);
      case "admin-operations":
        return await adminOperations(context);
      default:
        return notFound(`Unknown function handler: ${name}`);
    }
  } catch (error) {
    if (error && typeof error === "object" && "validationErrors" in error) {
      return validationError((error as { validationErrors: unknown[] }).validationErrors);
    }

    const message = error instanceof Error ? error.message : String(error);
    if (/Administrator access/.test(message)) return forbidden(message);
    if (/Missing Appwrite user context|No user profile|Authenticated Appwrite user context is required/i.test(message)) return unauthorized(message);
    return fail(message, 500);
  }
}
