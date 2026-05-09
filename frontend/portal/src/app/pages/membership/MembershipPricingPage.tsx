import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export function MembershipPricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">Membership</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Membership Pricing</h1>
            <p className="mt-4 max-w-3xl text-slate-600">Draft placeholder page for membership plan structure and pricing guidance.</p>

            <section className="mt-8 rounded-xl border border-blue-100 bg-blue-50/60 p-5">
              <h2 className="text-lg font-bold text-slate-900">Content update in progress</h2>
              <p className="mt-2 text-sm text-slate-600">This public membership page is a placeholder. Final copy, examples, and policy detail will be added in a later content release.</p>
            </section>
            <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h2 className="text-sm font-bold text-amber-900">Draft pricing notice</h2>
              <p className="mt-1 text-sm text-amber-800">Any prices or package values shown across the public site are placeholders and may change before final publication.</p>
            </section>

            <section className="mt-8">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Related public links</h2>
              <div className="mt-3 flex flex-wrap gap-4">
                <Link to="/membership/overview" className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">Overview</Link>
                <Link to="/membership/inclusions" className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">Inclusions</Link>
                <Link to="/membership/sign-up-now" className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">Sign Up Now</Link>
              </div>
            </section>
            <Link to="/membership/sign-up-now" className="mt-8 inline-flex items-center rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-colors">
              Continue to Sign Up
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
