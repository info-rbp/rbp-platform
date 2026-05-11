import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CTABanner } from "../components/CTABanner";
import { PageHero } from "../components/PageHero";
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  Compass,
  FileText,
  Handshake,
  Layers,
  Lightbulb,
  Route,
  Settings,
  ShieldCheck,
  Store,
  Target,
  Users,
  Zap,
} from "lucide-react";

const teamImage =
  "https://images.unsplash.com/photo-1758691736975-9f7f643d178e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwYnVzaW5lc3MlMjB0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3NzY5MjMzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080";

const colabImage =
  "https://images.unsplash.com/photo-1752650735943-d0fbf1edce21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxlbnRyZXByZW5ldXIlMjB0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzY5MjA3MzB8MA&ixlib=rb-4.1.0&q=80&w=1080";

const builtItems = [
  {
    icon: Briefcase,
    title: "Advisory services",
    desc: "Structured support for decisions, operations, growth, risk, finance, people, and business improvement.",
    href: "/core-services",
  },
  {
    icon: FileText,
    title: "Document Nucleus",
    desc: "Document pathways, brief creation, practical templates, and DocuShare support for business documentation needs.",
    href: "/document-nucleus/overview",
  },
  {
    icon: Users,
    title: "Membership hub",
    desc: "A membership model designed to give businesses clearer access to support, inclusions, offers, and resources.",
    href: "/membership",
  },
  {
    icon: Store,
    title: "Marketplace",
    desc: "A business marketplace for opportunities, products, listings, partner offers, and commercial connections.",
    href: "/marketplace",
  },
  {
    icon: Settings,
    title: "Operations support",
    desc: "Practical pathways for connectivity, finance, insurance, calculators, and operational business support.",
    href: "/operations",
  },
  {
    icon: Layers,
    title: "Business applications",
    desc: "A growing application layer for tools, workflows, integrations, and digital business support.",
    href: "/applications",
  },
  {
    icon: Handshake,
    title: "Partner ecosystem",
    desc: "A partner model for advisors, service providers, suppliers, specialists, and future platform collaborators.",
    href: "/about/work-with-us",
  },
];

const workSteps = [
  {
    icon: Compass,
    title: "Understand the need",
    desc: "We start by clarifying the business problem, context, urgency, and outcome the business is trying to achieve.",
  },
  {
    icon: Route,
    title: "Route the pathway",
    desc: "We guide the business toward the right advisory, service, document, application, membership, or partner pathway.",
  },
  {
    icon: Lightbulb,
    title: "Make it practical",
    desc: "The focus is on useful next steps, not abstract strategy documents that look impressive and solve nothing.",
  },
  {
    icon: CheckCircle,
    title: "Support the next move",
    desc: "RBP is designed to help businesses continue through delivery, support, resources, and ongoing platform access.",
  },
];

const values = [
  {
    icon: Target,
    title: "Practicality",
    desc: "We focus on what a business can actually use, implement, and measure.",
  },
  {
    icon: Lightbulb,
    title: "Clarity",
    desc: "We reduce noise, simplify decisions, and make the next step easier to understand.",
  },
  {
    icon: ShieldCheck,
    title: "Accountability",
    desc: "We believe advice and support should be tied to real business outcomes, not vague activity.",
  },
  {
    icon: Briefcase,
    title: "Commercial usefulness",
    desc: "Everything should help the business operate better, save time, reduce risk, or grow with more confidence.",
  },
  {
    icon: Zap,
    title: "Speed without chaos",
    desc: "We value momentum, but not the kind where everyone is running and nobody knows why.",
  },
];

