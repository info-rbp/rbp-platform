export function getStripeConfig() {
  return {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    defaultCurrency: process.env.STRIPE_DEFAULT_CURRENCY || "AUD",
    successUrl: process.env.STRIPE_SUCCESS_URL,
    cancelUrl: process.env.STRIPE_CANCEL_URL,
  };
}
