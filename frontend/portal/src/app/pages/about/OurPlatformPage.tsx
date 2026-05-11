import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import {
  ArrowRight,
  Briefcase,
  FileText,
  HelpCircle,
  Layers,
  LifeBuoy,
  Map,
  Network,
  Route,
  Settings,
  Store,
  Users,
} from "lucide-react";

const platformPillars = [
  {
    icon: Briefcase,
    title: "Core Services",
    desc: "Structured advisory pathways for decisions, risk, operations, finance, people, and business improvement.",
    href: "/core-services",
  },
  {
    icon: FileText,
    title: "Document Nucleus",
    desc: "Document support, practical templates, briefs, DocuShare pathways, and business documentation guidance.",
    href: "/document-nucleus/overview",
  },
  {
    icon: LifeBuoy,
    title: "On-Demand Services",
    desc: "Targeted support for specific business needs without locking every problem inside a long consulting engagement.",
    href: "/on-demand",
  },
  {
    icon: Settings,
    title: "Managed Services",
    desc: "Ongoing support options for business functions that need repeatable, structured operational help.",
    href: "/managed-services",
  },
  {
    icon: Layers,
    title: "Applications",
    desc: "A growing application layer for business tools, workflows, integrations, and practical digital support.",
    href: "/applications",
  },
  {
    icon: Store,
    title: "Marketplace",
    desc: "Products, listings, partner offers, opportunities, and commercial connections for small business users.",
    href: "/marketplace",
  },
  {
    icon: Users,
    title: "Membership",
    desc: "A membership model designed to give businesses clearer access to support, inclusions, resources, and offers.",
    href: "/membership",
  },
  {
    icon: HelpCircle,
    title: "Help Center & Resources",
    desc: "Guidance, FAQs, business resources, support content, and practical information to help users move forward.",
    href: "/help",
  },
];

const workflowSteps = [
  {
    title: "Discover",
    desc: "Users learn what RBP offers across services, membership, documents, applications, marketplace, and support.",
  },
  {
    title: "Choose a pathway",
    desc: "The platform guides users toward the most relevant service, membership, document, application, or contact path.",
  },
  {
    title: "Submit an intake",
    desc: "Forms and request flows collect the context needed to understand the business, issue, opportunity, or support need.",
  },
  {
    title: "Get routed",
    desc: "Enquiries and requests can be routed to the right service, advisor, support pathway, partner, or future backend workflow.",
  },
  {
    title: "Track progress",
    desc: "The member portal is designed to support visibility across requests, documents, sessions, offers, apps, and support.",
  },
  {
    title: "Access ongoing support",
    desc: "RBP is structured so businesses can keep using relevant resources, membership support, services, and partner pathways.",
  },
];

const audienceItems = [
  "Small business owners",
  "Founders",
  "Operators",
  "Directors",
  "Growing teams",
  "Businesses that need specialist support without hiring every role internally",
];

const differentiators = [
  "Remote-first delivery model",
  "Centralised support ecosystem",
  "Practical advisory and service pathways",
  "Membership-led access and benefits",
  "Document, marketplace, application, and partner support in one structure",
  "Built around small business realities rather than corporate theatre",
];

export function OurPlatformPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-16 text-white sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-200">
                <Network className="h-3.5 w-3.5" />
                Our Platform
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                One platform for advisory, services, documents, applications, and business support.
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Remote Business Partner brings together the practical support small businesses need to make decisions,
                access services, manage documents, explore applications, find opportunities, and stay connected through
                membership.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/core-services"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
                >
                  Explore Services <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/membership"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-slate-900 transition hover:bg-slate-100"
                >
                  View Membership
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Map */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-blue-700">
                <Map className="h-3.5 w-3.5" />
                Platform Map
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                How the RBP ecosystem fits together.
              </h2>

              <p className="mt-5 leading-relaxed text-slate-600">
                The platform is designed as a connected operating layer for small business support. Users can move from
                education to service selection, intake, support, membership, resources, and future portal visibility
                without being sent through a maze of unrelated pages. A rare mercy.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {platformPillars.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>

                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                      View pathway <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-slate-50 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-blue-700">
                <Route className="h-3.5 w-3.5" />
                How It Works
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                From business need to support pathway.
              </h2>

              <p className="mt-5 leading-relaxed text-slate-600">
                The platform is structured around clear user intent. A business should be able to understand the options,
                choose the right pathway, submit context, and move toward support without having to decode the website
                like a tax form written by a committee.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workflowSteps.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="mb-5 text-sm font-black text-blue-700">0{index + 1}</div>
                  <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Audience and Differentiators */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-700">
                Who It Is For
              </p>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Built for small businesses that need support without unnecessary complexity.
              </h2>

              <div className="mt-6 grid gap-3">
                {audienceItems.map((item) => (
                  <div key={item} className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8 shadow-sm">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-700">
                What Makes It Different
              </p>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                A connected model rather than a pile of disconnected offers.
              </h2>

              <div className="mt-6 grid gap-3">
                {differentiators.map((item) => (
                  <div key={item} className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-slate-950 py-16 text-white lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-center">
              <div className="lg:col-span-2">
                <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-300">
                  Next Step
                </p>
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Ready to understand where RBP fits into your business?
                </h2>
                <p className="mt-4 max-w-3xl leading-relaxed text-slate-300">
                  Book a discovery call if you want help choosing the right pathway, or explore services and membership
                  if you already know where you want to start.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  to="/about/discovery-call"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
                >
                  Book Discovery Call <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/core-services"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-bold text-white transition hover:bg-white/10"
                >
                  Explore Services
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-bold text-white transition hover:bg-white/10"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
