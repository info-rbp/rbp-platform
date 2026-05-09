import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { CTABanner } from "../../components/CTABanner";
import { PageHero } from "../../components/PageHero";
import { ArrowRight, CheckCircle } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1758611972678-bc3b29b4718f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG9wZXJhdGlvbnMlMjB0ZWFtJTIwbWFuYWdlbWVudCUyMG9mZmljZXxlbnwxfHx8fDE3Nzc1NDY4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080";

const services = ["Employee documentation & contracts","Onboarding coordination & process management","HR policy creation & maintenance","Absence & leave management support","Performance review process coordination","Disciplinary & grievance process support","Job description & recruitment documentation","HR admin & record-keeping support"];

export function HRServicesPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <PageHero
        title="HR Services"
        titleAccent="People Operations"
        subtitle="Ongoing HR administration, onboarding, policy management, and people operations support — for businesses without a dedicated HR team."
        badge="Managed Services"
        breadcrumb="HR Services"
        image={heroImage}
        bullets={["Onboarding & offboarding", "HR policy management", "Employee documentation"]}
        ctaPrimary={{ label: "Enquire About HR Services", href: "/contact" }}
        ctaSecondary={{ label: "All Managed Services", href: "/managed-services" }}
        stat={{ value: "Retained", label: "HR Support", sublabel: "Ongoing · Flexible · Expert" }}
      />
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">What we support</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {services.map((s) => (
              <div key={s} className="flex items-start gap-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-3">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> {s}
              </div>
            ))}
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5">
            Enquire Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      <CTABanner />
      <Footer />
    </div>
  );
}
