import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { CTABanner } from "../../components/CTABanner";
import { PageHero } from "../../components/PageHero";
import { Shield, CheckCircle, ArrowRight, Users, Monitor, HardHat, Umbrella, ShieldAlert, Car } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1757405944970-dfca42373629?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGluc3VyYW5jZSUyMHByb3RlY3Rpb24lMjBzaGllbGQlMjBvZmZpY2V8ZW58MXx8fHwxNzc2OTUyMjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080";

const coverTypes = [
  { icon: Users, title: "Public Liability", desc: "Protects your business against claims from third parties for injury or property damage caused by your business activities.", forWho: "All client-facing businesses" },
  { icon: ShieldAlert, title: "Professional Indemnity", desc: "Covers you against claims of negligence, errors, or omissions arising from your professional advice or services.", forWho: "Consultants, advisors, agencies" },
  { icon: HardHat, title: "Employer's Liability", desc: "A legal requirement if you employ staff — covers claims from employees who are injured or become ill as a result of their work.", forWho: "Any business with employees" },
  { icon: Monitor, title: "Cyber Insurance", desc: "Protects your business from the financial impact of cyber attacks, data breaches, and ransomware incidents.", forWho: "All digital & data-handling businesses" },
  { icon: Umbrella, title: "Business Interruption", desc: "Covers lost income and ongoing costs if your business is unable to operate following an insured event.", forWho: "All business types" },
  { icon: Car, title: "Commercial Vehicle", desc: "Insurance for vehicles used for business purposes — from single vans to full commercial fleets.", forWho: "Trade & logistics businesses" },
];

const steps = [
  { title: "Risk Review", desc: "We review your business operations to understand your specific risk exposure and coverage needs." },
  { title: "Market Search", desc: "We search the market to identify policies that provide the right coverage at a competitive premium." },
  { title: "Clear Comparison", desc: "We present your options in plain English — no jargon, no pressure." },
  { title: "Ongoing Support", desc: "We're available at renewal and whenever your coverage needs change." },
];

const benefits = [
  "Whole-of-market search across leading insurers",
  "Tailored to your specific industry and risk profile",
  "Plain English — no confusing policy jargon",
  "Support at claims time",
  "Annual review to ensure coverage stays right",
  "Competitive premiums through our insurer relationships",
];

export function BusinessInsurancePage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <PageHero
        title="Business Insurance"
        titleAccent="Done Right"
        subtitle="The right coverage for your business — matched to your risk profile, explained clearly, and reviewed annually."
        badge="Finance Centre"
        breadcrumb="Business Insurance"
        image={heroImage}
        bullets={["Public liability & PI cover", "Cyber & business interruption", "Whole-of-market search"]}
        ctaPrimary={{ label: "Get a Quote", href: "/contact" }}
        ctaSecondary={{ label: "Back to Finance", href: "/finance" }}
        stat={{ value: "100%", label: "Tailored Coverage", sublabel: "No off-the-shelf policies" }}
      />

      {/* Cover types */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-4">Coverage Types</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Insurance for Every Business Need</h2>
            <p className="text-slate-600 max-w-xl mx-auto">We guide you through every type of business insurance — ensuring you're covered where it matters most.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coverTypes.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="bg-slate-50 border border-slate-100 rounded-2xl p-7 hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{c.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{c.desc}</p>
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">{c.forWho}</div>
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
              <span className="inline-block text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full mb-5">Why Choose Us</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">Insurance guidance you can trust</h2>
              <p className="text-slate-600 leading-relaxed mb-8">We search the whole market on your behalf — cutting through the complexity so you get the right cover at the right price, without the headache.</p>
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
              <span className="inline-block text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full mb-5">Our Approach</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">How we find your coverage</h2>
              <div className="space-y-5">
                {steps.map((s, i) => (
                  <div key={s.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-emerald-700 text-white rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0">{i + 1}</div>
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
      <section className="py-20 bg-emerald-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Shield className="w-12 h-12 text-emerald-300 mx-auto mb-5" />
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">Is your business properly protected?</h2>
          <p className="text-emerald-100 leading-relaxed mb-8">Get in touch for a no-obligation insurance review — we'll identify any gaps and find the right coverage for you.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-all shadow-lg hover:-translate-y-0.5">
              Get Your Insurance Review <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/finance" className="inline-flex items-center gap-2 bg-emerald-600/50 hover:bg-emerald-600/70 border border-emerald-500/40 text-white font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5">
              Back to Finance Centre
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <p className="text-slate-500 text-xs leading-relaxed">
            <strong>Insurance Disclaimer:</strong> Remote Business Partner provides information and introductions to insurance products. We are not authorised insurance brokers. Always review policy documents carefully and seek independent advice to ensure coverage meets your specific requirements.
          </p>
        </div>
      </div>

      <CTABanner />
      <Footer />
    </div>
  );
}
