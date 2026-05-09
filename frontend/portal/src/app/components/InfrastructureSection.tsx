import { Settings, RefreshCw, Lightbulb } from "lucide-react";

const toolkitImage = "https://images.unsplash.com/photo-1768055105681-7d2096c5165f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBhZHZpc29yeSUyMGNoYXJ0cyUyMGRhdGF8ZW58MXx8fHwxNzc2OTIwNzMwfDA&ixlib=rb-4.1.0&q=80&w=1080";

const features = [
  {
    icon: Settings,
    title: "Integrated Ecosystem",
    desc: "Seamlessly connected tools for unified management across your business.",
  },
  {
    icon: RefreshCw,
    title: "Operational Efficiency",
    desc: "Automated workflows that reclaim precious time and reduce friction.",
  },
  {
    icon: Lightbulb,
    title: "Actionable Insights",
    desc: "Data-driven intelligence to guide confident, strategic decisions.",
  },
];

export function InfrastructureSection() {
  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900 text-white rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Content */}
            <div className="p-10 lg:p-16 flex flex-col justify-center">
              <span className="inline-block text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-900/50 px-3 py-1 rounded-full mb-6 w-fit">
                The Toolkit
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 tracking-tight">
                The Small Business Toolkit
              </h2>
              <p className="text-slate-300 mb-10 leading-relaxed">
                We've built a comprehensive ecosystem for small business owners. Our toolkit integrates specialized services, secure platforms, and actionable insights to streamline your operations and empower sustainable growth.
              </p>

              <div className="space-y-7">
                {features.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div key={feat.title} className="flex gap-5">
                      <div className="w-11 h-11 flex-shrink-0 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">{feat.title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Image */}
            <div className="relative min-h-[320px] lg:min-h-0">
              <img
                src={toolkitImage}
                alt="Small Business Toolkit"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-slate-900/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
