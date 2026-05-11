import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { ArrowRight } from "lucide-react";

export function OurPlatformPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-700">
            Our Platform
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            One platform for advisory, services, documents, applications, and business support.
          </h1>
          <p className="mt-5 max-w-3xl text-slate-600">
            This page explains the RBP ecosystem across services, documents, membership,
            marketplace, applications, resources, and support pathways.
          </p>
          <Link
            to="/about/discovery-call"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800"
          >
            Book Discovery Call <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
