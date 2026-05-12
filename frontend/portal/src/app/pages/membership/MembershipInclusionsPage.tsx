import { Link } from "react-router";

import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import { premiumMembershipRoutes } from "../../data/premiumMembership";
import {
  freeMembershipTier,
  membershipTierComparisonRows,
  premiumMembershipTier,
} from "../../data/membershipTiers";

export function MembershipInclusionsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-blue-700">
              Membership Inclusions
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Compare RBP Free and Premium Membership
            </h1>
            <p className="mt-5 max-w-4xl text-base leading-7 text-slate-600">
              Both memberships give users access to the RBP platform. Free Membership allows users to purchase products and services online and access selected benefits. RBP Premium Membership unlocks enhanced access, discounts, credits, and premium member benefits.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/portal/membership/checkout" className="inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800">
                Create account to continue
              </Link>
              <Link to="/portal/membership/checkout" className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
                Continue in portal
              </Link>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">{freeMembershipTier.name}</h2>
              <p className="mt-2 text-3xl font-black text-slate-950">{freeMembershipTier.priceLabel}</p>
              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                {freeMembershipTier.highlights.map((item) => (
                  <li key={item} className="flex gap-3"><span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-600" /><span>{item}</span></li>
                ))}
              </ul>
            </article>
            <article className="rounded-3xl border border-blue-300 bg-white p-6 shadow-sm ring-4 ring-blue-100">
              <h2 className="text-2xl font-black text-slate-950">{premiumMembershipTier.name}</h2>
              <p className="mt-2 text-3xl font-black text-slate-950">{premiumMembershipTier.priceLabel}</p>
              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                {premiumMembershipTier.highlights.map((item) => (
                  <li key={item} className="flex gap-3"><span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-600" /><span>{item}</span></li>
                ))}
              </ul>
            </article>
          </section>

          <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-8 py-6">
              <h2 className="text-2xl font-bold text-slate-950">Full Membership Comparison</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Review Free Membership and RBP Premium Membership across services, resources, discounts, credits, offers, operations benefits, and other account settings.
              </p>
            </div>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Inclusion / Benefit</th>
                    <th className="px-6 py-4 font-semibold">Free Membership</th>
                    <th className="px-6 py-4 font-semibold">RBP Premium Membership</th>
                    <th className="px-6 py-4 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {membershipTierComparisonRows.map((row) => (
                    <tr key={`${row.category}-${row.feature}`}>
                      <td className="px-6 py-4 font-semibold text-slate-900">{row.category}</td>
                      <td className="px-6 py-4 text-slate-900">{row.feature}</td>
                      <td className="px-6 py-4 text-slate-700">{row.free}</td>
                      <td className="px-6 py-4 font-semibold text-blue-700">{row.premium}</td>
                      <td className="px-6 py-4 text-slate-600">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-4 p-5 lg:hidden">
              {membershipTierComparisonRows.map((row) => (
                <article key={`${row.category}-${row.feature}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{row.category}</p>
                  <h3 className="mt-1 text-base font-bold text-slate-950">{row.feature}</h3>
                  <dl className="mt-3 grid gap-2 text-sm">
                    <div><dt className="font-semibold text-slate-500">Free</dt><dd className="text-slate-800">{row.free}</dd></div>
                    <div><dt className="font-semibold text-slate-500">Premium</dt><dd className="text-blue-700">{row.premium}</dd></div>
                  </dl>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{row.notes}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-slate-950">Membership Terms and Eligibility</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Some benefits, credits, discounts, and offers may be subject to eligibility, fair use, and membership terms.
            </p>
            <Link to={premiumMembershipRoutes.terms} className="mt-6 inline-flex items-center text-sm font-bold text-blue-700 hover:text-blue-800 hover:underline">
              View Membership Terms
            </Link>
          </section>

          <section className="mt-8 rounded-3xl border border-blue-200 bg-blue-50 p-8 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">Ready to choose your membership?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                Create a Free Membership for online purchasing access, or start Premium to unlock enhanced benefits.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-0 sm:justify-end">
              <Link to="/portal/membership/checkout" className="inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800">Create account to continue</Link>
              <Link to="/portal/membership/checkout" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100">Continue in portal</Link>
              <Link to={premiumMembershipRoutes.faq} className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100">Read FAQs</Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
