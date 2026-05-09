import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { mockMembershipPlans } from "../../mock";

export function MembershipOverviewPage() {
  const plan = mockMembershipPlans[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
          <section>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-700">Membership</p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Premium membership for business owners who want structured support.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Start with the Remote Business Partner membership, confirm inclusions, simulate payment, and complete a frontend-only onboarding flow before landing in the member portal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/membership/sign-up-now" className="inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800">
                Start mock sign-up
              </Link>
              <Link to="/membership/remote-business-partner-membership" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100">
                View plan details
              </Link>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {["Business onboarding", "Member portal access", "On-demand service entry", "Resources and partner offers"].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </section>
          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Featured plan</p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">{plan.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{plan.description}</p>
            <p className="mt-5 text-xl font-black text-blue-700">{plan.price.label}</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-600">
              {plan.inclusions.map((inclusion) => (
                <li key={inclusion}>- {inclusion}</li>
              ))}
            </ul>
            <Link to={plan.ctaHref} className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800">
              Choose this plan
            </Link>
            <p className="mt-4 text-xs font-medium text-slate-500">Phase 1 mock only. No real payment or authentication is processed.</p>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
