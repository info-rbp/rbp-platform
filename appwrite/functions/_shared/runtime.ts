import { Query } from "node-appwrite";
import { createAuditEvent, persistAuditEvent } from "./audit";
import { collectionIds, createAdminContext, requireAdmin, resolveCurrentUser } from "./appwriteAdmin";
import { grantTenantEntitlements, listTenantEntitlements, resolvePlanEntitlements, revokeTenantEntitlements } from "./entitlements";
import { fail, forbidden, notFound, ok, parseJsonBody, unauthorized, validationError } from "./response";
import { buildIdempotencyKey, createCheckoutSession, getStripeClient, mapStripeEventToStatus, verifyWebhookSignature } from "./stripe";

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

function readHeader(context: FunctionContext, name: string) {
  const headers = context.req?.headers || {};
  const matched = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase());
  return matched?.[1] || undefined;
}

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

async function bootstrapTenant(context: FunctionContext) {
  const admin = createAdminContext();
  const payload = parseJsonBody(context);
  requireFields(payload, ["accountId", "email", "name"]);

  const accountId = String(payload.accountId);
  const email = String(payload.email).toLowerCase();
  const name = String(payload.name);
  const businessName = String(payload.businessName || `${name} Business`);
  const planCode = String(payload.planCode || "free");

  const tenantResult = await admin.upsertByQuery(
    collectionIds.tenants,
    [Query.equal("tenant_name", [businessName])],
    { tenant_name: businessName, status: "active", plan_code: planCode },
  );
  const tenantId = String((tenantResult.document as { $id: string }).$id);

  const businessProfileResult = await admin.upsertByQuery(
    collectionIds.businessProfiles,
    [Query.equal("tenant_id", [tenantId])],
    { tenant_id: tenantId, business_name: businessName, contact_email: email },
  );

  const userProfileResult = await admin.upsertByQuery(
    collectionIds.userProfiles,
    [Query.equal("appwrite_user_id", [accountId])],
    { tenant_id: tenantId, appwrite_user_id: accountId, email, role: "member" },
  );
  const userProfileId = String((userProfileResult.document as { $id: string }).$id);

  await admin.upsertByQuery(
    collectionIds.teamMemberships,
    [Query.equal("user_profile_id", [userProfileId])],
    { tenant_id: tenantId, user_profile_id: userProfileId, team_role: "owner" },
  );

  await admin.upsertByQuery(
    collectionIds.subscriptions,
    [Query.equal("tenant_id", [tenantId])],
    { tenant_id: tenantId, plan_code: planCode, status: "active", stripe_subscription_id: undefined },
  );

  const entitlementSummary = await grantTenantEntitlements(tenantId, planCode);
  await createNotification({ tenantId, userId: accountId, title: "Welcome to RBP", message: "Your tenant has been provisioned in Appwrite.", status: "sent" });
  await persistAuditEvent({ eventName: "bootstrap_tenant", actorId: accountId, tenantId, payload });

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
    await admin.createDocument(collectionIds.stripeCustomers, {
      tenant_id: currentUser.tenantId,
      stripe_customer_id: customerId,
      email: String(currentUser.userProfile.email || ""),
    });
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

  await persistAuditEvent({ eventName: "create_membership_checkout", actorId: currentUser.userId, tenantId: currentUser.tenantId, payload: { planCode, checkoutSessionId: session.id } });

  return ok({
    checkout_url: session.url,
    checkout_session_id: session.id,
    status: "pending",
  }, "Checkout session created.");
}

