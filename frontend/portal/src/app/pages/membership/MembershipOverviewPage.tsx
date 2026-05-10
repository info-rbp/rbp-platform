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
              Premium Early Bird Offer for Premium Business Owners
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Get access to all the tools and resources that you need to run your business 24/7 without having to wait for a call back. All digital, all designed for you
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {[
                "Membership Designed for Business Owners",
                "Resources Designed for Small Business",
                "Tools Built For the Long Term",
                "More Assets Coming Soon",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </section>
          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Earlybird Offer</p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">{plan.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{plan.description}</p>
            <p className="mt-5 text-xl font-black text-blue-700">{plan.price.label}</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-600">
              {plan.inclusions.map((inclusion) => (
                <li key={inclusion}>- {inclusion}</li>
              ))}
            </ul>
            <Link
              to={plan.ctaHref}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
            >
              See Full Inclusions
            </Link>
            <p className="mt-4 text-xs font-medium text-slate-500">Available for a limited time only</p>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
