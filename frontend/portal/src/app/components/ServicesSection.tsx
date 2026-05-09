import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const services = [
  {
    number: "01",
    title: "Advisory Services",
    tagline: "Expert Guidance, On Your Terms",
    desc: "On-demand senior consulting tailored precisely to your business challenges — no long retainers, no fluff. Just strategic clarity when you need it most.",
    bullets: [
      "Business health assessments & diagnostics",
      "Growth strategy and market positioning",
      "Operational efficiency reviews",
      "Leadership and decision-support coaching",
    ],
    link: "/services",
    gradient: "from-blue-600 to-blue-800",
    accentBg: "bg-blue-700",
    badgeBg: "bg-blue-100 text-blue-700",
  },
  {
    number: "02",
    title: "DocuShare",
    tagline: "Your Documents, Secured & Organized",
    desc: "A centralized, secure document management platform built for small businesses that need enterprise-grade organization without the enterprise price tag.",
    bullets: [
      "Encrypted cloud document storage",
      "Version control and audit trails",
      "Role-based team access permissions",
      "One-click client sharing & e-signatures",
    ],
    link: "/docushare",
    gradient: "from-violet-600 to-violet-800",
    accentBg: "bg-violet-700",
    badgeBg: "bg-violet-100 text-violet-700",
  },
  {
    number: "03",
    title: "Applications",
    tagline: "Tools That Work as Hard as You Do",
    desc: "Curated, powerful software applications designed to automate your workflows, reduce manual effort, and free you to focus on growth.",
    bullets: [
      "Workflow automation & task management",
      "CRM and customer engagement tools",
      "Accounting and invoicing integrations",
      "Productivity suite recommendations",
    ],
    link: "/applications",
    gradient: "from-emerald-600 to-emerald-800",
    accentBg: "bg-emerald-700",
    badgeBg: "bg-emerald-100 text-emerald-700",
  },
  {
    number: "04",
    title: "Offers",
    tagline: "Exclusive Value, Delivered to You",
    desc: "Hand-picked deals, discounts, and partnership opportunities with top-tier vendors — curated specifically for small business owners like you.",
    bullets: [
      "Vendor-negotiated software discounts",
      "Exclusive partner network access",
      "Seasonal and limited-time promotions",
      "Member-only bundles and packages",
    ],
    link: "/offers",
    gradient: "from-orange-500 to-orange-700",
    accentBg: "bg-orange-600",
    badgeBg: "bg-orange-100 text-orange-700",
  },
  {
    number: "05",
    title: "Finance",
    tagline: "Capital & Coverage, Simplified",
    desc: "Navigate lending, insurance, and financial planning with confidence. We connect you with competitive options and guide you through every decision.",
    bullets: [
      "Small business loan matching",
      "Business insurance comparisons",
      "Cash flow planning & forecasting",
      "Credit readiness assessments",
    ],
    link: "/finance",
    gradient: "from-sky-600 to-sky-800",
    accentBg: "bg-sky-700",
    badgeBg: "bg-sky-100 text-sky-700",
  },
  {
    number: "06",
    title: "Resources",
    tagline: "Knowledge That Moves Businesses Forward",
    desc: "A curated library of market intelligence, guides, templates, and training content — everything a growing business needs to stay sharp and informed.",
    bullets: [
      "Industry reports & market analysis",
      "Downloadable templates & playbooks",
      "Video training and webinar library",
      "Regulatory and compliance guides",
    ],
    link: "/resources",
    gradient: "from-rose-600 to-rose-800",
    accentBg: "bg-rose-700",
    badgeBg: "bg-rose-100 text-rose-700",
  },
];

export function ServicesSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoplayRef.current = setInterval(() => emblaApi?.scrollNext(), 5000);
  }, [emblaApi, stopAutoplay]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  const active = services[selectedIndex];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
            What We Offer
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">
            Your Complete Business Toolkit
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive advisory and toolsets designed to support every stage of your small business journey.
          </p>
        </div>

        {/* Service Tab Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {services.map((s, i) => (
            <button
              key={s.title}
              onClick={() => { scrollTo(i); stopAutoplay(); }}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                i === selectedIndex
                  ? `${s.badgeBg} ring-2 ring-offset-2 ring-current`
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
        >
          <div className="overflow-hidden rounded-3xl shadow-xl" ref={emblaRef}>
            <div className="flex">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="flex-none w-full min-h-[420px] flex flex-col lg:flex-row"
                >
                  {/* Left accent panel */}
                  <div className={`bg-gradient-to-br ${service.gradient} lg:w-2/5 flex flex-col justify-between p-10 lg:p-14`}>
                    <div>
                      <span className="text-7xl lg:text-8xl font-black text-white/15 leading-none select-none block mb-6">
                        {service.number}
                      </span>
                      <p className="text-sm font-bold uppercase tracking-widest text-white/60 mb-2">
                        {service.tagline}
                      </p>
                      <h3 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                        {service.title}
                      </h3>
                    </div>
                    <Link
                      to={service.link}
                      className="inline-flex items-center gap-2 mt-10 text-sm font-bold text-white/80 hover:text-white group transition-colors"
                    >
                      Explore {service.title}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Right content panel */}
                  <div className="bg-slate-50 lg:w-3/5 flex flex-col justify-center p-10 lg:p-14">
                    <p className="text-slate-600 text-base leading-relaxed mb-8 max-w-lg">
                      {service.desc}
                    </p>
                    <ul className="space-y-4">
                      {service.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3">
                          <span className={`mt-1 w-2 h-2 rounded-full flex-none ${service.accentBg}`} />
                          <span className="text-slate-700 text-sm leading-snug">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prev / Next */}
          <button
            onClick={scrollPrev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:shadow-lg border border-slate-200 text-slate-700 hover:text-blue-700 rounded-full p-3 transition-all"
            aria-label="Previous service"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:shadow-lg border border-slate-200 text-slate-700 hover:text-blue-700 rounded-full p-3 transition-all"
            aria-label="Next service"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-7">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => { scrollTo(i); stopAutoplay(); }}
              className={`rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? `${services[i].accentBg} w-6 h-2`
                  : "bg-slate-200 w-2 h-2 hover:bg-slate-400"
              }`}
              aria-label={`Go to ${services[i].title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
