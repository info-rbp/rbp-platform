import { useState } from "react";
import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import {
  ClipboardList,
  ShieldAlert,
  Lightbulb,
  FileText,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Star,
  BarChart2,
  Lock,
  RefreshCw,
  Zap,
  Users,
  MessageSquare,
} from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHN0cmF0ZWd5JTIwYW5hbHlzaXMlMjBkaWdpdGFsJTIwYWR2aXNvcnklMjB0b29sJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3Njk0ODg5NXww&ixlib=rb-4.1.0&q=80&w=1080";

// ── How it works steps ──
const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Describe Your Situation",
    desc: "Answer a structured set of guided questions about your business challenge, context, and goals. No jargon — just honest answers about where things stand.",
    color: "bg-blue-700",
  },
  {
    number: "02",
    icon: ShieldAlert,
    title: "Risk & Opportunity Scan",
    desc: "The platform analyses your inputs to surface the key risks you may not have considered and the strategic opportunities most relevant to your situation.",
    color: "bg-violet-700",
  },
  {
    number: "03",
    icon: Lightbulb,
    title: "Structured Recommendations",
    desc: "You receive a professionally formatted advisory report — tailored to your specific inputs — outlining prioritised recommendations with clear rationale.",
    color: "bg-amber-600",
  },
  {
    number: "04",
    icon: FileText,
    title: "Clear Next Steps",
    desc: "Every report ends with an actionable roadmap: concrete steps ranked by impact and urgency so you always know exactly what to do next.",
    color: "bg-emerald-700",
  },
];

// ── Review categories ──
const reviewAreas = [
  {
    icon: BarChart2,
    title: "Business Performance Review",
    desc: "Assess your commercial performance — revenue health, cost structure, margin trends, and growth blockers — and receive recommendations to improve profitability.",
    tags: ["Revenue", "Cost Control", "Growth"],
    color: "border-blue-200 bg-blue-50/40",
    iconColor: "bg-blue-100 text-blue-700",
  },
  {
    icon: ShieldAlert,
    title: "Risk Assessment",
    desc: "Identify operational, financial, legal, and people-related risks before they become problems. Get a prioritised risk register with mitigation guidance.",
    tags: ["Operational", "Financial", "Compliance"],
    color: "border-red-200 bg-red-50/40",
    iconColor: "bg-red-100 text-red-700",
  },
  {
    icon: Lightbulb,
    title: "Opportunity Identification",
    desc: "Uncover strategic opportunities — market gaps, process improvements, partnerships, and product moves — tailored to your current business stage and resources.",
    tags: ["Strategy", "Market", "Expansion"],
    color: "border-amber-200 bg-amber-50/40",
    iconColor: "bg-amber-100 text-amber-700",
  },
  {
    icon: Users,
    title: "Team & Organisational Review",
    desc: "Evaluate your team structure, role clarity, hiring gaps, and culture indicators. Receive guidance on organisational design and people priorities.",
    tags: ["HR", "Structure", "Culture"],
    color: "border-violet-200 bg-violet-50/40",
    iconColor: "bg-violet-100 text-violet-700",
  },
  {
    icon: RefreshCw,
    title: "Change Readiness Review",
    desc: "Planning a pivot, restructure, or growth phase? This review assesses your readiness for change and delivers a structured change management roadmap.",
    tags: ["Transformation", "Planning", "Readiness"],
    color: "border-emerald-200 bg-emerald-50/40",
    iconColor: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: Zap,
    title: "AI & Technology Adoption",
    desc: "Understand where AI and automation can deliver the most value in your business. Receive a practical adoption plan matched to your team's capacity and budget.",
    tags: ["AI", "Automation", "Efficiency"],
    color: "border-sky-200 bg-sky-50/40",
    iconColor: "bg-sky-100 text-sky-700",
  },
];

