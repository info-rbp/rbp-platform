import path from "node:path";
import { Query } from "node-appwrite";
import { createAdminServices, readJson } from "./_lib";
import { getStripeClient } from "../../appwrite/functions/_shared/stripe";

type MembershipPlan = Record<string, unknown> & {
  plan_code?: string;
  amount?: number;
  billing_cycle?: string;
  currency?: string;
  stripe_product_id?: string;
  stripe_price_id?: string;
  active?: boolean;
};

function readSeedPlans() {
  return readJson<MembershipPlan[]>(
    path.join(process.cwd(), "appwrite", "seeds", "qa", "membership_plans.json"),
  );
}

function normalizePlanMap(plans: MembershipPlan[]) {
  return new Map(plans.map((plan) => [String(plan.plan_code || ""), plan]));
}

function validateRequiredPlans(plans: MembershipPlan[], source: string) {
  const planMap = normalizePlanMap(plans);
  const free = planMap.get("free");
  const premium = planMap.get("premium");

  if (!free || !premium) {
    throw new Error(`${source} is missing the free or premium membership plan.`);
  }

  if (Number(free.amount ?? 0) !== 0) {
    throw new Error(`${source} must keep the free membership plan at zero cost.`);
  }

  if (free.stripe_price_id) {
    throw new Error(`${source} must not require a Stripe subscription price id for the free plan.`);
  }

  if (String(premium.billing_cycle ?? "") !== "weekly") {
    throw new Error(`${source} must keep the premium plan on weekly billing.`);
  }

  if (Number(premium.amount ?? 0) !== 25) {
    throw new Error(`${source} must keep the premium plan at AUD 25 plus GST.`);
  }

  if (premium.stripe_price_id !== "price_1TXx7C0mYebE7B3JyCL64COg") {
    throw new Error(`${source} must keep the premium plan on the approved QA Stripe test price id.`);
  }

  if (premium.active !== true) {
    throw new Error(`${source} must keep the premium plan active for QA validation.`);
  }

  return { free, premium };
}

async function validateLiveStripe(plan: MembershipPlan) {
  const stripe = getStripeClient();
  const priceId = String(plan.stripe_price_id || "");
  const productId = String(plan.stripe_product_id || "");
  const price = await stripe.prices.retrieve(priceId);

  if (!price.active) {
    throw new Error(`Stripe price ${priceId} is not active.`);
  }

  if (productId && typeof price.product === "string" && price.product !== productId) {
    throw new Error(`Stripe price ${priceId} points to product ${price.product}, expected ${productId}.`);
  }

  if (plan.currency && String(plan.currency).toLowerCase() !== price.currency) {
    throw new Error(`Stripe price ${priceId} uses ${price.currency}, expected ${String(plan.currency).toLowerCase()}.`);
  }

  return {
    priceId,
    currency: price.currency,
    product: price.product,
  };
}

try {
  const seedPlans = readSeedPlans();
  const { premium: premiumSeedPlan } = validateRequiredPlans(seedPlans, "QA seed data");

  const report: Record<string, unknown> = {
    seed: {
      status: "validated",
      planCodes: seedPlans.map((plan) => String(plan.plan_code || "")).filter(Boolean),
    },
    liveAppwrite: {
      status: "skipped",
      message: "Set APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY, and APPWRITE_DATABASE_ID to validate live Appwrite membership plan records.",
    },
    liveStripe: {
      status: "skipped",
      message: "Set STRIPE_SECRET_KEY to validate live Stripe price ids.",
    },
  };

  if (
    process.env.APPWRITE_ENDPOINT
    && process.env.APPWRITE_PROJECT_ID
    && process.env.APPWRITE_API_KEY
    && process.env.APPWRITE_DATABASE_ID
  ) {
    const { databases, databaseId } = createAdminServices();
    const listed = await databases.listDocuments<MembershipPlan>(databaseId, "membership_plans", [Query.limit(100)]);
    const livePlans = listed.documents.map((document) => ({ ...document }));
    validateRequiredPlans(livePlans, "Live Appwrite membership_plans collection");

    report.liveAppwrite = {
      status: "validated",
      total: listed.total,
      planCodes: livePlans.map((plan) => String(plan.plan_code || "")).filter(Boolean),
    };
  }

  if (process.env.STRIPE_SECRET_KEY) {
    report.liveStripe = {
      status: "validated",
      free: {
        status: "skipped",
        message: "Free membership has no subscription checkout price; Stripe is used only for pay-per-use purchases.",
      },
      premium: await validateLiveStripe(premiumSeedPlan),
    };
  }

  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
