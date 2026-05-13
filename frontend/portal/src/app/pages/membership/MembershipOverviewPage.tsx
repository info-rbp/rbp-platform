import { Link } from "react-router";

import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import {
  freeMembershipTier,
  membershipTierComparisonRows,
  membershipTiers,
  premiumMembershipTier,
} from "../../data/membershipTiers";
import {
  premiumMembershipPlan,
  premiumMembershipRoutes,
} from "../../data/premiumMembership";

const comparisonPreview = membershipTierComparisonRows.filter((row) =>
  [
    "Purchase products and services online",
    "Business Advisor",
    "Decision Desk",
    "The Fixer",
    "Risk Advisor",
    "Templates",
    "On-Demand Services",
    "Annual Service Credit",
    "Marketplace Discount",
    "Member Offers",
    "Finance",
    "Referral Bonus",
  ].includes(row.feature)
);

const freeReasons = [
  "Required for online purchases",
  "Helps keep orders, enquiries, and profile details in one place",
  "Gives access to member offers and available benefits",
  "Allows upgrade to Premium at any time",
];

const premiumReasons = [
  "You want unlimited access to Core Services",
  "You use Nucleus resources regularly",
  "You want 25% discounts on services",
  "You want annual service credits",
  "You want marketplace savings and operations benefits",
  "You want referral credit eligibility",
];

export function MembershipOverviewPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <section
            id="early-bird-offer"
            className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-8 text-white shadow-xl sm:p-10"
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-blue-200">
              Membership
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Choose the RBP Membership That Fits How You Use the Platform
            </h1>
            <p className="mt-6 max-w-4xl text-base leading-7 text-slate-200 sm:text-lg">
              Create a free RBP account to purchase products and services online, or upgrade to RBP Premium Membership for Core Services, Nucleus access, service discounts, credits, marketplace savings, and member benefits. Membership checkout is processed securely through Stripe, and QA uses Stripe test mode.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#membership-comparison"
                className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-slate-100"
              >
                Compare Memberships
              </a>
              <Link
                to="/portal/membership/checkout"
                className="inline-flex items-center rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Create account to continue
              </Link>
              <Link
                to="/portal/membership/checkout"
                className="inline-flex items-center rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-400"
              >
                Continue in portal
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-blue-50 px-6 py-5 text-sm text-blue-900 shadow-sm">
            Stripe handles membership checkout. In QA, Stripe runs in test mode, and benefits remain linked to membership status rather than instant activation claims.
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            {membershipTiers.map((tier) => (
              <article
                key={tier.code}
                className={[
                  "rounded-3xl border bg-white p-8 shadow-sm",
                  tier.recommended ? "border-blue-300 ring-4 ring-blue-100" : "border-slate-200",
                ].join(" ")}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-black text-slate-950">{tier.name}</h2>
                  {tier.recommended ? (
                    <span className="rounded-full bg-blue-700 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                      Early Bird Offer
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 text-3xl font-black text-slate-950">{tier.priceLabel}</p>
                {tier.code === "premium" ? (
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Normally {premiumMembershipPlan.standardPrice}
                  </p>
                ) : null}
                <p className="mt-4 text-sm leading-6 text-slate-600">{tier.description}</p>
                <p className="mt-5 text-sm font-bold text-slate-900">
                  Best for:{" "}
                  {tier.code === "free"
                    ? "Creating an account and purchasing online."
                    : "Small business owners who want access, discounts, credits, and ongoing platform benefits."}
                </p>
                <ul className="mt-5 space-y-3 text-sm text-slate-700">
                  {tier.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-600" aria-hidden />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={tier.ctaHref}
                  className={[
                    "mt-6 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-bold transition-colors",
                    tier.recommended
                      ? "bg-blue-700 text-white hover:bg-blue-800"
                      : "border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100",
                  ].join(" ")}
                >
                  {tier.ctaLabel}
                </Link>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <h2 className="text-2xl font-black text-slate-950">
                Why Create a Free RBP Membership?
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Free Membership gives users the account access needed to purchase products and services online, save business details, review member offers, and manage basic platform activity.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {freeReasons.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-600" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <h2 className="text-2xl font-black text-slate-950">
                When to Upgrade to RBP Premium Membership
              </h2>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {premiumReasons.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-600" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section
            id="membership-comparison"
            className="scroll-mt-28 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-200 px-8 py-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-blue-700">
                Comparison Preview
              </p>
              <h2 className="mt-3 text-2xl font-black text-slate-950">
                Free vs Premium Membership
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Feature</th>
                    <th className="px-6 py-4 font-semibold">Free</th>
                    <th className="px-6 py-4 font-semibold">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {comparisonPreview.map((row) => (
                    <tr key={row.feature}>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {row.feature}
                      </td>
                      <td className="px-6 py-4 text-slate-700">{row.free}</td>
                      <td className="px-6 py-4 font-semibold text-blue-700">
                        {row.premium}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-200 px-8 py-6">
              <Link
                to={premiumMembershipRoutes.inclusions}
                className="inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
              >
                View Full Membership Inclusions
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
