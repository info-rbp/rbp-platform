import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CTABanner } from "../components/CTABanner";
import { PageHero } from "../components/PageHero";
import { LayoutGrid, Zap, RefreshCw, Users, BarChart2, Bell, ArrowRight } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHNvZnR3YXJlJTIwYXBwbGljYXRpb25zJTIwdGVjaG5vbG9neSUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NzY5MjMzMDN8MA&ixlib=rb-4.1.0&q=80&w=1080";

const apps = [
  {
    icon: Zap,
    name: "Workflow Automator",
    category: "Automation",
    desc: "Build powerful automated workflows without writing a single line of code. Connect your tools and let them work together.",
    color: "bg-amber-100 text-amber-700",
    badge: "Popular",
  },
  {
    icon: BarChart2,
    name: "Business Dashboard",
    category: "Analytics",
    desc: "Get a real-time view of all your key business metrics in one unified dashboard. Know your numbers at a glance.",
    color: "bg-blue-100 text-blue-700",
    badge: null,
  },
  {
    icon: Users,
    name: "Team Hub",
    category: "Collaboration",
    desc: "Manage tasks, projects, and team communications in one place. Keep everyone aligned and accountable.",
    color: "bg-violet-100 text-violet-700",
    badge: "New",
  },
  {
    icon: RefreshCw,
    name: "Process Manager",
    category: "Operations",
    desc: "Document, track, and optimize your business processes with a visual process builder and tracking tools.",
    color: "bg-emerald-100 text-emerald-700",
    badge: null,
  },
  {
    icon: Bell,
    name: "Alerts & Reporting",
    category: "Notifications",
    desc: "Never miss an important business signal. Set custom alerts and generate automated reports on schedule.",
    color: "bg-rose-100 text-rose-700",
    badge: null,
  },
  {
    icon: LayoutGrid,
    name: "App Marketplace",
    category: "Integrations",
    desc: "Browse and connect hundreds of third-party apps and services to extend your business capabilities.",
    color: "bg-sky-100 text-sky-700",
    badge: "Coming Soon",
  },
];

export function ApplicationsPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <PageHero
        title="Business"
        titleAccent="Applications Suite"
        subtitle="Powerful, curated software tools to automate your workflows, boost productivity, and drive operational excellence."
        badge="Applications"
        breadcrumb="Applications"
        image={heroImage}
        bullets={["Curated best-in-class tools", "Easy integrations", "Ongoing recommendations"]}
        ctaPrimary={{ label: "Explore the Suite", href: "/contact" }}
        ctaSecondary={{ label: "View All Services", href: "/services" }}
        stat={{ value: "50+", label: "Integrated Applications", sublabel: "And growing" }}
      />

      {/* Intro */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-5">
            Curated for Small Business
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-5 tracking-tight">
            The Right Tools, Ready to Deploy
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-14 leading-relaxed">
            We've handpicked and configured the best business applications so you don't have to evaluate dozens of tools. Each app in our suite is tailored for the needs of growing small businesses.
          </p>

          {/* App Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {apps.map((app) => {
              const Icon = app.icon;
              return (
                <div key={app.name} className="bg-slate-50 border border-slate-100 rounded-2xl p-7 hover:shadow-md transition-all flex flex-col">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {app.badge && (
                      <span className="text-xs font-bold bg-blue-700 text-white px-2.5 py-1 rounded-lg">
                        {app.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{app.category}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{app.name}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed flex-grow mb-5">{app.desc}</p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-800 text-sm font-bold transition-colors"
                  >
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </div>
  );
}