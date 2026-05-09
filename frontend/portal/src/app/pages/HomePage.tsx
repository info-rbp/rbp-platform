import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  ArrowRight, CheckCircle, Star, Headphones, Users, Layers,
  ShoppingBag, Zap, BookOpen, Settings2, Tag, HelpCircle,
  BarChart3, FileText, Lightbulb, MessageSquare, Home as HomeIcon,
  Shield, DollarSign, Wifi, Calculator, ChevronRight,
} from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1735825764460-c5dec05d6253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidXNpbmVzcyUyMHBsYXRmb3JtJTIwZGFzaGJvYXJkJTIwcHJvZmVzc2lvbmFsJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3NzU0NjgzOXww&ixlib=rb-4.1.0&q=80&w=1080";

const platformSections = [
  {
    icon: Headphones, color: "bg-blue-100 text-blue-700", accent: "border-blue-200",
    label: "On-Demand Services", href: "/on-demand",
    desc: "Business Advisor, consulting, documents, and decision support — when you need it.",
    links: ["Business Advisor", "Document Centre", "Decision Desk"],
  },
  {
    icon: Users, color: "bg-emerald-100 text-emerald-700", accent: "border-emerald-200",
    label: "Managed Services", href: "/managed-services",
    desc: "Ongoing operational support — bid management, real estate, and HR services.",
    links: ["Bid Management", "Real Estate", "HR Services"],
  },
  {
    icon: Layers, color: "bg-violet-100 text-violet-700", accent: "border-violet-200",
    label: "Business Applications", href: "/applications",
    desc: "White-labelled Frappe-powered business software — ready to set up for your business.",
    links: ["CRM & Sales", "ERP & Finance", "HR & People"],
  },
  {
    icon: ShoppingBag, color: "bg-amber-100 text-amber-700", accent: "border-amber-200",
    label: "Business Marketplace", href: "/marketplace",
    desc: "Packaged solutions, business-in-a-box bundles, setup packages, and digital products.",
    links: ["Business-in-a-Box", "Setup Bundles", "Digital Assets"],
  },
  {
    icon: Zap, color: "bg-rose-100 text-rose-700", accent: "border-rose-200",
    label: "Membership Hub", href: "/membership",
    desc: "Plans that unlock advisory access, applications, resources, documents, and more.",
    links: ["Compare Plans", "Member Benefits", "Join Now"],
  },
  {
    icon: BookOpen, color: "bg-teal-100 text-teal-700", accent: "border-teal-200",
    label: "Resource Centre", href: "/resources",
    desc: "Practical guides, templates, checklists, calculators, and business knowledge.",
    links: ["Guides & Articles", "Templates", "Calculators"],
  },
  {
    icon: Settings2, color: "bg-sky-100 text-sky-700", accent: "border-sky-200",
    label: "Operations Centre", href: "/operations",
    desc: "Finance pathways, insurance guidance, connectivity offers, and operational tools.",
    links: ["Business Finance", "Insurance", "Calculators"],
  },
  {
    icon: Tag, color: "bg-orange-100 text-orange-700", accent: "border-orange-200",
    label: "Business Offers", href: "/offers",
    desc: "Partner deals, exclusive offers, and curated discounts for your business.",
    links: ["Featured Deals", "Partner Offers", "Exclusive Access"],
  },
];

const howItWorks = [
  { step: "01", title: "Choose your pathway", desc: "Get immediate on-demand support, set up managed services, explore applications, or browse the marketplace." },
  { step: "02", title: "Access the right tools", desc: "Use the platform — documents, applications, resources, calculators, and advisory tools in one place." },
  { step: "03", title: "Build your business", desc: "With the right support, systems, and services behind you — grow with confidence." },
];

const stats = [
  { value: "500+", label: "Small businesses supported" },
  { value: "30+", label: "Business applications available" },
  { value: "$2M+", label: "Funding facilitated" },
  { value: "96%", label: "Client satisfaction rate" },
];

const featuredServices = [
  { icon: Lightbulb, label: "Business Advisor", desc: "Strategic guidance for business owners facing challenges, planning growth, or making key decisions.", href: "/on-demand/business-advisor", color: "bg-blue-50 text-blue-700 border-blue-100" },
  { icon: FileText, label: "Document Centre", desc: "Professional business documents — plans, legal docs, HR templates, and compliance packs.", href: "/on-demand/documents", color: "bg-teal-50 text-teal-700 border-teal-100" },
  { icon: BarChart3, label: "Bid Management", desc: "End-to-end tender, bid, and proposal management for businesses chasing contracts.", href: "/managed-services/bid-management", color: "bg-violet-50 text-violet-700 border-violet-100" },
  { icon: MessageSquare, label: "Decision Desk", desc: "Submit a business issue and receive structured written guidance and recommended next steps.", href: "/on-demand/decision-desk", color: "bg-amber-50 text-amber-700 border-amber-100" },
];

const testimonials = [
  { name: "Sarah M.", role: "Founder, Retail SME", quote: "Remote Business Partner gave us access to resources and advisory support we couldn't have afforded otherwise. The platform is genuinely useful.", rating: 5 },
  { name: "James T.", role: "Director, Property Business", quote: "The Bid Management service alone has transformed how we approach tenders. Highly professional, thorough, and worth every penny.", rating: 5 },
  { name: "Priya K.", role: "Startup Founder", quote: "The Document Centre saved us weeks of work. Everything was professional, tailored, and delivered exactly as described.", rating: 5 },
];

