import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">404</p>
          <h1 className="mt-2 text-4xl font-black text-slate-900">Page Not Found</h1>
          <p className="mt-4 text-slate-600">The page you requested could not be found. Try one of these public pages.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              ["Home", "/"], ["On-Demand", "/on-demand"], ["Applications", "/applications"],
              ["Membership", "/membership"], ["Contact", "/contact"], ["Help", "/help"],
            ].map(([label, href]) => (
              <Link key={href} to={href} className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800">{label}</Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
