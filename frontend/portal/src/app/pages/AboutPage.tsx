import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CTABanner } from "../components/CTABanner";
import { PageHero } from "../components/PageHero";
import { Target, Heart, Zap, Globe, ArrowRight } from "lucide-react";

const teamImage = "https://images.unsplash.com/photo-1758691736975-9f7f643d178e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwYnVzaW5lc3MlMjB0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3NzY5MjMzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080";
const colabImage = "https://images.unsplash.com/photo-1752650735943-d0fbf1edce21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnRyZXByZW5ldXIlMjB0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzY5MjA3MzB8MA&ixlib=rb-4.1.0&q=80&w=1080";

const values = [
  {
    icon: Target,
    title: "Precision-Focused",
    desc: "We don't do vague. Our advisory is specific, structured, and calibrated to your exact situation.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: Heart,
    title: "Client-First",
    desc: "Your growth is our metric. Every recommendation we make is in service of your business outcomes.",
    color: "bg-rose-100 text-rose-700",
  },
  {
    icon: Zap,
    title: "Agile Delivery",
    desc: "We move fast, adapt quickly, and deliver meaningful impact without lengthy timelines.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Globe,
    title: "Fully Remote",
    desc: "Operating globally with no overhead—our remote model means better value for you.",
    color: "bg-emerald-100 text-emerald-700",
  },
];

const team = [
  {
    name: "Alexandra Reid",
    role: "Founder & Lead Consultant",
    bio: "10+ years in operations advisory and business transformation across SMEs.",
    initials: "AR",
    color: "bg-blue-600",
  },
  {
    name: "David Osei",
    role: "Head of Finance Advisory",
    bio: "Former investment banker bringing institutional-grade thinking to small business finance.",
    initials: "DO",
    color: "bg-violet-600",
  },
  {
    name: "Priya Shah",
    role: "AI & Digital Lead",
    bio: "Specializes in practical AI adoption, automation strategy, and digital workflow design.",
    initials: "PS",
    color: "bg-emerald-600",
  },
  {
    name: "Marcus Webb",
    role: "HR & People Advisory",
    bio: "Supports businesses in building high-performing, well-structured teams from the ground up.",
    initials: "MW",
    color: "bg-orange-600",
  },
];

export function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <PageHero
        title="We Are Remote"
        titleAccent="Business Partner"
        subtitle="A team of seasoned consultants committed to empowering small businesses with the tools, strategy, and advisory they need to grow with confidence."
        badge="About Us"
        breadcrumb="About Us"
        image={teamImage}
        bullets={["Experienced senior consultants", "Committed to your growth", "Transparent & accountable"]}
        ctaPrimary={{ label: "Book Discovery Call", href: "/about/discovery-call" }}
        ctaSecondary={{ label: "Our Services", href: "/on-demand/services" }}
        stat={{ value: "10+", label: "Years Combined Experience", sublabel: "Across advisory verticals" }}
      />

      {/* Mission */}
      <section id="our-purpose" className="py-20 lg:py-28 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-5">
                Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Bringing Enterprise-Grade Thinking to Small Business
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Remote Business Partner was founded on a simple belief: small businesses deserve access to the same quality of advisory that large corporations take for granted. We exist to close that gap.
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                We work with founders, directors, and operators who are ambitious about growth but recognize they need a trusted, knowledgeable partner to help them structure, optimize, and scale their businesses smartly.
              </p>
              <Link
                to="/about/discovery-call"
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                Work With Us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 aspect-[4/3]">
              <img src={colabImage} alt="Our team" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="our-platform" className="py-16 bg-slate-50 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
              What Drives Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm">
                  <div className={`w-12 h-12 ${v.color} rounded-xl flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
              Meet the Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">The People Behind RBP</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-slate-50 rounded-2xl border border-slate-100 p-7 text-center">
                <div
                  className={`w-16 h-16 ${member.color} rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-5`}
                >
                  {member.initials}
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-blue-700 text-xs font-semibold mb-3">{member.role}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
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
