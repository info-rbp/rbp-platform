import { Link } from "react-router";

import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import {
  premiumMembershipFaqGroups,
  premiumMembershipPlan,
  premiumMembershipRoutes,
} from "../../data/premiumMembership";

export function MembershipFaqPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-blue-700">
              Membership FAQs
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {premiumMembershipPlan.name} Frequently Asked Questions
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              Answers to common questions about {premiumMembershipPlan.name}, early bird pricing, inclusions, service credits, discounts, offers, users, and referral benefits.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={premiumMembershipRoutes.inclusions}
                className="inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
              >
                View Inclusions
              </Link>
              <Link
                to={premiumMembershipRoutes.signup}
                className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Start Sign-Up
              </Link>
            </div>
          </section>

          <section className="mt-8 space-y-6">
            {premiumMembershipFaqGroups.map((group) => (
              <article
                key={group.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-slate-950">{group.title}</h2>
                <div className="mt-6 space-y-4">
                  {group.items.map((item) => (
                    <div
                      key={item.question}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.answer}{" "}
                        {item.includeTermsLink ? (
                          <Link
                            to={premiumMembershipRoutes.terms}
                            className="font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                          >
                            View Membership Terms.
                          </Link>
                        ) : null}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="mt-8 rounded-3xl border border-blue-200 bg-blue-50 p-8 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                Ready to compare the full membership inclusions?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                Review everything included, then continue into the premium membership sign-up preview when you are ready.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-0 sm:justify-end">
              <Link
                to={premiumMembershipRoutes.inclusions}
                className="inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
              >
                View Premium Membership Inclusions
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
