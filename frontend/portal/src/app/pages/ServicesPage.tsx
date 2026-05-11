import { Link } from "react-router";
import { advisoryCategories } from "../data/onDemandServices";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CTABanner } from "../components/CTABanner";
import { OnDemandBanner } from "../components/OnDemandBanner";
import { PageHero } from "../components/PageHero";
import { ArrowRight } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1714974528693-f77f6fcc56af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbnN1bHRpbmclMjBzdHJhdGVneSUyMG1lZXRpbmclMjBwcm9mZXNzaW9uYWxzfGVufDF8fHx8MTc3NjkyMzMwM3ww&ixlib=rb-4.1.0&q=80&w=1080";

const services = [
  {
    title: "Operations Advisory",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop",
    desc: "Optimizing workflows and efficiency.",
    details:
      "We help you streamline processes, eliminate operational bottlenecks, and design workflows that allow your team to deliver faster and more accurately.",
    tag: "Most Popular",
  },
  {
    title: "Human Resource Advisory",
    img: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop",
    desc: "Structuring teams for success.",
    details:
      "We provide practical support on role clarity, organizational structure, workplace practices, and employee lifecycle management so your team is aligned with your business goals.",
    tag: null,
  },
  {
    title: "Management Consulting",
    img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=600&auto=format&fit=crop",
    desc: "High-level strategic guidance.",
    details:
      "We offer commercial guidance on business direction, performance improvement, planning, and organizational structure to help owners make confident, data-driven decisions.",
    tag: null,
  },
  {
    title: "Change Management",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    desc: "Navigating business transformation.",
    details:
      "Whether you are undergoing restructuring, merging workflows, or transitioning to new processes, we help manage the people, processes, and tools to make change stick.",
    tag: null,
  },
  {
    title: "AI Implementation",
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop",
    desc: "Practical AI operationalization.",
    details:
      "We help you identify, adopt, and integrate AI tools safely and effectively into your existing processes to drive real efficiency and team competency.",
    tag: "Trending",
  },
  {
    title: "Admin & Finance Consulting",
    img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
    desc: "Building solid systems.",
    details:
      "We support the operational side of your administration and financial systems, helping you prepare for funding, maintain readiness, and standardize internal commercial workflows.",
    tag: null,
  },
  {
    title: "Customised Solutions",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
    desc: "Support for unique needs.",
    details:
      "Some problems don't fit a category. We offer bespoke advisory, project management, and targeted interventions for complex, cross-functional challenges.",
    tag: null,
  },
];

const advisoryAnchorSections = advisoryCategories.map((item) => ({
  ...item,
  description: `${item.title} support and advisory content will be expanded as the service catalogue is refined.`,
}));

export function ServicesPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <PageHero
        title="Expert Advisory for"
        titleAccent="Small Business Growth"
        subtitle="We combine practical consulting, operational support, and strategic guidance to help you navigate complexity and build a more effective business."
        badge="Our Services"
        breadcrumb="Services"
        image={heroImage}
        bullets={["On-demand expert advisory", "Tailored to your budget", "Across 7 service verticals"]}
        ctaPrimary={{ label: "Book Discovery Call", href: "/about/discovery-call" }}
        ctaSecondary={{ label: "Explore All Services", href: "/on-demand/services" }}
        stat={{ value: "200+", label: "Businesses Supported", sublabel: "And growing" }}
      />

      <OnDemandBanner />

      {/* Services Grid */}
      <section className="py-16 lg:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
            Service Offering
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            What We Can Do For You
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            On-demand delivery of expert advisory and consulting services tailored to your small business needs.
          </p>
        </div>

        <div className="space-y-8">
          {services.map((s, index) => (
            <div
              key={s.title}
              className={`bg-slate-50 border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-center gap-8 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="w-full lg:w-72 flex-shrink-0">
                <div className="relative rounded-2xl overflow-hidden aspect-video shadow-md">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                  {s.tag && (
                    <div className="absolute top-3 left-3 bg-blue-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                      {s.tag}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="font-semibold text-blue-700 mb-3 text-sm">{s.desc}</p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{s.details}</p>
                <Link
                  to="/about/discovery-call"
                  className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 px-6 rounded-xl transition-all text-sm"
                >
                  Enquire Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advisory anchor sections */}
      <section id="advisory-categories" className="py-16 bg-slate-50 scroll-mt-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="overview" className="text-center mb-12 scroll-mt-32">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-white px-3 py-1 rounded-full mb-4">
              Advisory Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Explore On-Demand Advisory Areas
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These sections support the public navigation links and give each advisory category a clear destination on the page.
            </p>
          </div>

          <div id="how-it-works" className="bg-white border border-slate-200 rounded-2xl p-7 mb-8 scroll-mt-32">
            <h3 className="text-xl font-bold text-slate-900 mb-2">How On-Demand Services Work</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Choose the support area that best matches your business need, submit an enquiry, and we will scope the most suitable advisory pathway.
            </p>
          </div>

          <div id="core-services" className="grid grid-cols-1 md:grid-cols-2 gap-5 scroll-mt-32">
            {advisoryAnchorSections.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm scroll-mt-32"
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

      <CTABanner />
      <Footer />
    </div>
  );
}
