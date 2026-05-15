import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

const sections = [
  {
    title: "Service request process",
    body: "Service requests may begin through the public website, member portal, or a reviewed enquiry pathway. A request is not confirmed until the scope, required information, timing, and next step are reviewed.",
  },
  {
    title: "Scope confirmation",
    body: "Remote Business Partner may confirm the service scope, assumptions, exclusions, dependencies, and expected deliverables before work starts. Some requests may be referred, declined, or moved to a different pathway.",
  },
  {
    title: "Customer obligations",
    body: "Customers are responsible for providing accurate business information, required documents, timely responses, access approvals, and review feedback needed to progress a request.",
  },
  {
    title: "Turnaround expectations",
    body: "Any stated timing is an estimate unless separately confirmed. Turnaround can depend on scope, customer input, third-party response times, and operational capacity.",
  },
  {
    title: "Review and approval flow",
    body: "Draft outputs, recommendations, requests, and marketplace-related material may require customer review or RBP review before further action. Marketplace listings and enquiries remain reviewed and gated.",
  },
  {
    title: "What is not included",
    body: "Services do not guarantee business outcomes and do not replace regulated legal, financial, tax, accounting, insurance, HR, or other professional advice unless a separately qualified provider is formally engaged.",
  },
];

export function ServicesPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">Legal</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Services Policy</h1>
            <p className="mt-3 text-sm font-semibold text-slate-500">Last updated: May 2026</p>
            <p className="mt-4 max-w-3xl text-slate-600">This launch-draft content is provided for QA readiness and remains subject to final legal review.</p>

            <div className="mt-8 space-y-6">
              {sections.map((section) => (
                <section key={section.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{section.body}</p>
                </section>
              ))}
            </div>

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
