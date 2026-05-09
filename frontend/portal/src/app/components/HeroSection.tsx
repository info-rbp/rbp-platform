import { Link } from "react-router";
import { ArrowRight, TrendingUp, Users, CheckCircle } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1758518726324-62bef7c815b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidXNpbmVzcyUyMG9mZmljZSUyMHByb2Zlc3Npb25hbHN8ZW58MXx8fHwxNzc2OTIwNzI5fDA&ixlib=rb-4.1.0&q=80&w=1080";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase">Agile Authority in Consulting</span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Redefining Advisory for the{" "}
              <span className="text-blue-700 relative">
                Modern Age
                <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 300 6" fill="none">
                  <path d="M0 3 Q75 0 150 3 Q225 6 300 3" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
                </svg>
              </span>
            </h1>

            <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
              Empowering high-growth small businesses with the structural integrity of top-tier consultancy and the kinetic energy of modern fintech.
            </p>

            {/* Trust bullets */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              {["On-demand expert advisory", "Budget-flexible engagements", "End-to-end business toolkit"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-slate-600 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-7 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5"
              >
                Explore Services
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-800 border border-slate-200 hover:border-slate-300 px-7 py-3.5 rounded-xl font-bold transition-all hover:bg-slate-50 hover:-translate-y-0.5 shadow-sm"
              >
                Book a Consultation
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-6 xl:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 aspect-[4/3]">
              <img
                src={heroImage}
                alt="Remote Business Partner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 z-20 border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-700" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Growth Metric</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">+142%</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Avg. Operational Velocity</div>
            </div>

            {/* Floating clients card */}
            <div className="absolute -top-4 -right-4 bg-blue-700 text-white rounded-2xl shadow-xl p-4 z-20">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Businesses Served</span>
              </div>
              <div className="text-2xl font-extrabold">200+</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
