import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { CTABanner } from "../../components/CTABanner";
import { PageHero } from "../../components/PageHero";
import { ArrowRight, CheckCircle } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1758611972678-bc3b29b4718f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG9wZXJhdGlvbnMlMjB0ZWFtJTIwbWFuYWdlbWVudCUyMG9mZmljZXxlbnwxfHx8fDE3Nzc1NDY4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080";

const services = ["Tenancy documentation preparation & management","Tenant communication templates & correspondence","Property compliance documentation","Inspection report templates & processes","Rental income tracking support","Maintenance workflow documentation","Property admin process setup & SOPs","Onboarding documentation for new tenants"];

export function RealEstatePage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <PageHero
        title="Real Estate"
        titleAccent="Operations Support"
        subtitle="Operational, administrative, and documentation support for property businesses, landlords, managers, and real estate professionals."
        badge="Managed Services"
        breadcrumb="Real Estate"
        image={heroImage}
        bullets={["Tenancy documentation", "Property compliance", "Admin & process support"]}
        ctaPrimary={{ label: "Enquire About Real Estate Services", href: "/contact" }}
        ctaSecondary={{ label: "All Managed Services", href: "/managed-services" }}
        stat={{ value: "End-to-end", label: "Property Admin", sublabel: "Docs · Processes · Comms" }}
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
          <Link to="/contact" className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5">
            Enquire Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      <CTABanner />
      <Footer />
    </div>
  );
}
