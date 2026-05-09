import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Users,
  Star,
  ShieldCheck,
  Layers,
  TrendingUp,
} from "lucide-react";

const usps = [
  {
    icon: Users,
    stat: "200+",
    title: "Businesses Supported",
    description:
      "A proven track record helping small and mid-size businesses scale smarter, cut waste, and grow with confidence.",
  },
  {
    icon: Zap,
    stat: "On-Demand",
    title: "Expertise, When You Need It",
    description:
      "Access senior business advisors instantly — no long-term retainers, no overhead. Just the right help at the right time.",
  },
  {
    icon: Layers,
    stat: "7",
    title: "Service Verticals",
    description:
      "From finance and operations to HR and technology, we cover every dimension of your business under one roof.",
  },
  {
    icon: Star,
    stat: "98%",
    title: "Client Satisfaction",
    description:
      "Our clients consistently rate us as a top-tier advisory partner, returning time and again for new challenges.",
  },
  {
    icon: ShieldCheck,
    stat: "Trusted",
    title: "Agile & Accountable",
    description:
      "We move at your pace with clear deliverables and measurable outcomes — no vague advice, just real results.",
  },
  {
    icon: TrendingUp,
    stat: "End-to-End",
    title: "Strategy to Execution",
    description:
      "We don't just hand you a plan — we stay beside you through implementation, iteration, and long-term growth.",
  },
];

export function StatsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoplayRef.current = setInterval(() => {
      emblaApi?.scrollNext();
    }, 4000);
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

  return (
    <section className="py-14 bg-blue-700 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-blue-200 text-sm uppercase tracking-widest mb-1">Why Choose Us</p>
          <h2 className="text-white text-2xl sm:text-3xl font-extrabold">
            What Sets Remote Business Partner Apart
          </h2>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
        >
          {/* Prev Button */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-2 sm:translate-x-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Track */}
          <div className="overflow-hidden mx-8 sm:mx-10" ref={emblaRef}>
            <div className="flex gap-4">
              {usps.map((usp) => {
                const Icon = usp.icon;
                return (
                  <div
                    key={usp.title}
                    className="flex-none w-[85%] sm:w-[44%] lg:w-[30%] bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-7 py-8 flex flex-col items-center text-center"
                  >
                    <div className="bg-white/20 rounded-full p-4 mb-4">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-3xl font-extrabold text-white mb-1">{usp.stat}</div>
                    <div className="text-base font-bold text-blue-100 mb-3">{usp.title}</div>
                    <p className="text-sm text-blue-200 leading-relaxed">{usp.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-2 sm:translate-x-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-7">
          {usps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? "bg-white w-6 h-2"
                  : "bg-white/30 w-2 h-2 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
