import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

const premiumMembershipHref = "/membership/remote-business-partner-membership";

const benefitCards = [
  {
    eyebrow: "One business platform",
    title: "Everything Starts From One Member Hub",
    description:
      "Use your membership as the front door to RBP services, Nucleus resources, business applications, offers, and support pathways without jumping between disconnected systems.",
  },
  {
    eyebrow: "Core services included",
    title: "Use Core Services When You Need Direction",
    description:
      "Access practical support for everyday business needs across operations, documents, planning, finance, systems, and growth so you can keep moving instead of waiting around.",
  },
  {
    eyebrow: "Nucleus access",
    title: "Access Nucleus Resources and Business Tools",
    description:
      "Get access to digital resources, templates, guides, documents, and tools designed to help small business owners manage work, make decisions, and stay organised.",
  },
  {
    eyebrow: "Discounted help",
    title: "Save on On-Demand Business Services",
    description:
      "When you need more specialised support, your premium membership gives you 25% off eligible On-Demand Services across the RBP platform.",
  },
];

const proofPoints = [
  "Unlimited use of included Core Services",
  "Unlimited access to Nucleus resources, tools, and member assets",
  "25% discount on eligible On-Demand Business Services",
  "Member access to offers, resources, applications, and future platform assets",
];

const purchaseReadinessPoints = [
  "Early bird premium membership pricing",
  "Built for small business owners",
  "One place for tools, resources, services, and offers",
  "Clear next step: review inclusions before joining",
];

function CheckIcon() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
      ✓
    </span>
  );
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm backdrop-blur">
      <p className="text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
    </div>
  );
}

export function MembershipOverviewPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-white via-blue-50/50 to-slate-100 py-16 sm:py-20">
          <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -left-28 bottom-0 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

          <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
            <section>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-blue-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Limited Early Bird Premium Membership Offer
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Finally, A Membership Built For Small Business Owners
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                RBP Premium Membership gives small business owners one digital
                place to access Core Services, Nucleus resources, business
                tools, member offers, applications, and discounted On-Demand
                Business Services. It is built for owners who want practical
                support, clearer systems, and faster access to the resources
                they need to run their business.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={premiumMembershipHref}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition-colors hover:bg-blue-800"
                >
                  View Premium Membership Inclusions
                </Link>

                <Link
                  to="/membership/usage"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
                >
                  See How Membership Works
                </Link>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {purchaseReadinessPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3 rounded-2xl border border-white bg-white/80 p-4 text-sm font-bold text-slate-700 shadow-sm backdrop-blur"
                  >
                    <CheckIcon />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <MetricCard value="75%" label="Early bird saving" />
                <MetricCard value="24/7" label="Digital platform access" />
                <MetricCard value="25%" label="On-demand service discount" />
              </div>
            </section>

            <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
              <div className="rounded-2xl bg-slate-950 p-5 text-white">
                <p className="text-xs font-black uppercase tracking-widest text-blue-300">
                  Early bird premium membership
                </p>

                <h2 className="mt-3 text-2xl font-black">
                  RBP Premium Membership
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  A premium small business membership that gives owners one
                  digital place to access core services, Nucleus resources,
                  practical tools, member offers, and discounted on-demand
                  business support.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <p className="text-sm font-bold text-slate-500 line-through">
                  Normally $100 + GST per week
                </p>

                <p className="mt-1 text-3xl font-black tracking-tight text-blue-700">
                  $25 + GST per week
                </p>

                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-blue-700">
                  Early bird pricing available for a limited time
                </p>
              </div>

              <ul className="mt-6 space-y-4">
                {proofPoints.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm font-semibold leading-6 text-slate-700"
                  >
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={premiumMembershipHref}
                className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition-colors hover:bg-blue-800"
              >
                Check Inclusions and Join
              </Link>

              <p className="mt-4 text-center text-xs font-semibold leading-5 text-slate-500">
                Review the full RBP Premium Membership inclusions before
                joining.
              </p>
            </aside>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-widest text-blue-700">
                Built around the RBP platform
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                A premium membership that connects owners to the tools,
                services, and resources inside Remote Business Partner.
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                This is not a generic advice subscription. RBP Premium
                Membership is designed around the platform experience we are
                building: Nucleus resources, Core Services, On-Demand Services,
                applications, offers, marketplace access, and a member portal
                that gives business owners a clearer way to get support.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {benefitCards.map((card) => (
                <article
                  key={card.title}
                  className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/70"
                >
                  <p className="text-xs font-black uppercase tracking-widest text-blue-700">
                    {card.eyebrow}
                  </p>

                  <h3 className="mt-4 text-lg font-black leading-6 text-slate-950">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-12 text-white">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-300">
                Ready to review what is included?
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight">
                RBP Premium Membership starts from $25 + GST per week
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Compare the inclusions, understand the member benefits, and see
                how the premium membership gives your business access to RBP
                services, resources, tools, and discounts.
              </p>
            </div>

            <Link
              to={premiumMembershipHref}
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-blue-50"
            >
              View Full Premium Inclusions
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}