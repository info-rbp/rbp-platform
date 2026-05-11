import { Link } from "react-router";
import {
  ArrowRight,
  CheckCircle,
  ClipboardList,
  FileSearch,
  FileText,
  Layers,
  MessageSquareText,
  PenTool,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { PageHero } from "../../components/PageHero";

const heroImage =
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

const processSteps = [
  {
    icon: FileSearch,
    title: "Understand the document need",
    desc: "Identify the type of document, intended use, audience, jurisdiction, and business context before anything is drafted or assembled.",
  },
  {
    icon: Layers,
    title: "Select the right starting point",
    desc: "Use the most suitable template, suite, toolkit, or industry pack as the foundation so the document starts from a practical structure.",
  },
  {
    icon: PenTool,
    title: "Generate and adapt content",
    desc: "Shape the document around the user's business inputs, required sections, terminology, and operating model.",
  },
  {
    icon: ShieldCheck,
    title: "Review for usability",
    desc: "Check that the output is clear, complete, and ready for the user to review, refine, or escalate for custom support.",
  },
];

const customisationSteps = [
  {
    icon: MessageSquareText,
    title: "Scope the requirement",
    desc: "Clarify what the document needs to do, where the standard template stops being enough, and what business-specific detail must be included.",
  },
  {
    icon: ClipboardList,
    title: "Gather source information",
    desc: "Collect policies, processes, examples, role details, workflows, or industry requirements that need to be reflected in the custom document.",
  },
  {
    icon: Settings2,
    title: "Customise the structure",
    desc: "Adapt the document sections, wording, responsibilities, review points, and practical instructions to suit the business context.",
  },
  {
    icon: RefreshCw,
    title: "Refine and finalise",
    desc: "Review the draft, adjust the details, and produce a version that is practical for the business to use internally or with stakeholders.",
  },
];

function ProcessCard({
  number,
  icon: Icon,
  title,
  desc,
}: {
  number: number;
  icon: typeof FileText;
  title: string;
  desc: string;
}) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute right-5 top-5 text-5xl font-black leading-none text-slate-100">
        {String(number).padStart(2, "0")}
      </div>
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-3 text-lg font-extrabold text-slate-950">{title}</h3>
      <p className="text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  );
}

function NucleusCta() {
  return (
    <section className="bg-blue-700 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 rounded-3xl bg-white p-8 shadow-2xl lg:flex-row lg:items-center lg:justify-between lg:p-10">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              Document Nucleus
            </p>
            <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              Find the right document pathway for your business
            </h2>
            <p className="leading-relaxed text-slate-600">
              Use Nucleus to explore templates, suites, toolkits, industry packs, and customisation pathways without turning every process page into another document category. Revolutionary restraint, apparently.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/document-nucleus/overview"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-800"
            >
              Explore Nucleus <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact?reason=document-support"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NucleusProcessPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        title="How Nucleus"
        titleAccent="Documents Are Generated"
        subtitle="A practical overview of the process used to move from a document need to a usable business document, template, toolkit, or suite."
        badge="Nucleus Process"
        breadcrumb="Nucleus Process"
        image={heroImage}
        bullets={["Document scoping", "Structured generation", "Practical review"]}
        ctaPrimary={{ label: "Explore Nucleus", href: "/document-nucleus/overview" }}
        ctaSecondary={{ label: "View Templates", href: "/document-nucleus/category/templates" }}
        stat={{ value: "4", label: "Process Stages", sublabel: "Scope, select, generate, review" }}
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
              Process overview
            </span>
            <h2 className="mb-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              This is not a document category
            </h2>
            <p className="leading-relaxed text-slate-600">
              The Process page explains how documents are generated and prepared inside Nucleus. Templates, documentation suites, toolkits, and industry packs remain the actual document categories. A tiny distinction, yet somehow vital to preventing navigational soup.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <ProcessCard key={step.title} number={index + 1} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="mb-5 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
                What the process supports
              </span>
              <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                From generic resource to business-ready document
              </h2>
              <p className="mb-6 leading-relaxed text-slate-600">
                Nucleus is designed to reduce the gap between finding a document and making it usable. The process helps users understand where to start, what inputs matter, and when a standard template should become a customised document.
              </p>
              <div className="space-y-3">
                {[
                  "Clearer document selection before drafting begins",
                  "Better use of business context and operating details",
                  "More consistent outputs across templates and suites",
                  "A clear hand-off point when customisation is required",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                Document pathway
              </p>
              <h3 className="mb-5 text-2xl font-extrabold">Category first, process second</h3>
              <p className="mb-6 leading-relaxed text-slate-300">
                Users should pick from categories when they need a document type. They should use this page when they need to understand how the document generation pathway works.
              </p>
              <Link
                to="/document-nucleus/customisation"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-800"
              >
                View Customisation Process <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <NucleusCta />
      <Footer />
    </div>
  );
}

export function NucleusCustomisationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        title="Nucleus"
        titleAccent="Customisation Process"
        subtitle="An overview of how standard templates and document structures can be adapted into custom documents for a specific business context."
        badge="Document Customisation"
        breadcrumb="Customisation"
        image={heroImage}
        bullets={["Custom document scoping", "Business-specific drafting", "Practical refinement"]}
        ctaPrimary={{ label: "Explore Nucleus", href: "/document-nucleus/overview" }}
        ctaSecondary={{ label: "Contact Us", href: "/contact?reason=document-customisation" }}
        stat={{ value: "4", label: "Customisation Stages", sublabel: "Scope, gather, adapt, finalise" }}
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
              Customisation overview
            </span>
            <h2 className="mb-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Customisation is a service pathway, not a document shelf
            </h2>
            <p className="leading-relaxed text-slate-600">
              This page explains how Nucleus can support custom documents when a standard template, suite, toolkit, or industry pack needs to be adapted to match a business's real process, structure, and operating language.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {customisationSteps.map((step, index) => (
              <ProcessCard key={step.title} number={index + 1} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="mb-5 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
                When customisation helps
              </span>
              <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                When the template is close, but not enough
              </h2>
              <p className="mb-6 leading-relaxed text-slate-600">
                Customisation is useful when a document needs to reflect a business's internal process, role structure, industry language, risk profile, or stakeholder requirements. The aim is not to make documents longer. Humanity has suffered enough PDFs. The aim is to make them more usable.
              </p>
              <div className="space-y-3">
                {[
                  "Adapt templates to suit a specific business model",
                  "Create custom policies, procedures, forms, and packs",
                  "Align document language with internal roles and workflows",
                  "Refine outputs for practical use by staff, clients, or stakeholders",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mb-4 text-2xl font-extrabold text-slate-950">Custom document examples</h3>
              <div className="space-y-3">
                {[
                  "Business-specific policy documents",
                  "Procedure manuals and workflow guides",
                  "Client-facing document packs",
                  "Role-based templates and internal forms",
                  "Industry-specific operating documents",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <FileText className="h-4 w-4 flex-shrink-0 text-blue-700" />
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <NucleusCta />
      <Footer />
    </div>
  );
}