async function handleStripeWebhook(context: FunctionContext) {
  const admin = createAdminContext();
  const signature = readHeader(context, "stripe-signature");
  const rawBody = typeof context.req?.body === "string" ? context.req.body : JSON.stringify(context.req?.body || {});
  if (!signature) {
    return unauthorized("Missing Stripe signature.");
  }

  const event = verifyWebhookSignature(rawBody, signature);
  const idempotencyKey = buildIdempotencyKey(event.id);
  const existing = await admin.findOne<Record<string, unknown>>(collectionIds.paymentEvents, [Query.equal("stripe_event_id", [idempotencyKey])]);
  if (existing) {
    return ok({ received: true, idempotent: true }, "Event already processed.");
  }

  const object = event.data.object as Record<string, unknown>;
  const tenantId = String(object.metadata?.tenant_id || object.customer_details?.metadata?.tenant_id || "");
  const status = mapStripeEventToStatus(event.type);

  await admin.createDocument(collectionIds.paymentEvents, {
    tenant_id: tenantId || undefined,
    event_type: event.type,
    stripe_event_id: idempotencyKey,
    status,
  });

  if (tenantId) {
    const currentSubscription = await admin.findOne<Record<string, unknown> & { $id: string }>(collectionIds.subscriptions, [Query.equal("tenant_id", [tenantId])]);
    if (currentSubscription && "$id" in currentSubscription) {
      await admin.updateDocument(collectionIds.subscriptions, String(currentSubscription.$id), {
        tenant_id: tenantId,
        plan_code: String(currentSubscription.plan_code || object.metadata?.plan_code || "free"),
        status,
        stripe_subscription_id: String(object.subscription || currentSubscription.stripe_subscription_id || ""),
      });
    }

    if (status === "active") {
      await grantTenantEntitlements(tenantId, String(object.metadata?.plan_code || "free"));
    } else if (status === "revoked") {
      await revokeTenantEntitlements(tenantId);
    }

    await createNotification({ tenantId, title: "Subscription updated", message: `Stripe event ${event.type} was processed.`, status: "sent" });
  }

  await persistAuditEvent({ eventName: "stripe_webhook_processed", tenantId: tenantId || undefined, payload: { eventType: event.type, eventId: event.id } });
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
  await createNotification({ tenantId: currentUser.tenantId, userId: currentUser.userId, title: "Subscription cancellation requested", message: "Your subscription will be cancelled at the end of the billing period.", status: "sent" });
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

  await createNotification({ tenantId: String(payload.tenantId), title: "Entitlements updated", message: `Entitlement ${String(payload.entitlementKey)} was updated.`, status: "sent" });
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

  await createNotification({ tenantId: currentUser.tenantId, userId: currentUser.userId, title: "Service request submitted", message: `${serviceType} request ${referenceId} was submitted.`, status: "sent" });
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
  await createNotification({ tenantId: String(existing.tenant_id || ""), title: "Service request updated", message: `Service request ${String(existing.reference_id || payload.serviceRequestId)} is now ${String(payload.status)}.`, status: "sent" });
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
    });
  }

  await persistAuditEvent({ eventName: "send_notification", payload: createAuditEvent("send_notification", payload) as unknown as Record<string, unknown> });
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
    await admin.updateDocument(collectionIds.notificationDeliveries, String(delivery.$id), {
      notification_id: String(delivery.notification_id || ""),
      delivery_type: String(delivery.delivery_type || "email"),
      status: nextStatus,
      recipient,
    });
    processed += 1;
  }

  await persistAuditEvent({ eventName: "process_notification_queue", payload: { processed } });
  return ok({ processed }, "Notification queue processed.");
}

async function adminOperations(context: FunctionContext) {
  await requireAdmin(context);
  const admin = createAdminContext();
  const payload = parseJsonBody(context);
  const action = String(payload.action || "");
  const actionPayload = (payload.payload && typeof payload.payload === "object" ? payload.payload : payload) as Record<string, unknown>;

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
        ...existing,
        ...actionPayload,
      });
      return ok({ updated: true });
    }
    case "list_application_interest":
      return ok({ items: (await admin.listDocuments(collectionIds.applicationInterest)).documents });
    case "update_application_interest_status": {
      requireFields(actionPayload, ["interestId", "status"]);
      const existing = await admin.getDocument<Record<string, unknown>>(collectionIds.applicationInterest, String(actionPayload.interestId));
      await admin.updateDocument(collectionIds.applicationInterest, String(actionPayload.interestId), { ...existing, status: String(actionPayload.status) });
      return ok({ updated: true });
    }
    case "list_service_requests":
      return ok({ items: (await admin.listDocuments(collectionIds.serviceRequests)).documents });
    case "update_service_request_status":
      return adminUpdateServiceStatus({ req: { body: JSON.stringify({ serviceRequestId: actionPayload.serviceRequestId, status: actionPayload.status }), headers: context.req?.headers } });
    case "list_notifications":
      return ok({ items: (await admin.listDocuments(collectionIds.notifications)).documents });
    case "list_audit_events":
      return ok({ items: (await admin.listDocuments(collectionIds.auditEvents)).documents });
    case "list_my_notifications": {
      const currentUser = await resolveCurrentUser(context);
      return ok({ items: (await admin.listDocuments(collectionIds.notifications, [Query.equal("user_id", [currentUser.userId])])).documents });
    }
    case "mark_notification_read": {
      requireFields(actionPayload, ["name"]);
      const existing = await admin.getDocument<Record<string, unknown>>(collectionIds.notifications, String(actionPayload.name));
      await admin.updateDocument(collectionIds.notifications, String(actionPayload.name), { ...existing, status: "sent" });
      return ok({ updated: true });
    }
    case "mark_all_notifications_read": {
      const currentUser = await resolveCurrentUser(context);
      const notifications = await admin.listDocuments<Record<string, unknown> & { $id: string }>(collectionIds.notifications, [Query.equal("user_id", [currentUser.userId])]);
      for (const notification of notifications.documents) {
        await admin.updateDocument(collectionIds.notifications, String(notification.$id), { ...notification, status: "sent" });
      }
      return ok({ updated: notifications.documents.length });
    }
    case "get_portal_dashboard": {
      const currentUser = await resolveCurrentUser(context);
      const subscription = await admin.findOne<Record<string, unknown>>(collectionIds.subscriptions, [Query.equal("tenant_id", [currentUser.tenantId])]);
      const notifications = await admin.listDocuments<Record<string, unknown>>(collectionIds.notifications, [Query.equal("user_id", [currentUser.userId]), Query.limit(10)]);
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
        notifications: notifications.documents,
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
    if (/Missing Appwrite user context|No user profile/.test(message)) return unauthorized(message);
    return fail(message, 500);
  }
}
