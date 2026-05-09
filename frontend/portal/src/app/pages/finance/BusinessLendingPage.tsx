import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { CTABanner } from "../../components/CTABanner";
import { PageHero } from "../../components/PageHero";
import { DollarSign, CheckCircle, ArrowRight, Clock, ShieldCheck, BadgePercent, Landmark, Briefcase, BarChart3, Star } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1557869737-514ed88cb747?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGxvYW4lMjBiYW5rJTIwZmluYW5jZSUyMHNtYWxsJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzc2OTUyMjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080";

const loanTypes = [
  { icon: Landmark, title: "Term Loans", desc: "Fixed-amount loans repaid over an agreed period — ideal for planned investments, equipment, or expansion projects.", range: "$10,000 – $500,000", term: "1–7 years" },
  { icon: BarChart3, title: "Working Capital Loans", desc: "Short-term finance to cover day-to-day operational costs, seasonal cash flow gaps, or bridging periods.", range: "$5,000 – $150,000", term: "3–24 months" },
  { icon: Briefcase, title: "Asset Finance", desc: "Finance the purchase of equipment, vehicles, or machinery — spreading the cost while retaining working capital.", range: "$5,000 – $250,000", term: "1–5 years" },
  { icon: BadgePercent, title: "Government-Backed Loans", desc: "Access government-guaranteed lending schemes designed to support small business growth with favourable terms.", range: "Up to $250,000", term: "Up to 6 years" },
];

const process = [
  { step: "01", title: "Initial Assessment", desc: "We review your business profile, funding need, and eligibility to identify the most suitable lending options." },
  { step: "02", title: "Lender Matching", desc: "We match you with lenders from our panel who are most likely to approve your application." },
  { step: "03", title: "Application Support", desc: "Our team helps you prepare and submit a strong application — maximising your approval chances." },
  { step: "04", title: "Offer & Drawdown", desc: "Once approved, we guide you through accepting the offer and drawing down your funds." },
];

const benefits = [
  "Access to 150+ lender panel",
  "Loans from $5,000 to $500,000",
  "Flexible repayment terms",
  "Fast decisions — often within 48 hours",
  "No upfront fees",
  "Dedicated advisor throughout",
];

export function BusinessLendingPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <PageHero
        title="Business Lending for"
        titleAccent="Growing Businesses"
        subtitle="Access competitive loans and finance options tailored to your business — matched to the right lender, with expert support throughout."
        badge="Finance Centre"
        breadcrumb="Business Lending"
        image={heroImage}
        bullets={["Loans from $5,000 to $500,000", "150+ lender panel", "Decisions in 48 hours"]}
        ctaPrimary={{ label: "Apply Now", href: "/contact" }}
        ctaSecondary={{ label: "Back to Finance", href: "/finance" }}
        stat={{ value: "96%", label: "Approval Rate", sublabel: "Across our applications" }}
      />

      {/* Stats strip */}
      <div className="bg-sky-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { value: "$50M+", label: "Funding Facilitated" },
              { value: "150+", label: "Lender Partners" },
              { value: "48hrs", label: "Avg. Decision Time" },
              { value: "$5K–$500K", label: "Loan Range" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{s.value}</div>
                <div className="text-sky-100 text-sm font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loan types */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-sky-700 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full mb-4">Lending Options</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Find the Right Type of Finance</h2>
            <p className="text-slate-600 max-w-xl mx-auto">We work with your specific needs — whether you're investing in growth, managing cash flow, or acquiring assets.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {loanTypes.map((loan) => {
              const Icon = loan.icon;
              return (
                <div key={loan.title} className="bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{loan.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">{loan.desc}</p>
                  <div className="flex gap-4 flex-wrap">
                    <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                      <div className="text-xs text-slate-400 font-semibold">Loan range</div>
                      <div className="text-sm font-bold text-slate-900">{loan.range}</div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                      <div className="text-xs text-slate-400 font-semibold">Term</div>
                      <div className="text-sm font-bold text-slate-900">{loan.term}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why us + process */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <span className="inline-block text-xs font-bold text-sky-700 uppercase tracking-widest bg-sky-100 px-3 py-1 rounded-full mb-5">Why Choose Us</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">We do the heavy lifting for you</h2>
              <p className="text-slate-600 leading-relaxed mb-8">Securing business finance can be time-consuming and complex. We simplify the process — matching you to the right lender and supporting your application from start to finish.</p>
              <div className="space-y-3">
                {benefits.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="inline-block text-xs font-bold text-sky-700 uppercase tracking-widest bg-sky-100 px-3 py-1 rounded-full mb-5">The Process</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">How it works</h2>
              <div className="space-y-5">
                {process.map((p, i) => (
                  <div key={p.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-sky-700 text-white rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0">{i + 1}</div>
                      {i < process.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                    </div>
                    <div className="pb-4">
                      <div className="font-bold text-slate-900 mb-1">{p.title}</div>
                      <div className="text-slate-500 text-sm leading-relaxed">{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-sky-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <DollarSign className="w-12 h-12 text-sky-300 mx-auto mb-5" />
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">Ready to explore your lending options?</h2>
          <p className="text-sky-100 leading-relaxed mb-8">Speak to one of our finance advisors today — no obligation, no upfront fees.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-sky-700 font-bold px-8 py-4 rounded-xl hover:bg-sky-50 transition-all shadow-lg hover:-translate-y-0.5">
              Start Your Application <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/finance" className="inline-flex items-center gap-2 bg-sky-600/50 hover:bg-sky-600/70 border border-sky-500/40 text-white font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5">
              Back to Finance Centre
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <p className="text-slate-500 text-xs leading-relaxed">
            <strong>Financial Disclaimer:</strong> Remote Business Partner provides introductions to lending products and is not an authorised financial advisor. Always seek independent financial advice before committing to any loan or credit facility. Your business assets may be at risk if repayments are not maintained.
          </p>
        </div>
      </div>

      <CTABanner />
      <Footer />
    </div>
  );
}