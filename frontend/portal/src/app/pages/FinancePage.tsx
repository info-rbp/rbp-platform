import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CTABanner } from "../components/CTABanner";
import { PageHero } from "../components/PageHero";
import { LineChart, DollarSign, Shield, TrendingUp, CreditCard, FileText, ArrowRight, CheckCircle } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1772413438617-937e44f2642e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGJ1c2luZXNzJTIwZmluYW5jZSUyMGxvYW4lMjBpbnZlc3RtZW50JTIwZ3Jvd3RofGVufDF8fHx8MTc3NjkyMzMwNXww&ixlib=rb-4.1.0&q=80&w=1080";

const solutions = [
  {
    icon: DollarSign,
    title: "Business Lending",
    desc: "Access competitive lending options tailored for small businesses. We connect you with lenders who understand your growth stage and revenue profile.",
    features: ["Loans from $5,000 to $500,000", "Flexible repayment terms", "Fast approval process", "No hidden fees"],
    color: "bg-sky-100 text-sky-700",
  },
  {
    icon: Shield,
    title: "Business Insurance",
    desc: "Protect your business with the right coverage. We guide you through selecting insurance products that match your specific risk profile.",
    features: ["Public liability", "Professional indemnity", "Employer's liability", "Cyber protection"],
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: LineChart,
    title: "Financial Planning",
    desc: "Build a robust financial foundation. Our finance consultants help you forecast, budget, and structure your finances for sustainable growth.",
    features: ["Cash flow forecasting", "Budgeting frameworks", "Investment readiness", "KPI development"],
    color: "bg-violet-100 text-violet-700",
  },
  {
    icon: CreditCard,
    title: "Credit & Funding",
    desc: "From government grants to invoice financing, we help you identify and access the right funding sources for your growth objectives.",
    features: ["Grant identification", "Invoice financing", "Equity funding prep", "R&D tax credits"],
    color: "bg-amber-100 text-amber-700",
  },
];

export function FinancePage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <PageHero
        title="Finance Solutions for"
        titleAccent="Small Business"
        subtitle="Access competitive lending, insurance, and financial advisory tailored specifically for growing small businesses."
        badge="Finance"
        breadcrumb="Finance"
        image={heroImage}
        bullets={["Competitive lending options", "Business insurance guidance", "Expert financial planning"]}
        ctaPrimary={{ label: "Get Financial Advice", href: "/contact" }}
        ctaSecondary={{ label: "Our Services", href: "/services" }}
        stat={{ value: "$2M+", label: "Funding Facilitated", sublabel: "For our clients" }}
      />

      {/* Hero stats */}
      <div className="bg-blue-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { value: "$50M+", label: "Funding Facilitated" },
              { value: "150+", label: "Lender Partners" },
              { value: "48hrs", label: "Average Turnaround" },
              { value: "96%", label: "Approval Rate" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-blue-100 text-sm font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Solutions */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-sky-700 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full mb-4">
              Our Finance Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              End-to-End Financial Support
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Whether you need funding, protection, or planning, our finance team has you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {solutions.map((sol) => {
              const Icon = sol.icon;
              return (
                <div key={sol.title} className="bg-slate-50 border border-slate-100 rounded-2xl p-8">
                  <div className={`w-12 h-12 ${sol.color} rounded-xl flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{sol.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">{sol.desc}</p>
                  <div className="space-y-2 mb-6">
                    {sol.features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to={`/finance/${sol.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/g, '')}`}
                    className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 text-sm font-bold transition-colors"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-slate-500 text-xs leading-relaxed">
              <strong>Financial Disclaimer:</strong> Remote Business Partner provides information and introductions to financial products and services. We are not authorised financial advisors. Always seek independent financial advice before making financial decisions. Your business may be at risk if you do not keep up repayments on any loans or credit facilities.
            </p>
          </div>
        </div>
      </div>

      <CTABanner />
      <Footer />
    </div>
  );
}