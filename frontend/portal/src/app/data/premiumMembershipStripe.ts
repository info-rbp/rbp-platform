export const premiumMembershipStripeTestCatalog = {
  environment: "test",
  product: {
    name: "RBP Premium Membership",
    stripeProductId: "prod_UUkCHEv53d9xLJ",
  },
  prices: {
    earlyBirdWeekly: {
      label: "Early bird weekly",
      amount: 25,
      currency: "AUD",
      interval: "week",
      tax: "GST exclusive",
      stripePriceId: "price_1TVlMC0xk2ucRLEh9h6bjNuc",
    },
    standardWeekly: {
      label: "Standard weekly",
      amount: 100,
      currency: "AUD",
      interval: "week",
      tax: "GST exclusive",
      stripePriceId: "price_1TVlMI0xk2ucRLEhxoHGI1As",
    },
    bidManagementOnboarding: {
      label: "Bid Management discounted onboarding",
      amount: 250,
      currency: "AUD",
      interval: "once",
      tax: "GST exclusive",
      stripePriceId: "price_1TVlMS0xk2ucRLEhu8iS43ly",
    },
    additionalUserWeekly: {
      label: "Additional premium member user weekly",
      amount: 5,
      currency: "AUD",
      interval: "week",
      tax: "GST exclusive",
      stripePriceId: "price_1TVlMa0xk2ucRLEhN1uN1FGN",
    },
  },
  notes: [
    "These IDs are for Stripe test mode only.",
    "Do not use these IDs in live Stripe mode.",
    "Live product and price IDs should be added only after the live Stripe catalog is created and verified.",
    "lookup_key, metadata, and tax_behavior were not set through the available Stripe connector and should be completed during live setup if required.",
  ],
} as const;

export type PremiumMembershipStripeTestCatalog = typeof premiumMembershipStripeTestCatalog;
