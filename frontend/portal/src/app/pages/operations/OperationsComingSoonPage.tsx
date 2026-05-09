import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export function OperationsComingSoonPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">Operations</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Operations Update Coming Soon</h1>
            <p className="mt-4 max-w-3xl text-slate-600">Placeholder for upcoming operations content and services that are being prepared for public release.</p>

            <section className="mt-8 rounded-xl border border-blue-100 bg-blue-50/60 p-5">
              <h2 className="text-lg font-bold text-slate-900">Content update in progress</h2>
              <p className="mt-2 text-sm text-slate-600">
                This page is a public placeholder for the enhanced sitemap. Detailed content, FAQs, and service specifics
                will be published in a future content release.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Related public links</h2>
              <div className="mt-3 flex flex-wrap gap-4">
              <Link to="/operations" className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">Operations Center</Link>
              <Link to="/operations/finance" className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">Finance</Link>
              <Link to="/resources" className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">Resources</Link>
              </div>
            </section>
            <Link
              to="/operations"
              className="inline-flex items-center rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-colors"
            >
              Browse Current Services
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