const trustPoints = [
  "Built around the real operating needs of small businesses",
  "Designed to combine advice, service pathways, documents, tools, marketplace access, and membership",
  "Remote-first so support can be delivered flexibly and efficiently",
  "Structured around clear intake, routing, and practical next steps",
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <PageHero
        title="A smarter operating partner"
        titleAccent="for small business"
        subtitle="Remote Business Partner gives small businesses a connected way to access advisory, services, documents, applications, marketplace opportunities, membership support, and practical business resources."
        badge="About Us"
        breadcrumb="About Us"
        image={teamImage}
        bullets={[
          "Remote-first business support",
          "Advisory, services, documents, and tools",
          "Built for small business operators",
        ]}
        ctaPrimary={{ label: "Book Discovery Call", href: "/about/discovery-call" }}
        ctaSecondary={{ label: "Explore Our Platform", href: "/about/our-platform" }}
        stat={{
          value: "1",
          label: "Connected Platform",
          sublabel: "For advisory, services, tools, documents, membership, and support",
        }}
      />

      {/* Who we are */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="mb-5 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
                Who We Are
              </span>
              <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                RBP is not just a consultancy. It is a business support platform built around how small businesses actually operate.
              </h2>
              <p className="mb-6 leading-relaxed text-slate-600">
                Remote Business Partner was created for founders, directors, operators, and growing teams who need access to trusted business support without building a full internal advisory department.
              </p>
              <p className="mb-8 leading-relaxed text-slate-600">
                We bring together advisory, execution support, digital tools, document pathways, marketplace access, partner services, and membership benefits so businesses can move from problem to pathway faster.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/about/discovery-call"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition-all hover:bg-blue-800"
                >
                  Book a Discovery Call <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/about/our-platform"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Explore Our Platform
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl shadow-2xl shadow-slate-200">
              <img src={colabImage} alt="Remote Business Partner collaboration" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* What we have built */}
      <section className="bg-slate-50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
              What We Have Built
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              A connected ecosystem for practical business support.
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              RBP is being developed as a platform where small businesses can find the right pathway, request support, access documents, explore services, connect with offers, and use resources from one place.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {builtItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                    Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why we built it */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <span className="mb-5 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
                Why We Built It
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Small businesses need better access to support without the usual maze of disconnected providers.
              </h2>
            </div>

            <div className="space-y-6">
              <p className="leading-relaxed text-slate-600">
                Most small businesses eventually hit the same problem: they need expert help, but the available options are fragmented, expensive, generic, or too slow. One provider handles documents, another handles finance, another handles operations, another sells tools, and nobody owns the whole picture.
              </p>
              <p className="leading-relaxed text-slate-600">
                Remote Business Partner exists to close that gap. The platform is designed to give businesses a clearer way to access advice, services, documents, partner support, applications, and resources without turning every business problem into a scavenger hunt.
              </p>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <h3 className="mb-4 font-bold text-slate-900">Why businesses should trust the model</h3>
                <div className="space-y-3">
                  {trustPoints.map((point) => (
                    <div key={point} className="flex gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-700" />
                      <p className="text-sm leading-relaxed text-slate-700">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="bg-slate-950 py-20 text-white lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <span className="mb-4 inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-300">
              How We Work
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Clear intake. Practical routing. Useful next steps.
            </h2>
            <p className="mt-5 leading-relaxed text-slate-300">
              The platform is structured to help businesses move from uncertainty to action through a clear pathway instead of another endless exploratory conversation. Humanity has suffered enough calendar invitations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {workSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-7">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-black text-slate-500">0{index + 1}</span>
                  </div>
                  <h3 className="mb-3 font-bold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-300">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
              What Drives Us
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Values built for useful work.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-slate-600">
              RBP is designed around practical business outcomes, not consultant theatre, bloated process, or presentations that somehow need three meetings to explain one slide.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div key={value.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-bold text-slate-900">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-center">
              <div className="lg:col-span-2">
                <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-700">
                  What should you do next?
                </p>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Start with the pathway that fits your intent.
                </h2>
                <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
                  Book a discovery call if you want help choosing the right next step, contact us for a general enquiry, or work with us if you are exploring a partnership with RBP.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  to="/about/discovery-call"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition-all hover:bg-blue-800"
                >
                  Book Discovery Call <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Contact Us
                </Link>
                <Link
                  to="/about/work-with-us"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Work With Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </div>
  );
}
