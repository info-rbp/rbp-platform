import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { mockMembershipExtras, mockMembershipPlans } from "../../mock";

export function RemoteBusinessPartnerMembershipPage() {
  const plan = mockMembershipPlans[0];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-700">Remote Business Partner Membership</p>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{plan.name}</h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
                A calm, structured membership experience for business owners who need practical advisory support, access to on-demand services, and a portal handoff after onboarding.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/membership/sign-up-now" className="inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800">
                  Start membership flow
                </Link>
                <Link to="/membership/inclusions" className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
                  See inclusions
                </Link>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {plan.inclusions.map((inclusion) => (
                  <article key={inclusion} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-950">{inclusion}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Included as a frontend-only entitlement state for Phase 1 journey testing.</p>
                  </article>
                ))}
              </div>
            </div>
            <aside className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <h2 className="text-xl font-black text-slate-950">One membership, optional extras</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{plan.price.label}. Optional extras are selected inside the mock checkout.</p>
              <div className="mt-5 space-y-3">
                {mockMembershipExtras.map((extra) => (
                  <div key={extra.id} className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-sm font-bold text-slate-900">{extra.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{extra.description}</p>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
