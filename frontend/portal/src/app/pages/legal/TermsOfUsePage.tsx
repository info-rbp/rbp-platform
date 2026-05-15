import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

const sections = [
  {
    title: "Using the website and portal",
    body: "The public website and portal provide information, service pathways, membership pathways, marketplace enquiry options, and account features. Access to some areas may require an account or reviewed request.",
  },
  {
    title: "Account responsibility",
    body: "You are responsible for keeping your account details accurate, protecting login access, and making sure information submitted through the portal is complete and current.",
  },
  {
    title: "Service requests and membership pathways",
    body: "Submitting a service request, enquiry, membership interest, or application-interest form does not guarantee acceptance, availability, timing, or outcome. Scope and next steps may need confirmation before work starts.",
  },
  {
    title: "Marketplace and Applications",
    body: "Marketplace listing and enquiry flows remain reviewed and gated. Applications are delayed/register-interest only for this launch phase and are not customer-provisioned through the website or portal.",
  },
  {
    title: "Acceptable use",
    body: "Do not misuse the website, attempt unauthorised access, submit misleading information, upload harmful material, interfere with platform operation, or use the service in a way that breaches applicable law.",
  },
  {
    title: "Limitations and changes",
    body: "Content, services, offers, membership inclusions, and platform features may change. Public information is provided for general business support and does not replace professional legal, financial, tax, insurance, HR, or regulated advice.",
  },
];

export function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">Legal</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Terms of Use</h1>
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
                <Link to="/legal/privacy-policy" className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">Privacy Policy</Link>
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
