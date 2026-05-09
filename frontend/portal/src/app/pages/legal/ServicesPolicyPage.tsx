import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export function ServicesPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">Legal</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Services Policy</h1>
            <p className="mt-4 max-w-3xl text-slate-600">Placeholder for service boundaries, delivery assumptions, and public policy notices.</p>

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
              <Link to="/legal" className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">Legal Index</Link>
              <Link to="/legal/terms-of-use" className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">Terms of Use</Link>
              <Link to="/legal/terms-of-engagement" className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">Terms of Engagement</Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
