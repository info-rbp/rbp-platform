import { Link } from "react-router";
import { ArrowRight, Phone } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="relative bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl overflow-hidden">
          {/* Background texture */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10 px-8 py-14 sm:px-14 sm:py-16 text-center text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full mb-5">
              <Phone className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase tracking-wider">Get Started Today</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold mb-5 tracking-tight max-w-2xl mx-auto">
              Ready to Elevate Your Business Operations?
            </h3>
            <p className="text-blue-100 mb-10 max-w-xl mx-auto leading-relaxed">
              Connect with our team to discuss your specific needs, or explore our full range of advisory solutions designed for your growth stage.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/contact?reason=discovery-call"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-900 px-8 py-3.5 rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-lg"
              >
                Book Discovery Call
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/on-demand/services"
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-blue-800 text-white border-2 border-white/30 hover:border-white px-8 py-3.5 rounded-xl font-bold transition-all hover:-translate-y-0.5"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
