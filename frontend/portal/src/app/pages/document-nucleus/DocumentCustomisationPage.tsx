import { Link } from "react-router";
import { ArrowRight, CheckCircle, FileSearch, FileText, MessageSquare, PenTool, ShieldCheck, SlidersHorizontal } from "lucide-react";

import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { PageHero } from "../../components/PageHero";

const heroImage =
  "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

const customisationTypes = [
  { icon: PenTool, title: "Adapt an existing template", desc: "Adjust wording, structure, sections, and use cases so an existing document fits the business properly." },
  { icon: FileSearch, title: "Create a custom document", desc: "Scope a document from scratch when a template, suite, toolkit, or industry pack is not enough." },
  { icon: SlidersHorizontal, title: "Configure requirements", desc: "Shape the document around business context, audience, process, jurisdiction, complexity, and intended use." },
  { icon: ShieldCheck, title: "Prepare for practical use", desc: "Turn the output into a document the member can review, operationalise, and maintain." },
];

export function DocumentCustomisationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        title="Document"
        titleAccent="Customisation"
        subtitle="Nucleus customisation helps members adapt existing documents or scope new custom documents around their business needs."
        badge="Nucleus Customisation"
        breadcrumb="Customisation"
        image={heroImage}
        bullets={["Template adaptation", "Custom document scoping", "Member-specific requirements"]}
        ctaPrimary={{ label: "Submit through your account", href: "/portal/services/docushare/start" }}
        ctaSecondary={{ label: "Explore Nucleus", href: "/document-nucleus/overview" }}
        stat={{ value: "Custom", label: "Document Support", sublabel: "Adapt, scope, configure" }}
      />

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-5">Customisation process</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">When standard documents need to fit the business</h2>
              <p className="text-slate-600 leading-relaxed mb-6">Customisation is not a document category. It is the process for adapting an existing document or creating a new document when the business context needs something more specific.</p>
              <p className="text-slate-600 leading-relaxed mb-8">The aim is to capture the member's practical requirements first, then shape the document around how it will actually be used. An outrageous idea, apparently.</p>
              <div className="space-y-3">
                {["Adapt existing templates, suites, toolkits, or packs", "Scope custom documents from scratch", "Capture business-specific requirements and context", "Prepare documents for review, use, and ongoing refinement"].map((item) => (
                  <div key={item} className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /><span className="text-slate-700 font-medium text-sm">{item}</span></div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {customisationTypes.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-sm transition-all">
                    <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4"><Icon className="w-5 h-5" /></div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1.5">{item.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full mb-4">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">A simple path for custom document work</h2>
            <p className="text-slate-600 leading-relaxed">The customisation pathway is designed to clarify what needs changing, what needs creating, and what the final document needs to achieve.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Review the starting point", "Define the required changes", "Prepare the custom output"].map((title, index) => (
              <div key={title} className="relative bg-white border border-slate-100 rounded-2xl p-7 shadow-sm">
                <div className="absolute top-4 right-5 text-slate-100 font-extrabold text-5xl select-none leading-none">{String(index + 1).padStart(2, "0")}</div>
                <div className="w-12 h-12 bg-blue-700 rounded-2xl flex items-center justify-center mb-5 shadow-md"><FileText className="w-6 h-6 text-white" /></div>
                <h3 className="font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{index === 0 ? "Start with the selected document, current material, or blank requirement." : index === 1 ? "Capture business context, sections, users, workflows, and final use case." : "Shape the document so it is ready for review, refinement, and practical use."}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-8 lg:p-10 shadow-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700 mb-3">Custom document support</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-3">Need something more specific than a template?</h2>
              <p className="text-slate-600 leading-relaxed">Use the customisation pathway to scope the document properly and capture the detail needed to create something useful.</p>
            </div>
            <Link to="/portal/services/docushare/start" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-800 transition-all">
              Start a Custom Brief <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
