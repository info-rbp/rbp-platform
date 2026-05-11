import { Link } from "react-router";

import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import {
  premiumMembershipBenefitCards,
  premiumMembershipBuiltFor,
  premiumMembershipPlan,
  premiumMembershipRoutes,
} from "../../data/premiumMembership";

export function MembershipOverviewPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <section
            id="early-bird-offer"
            className="grid gap-8 rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-8 text-white shadow-xl sm:p-10 lg:grid-cols-[minmax(0,1fr)_380px]"
          >
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-blue-200">
                {premiumMembershipPlan.offerLabel}
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                {premiumMembershipPlan.heroTitle}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
                {premiumMembershipPlan.heroBody}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={premiumMembershipRoutes.inclusions}
                  className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-slate-100"
                >
                  View Premium Membership Inclusions
                </Link>
                <Link
                  to={premiumMembershipRoutes.signup}
                  className="inline-flex items-center rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Start Membership Sign-Up
                </Link>
              </div>
            </div>

            <aside className="rounded-[1.75rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-blue-100">
                {premiumMembershipPlan.name}
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-slate-200">
                  Normally {premiumMembershipPlan.standardPrice}
                </p>
                <p className="text-3xl font-black text-white">
                  Early bird: {premiumMembershipPlan.earlyBirdPrice}
                </p>
              </div>
              <p className="mt-3 text-sm text-blue-100">{premiumMembershipPlan.offerNote}</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-100">
                {premiumMembershipPlan.topHighlights.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-300" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={premiumMembershipRoutes.inclusions}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-400"
              >
                Check Inclusions and Join
              </Link>
            </aside>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {premiumMembershipBenefitCards.map((card) => (
              <article
                key={card.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-slate-950">{card.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.copy}</p>
              </article>
            ))}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <h2 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950">
              Built for business owners who want practical support, better resources, and lower service costs.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {premiumMembershipBuiltFor.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-base font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-blue-200 bg-blue-50 p-8 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                Ready to see everything included?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                Review the full inclusions, compare the member benefits, and move straight into the premium membership sign-up preview when you are ready.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-0 sm:justify-end">
              <Link
                to={premiumMembershipRoutes.inclusions}
                className="inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
              >
                View Full Premium Inclusions
              </Link>
              <Link
                to={premiumMembershipRoutes.signup}
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Start Membership Sign-Up
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
