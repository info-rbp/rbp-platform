import { Link } from "react-router";
import { managedServices } from "../data/managedServices";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CTABanner } from "../components/CTABanner";
import { PageHero } from "../components/PageHero";
import { BarChart3, Home as HomeIcon, Users, ArrowRight, CheckCircle, Clock, RefreshCw, Award } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1758611972678-bc3b29b4718f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG9wZXJhdGlvbnMlMjB0ZWFtJTIwbWFuYWdlbWVudCUyMG9mZmljZXxlbnwxfHx8fDE3Nzc1NDY4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080";

const services = [
  {
    icon: BarChart3, color: "bg-blue-100 text-blue-700", border: "border-blue-200",
    title: "Bid Management", href: "/managed-services/bid-management",
    desc: "End-to-end management of tenders, bids, proposals, and contract submissions. We take the process from identification through to submission.",
    deliverables: ["Tender opportunity identification", "Bid/no-bid assessment", "Proposal writing & editing", "Compliance checklist management", "Submission coordination", "Debrief & feedback review"],
    ideal: "Businesses pursuing public or private contracts",
  },
  {
    icon: HomeIcon, color: "bg-emerald-100 text-emerald-700", border: "border-emerald-200",
    title: "Real Estate", href: "/managed-services/real-estate",
    desc: "Operational, administrative, and documentation support for real estate businesses, property managers, landlords, and property professionals.",
    deliverables: ["Tenancy documentation", "Property process management", "Compliance documentation", "Tenant communication support", "Property admin support", "Operational procedures"],
    ideal: "Property managers, landlords, estate agencies",
  },
  {
    icon: Users, color: "bg-rose-100 text-rose-700", border: "border-rose-200",
    title: "HR Services", href: "/managed-services/hr-services",
    desc: "Ongoing people operations and HR administrative support — from onboarding and documentation to policy management and day-to-day HR admin.",
    deliverables: ["Employee documentation", "Onboarding coordination", "HR policy management", "Contract preparation support", "Absence & leave tracking support", "HR process documentation"],
    ideal: "SMEs without an in-house HR team",
  },
];

const benefits = [
  { icon: Clock, label: "Save time", desc: "Offload operational tasks to an experienced team — freeing you to focus on growth." },
  { icon: RefreshCw, label: "Consistent delivery", desc: "Recurring support means nothing gets missed — processes are maintained and improved over time." },
  { icon: Award, label: "Expert support", desc: "Access knowledge and capacity without the cost of hiring full-time staff." },
];

const process = [
  { step: "01", title: "Enquiry & scoping", desc: "Tell us what you need and we'll scope a managed service arrangement tailored to your business." },
  { step: "02", title: "Onboarding", desc: "We get to know your business, systems, and processes — then build a delivery framework." },
  { step: "03", title: "Ongoing delivery", desc: "Regular, reliable delivery of your managed service — with clear communication and reporting." },
  { step: "04", title: "Review & adapt", desc: "We review the arrangement regularly and adapt as your business evolves." },
];

const managedAnchorSections = managedServices
  .filter((service) => service.type === "anchor")
  .map((service) => ({
    id: service.id,
    title: service.title,
    description: service.summary,
  }));

export function ManagedServicesPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <PageHero
        title="Ongoing Support."
        titleAccent="Reliable Delivery."
        subtitle="Managed services for businesses that need consistent operational support — bid management, real estate admin, and HR services on a retained basis."
        badge="Managed Services"
        breadcrumb="Managed Services"
        image={heroImage}
        bullets={["Retained support arrangements", "Consistent, reliable delivery", "Expert teams"]}
        ctaPrimary={{ label: "Request Managed Services", href: "/contact?reason=managed-services" }}
        ctaSecondary={{ label: "On-Demand Instead", href: "/on-demand" }}
        stat={{ value: "3", label: "Core Service Areas", sublabel: "Bid · Real Estate · HR" }}
      />

      {/* Services */}
      <section id="overview" className="py-20 lg:py-28 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">Service Areas</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Three areas of managed operational support</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Each service area is delivered on a retained, ongoing basis — giving your business consistent support without the overhead of hiring.</p>
          </div>
          <div className="space-y-6">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div key={svc.title} className={`bg-white border-2 ${svc.border} rounded-2xl overflow-hidden hover:shadow-md transition-all`}>
                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    <div className="p-8 lg:border-r border-slate-100">
                      <div className={`w-12 h-12 ${svc.color} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 mb-2">{svc.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">{svc.desc}</p>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Ideal for</div>
                      <div className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${svc.color}`}>{svc.ideal}</div>
                    </div>
                    <div className="p-8 lg:col-span-2">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Example deliverables</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                        {svc.deliverables.map((d) => (
                          <div key={d} className="flex items-center gap-2 text-sm text-slate-700">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {d}
                          </div>
                        ))}
                      </div>
                      <Link to={svc.href} className={`inline-flex items-center gap-2 font-bold text-sm px-5 py-3 rounded-xl transition-all hover:-translate-y-0.5 ${svc.color}`}>
                        Explore {svc.title} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Managed service anchor sections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
              Additional Managed Service Areas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Flexible retained support areas
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              These sections support the public navigation links and provide clear page destinations for each managed service area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {managedAnchorSections.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-7 scroll-mt-32"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">{item.description}</p>
                <Link
                  to={`/contact?reason=${item.id}`}
                  className="inline-flex items-center gap-2 text-blue-700 font-bold text-sm hover:text-blue-800"
                >
                  Enquire about {item.title} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="bg-white border border-slate-100 rounded-2xl p-7 text-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{b.label}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="engagement-process" className="py-20 scroll-mt-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="how-managed-services-work" className="text-center mb-10 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">How managed services work</h2>
            <p className="text-slate-500">A straightforward onboarding and delivery process.</p>
          </div>
          <div className="space-y-5">
            {process.map((p, i) => (
              <div key={p.step} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0">{i + 1}</div>
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
      </section>

      <CTABanner />
      <Footer />
    </div>
  );
}
