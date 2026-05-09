import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "CEO, Bloom Retail Co.",
    quote:
      "Remote Business Partner completely transformed how we manage operations. Within 8 weeks, we had clear processes, a lean team structure, and more time to focus on growth.",
    initials: "SM",
    color: "bg-blue-600",
  },
  {
    name: "James T.",
    role: "Founder, TechForge Solutions",
    quote:
      "The AI Implementation advisory alone saved us thousands in redundant tools. Their practical, no-nonsense approach is exactly what small businesses need.",
    initials: "JT",
    color: "bg-violet-600",
  },
  {
    name: "Lisa O.",
    role: "Director, Okafor Consulting",
    quote:
      "DocuShare changed everything about how we handle client files. Secure, organized, and incredibly easy. Highly recommend the full RBP toolkit.",
    initials: "LO",
    color: "bg-emerald-600",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
            Client Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Business Owners
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-slate-50 border border-slate-100 p-8 rounded-2xl shadow-sm flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-slate-700 text-sm leading-relaxed flex-grow mb-6">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
