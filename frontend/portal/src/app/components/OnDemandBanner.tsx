import { Zap, Clock3, Scale } from "lucide-react";

const advisoryImage = "https://images.unsplash.com/photo-1714974528693-f77f6fcc56af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGJ1c2luZXNzJTIwdGVhbSUyMGNvbnN1bHRpbmclMjBtZWV0aW5nfGVufDF8fHx8MTc3NjkyMDcyOXww&ixlib=rb-4.1.0&q=80&w=1080";

const features = [
  {
    icon: Zap,
    title: "On-Demand Expertise",
    desc: "Access high-level advisory precisely when your business needs it most—no more, no less.",
  },
  {
    icon: Clock3,
    title: "Budget-Friendly Flexibility",
    desc: "Tailored solutions that respect your bottom line. Pay for the support you actually use.",
  },
  {
    icon: Scale,
    title: "Customised for Growth",
    desc: "Designed to evolve. We scale our advisory intensity and cost as your business grows.",
  },
];

export function OnDemandBanner() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 aspect-[4/3]">
            <img
              src={advisoryImage}
              alt="Advisory Services"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 to-transparent" />
            {/* Badge */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/60">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Avg. Engagement Time</div>
                  <div className="text-xl font-extrabold text-slate-900">3–6 weeks</div>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-5">
              Your Business, Your Terms
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
              Expert Advisory When You Need It, Within Your Budget
            </h2>

            <div className="space-y-7">
              {features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div key={feat.title} className="flex gap-5">
                    <div className="w-11 h-11 flex-shrink-0 bg-blue-700 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{feat.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
