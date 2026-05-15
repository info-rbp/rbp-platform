import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

const sections = [
  {
    title: "QA Stripe test mode",
    body: "During QA, Stripe must remain in test mode unless an authorised production configuration is separately approved. QA payment testing must use test products, test prices, test cards, and sandbox-safe webhook configuration.",
  },
  {
    title: "Production payment approach",
    body: "Production payment capture is intended to be enabled later through authorised configuration, reviewed billing terms, and approved payment processor setup. This launch-draft page does not authorise live payment capture during QA.",
  },
  {
    title: "Billing cycles",
    body: "Memberships or services may use monthly, annual, one-off, or manual billing cycles depending on the selected plan or confirmed service scope. Billing details should be confirmed before payment is requested.",
  },
  {
    title: "Failed payments",
    body: "If a payment fails, access, fulfilment, or service progress may be paused while the issue is reviewed. Customers may be asked to retry payment, update details, or contact support.",
  },
  {
    title: "Refunds and cancellations",
    body: "Refund and cancellation handling may depend on the service type, billing cycle, work already performed, third-party provider terms, and any confirmed engagement terms.",
  },
  {
    title: "Payment data",
    body: "Payment card data is handled by the payment processor and is not intended to be stored by Remote Business Partner as raw card details. Payment records may store processor references, status, amount, currency, and related account or subscription details.",
  },
];

export function PaymentPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">Legal</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Payment Policy</h1>
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
                <Link to="/legal/terms-of-engagement" className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">Terms of Engagement</Link>
                <Link to="/legal/services-policy" className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">Services Policy</Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