// ── Report features ──
const reportFeatures = [
  { icon: FileText, title: "Structured Format", desc: "Every report follows the same professional framework — executive summary, findings, analysis, recommendations, and next steps." },
  { icon: Lock, title: "Confidential & Secure", desc: "Your inputs and reports are treated with full confidentiality and stored securely. We never share your business data with third parties." },
  { icon: RefreshCw, title: "Repeatable Reviews", desc: "Re-run any review as your business evolves. Track how your risk profile, performance, and opportunities shift over time." },
  { icon: MessageSquare, title: "Follow-Up Advisory", desc: "Want a human consultant to discuss your report? Every Business Advisor session can be upgraded to a live advisory call with an RBP consultant." },
];

// ── Testimonials ──
const testimonials = [
  {
    quote:
      "The risk assessment caught three issues I'd been ignoring for months. The structured format made it easy to share with my board and take action immediately.",
    name: "David M.",
    role: "CEO, Logistics SME",
    initials: "DM",
    color: "bg-blue-600",
    review: "Business Performance Review",
  },
  {
    quote:
      "It's like having a senior consultant in a box. I answered the questions honestly and got back a report I could have paid £5,000 for at a big consultancy.",
    name: "Priya K.",
    role: "Founder, SaaS Startup",
    initials: "PK",
    color: "bg-violet-600",
    review: "Opportunity Identification",
  },
  {
    quote:
      "The Change Readiness Review saved us from a costly restructure that wasn't ready. The next steps were specific and realistic — not generic advice.",
    name: "Tom R.",
    role: "MD, Professional Services",
    initials: "TR",
    color: "bg-emerald-600",
    review: "Change Readiness Review",
  },
];

// ── FAQ ──
const faqs = [
  {
    q: "How long does it take to complete a review?",
    a: "Most reviews take 15–30 minutes to complete. The guided questions are clear and focused — you're not filling in a lengthy form, you're having a structured conversation with the platform.",
  },
  {
    q: "How quickly do I receive my report?",
    a: "Reports are typically generated within minutes of completing your inputs. For complex reviews, allow up to a few hours for the full structured output to be compiled.",
  },
  {
    q: "Is Business Advisor a replacement for a human consultant?",
    a: "No — it's a complement. Business Advisor delivers structured, consistent analysis at speed and scale. For complex situations that require nuanced judgment, we recommend pairing your report with a live advisory session from an RBP consultant.",
  },
  {
    q: "Can I run more than one type of review?",
    a: "Yes. You can run as many review types as you need. Many users run a Performance Review and a Risk Assessment together to get a full picture before making a major decision.",
  },
  {
    q: "Is my business information kept confidential?",
    a: "Absolutely. Your inputs are confidential and are never shared with third parties. Reports are stored securely and accessible only to you.",
  },
  {
    q: "Do I need a membership to use Business Advisor?",
    a: "Some reviews are available on the free Community membership. Professional and Executive members get access to the full suite of review types and unlimited report generation.",
  },
];

const stats = [
  { value: "6", label: "Review Categories" },
  { value: "30 min", label: "Avg. Completion Time" },
  { value: "100%", label: "Confidential" },
  { value: "4.8/5", label: "User Rating" },
];

