import Stripe from "stripe";

export function getStripeConfig() {
  return {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    defaultCurrency: process.env.STRIPE_DEFAULT_CURRENCY || "AUD",
    successUrl: process.env.STRIPE_SUCCESS_URL,
    cancelUrl: process.env.STRIPE_CANCEL_URL,
  };
}

export function getStripeClient() {
  const config = getStripeConfig();
  if (!config.secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY.");
  }

  return new Stripe(config.secretKey, { apiVersion: "2025-02-24.acacia" });
}

export async function createCheckoutSession(input: {
  customerId?: string;
  email?: string;
  priceId: string;
  metadata?: Record<string, string>;
}) {
  const config = getStripeConfig();
  if (!config.successUrl || !config.cancelUrl) {
    throw new Error("Missing STRIPE_SUCCESS_URL or STRIPE_CANCEL_URL.");
  }

  const stripe = getStripeClient();
  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer: input.customerId,
    customer_email: input.customerId ? undefined : input.email,
    line_items: [{ price: input.priceId, quantity: 1 }],
    success_url: config.successUrl,
    cancel_url: config.cancelUrl,
    metadata: input.metadata,
  });
}

export function verifyWebhookSignature(body: string, signature: string) {
  const config = getStripeConfig();
  if (!config.webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET.");
  }

  return getStripeClient().webhooks.constructEvent(body, signature, config.webhookSecret);
}

export function buildIdempotencyKey(eventId: string) {
  return `stripe:${eventId}`;
}

export function mapStripeEventToStatus(eventType: string) {
  switch (eventType) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "invoice.payment_succeeded":
      return "active";
    case "checkout.session.async_payment_failed":
    case "invoice.payment_failed":
      return "suspended";
    case "checkout.session.expired":
      return "expired";
    case "customer.subscription.deleted":
      return "revoked";
    default:
      return "pending";
  }
}

export function isCheckoutAbandonmentEvent(eventType: string) {
  return eventType === "checkout.session.expired";
}
