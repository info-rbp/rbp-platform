import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

const sections = [
  {
    title: "Engagement boundaries",
    body: "An engagement starts only when the relevant scope, commercial pathway, and required information are confirmed. Public enquiries, service requests, marketplace enquiries, and application-interest submissions do not automatically create an engagement.",
  },
  {
    title: "Communication expectations",
    body: "Customers should provide timely, accurate, and complete information. Remote Business Partner may communicate through the portal, email, phone, Frappe Desk-backed admin workflows, or other agreed channels.",
  },
  {
    title: "Advisory and support limitations",
    body: "Support may include general business guidance, coordination, documentation, and operational assistance. It does not guarantee outcomes and does not replace regulated legal, financial, accounting, insurance, HR, or tax advice.",
  },
  {
    title: "Changes and cancellations",
    body: "Requested changes may affect timing, scope, fees, or delivery approach. Cancellations or pauses may be handled according to the confirmed service pathway or payment terms for that request.",
  },
  {
    title: "Customer-provided information",
    body: "Work may rely on information, files, approvals, and instructions provided by the customer. Delays or inaccurate information can affect delivery and recommendations.",
  },
  {
    title: "Third-party boundaries",
    body: "Some services, offers, marketplace pathways, or application-interest items may involve third-party providers. Their terms, availability, review processes, and decisions may apply separately.",
  },
];

export function TermsOfEngagementPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">Legal</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Terms of Engagement</h1>
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
                <Link to="/legal/payment-policy" className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">Payment Policy</Link>
                <Link to="/contact" className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">Contact</Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
