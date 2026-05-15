import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

const sections = [
  {
    title: "Information we collect",
    body: "We may collect account and profile details, business details, service request information, marketplace enquiry or listing interest information, application-interest submissions, support messages, and website usage information needed to operate the platform.",
  },
  {
    title: "How we use information",
    body: "We use information to respond to enquiries, manage member and service pathways, support account and business profile setup, record application interest, review marketplace requests, send service and account notifications, and improve the website and portal experience.",
  },
  {
    title: "Payments and processors",
    body: "Payment activity may be handled by a payment processor such as Stripe. Raw card details are handled by the payment processor and are not intended to be stored by Remote Business Partner in the portal.",
  },
  {
    title: "Email notifications",
    body: "We may send account, service, billing, application-interest, marketplace, support, or operational notifications. QA email delivery must remain sandboxed to approved recipients until final production configuration is authorised.",
  },
  {
    title: "Third-party systems and providers",
    body: "We may use trusted providers for hosting, payments, communications, analytics, support, document handling, and operational administration. These providers should only receive information needed for their role.",
  },
  {
    title: "Storage and security",
    body: "We use reasonable administrative and technical controls to protect information. No online system is risk-free, so access should be limited to authorised users and sensitive credentials must never be shared through public forms.",
  },
  {
    title: "Contact and support",
    body: "Use the contact page or support pathway to ask about privacy, account information, data correction, or a service request record.",
  },
];

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">Legal</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Privacy Policy</h1>
            <p className="mt-3 text-sm font-semibold text-slate-500">Last updated: May 2026</p>
            <p className="mt-4 max-w-3xl text-slate-600">
              This launch-draft content is provided for QA readiness and remains subject to final legal review.
            </p>

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
