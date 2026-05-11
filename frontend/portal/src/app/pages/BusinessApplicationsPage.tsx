import { Link } from "react-router";
import { applicationCategories } from "../data/applications";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Layers,
  Map,
  Sparkles,
} from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGFwcGxpY2F0aW9ucyUyMGRhc2hib2FyZCUyMGJ1c2luZXNzJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3Nzc1NDY4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080";

export function BusinessApplicationsPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <section className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,0.20)_0%,_transparent_58%)] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/15 border border-blue-300/20 text-blue-100 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <Layers className="w-3 h-3" /> RBP Applications
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                Business applications,{" "}
                <span className="text-blue-300">built around how your business works.</span>
              </h1>

              <p className="text-lg text-slate-200 leading-relaxed mb-6">
                Launching in 2027, RBP Applications will bring together practical tools for CRM, operations, finance, people, documents, support, reporting, and automation. Each application will be configured around your workflows, roles, and business requirements.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  "Launching 2027",
                  "Built around business workflows",
                  "Integrated with the RBP platform",
                  "Setup and support planned",
                ].map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5 text-sm text-slate-200">
                    <CheckCircle className="w-4 h-4 text-blue-300 flex-shrink-0" />
                    {badge}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact?reason=applications-2027-interest"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-4 rounded-xl transition-all shadow-lg hover:-translate-y-0.5"
                >
                  Register Interest <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#overview"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-4 rounded-xl transition-all"
                >
                  View Planned Application Areas <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border border-white/10 bg-white/5">
                <img
                  src={heroImage}
                  alt="Preview of planned business application dashboards"
                  className="w-full h-full object-cover opacity-70"
                />
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 rounded-2xl p-4 shadow-xl">
                <div className="text-2xl font-extrabold">2027</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Launch Preview
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-blue-600 text-white rounded-2xl p-4 shadow-xl max-w-[220px]">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-100 mb-1">
                  Early planning open
                </div>
                <div className="text-sm font-semibold leading-snug">
                  Register interest and help prioritise what launches first.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
              What is being planned
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Applications designed for the way small businesses actually operate.
            </h2>

            <p className="text-slate-600 text-lg leading-relaxed">
              RBP Applications will help businesses manage customers, staff, documents, support, finance, reporting, workflows, and automation from one connected environment. The focus is not just installing software. The focus is configuring tools around real operating needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <Map className="w-5 h-5" />,
                title: "Workflow-led setup",
                summary: "Applications will be shaped around how work moves through the business, not around generic software menus.",
              },
              {
                icon: <Layers className="w-5 h-5" />,
                title: "Connected platform",
                summary: "The planned applications will align with the broader RBP platform, portal, records, and service workflows.",
              },
              {
                icon: <Sparkles className="w-5 h-5" />,
                title: "Priority shaped by interest",
                summary: "Early conversations will help determine which application areas are prioritised for release.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="overview" className="py-16 bg-slate-50 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-white px-3 py-1 rounded-full mb-4">
              Application Areas
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Planned application areas
            </h2>

            <p className="text-slate-600 max-w-2xl mx-auto">
              These areas show the capability groups being shaped for the 2027 application launch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {applicationCategories.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm scroll-mt-32 hover:border-blue-200 hover:shadow-md transition-all"
              >
                <div className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mb-4">
                  Planned capability area
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-5">{item.summary}</p>

                <Link
                  to={`/contact?reason=${item.id}`}
                  className="inline-flex items-center gap-2 text-blue-700 font-bold text-sm hover:text-blue-800"
                >
                  {item.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
            Shape the roadmap
          </span>

          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            Want to shape what launches first?
          </h2>

          <p className="text-slate-600 mb-6">
            Tell us which workflows matter most to your business. Early interest will help prioritise application areas and prepare setup pathways before the 2027 launch.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/contact?reason=applications-2027-interest"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg hover:-translate-y-0.5"
            >
              Register Interest <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/contact?reason=applications-requirements"
              className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-7 py-3.5 rounded-xl transition-all hover:bg-slate-50"
            >
              Discuss Application Needs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
