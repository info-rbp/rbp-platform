import { Link } from "react-router";

import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import {
  premiumMembershipPlan,
  premiumMembershipRoutes,
  premiumMembershipTermsSections,
} from "../../data/premiumMembership";

export function MembershipTermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-blue-700">
              Membership Terms
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {premiumMembershipPlan.name} Terms and Eligibility
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              This page brings together pricing notes, eligibility, fair use guidance,
              credits, referral conditions, and offer detail for {premiumMembershipPlan.name}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={premiumMembershipRoutes.inclusions}
                className="inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
              >
                View Membership Inclusions
              </Link>
              <Link
                to={premiumMembershipRoutes.signup}
                className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Start Membership Sign-Up
              </Link>
            </div>
          </section>

          <section className="mt-8 grid gap-6">
            {premiumMembershipTermsSections.map((section) => (
              <article
                key={section.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-slate-950">{section.title}</h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-600" aria-hidden />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>

          <section className="mt-8 rounded-3xl border border-blue-200 bg-blue-50 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Need the full offer context?</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
              Review the inclusions, FAQs, and sign-up preview together so pricing, access,
              and benefit conditions are easy to compare.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={premiumMembershipRoutes.faq}
                className="inline-flex items-center rounded-xl border border-blue-300 bg-white px-5 py-3 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100"
              >
                Read Membership FAQs
              </Link>
              <Link
                to={premiumMembershipRoutes.overview}
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Back to Overview
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
