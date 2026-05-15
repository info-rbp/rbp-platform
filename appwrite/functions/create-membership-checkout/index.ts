import { ok } from "../_shared/response";
import { getStripeConfig } from "../_shared/stripe";

export default async function main() {
  const stripe = getStripeConfig();
  return ok({
    action: "create-membership-checkout",
    stripeConfigured: Boolean(stripe.secretKey && stripe.successUrl && stripe.cancelUrl),
  });
}
