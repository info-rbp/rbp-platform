import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CTABanner } from "../components/CTABanner";
import { PageHero } from "../components/PageHero";
import { DollarSign, Shield, Calculator, Wifi, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1768839724256-28cd4a373209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBwbGFubmluZyUyMGNoYXJ0cyUyMGdyYXBocyUyMGludmVzdG1lbnQlMjBncm93dGh8ZW58MXx8fHwxNzc2OTUyMjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080";

const sections = [
  {
    icon: DollarSign, color: "bg-sky-100 text-sky-700", border: "border-sky-200",
    title: "Business Finance", href: "/operations/finance",
    desc: "General information and referral pathways for business lending, funding, and financial planning. We connect you with the right lenders and funding sources — without giving personal financial advice.",
    features: ["Business lending information", "Grant identification", "Invoice financing pathways", "R&D tax credit guidance", "Investment readiness support"],
    disclaimer: "General information only. Not financial advice.",
    cta: "Explore Finance Pathways",
  },
  {
    icon: Shield, color: "bg-emerald-100 text-emerald-700", border: "border-emerald-200",
    title: "Business Insurance", href: "/operations/insurance",
    desc: "Insurance guidance and referral pathways covering all the key insurance types your business may need. We help you understand your options and connect you with suitable providers.",
    features: ["Public liability guidance", "Professional indemnity", "Employer's liability", "Cyber insurance", "Business interruption"],
    disclaimer: "General information only. Not a regulated insurance service.",
    cta: "Explore Insurance Guidance",
  },
  {
    icon: Calculator, color: "bg-violet-100 text-violet-700", border: "border-violet-200",
    title: "Finance Calculators", href: "/operations/calculators",
    desc: "Practical tools to help you assess your business finances — from cash flow projections to funding readiness assessments and loan repayment estimates.",
    features: ["Cash flow calculator", "Loan repayment estimator", "Funding readiness check", "Break-even calculator", "Gross margin calculator"],
    disclaimer: "Estimates only. Results are indicative, not financial advice.",
    cta: "Use the Calculators",
  },
  {
    icon: Wifi, color: "bg-amber-100 text-amber-700", border: "border-amber-200",
    title: "Superloop Connectivity", href: "/operations/superloop",
    desc: "White-labelled business connectivity and telecommunications solutions through our Superloop partnership. Business broadband, phone lines, and connectivity packages.",
    features: ["Business broadband", "Phone line solutions", "Connectivity packages", "Business-grade speeds", "Support & installation"],
    disclaimer: "Availability subject to location.",
    cta: "View Connectivity Options",
  },
];

export function OperationsCenterPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <PageHero
        title="Operations Centre"
        titleAccent="for Business"
        subtitle="Finance pathways, insurance guidance, operational tools, and connectivity solutions — everything to support your business infrastructure."
        badge="Operations Centre"
        breadcrumb="Operations Centre"
        image={heroImage}
        bullets={["Finance & funding pathways", "Insurance guidance", "Connectivity solutions"]}
        ctaPrimary={{ label: "Explore Operations Support", href: "/contact" }}
        ctaSecondary={{ label: "Use Calculators", href: "/operations/calculators" }}
        stat={{ value: "4", label: "Operational Areas", sublabel: "Finance · Insurance · Tools · Telecoms" }}
      />

      {/* Disclaimer banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-start gap-2 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span><strong>Important:</strong> All finance and insurance content on this platform is general information only. Remote Business Partner is not an authorised financial advisor or regulated insurance broker. Always seek independent professional advice before making financial or insurance decisions.</span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">Four Areas</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Operational support infrastructure</h2>
            <p className="text-slate-600 max-w-xl mx-auto">The Operations Centre brings together finance, insurance, tools, and connectivity — the infrastructure layer of your business.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <div key={sec.title} className={`bg-white border-2 ${sec.border} rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5`}>
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-5">
                      <div className={`w-12 h-12 ${sec.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-xl mb-1">{sec.title}</h3>
                        <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md inline-block">{sec.disclaimer}</div>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-5">{sec.desc}</p>
                    <ul className="space-y-2 mb-6">
                      {sec.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <Link to={sec.href} className={`inline-flex items-center gap-2 font-bold text-sm px-5 py-3 rounded-xl transition-all hover:-translate-y-0.5 ${sec.color}`}>
                      {sec.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* General disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-slate-500 text-xs leading-relaxed">
              <strong>Disclaimer:</strong> Remote Business Partner provides general information about finance, insurance, and business connectivity options. We are not authorised financial advisors, insurance brokers, or regulated financial services providers. All calculators and tools provide indicative estimates only. Always seek independent professional advice before making any financial, insurance, or business infrastructure decision.
            </p>
          </div>
        </div>
      </div>

      <CTABanner />
      <Footer />
    </div>
  );
}