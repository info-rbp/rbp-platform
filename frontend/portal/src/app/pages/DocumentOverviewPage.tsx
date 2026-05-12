import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { mockDocuShareDocumentGroups } from "../mock";
import {
  FolderOpen,
  ArrowRight,
  CheckCircle,
  ClipboardList,
  MessageSquare,
  PenLine,
  Eye,
  PackageCheck,
} from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1768875820800-1c2a6f2e8280?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMG1hbmFnZW1lbnQlMjBvZmZpY2UlMjBwYXBlciUyMGZpbGluZyUyMGJ1c2luZXNzfGVufDF8fHx8MTc3Njk1MTE4OHww&ixlib=rb-4.1.0&q=80&w=1080";

// ── Document Categories ──
const categories = mockDocuShareDocumentGroups.map((group) => ({
  ...group,
  lightColor: `${group.lightBg} border-slate-200`,
  textColor: group.accent,
  items:
    group.id === "templates"
      ? ["Policies", "Proposals", "Company profiles", "Brand guidelines"]
      : group.id === "documentation-suites"
        ? ["Operations manuals", "HR suites", "Governance packs", "Sales documentation"]
        : group.id === "toolkits"
          ? ["Checklists", "Templates", "Instructions", "Examples"]
          : ["SOPs", "Workflow guides", "Approval paths", "Handover notes"],
}));

// ── 5-Step Process ──
const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Initial Requirements",
    desc: "You complete a structured requirements brief — outlining the purpose of the document, the intended audience, key details, and any specific requirements or constraints to be incorporated.",
    color: "bg-blue-700",
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Scoping & Confirmation",
    desc: "Our team reviews your brief and confirms the scope, format, and deliverable with you. Any clarifications are resolved at this stage before work begins.",
    color: "bg-violet-700",
  },
  {
    number: "03",
    icon: PenLine,
    title: "Document Creation",
    desc: "Your document is created by our advisors using professional templates and frameworks. All documents are written to a consistent, high standard aligned with your business context.",
    color: "bg-amber-600",
  },
  {
    number: "04",
    icon: Eye,
    title: "Review & Revisions",
    desc: "You receive the draft document for review. Feedback is incorporated and revisions are made until the document meets your requirements and approval.",
    color: "bg-sky-700",
  },
  {
    number: "05",
    icon: PackageCheck,
    title: "Final Delivery",
    desc: "The finalised document is delivered to you in your chosen format, securely stored in your Document Nucleus account and ready for immediate use.",
    color: "bg-emerald-700",
  },
];

export function DocumentOverviewPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* ── Page Hero ── */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Document Overview" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <Link to="/docushare" className="hover:text-blue-400 transition-colors">Document Nucleus</Link>
            <span>/</span>
            <span className="text-slate-300">Document Overview</span>
          </div>

          <span className="inline-block text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-900/40 border border-blue-700/30 px-3 py-1 rounded-full mb-5">
            Document Nucleus
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6 max-w-3xl">
            Our Document <span className="text-blue-400">Categories</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-xl leading-relaxed mb-8">
            Explore the full range of documents available through Document Nucleus — professionally created, structured, and delivered to your business.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#categories"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/50 hover:-translate-y-0.5"
            >
              Browse Categories
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/portal/services/docushare/start"
              className="inline-flex items-center gap-2 bg-white text-slate-950 hover:bg-blue-50 font-bold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
            >
              Start a document brief
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#process"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
            >
              See the Process
            </a>
          </div>
        </div>
      </section>

      {/* ── Intro strip ── */}
      <div className="bg-blue-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { value: "4", label: "Mock Document Groups" },
              { value: "9-Step", label: "Brief Flow" },
              { value: "Phase 1", label: "Frontend Mock" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold text-white mb-1">{s.value}</div>
                <div className="text-sm font-semibold text-blue-200">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Categories ── */}
      <section id="categories" className="py-20 lg:py-28 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
              Document Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Four mock groups of business documents
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Our Phase 1 document library is organised into mock groups. Select the one that matches your current business need, then continue into the DocuShare brief flow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`border-2 rounded-2xl overflow-hidden ${cat.lightColor} hover:shadow-lg transition-all hover:-translate-y-1`}
              >
                {/* Card header */}
                <div className={`${cat.color} px-8 py-8 flex items-center gap-5`}>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl font-extrabold">{cat.title.slice(0, 1)}</span>
                  </div>
                  <div>
                    <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-0.5">Category</div>
                    <div className="text-white font-extrabold text-xl">{cat.title}</div>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-8 py-7">
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-4 ${cat.tagColor}`}>
                    {cat.tag}
                  </span>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{cat.description}</p>
                  <div className="space-y-2.5">
                    {cat.items.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${cat.textColor}`} />
                        <span className="text-slate-500 text-sm italic">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-current/10">
                    <Link
                      to={`/document-nucleus/category/${cat.id}`}
                      className={`inline-flex items-center gap-2 font-bold text-sm ${cat.textColor} hover:underline`}
                    >
                      Browse {cat.title}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/portal/services/docushare/start"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-700"
                    >
                      Submit through your account
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm italic">
              Document groups and brief statuses are simulated for Phase 1 frontend review.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5-Step Process ── */}
      <section id="process" className="py-20 lg:py-28 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Our document creation process
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Every document we produce follows the same five-step process — ensuring quality, accuracy, and a result that works for your business.
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Vertical connector line */}
            <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-px bg-slate-200 -translate-x-1/2 z-0" />

            <div className="space-y-8 relative z-10">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isEven = i % 2 === 0;
                return (
                  <div
                    key={step.number}
                    className={`flex flex-col lg:flex-row items-center gap-6 lg:gap-10 ${
                      isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    }`}
                  >
                    {/* Content card */}
                    <div className={`flex-1 bg-white border border-slate-100 rounded-2xl p-8 shadow-sm ${isEven ? "lg:text-right" : "lg:text-left"}`}>
                      <div className={`flex items-center gap-4 mb-4 ${isEven ? "lg:flex-row-reverse lg:justify-start" : ""}`}>
                        <div className={`w-12 h-12 ${step.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step {i + 1}</div>
                          <h3 className="font-extrabold text-slate-900">{step.title}</h3>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                    </div>

                    {/* Centre number bubble */}
                    <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg z-10`}>
                      <span className="text-white font-extrabold text-xl">{i + 1}</span>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="flex-1 hidden lg:block" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-blue-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FolderOpen className="w-12 h-12 text-blue-300 mx-auto mb-5" />
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">
            Ready to create a mock document brief?
          </h2>
          <p className="text-blue-100 leading-relaxed mb-8">
            Use the Phase 1 DocuShare flow to review document requirements, mock uploads, review, submit and simulated portal status.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/portal/services/docushare/start"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:-translate-y-0.5"
            >
              Start a document brief
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/docushare"
              className="inline-flex items-center gap-2 bg-blue-600/50 hover:bg-blue-600/70 border border-blue-500/40 text-white font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5"
            >
              Back to Document Nucleus
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
