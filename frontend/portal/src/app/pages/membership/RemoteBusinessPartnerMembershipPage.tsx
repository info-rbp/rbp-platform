import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { mockMembershipPlans } from "../../mock";

const membershipBenefits = [
  {
    title: "Unlimited Use of Core Services",
    description:
      "Access practical support designed to help you manage day-to-day business needs without waiting for a callback.",
  },
  {
    title: "Unlimited Access to Nucleus",
    description:
      "Use business resources, tools, documents, and platform assets built for small business owners.",
  },
  {
    title: "25% Discount on On-Demand Services",
    description:
      "Receive member pricing on eligible on-demand services when you need additional support.",
  },
  {
    title: "Plus Much More",
    description:
      "Access a growing membership experience with more resources, assets, and tools being added over time.",
  },
];

export function RemoteBusinessPartnerMembershipPage() {
  const plan = mockMembershipPlans[0];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-700">
                Earlybird Offer
              </p>

              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                {plan.name}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
                Grab the early bird offer with a discounted membership fee and all the inclusions you need to run your business.
                Get access to tools, resources, Nucleus, core services, partner offers, and on-demand support whenever you need it.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/membership/inclusions"
                  className="inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
                >
                  See Full Inclusions
                </Link>

                <Link
                  to="/membership"
                  className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Back to Membership
                </Link>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {membershipBenefits.map((benefit) => (
                  <article
                    key={benefit.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <h2 className="text-sm font-bold text-slate-950">
                      {benefit.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {benefit.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
                Available for a limited time only
              </p>

              <h2 className="mt-3 text-2xl font-black text-slate-950">
                {plan.price.label}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Premium Early Bird Offer for Premium Business Owners. All digital, all designed to help you access the tools and resources you need to run your business.
              </p>

              <ul className="mt-5 space-y-3 text-sm font-semibold text-slate-700">
                {plan.inclusions.map((inclusion) => (
                  <li key={inclusion} className="rounded-xl bg-white p-4 shadow-sm">
                    {inclusion}
                  </li>
                ))}
              </ul>
            </aside>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
