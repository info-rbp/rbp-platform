import { Link } from "react-router";
import { ArrowRight, CheckCircle, ClipboardList, FileText, MessageSquare, Settings, Sparkles } from "lucide-react";

import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { PageHero } from "../../components/PageHero";

const heroImage =
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

const steps = [
  { icon: ClipboardList, title: "Choose the document pathway", desc: "Start with a template, suite, toolkit, industry pack, or a custom document requirement." },
  { icon: MessageSquare, title: "Provide business context", desc: "Share the purpose, audience, requirements, and any existing materials that should shape the document." },
  { icon: Settings, title: "Configure the structure", desc: "The document is shaped around the selected category, required sections, jurisdiction, use case, and level of detail." },
  { icon: FileText, title: "Generate or prepare the document", desc: "The output is prepared as a practical business document that can be reviewed, refined, and used by the member." },
];

export function DocumentProcessPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        title="How the"
        titleAccent="Document Process Works"
        subtitle="Nucleus helps members move from a document need to a structured, usable business document through a clear guided process."
        badge="Nucleus Process"
        breadcrumb="Process"
        image={heroImage}
        bullets={["Guided document pathway", "Structured business context", "Clear review process"]}
        ctaPrimary={{ label: "Explore Nucleus", href: "/document-nucleus/overview" }}
        ctaSecondary={{ label: "Start a Document Brief", href: "/document-nucleus/brief" }}
        stat={{ value: "4", label: "Process Stages", sublabel: "Select, brief, configure, generate" }}
      />

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">Document generation process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">From document need to usable output</h2>
            <p className="text-slate-600 leading-relaxed">This page explains the process behind generating documents in Nucleus. It is not a document category, because apparently menus work better when things are what they say they are.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-[3.25rem] left-[12.5%] right-[12.5%] h-px bg-slate-200 z-0" />
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative bg-white border border-slate-100 rounded-2xl p-7 shadow-sm flex flex-col items-start z-10">
                  <div className="absolute top-4 right-5 text-slate-100 font-extrabold text-5xl select-none leading-none">{String(index + 1).padStart(2, "0")}</div>
                  <div className="w-12 h-12 bg-blue-700 rounded-2xl flex items-center justify-center mb-5 shadow-md"><Icon className="w-6 h-6 text-white" /></div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Step {index + 1}</div>
                  <h3 className="font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full mb-5">What the process covers</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">A consistent way to create better business documents</h2>
              <p className="text-slate-600 leading-relaxed mb-6">Nucleus is designed to make document creation more repeatable, structured, and commercially useful. The process helps capture the business purpose first, then turns that into the right document pathway.</p>
              <div className="space-y-3">
                {["Template and suite selection", "Business context and document requirements", "Section structure and document purpose", "Review, refinement, and member handoff"].map((item) => (
                  <div key={item} className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /><span className="text-slate-700 font-medium text-sm">{item}</span></div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
              <Sparkles className="w-10 h-10 text-blue-300 mb-5" />
              <h3 className="text-2xl font-extrabold mb-4">Need a document created?</h3>
              <p className="text-slate-300 leading-relaxed mb-6">Start with the Nucleus overview or create a document brief. The detailed member workflow can then collect the information needed to generate or customise the right document.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/document-nucleus/overview" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-800 transition-all">Explore Nucleus <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/document-nucleus/brief" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-all">Start a Brief</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