export function HomePage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.15)_0%,_transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.1)_0%,_transparent_60%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Integrated Business Platform
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                Business support, systems, and services in one{" "}
                <span className="text-blue-400">connected platform.</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
                Access advisory support, managed services, business applications, documents, resources, finance pathways, marketplace solutions, and member tools — built for small businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link to="/on-demand" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-4 rounded-xl transition-all shadow-lg shadow-blue-900/40 hover:-translate-y-0.5">
                  Explore the Platform <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/membership" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-4 rounded-xl transition-all hover:-translate-y-0.5">
                  View Membership Options
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {["No long-term contracts", "Small business focused", "End-to-end support"].map((b) => (
                  <div key={b} className="flex items-center gap-1.5 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" /> {b}
                  </div>
                ))}
              </div>
            </div>
            {/* Right: hero image */}
            <div className="relative hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/40 border border-white/10 aspect-[4/3]">
                <img src={heroImage} alt="Business platform" className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              </div>
              {/* Floating stat cards */}
              
              <div className="absolute -top-4 -right-4 bg-blue-700 text-white rounded-2xl shadow-xl p-4">
                <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-0.5">Platform</div>
                <div className="text-sm font-extrabold">10 Core Sections</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="bg-blue-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{s.value}</div>
                <div className="text-blue-100 text-sm font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Platform sections grid ── */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full mb-4">The Platform</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              One platform. Every pathway.
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Remote Business Partner is structured around the real needs of small businesses — from immediate advice and documents, to managed services, software, finance, and resources.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {platformSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <Link
                  key={sec.href}
                  to={sec.href}
                  className={`bg-white border-2 ${sec.accent} rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 group flex flex-col`}
                >
                  <div className={`w-11 h-11 rounded-xl ${sec.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{sec.label}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">{sec.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {sec.links.map((l) => (
                      <span key={l} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{l}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full mb-5">How It Works</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
                Built around the way small businesses actually work
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                Whether you need immediate help, ongoing operational support, business software, or educational resources — there's a clear pathway for you.
              </p>
              <div className="space-y-6">
                {howItWorks.map((h) => (
                  <div key={h.step} className="flex gap-4">
                    <div className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                      {h.step}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 mb-1">{h.title}</div>
                      <div className="text-slate-500 text-sm leading-relaxed">{h.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/on-demand" className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-200">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/membership" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-6 py-3 rounded-xl transition-all hover:bg-slate-50">
                  See Membership Plans
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              {/* Membership image */}
              <div className="rounded-2xl overflow-hidden shadow-xl relative" style={{aspectRatio: "4/3"}}>
                <img
                  src="https://images.unsplash.com/photo-1637979911089-bf0d73f0b9c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFkdmlzb3J5JTIwbWVldGluZyUyMHRlYW0lMjBjb2xsYWJvcmF0aW9uJTIwb2ZmaWNlfGVufDF8fHx8MTc3Nzc5MTM4M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="RBP Membership — business advisory and community"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/80 backdrop-blur-sm rounded-full mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Membership Hub</span>
                  </div>
                  <p className="text-white text-sm font-semibold leading-snug">
                    Advisory access, tools, and community — all in one membership.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured services ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full mb-3">Popular Services</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Start here</h2>
            </div>
            <Link to="/on-demand" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:underline">
              View all services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredServices.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  to={s.href}
                  className={`bg-white border ${s.color} rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-0.5 group`}
                >
                  <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{s.label}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <div className="flex items-center gap-1 text-xs font-bold text-blue-600">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Membership prompt ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 translate-y-1/2" />
            </div>
            <div className="relative z-10 px-8 py-14 sm:px-14 sm:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="text-white">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full mb-5">
                    <Zap className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Membership Hub</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
                    Unlock the full platform with a membership plan.
                  </h2>
                  <p className="text-blue-100 leading-relaxed mb-6">
                    Membership gives you access to advisory sessions, the Decision Desk, document downloads, application discounts, member offers, and more.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {["Advisory access", "Decision Desk", "Document downloads", "Application discounts", "Member offers", "Resource library"].map((b) => (
                      <div key={b} className="flex items-center gap-2 text-sm text-blue-100">
                        <CheckCircle className="w-4 h-4 text-blue-300 flex-shrink-0" /> {b}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link to="/membership" className="inline-flex items-center gap-2 bg-white text-blue-900 font-bold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:-translate-y-0.5">
                      Compare Membership Options <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/membership" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3.5 rounded-xl transition-all">
                      Join Now
                    </Link>
                  </div>
                </div>
                <div className="hidden lg:grid grid-cols-2 gap-3">
                  {[
                    { label: "Starter Plan", price: "From $29/mo", badge: "Most popular" },
                    { label: "Growth Plan", price: "From $59/mo", badge: "Best value" },
                    { label: "Pro Plan", price: "From $99/mo", badge: "Full access" },
                    { label: "Enterprise", price: "Custom", badge: "Bespoke" },
                  ].map((plan) => (
                    <div key={plan.label} className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
                      <div className="text-xs font-bold text-blue-200 mb-1">{plan.badge}</div>
                      <div className="font-extrabold text-white mb-1">{plan.label}</div>
                      <div className="text-blue-200 text-sm">{plan.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full mb-4">Testimonials</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">What our clients say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Ready to explore the platform?
          </h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto leading-relaxed">
            Whether you need advice, a document, a managed service, or a business application — your starting point is one click away.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/on-demand" className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-200 hover:-translate-y-0.5">
              Explore the Platform <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-8 py-4 rounded-xl transition-all hover:bg-slate-50">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}