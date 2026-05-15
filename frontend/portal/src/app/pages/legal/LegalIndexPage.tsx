import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

const legalLinks = [
  { href: "/legal/privacy-policy", label: "Privacy Policy", summary: "How account, business, service, marketplace, application-interest, payment, and notification data is handled." },
  { href: "/legal/terms-of-use", label: "Terms of Use", summary: "Website and portal use, account responsibilities, launch boundaries, and acceptable use." },
  { href: "/legal/services-policy", label: "Services Policy", summary: "How service requests are scoped, reviewed, progressed, and supported." },
  { href: "/legal/terms-of-engagement", label: "Terms of Engagement", summary: "Engagement boundaries, communication expectations, support limits, and third-party provider boundaries." },
  { href: "/legal/payment-policy", label: "Payment Policy", summary: "QA Stripe test-mode boundaries, billing cycles, failed payments, refunds, cancellations, and payment processor handling." },
];

export function LegalIndexPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">Legal</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Legal and Policy Pages</h1>
            <p className="mt-3 text-sm font-semibold text-slate-500">Last updated: May 2026</p>
            <p className="mt-4 max-w-3xl text-slate-600">
              This launch-draft legal index is provided for QA readiness and remains subject to final legal review.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {legalLinks.map((item) => (
                <Link key={item.href} to={item.href} className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-blue-200 hover:bg-blue-50">
                  <h2 className="text-lg font-bold text-slate-900">{item.label}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.summary}</p>
                </Link>
              ))}
            </div>

            <section className="mt-8 rounded-xl border border-amber-100 bg-amber-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">Launch-draft note</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                These pages support QA review. They do not approve live payments, customer Application provisioning, or automatic marketplace publishing.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
