import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { CTABanner } from "../../components/CTABanner";
import { PageHero } from "../../components/PageHero";
import { CreditCard, CheckCircle, ArrowRight, Landmark, FileSearch, FlaskConical, Layers, GitMerge } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1591522810896-cb5f45acb9a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGZ1bmRpbmclMjBncmFudCUyMG1vbmV5JTIwY3JlZGl0JTIwc3RhcnR1cHxlbnwxfHx8fDE3NzY5NTIyNDh8MA&ixlib=rb-4.1.0&q=80&w=1080";

const fundingTypes = [
  { icon: Landmark, title: "Grant Identification", desc: "We identify government, local authority, and sector-specific grants you may be eligible for — and support your application.", badge: "Non-repayable" },
  { icon: Layers, title: "Invoice Financing", desc: "Unlock cash tied up in unpaid invoices. We connect you with invoice finance providers who can release up to 90% of invoice value.", badge: "Flexible" },
  { icon: GitMerge, title: "Equity Funding Prep", desc: "Preparing to raise investment? We help you structure your business, financials, and pitch to maximise your appeal to equity investors.", badge: "Growth stage" },
  { icon: FlaskConical, title: "R&D Tax Credits", desc: "If your business invests in innovation, you may be eligible for HMRC's R&D tax credit scheme — we help you identify and claim what you're owed.", badge: "Up to 33% relief" },
  { icon: FileSearch, title: "Funding Audit", desc: "A comprehensive review of all funding streams available to your business — grants, loans, equity, and tax reliefs — in one report.", badge: "Full picture" },
  { icon: CreditCard, title: "Credit Facility Sourcing", desc: "Revolving credit facilities, overdrafts, and business credit cards — we source the right flexible credit for your operational needs.", badge: "Short-term" },
];

const steps = [
  { title: "Funding Needs Assessment", desc: "We start by understanding your business, your growth plans, and the type and amount of funding you need." },
  { title: "Funding Landscape Review", desc: "We map out all available funding options — grants, loans, equity, and tax reliefs — relevant to your business." },
  { title: "Strategy & Prioritisation", desc: "We prioritise the best opportunities and build an action plan for accessing them." },
  { title: "Application & Submission", desc: "We support you in preparing and submitting strong applications — improving your chances of success." },
];

const benefits = [
  "Access to grants, loans, equity, and tax reliefs",
  "Comprehensive funding audit across all streams",
  "Expert R&D tax credit identification",
  "Invoice finance release within 24 hours",
  "End-to-end application support",
  "No funding found — no fee",
];

export function CreditFundingPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <PageHero
        title="Credit & Funding"
        titleAccent="Solutions"
        subtitle="From government grants to invoice financing — we identify and secure the right funding sources to fuel your business growth."
        badge="Finance Centre"
        breadcrumb="Credit & Funding"
        image={heroImage}
        bullets={["Grant identification", "Invoice financing", "R&D tax credits"]}
        ctaPrimary={{ label: "Find My Funding", href: "/contact" }}
        ctaSecondary={{ label: "Back to Finance", href: "/finance" }}
        stat={{ value: "£M+", label: "Funding Secured", sublabel: "For our clients" }}
      />

      {/* Funding types */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full mb-4">Funding Options</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Every Funding Stream, Covered</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Most businesses only access a fraction of the funding available to them. We map the full landscape so you don't miss out.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fundingTypes.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-slate-50 border border-slate-100 rounded-2xl p-7 hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">{f.badge}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
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
              <span className="inline-block text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full mb-5">Why Choose Us</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">Most businesses leave money on the table</h2>
              <p className="text-slate-600 leading-relaxed mb-8">Grants go unclaimed. Tax reliefs go unidentified. Invoice cash sits locked up for months. We make sure you're accessing every pound available to your business.</p>
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
              <span className="inline-block text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full mb-5">Our Process</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">How we find your funding</h2>
              <div className="space-y-5">
                {steps.map((s, i) => (
                  <div key={s.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0">{i + 1}</div>
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
      <section className="py-20 bg-amber-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CreditCard className="w-12 h-12 text-amber-200 mx-auto mb-5" />
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">Find out what funding you're missing</h2>
          <p className="text-amber-100 leading-relaxed mb-8">Book a funding audit and we'll identify every grant, credit, and tax relief your business could be accessing.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-amber-700 font-bold px-8 py-4 rounded-xl hover:bg-amber-50 transition-all shadow-lg hover:-translate-y-0.5">
              Book a Funding Audit <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/finance" className="inline-flex items-center gap-2 bg-amber-500/50 hover:bg-amber-500/70 border border-amber-400/40 text-white font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5">
              Back to Finance Centre
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <p className="text-slate-500 text-xs leading-relaxed">
            <strong>Financial Disclaimer:</strong> Remote Business Partner provides information and introductions to funding sources. We are not authorised financial advisors. Grant eligibility, R&D tax credit claims, and equity funding are subject to individual business circumstances. Always seek independent financial and legal advice before making financial decisions.
          </p>
        </div>
      </div>

      <CTABanner />
      <Footer />
    </div>
  );
}