export function BusinessAdvisorPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <PageHero
        title="Meet Your"
        titleAccent="Business Advisor"
        subtitle="A guided online review system that helps you identify risks, uncover opportunities, and receive structured written recommendations — no consultant required."
        badge="Business Advisor"
        breadcrumb="Business Advisor"
        image={heroImage}
        bullets={["Structured written reports", "6 review categories", "Results in minutes"]}
        ctaPrimary={{ label: "Start a Review", href: "/contact" }}
        ctaSecondary={{ label: "See How It Works", href: "#how-it-works" }}
        stat={{ value: "4.8/5", label: "User Rating", sublabel: "Based on advisor sessions" }}
      />

      {/* ── Stats bar ── */}
      <div className="bg-blue-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold text-white mb-1">{s.value}</div>
                <div className="text-sm font-semibold text-blue-200">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── What is Business Advisor ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-5">
                What Is It?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                Expert-level analysis, delivered on demand
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Business Advisor is an online guided review system — not a traditional consulting service. You describe your situation through structured inputs, and the platform delivers a professional, tailored advisory report with actionable recommendations.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                It's designed for business owners who need high-quality strategic thinking quickly, without the time commitment or cost of a full consulting engagement. Every report follows the same professional framework used by RBP's senior consultants.
              </p>
              <div className="space-y-3">
                {[
                  "Consistent, professional report format every time",
                  "Tailored to your specific inputs — not generic templates",
                  "Covers performance, risk, people, strategy, and more",
                  "Upgrade any report with a live advisory session",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature pills grid */}
            <div className="grid grid-cols-2 gap-4">
              {reportFeatures.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-sm transition-all"
                  >
                    <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1.5">{f.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              From situation to structured advice in four steps
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Business Advisor takes your inputs through a consistent framework and returns a professional report — every time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-[3.25rem] left-[12.5%] right-[12.5%] h-px bg-slate-200 z-0" />

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative bg-white border border-slate-100 rounded-2xl p-7 shadow-sm flex flex-col items-start z-10">
                  {/* Step number ghost */}
                  <div className="absolute top-4 right-5 text-slate-100 font-extrabold text-5xl select-none leading-none">
                    {step.number}
                  </div>
                  <div className={`w-12 h-12 ${step.color} rounded-2xl flex items-center justify-center mb-5 shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Step {i + 1}</div>
                  <h3 className="font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Review Areas ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
              Review Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Six areas of business advisory
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Choose the review type that matches your current priority. Each produces a standalone report with tailored findings and next steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviewAreas.map((area) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.title}
                  className={`border rounded-2xl p-7 ${area.color} hover:shadow-md transition-all hover:-translate-y-0.5`}
                >
                  <div className={`w-11 h-11 ${area.iconColor} rounded-xl flex items-center justify-center mb-5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{area.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{area.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {area.tags.map((tag) => (
                      <span key={tag} className="text-xs font-bold text-slate-500 bg-white/70 border border-slate-200 rounded-full px-2.5 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Your First Review
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sample Report Preview ── */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/30 border border-blue-500/30 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">What You Receive</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 leading-tight">
                A professional report — not a chatbot response
              </h2>
              <p className="text-slate-300 leading-relaxed mb-8">
                Every Business Advisor output is a structured written document with the same sections our human consultants use. Clear, consistent, and immediately actionable.
              </p>
              <div className="space-y-3">
                {[
                  "Executive Summary — key findings in plain language",
                  "Situation Analysis — what the data and inputs indicate",
                  "Risk Register — prioritised risks with severity ratings",
                  "Opportunity Map — ranked strategic opportunities",
                  "Recommendations — specific, prioritised actions",
                  "Next Steps — 30/60/90-day action roadmap",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-700/40 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-extrabold text-blue-300">{i + 1}</span>
                    </div>
                    <span className="text-slate-200 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock report card */}
            <div className="bg-white rounded-2xl p-6 text-slate-900 shadow-2xl">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-0.5">Business Advisor Report</div>
                  <div className="font-extrabold text-slate-900">Business Performance Review</div>
                </div>
                <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Executive Summary", lines: 2, color: "bg-slate-100" },
                  { label: "Risk Register", lines: 3, color: "bg-red-50" },
                  { label: "Opportunity Map", lines: 2, color: "bg-amber-50" },
                  { label: "Recommendations", lines: 3, color: "bg-blue-50" },
                ].map((section) => (
                  <div key={section.label} className={`${section.color} rounded-xl p-4`}>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{section.label}</div>
                    <div className="space-y-1.5">
                      {[...Array(section.lines)].map((_, i) => (
                        <div key={i} className={`h-2 rounded-full bg-slate-200 ${i === section.lines - 1 ? "w-3/4" : "w-full"}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-400 font-medium">Generated by RBP Business Advisor</div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Report Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
              User Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What business owners say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex flex-col gap-5">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full self-start">{t.review}</span>
                <MessageSquare className="w-6 h-6 text-blue-200" />
                <p className="text-slate-700 text-sm leading-relaxed flex-grow italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
              FAQs
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Common questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-bold text-slate-900 text-sm">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t border-slate-50">
                    <p className="text-slate-600 text-sm leading-relaxed pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-slate-500 text-sm mb-4">Ready to get started?</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              Start a Review Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
