import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CTABanner } from "../components/CTABanner";
import { PageHero } from "../components/PageHero";
import { Lightbulb, Headphones, FileText, MessageSquare, ArrowRight, CheckCircle, ChevronRight } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1758519288969-4806f015852d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbnN1bHRhbnQlMjBhZHZpc29yeSUyMG1lZXRpbmclMjBzdHJhdGVneXxlbnwxfHx8fDE3Nzc1NDY4NDB8MA&ixlib=rb-4.1.0&q=80&w=1080";

const subSections = [
  {
    icon: Lightbulb,
    color: "bg-blue-100 text-blue-700",
    accentBg: "bg-blue-50",
    border: "border-blue-200",
    title: "Business Advisor",
    subtitle: "Strategic guidance on demand",
    desc: "Get structured strategic advice from an experienced business advisor — whether you're facing a challenge, planning growth, making a key decision, or reviewing your business model.",
    href: "/on-demand/business-advisor",
    cta: "Talk to a Business Advisor",
    features: ["Business health reviews", "Growth strategy sessions", "Problem diagnosis & recommendations", "Decision-making support", "One-off or ongoing sessions"],
  },
  {
    icon: Headphones,
    color: "bg-violet-100 text-violet-700",
    accentBg: "bg-violet-50",
    border: "border-violet-200",
    title: "On-Demand Services",
    subtitle: "Project-based consulting & support",
    desc: "Access specific consulting, research, and project-based support without retaining a full managed service. Enquire about a task, scope a project, and get it done.",
    href: "/on-demand/services",
    cta: "Explore Services",
    features: ["Scoped consulting projects", "Business research & analysis", "Operational task support", "Specialist advisory referrals", "Flexible engagement model"],
  },
  {
    icon: FileText,
    color: "bg-teal-100 text-teal-700",
    accentBg: "bg-teal-50",
    border: "border-teal-200",
    title: "Document Centre",
    subtitle: "Business documents & templates",
    desc: "Access a library of professionally produced business documents — from business plans and legal templates to HR policies, compliance packs, and branded toolkits.",
    href: "/on-demand/documents",
    cta: "Browse Documents",
    features: ["Business plans & proposals", "Legal & compliance templates", "HR policy documents", "Financial planning templates", "Branded document packages"],
  },
  {
    icon: MessageSquare,
    color: "bg-amber-100 text-amber-700",
    accentBg: "bg-amber-50",
    border: "border-amber-200",
    title: "Decision Desk",
    subtitle: "Submit an issue, get clear guidance",
    desc: "Submit a business challenge or question and receive structured written guidance, a recommended course of action, and clear next steps — within a defined turnaround.",
    href: "/on-demand/decision-desk",
    cta: "Use the Decision Desk",
    features: ["Structured issue submission", "Written advisory response", "Recommended next steps", "Turnaround within agreed timeframe", "Available to members & non-members"],
  },
];

const comparison = [
  { feature: "Delivery format", advisor: "Live session", services: "Project deliverable", documents: "PDF/Word doc", decision: "Written report" },
  { feature: "Response time", advisor: "Booked session", services: "Agreed timeline", documents: "1–7 days", decision: "48–72 hours" },
  { feature: "Best for", advisor: "Strategic decisions", services: "Specific tasks", documents: "Templates & packs", decision: "One-off issues" },
  { feature: "Membership required?", advisor: "No", services: "No", documents: "No", decision: "No" },
];

export function OnDemandPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <PageHero
        title="On-Demand Support for"
        titleAccent="Your Business"
        subtitle="Get the right help, right now — advisor sessions, consulting services, professional documents, and structured decision support, all without a long-term commitment."
        badge="On-Demand Services"
        breadcrumb="On-Demand Services"
        image={heroImage}
        bullets={["No long-term contracts", "Expert advisory support", "Fast turnaround"]}
        ctaPrimary={{ label: "Find the Right Support", href: "/contact" }}
        ctaSecondary={{ label: "Browse Documents", href: "/on-demand/documents" }}
        stat={{ value: "48hrs", label: "Avg. Response Time", sublabel: "For Decision Desk" }}
      />

      {/* Sub-sections */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">Four Pathways</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Choose the right type of support
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Not all business needs are the same. Whether you need live advice, a specific deliverable, or a professional document — we have a clear pathway for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <div key={sec.title} className={`bg-white border-2 ${sec.border} rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5`}>
                  <div className={`${sec.accentBg} px-8 py-6 border-b ${sec.border}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${sec.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-xl mb-1">{sec.title}</h3>
                        <p className="text-sm font-semibold text-slate-500">{sec.subtitle}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-slate-600 leading-relaxed mb-6">{sec.desc}</p>
                    <ul className="space-y-2 mb-8">
                      {sec.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={sec.href}
                      className={`inline-flex items-center gap-2 font-bold text-sm px-5 py-3 rounded-xl transition-all hover:-translate-y-0.5 ${sec.color} hover:opacity-90`}
                    >
                      {sec.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Not sure which to choose?</h2>
            <p className="text-slate-500">Here's a quick comparison to help you decide.</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-5 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200">
              <div className="p-4"></div>
              {["Business Advisor", "Services", "Documents", "Decision Desk"].map((h) => (
                <div key={h} className="p-4 text-center text-slate-700">{h}</div>
              ))}
            </div>
            {comparison.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-5 border-b border-slate-100 last:border-0 ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                <div className="p-4 text-sm font-bold text-slate-700">{row.feature}</div>
                {[row.advisor, row.services, row.documents, row.decision].map((val, j) => (
                  <div key={j} className="p-4 text-sm text-slate-600 text-center">{val}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership prompt */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
            <div>
              <div className="font-extrabold text-xl mb-1">Get more with a membership</div>
              <div className="text-blue-200 text-sm">Members get discounted advisory sessions, Decision Desk access, and free document downloads.</div>
            </div>
            <Link to="/membership" className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all whitespace-nowrap">
              View Membership Plans <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </div>
  );
}
