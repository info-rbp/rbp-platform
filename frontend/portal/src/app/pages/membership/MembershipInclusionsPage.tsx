import { Link } from "react-router";

import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import {
  premiumMembershipInclusions,
  premiumMembershipPlan,
  premiumMembershipRoutes,
  premiumMembershipSummaryCards,
  premiumMembershipTermsSummary,
} from "../../data/premiumMembership";

const inclusionRows = premiumMembershipInclusions.flatMap((group) =>
  group.items.map((item) => ({
    category: group.category,
    name: item.name,
    value: item.value,
    notes: item.notes,
  }))
);

export function MembershipInclusionsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-blue-700">
                  Premium Membership Inclusions
                </p>
                <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                  Everything Included in {premiumMembershipPlan.name}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
                  {premiumMembershipPlan.summaryBody}
                </p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-bold text-blue-900">
                Early bird: {premiumMembershipPlan.earlyBirdPrice}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={premiumMembershipRoutes.signup}
                className="inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
              >
                Start Membership Sign-Up
              </Link>
              <Link
                to={premiumMembershipRoutes.faq}
                className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Read Membership FAQs
              </Link>
            </div>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {premiumMembershipSummaryCards.map((card) => (
              <article
                key={card.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {card.title}
                </p>
                <p className="mt-3 text-xl font-bold text-slate-950">{card.value}</p>
              </article>
            ))}
          </section>

          <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-8 py-6">
              <h2 className="text-2xl font-bold text-slate-950">Full Membership Inclusions</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Review the included services, discounts, resources, credits, and member benefits in one place.
              </p>
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Inclusion / Benefit</th>
                    <th className="px-6 py-4 font-semibold">RBP Premium Membership</th>
                    <th className="px-6 py-4 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {inclusionRows.map((row) => (
                    <tr key={`${row.category}-${row.name}`}>
                      <td className="px-6 py-4 font-semibold text-slate-900">{row.category}</td>
                      <td className="px-6 py-4 text-slate-900">{row.name}</td>
                      <td className="px-6 py-4 font-semibold text-blue-700">{row.value}</td>
                      <td className="px-6 py-4 text-slate-600">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-5 lg:hidden">
              {premiumMembershipInclusions.map((group) => (
                <section key={group.category} className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="text-lg font-bold text-slate-950">{group.category}</h3>
                  <div className="mt-4 space-y-3">
                    {group.items.map((item) => (
                      <article
                        key={item.name}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="text-base font-semibold text-slate-950">{item.name}</p>
                        <p className="mt-1 text-sm font-bold text-blue-700">{item.value}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.notes}</p>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-slate-950">Important Membership Terms</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
              {premiumMembershipTermsSummary.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-600" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to={premiumMembershipRoutes.terms}
              className="mt-6 inline-flex items-center text-sm font-bold text-blue-700 hover:text-blue-800 hover:underline"
            >
              View Membership Terms
            </Link>
          </section>

          <section className="mt-8 rounded-3xl border border-blue-200 bg-blue-50 p-8 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                Ready to access these inclusions?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                Move into the premium membership sign-up preview or review the most common questions before you continue.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-0 sm:justify-end">
              <Link
                to={premiumMembershipRoutes.signup}
                className="inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
              >
                Start Membership Sign-Up
              </Link>
              <Link
                to={premiumMembershipRoutes.faq}
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Read Membership FAQs
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
