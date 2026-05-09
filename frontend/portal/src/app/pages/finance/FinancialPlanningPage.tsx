import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { CTABanner } from "../../components/CTABanner";
import { PageHero } from "../../components/PageHero";
import { LineChart, CheckCircle, ArrowRight, TrendingUp, PieChart, Target, LayoutList, BarChart2 } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1768839724256-28cd4a373209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBwbGFubmluZyUyMGNoYXJ0cyUyMGdyYXBocyUyMGludmVzdG1lbnQlMjBncm93dGh8ZW58MXx8fHwxNzc2OTUyMjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080";

const services = [
  { icon: TrendingUp, title: "Cash Flow Forecasting", desc: "Understand exactly when money comes in and goes out — so you can plan ahead, avoid surprises, and make confident decisions.", outcome: "12-month rolling forecast" },
  { icon: LayoutList, title: "Budgeting Frameworks", desc: "Build a realistic, structured budget that aligns spending with your strategic priorities and growth targets.", outcome: "Annual budget model" },
  { icon: Target, title: "Investment Readiness", desc: "Prepare your business financially for investment — including financial modelling, valuation inputs, and investor-ready reporting.", outcome: "Investor-ready financials" },
  { icon: BarChart2, title: "KPI Development", desc: "Define the financial and operational metrics that matter most for your business — and build a dashboard to track them.", outcome: "Custom KPI dashboard" },
  { icon: PieChart, title: "Profit Improvement", desc: "Identify where margin is being lost and develop a targeted plan to improve profitability across your business.", outcome: "Profitability action plan" },
  { icon: LineChart, title: "Financial Reporting", desc: "Get clear, management-level financial reports that give you a real-time view of business performance.", outcome: "Monthly management accounts" },
];

const steps = [
  { title: "Financial Health Check", desc: "We start with a full review of your current financial position — revenues, costs, cash flow, and structure." },
  { title: "Goals & Priorities", desc: "We align the planning work to your specific business goals — growth, stability, investment readiness, or exit." },
  { title: "Plan Development", desc: "Our advisors build the forecasts, models, and frameworks your business needs." },
  { title: "Ongoing Advisory", desc: "We review and update the plan regularly — ensuring it stays relevant as your business evolves." },
];

const benefits = [
  "Clarity on your current financial position",
  "Forward-looking forecasts — not just historic reports",
  "Practical, actionable plans — not just spreadsheets",
  "Experienced finance advisors (not accountants)",
  "Flexible — monthly advisory or project-based",
  "Aligned to your growth strategy",
];

export function FinancialPlanningPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <PageHero
        title="Financial Planning for"
        titleAccent="Sustainable Growth"
        subtitle="Build a robust financial foundation — with expert forecasting, budgeting, and advisory support tailored to your business."
        badge="Finance Centre"
        breadcrumb="Financial Planning"
        image={heroImage}
        bullets={["Cash flow forecasting", "Investment readiness", "KPI frameworks"]}
        ctaPrimary={{ label: "Book a Planning Session", href: "/contact" }}
        ctaSecondary={{ label: "Back to Finance", href: "/finance" }}
        stat={{ value: "3-Year", label: "Planning Horizon", sublabel: "Short & long term" }}
      />

      {/* Services */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-violet-700 uppercase tracking-widest bg-violet-50 px-3 py-1 rounded-full mb-4">Planning Services</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Everything You Need to Plan with Confidence</h2>
            <p className="text-slate-600 max-w-xl mx-auto">From cash flow to KPIs — we build the financial infrastructure your business needs to grow.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="bg-slate-50 border border-slate-100 rounded-2xl p-7 hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="w-12 h-12 bg-violet-100 text-violet-700 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <div className="text-xs font-bold text-violet-700 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-full inline-block">Deliverable: {s.outcome}</div>
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
              <span className="inline-block text-xs font-bold text-violet-700 uppercase tracking-widest bg-violet-100 px-3 py-1 rounded-full mb-5">Why Choose Us</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">Finance advisory that looks forward</h2>
              <p className="text-slate-600 leading-relaxed mb-8">Most businesses only look at their finances in hindsight. We help you look forward — building the plans and tools you need to make proactive, confident decisions.</p>
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
              <span className="inline-block text-xs font-bold text-violet-700 uppercase tracking-widest bg-violet-100 px-3 py-1 rounded-full mb-5">Our Process</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">How we work with you</h2>
              <div className="space-y-5">
                {steps.map((s, i) => (
                  <div key={s.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-violet-700 text-white rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0">{i + 1}</div>
                      {i < steps.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                    </div>
                    <div className="pb-4">
                      <div className="font-bold text-slate-900 mb-1">{s.title}</div>
                      <div className="text-slate-500 text-sm leading-relaxed">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-violet-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <LineChart className="w-12 h-12 text-violet-300 mx-auto mb-5" />
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">Ready to take control of your finances?</h2>
          <p className="text-violet-100 leading-relaxed mb-8">Book a financial planning session and let's build the roadmap your business needs.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-4 rounded-xl hover:bg-violet-50 transition-all shadow-lg hover:-translate-y-0.5">
              Book a Planning Session <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/finance" className="inline-flex items-center gap-2 bg-violet-600/50 hover:bg-violet-600/70 border border-violet-500/40 text-white font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5">
              Back to Finance Centre
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </div>
  );
}
