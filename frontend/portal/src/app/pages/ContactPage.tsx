import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Users,
} from "lucide-react";

const enquiryTypes = [
  "General enquiry",
  "Membership enquiry",
  "Services enquiry",
  "Document Nucleus / DocuShare enquiry",
  "Marketplace enquiry",
  "Applications enquiry",
  "Operations enquiry",
  "Partnership enquiry",
  "Employment / future opportunities",
  "Support request",
  "Billing enquiry",
];

const reasonLabels: Record<string, string> = {
  "application-setup": "Applications enquiry",
  "managed-services": "Services enquiry",
  "list-with-us": "Marketplace enquiry",
  "marketplace-product": "Marketplace enquiry",
  "offers-partnership": "Partnership enquiry",
  "offer-enquiry": "Partnership enquiry",
  "resource-request": "General enquiry",
  support: "Support request",
  billing: "Billing enquiry",
  "operations-advisory": "Services enquiry",
  "human-resource-advisory": "Services enquiry",
  "accounting-finance": "Operations enquiry",
  "sales-marketing": "Services enquiry",
  "management-consulting": "Services enquiry",
  "change-management": "Services enquiry",
  "ai-advisory": "Services enquiry",
  "research-development": "Services enquiry",
  "information-technology": "Applications enquiry",
  "public-relations": "Services enquiry",
  "customised-solutions": "Services enquiry",
  "document-management": "Document Nucleus / DocuShare enquiry",
  "business-sale-support": "Services enquiry",
  franchise: "Services enquiry",
  lms: "Applications enquiry",
  "custom-solutions": "Services enquiry",
  integrations: "Applications enquiry",
  "fleet-management": "Applications enquiry",
  "business-watchlist": "Applications enquiry",
};

const reasonTitles: Record<string, string> = {
  "application-setup": "Application Setup",
  "managed-services": "Managed Services",
  "list-with-us": "List With Us",
  "marketplace-product": "Marketplace Product",
  "offers-partnership": "Partnership",
  "offer-enquiry": "Offer Enquiry",
  "resource-request": "Resource Request",
  support: "Support",
  billing: "Billing",
  "operations-advisory": "Operations Advisory",
  "human-resource-advisory": "Human Resource Advisory",
  "accounting-finance": "Accounting & Finance",
  "sales-marketing": "Sales & Marketing",
  "management-consulting": "Management Consulting",
  "change-management": "Change Management",
  "ai-advisory": "AI Advisory",
  "research-development": "Research & Development",
  "information-technology": "Information Technology",
  "public-relations": "Public Relations",
  "customised-solutions": "Customised Solutions",
  "document-management": "Document Management",
  "business-sale-support": "Business Sale Support",
  franchise: "Franchise",
  lms: "LMS",
  "custom-solutions": "Custom Solutions",
  integrations: "Integrations",
  "fleet-management": "Fleet Management",
  "business-watchlist": "Business Watchlist",
};

const quickActions = [
  {
    icon: MessageCircle,
    title: "Book a Discovery Call",
    desc: "Start with a focused conversation about your business and the right RBP pathway.",
    href: "/about/discovery-call",
  },
  {
    icon: Users,
    title: "Partner With Us",
    desc: "For advisors, suppliers, service providers, marketplace partners, and collaborators.",
    href: "/about/work-with-us",
  },
  {
    icon: Briefcase,
    title: "Future Opportunities",
    desc: "Register interest in future employment, contractor, advisory, or specialist opportunities.",
    href: "/about/work-for-us",
  },
];

const nextSteps = [
  "We review your enquiry and the context you provide.",
  "We route it to the most relevant RBP pathway or contact point.",
  "We respond with next steps, a recommended service, membership option, support path, or specialist page.",
];

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason") ?? "";
  const selectedReasonTitle = reasonTitles[reason] ?? "";
  const selectedEnquiryType = reasonLabels[reason] ?? "";
  const isLegacyDiscoveryCall = reason === "discovery-call";

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    enquiryType: selectedEnquiryType,
    message: "",
    consent: false,
  });

  const updateForm = (key: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-200">
                <MessageCircle className="h-3.5 w-3.5" />
                Contact Remote Business Partner
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Tell us what you need and we will route your enquiry.
              </h1>

              <p className="mt-5 max-w-2xl leading-relaxed text-slate-300">
                Use the form below for general enquiries, services, membership, support, billing, marketplace,
                applications, operations, partnerships, and future opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Quick action cards */}
        <section className="border-b border-slate-200 bg-slate-50 py-10">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  to={action.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-bold text-slate-900">{action.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{action.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                    Go to page <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            {/* Form */}
            <div className="lg:col-span-2">
              {isLegacyDiscoveryCall && (
                <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <h2 className="font-bold text-slate-900">Looking to book a discovery call?</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    Discovery calls now have their own dedicated booking page.
                  </p>
                  <Link
                    to="/about/discovery-call"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800"
                  >
                    Book a Discovery Call <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}

              {submitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm sm:p-10">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle className="h-8 w-8" />
                  </div>

                  <h2 className="mt-5 text-2xl font-black text-slate-900">Enquiry received</h2>

                  <p className="mt-3 text-slate-600">
                    Thanks, <strong>{form.name}</strong>. We have received your enquiry and will route it to the most
                    relevant RBP pathway or contact point.
                  </p>

                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
                    >
                      Back to About Us <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      to="/about/our-platform"
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-emerald-50"
                    >
                      Explore Platform
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-blue-700">
                      <Send className="h-3.5 w-3.5" />
                      Send an Enquiry
                    </div>

                    <h2 className="text-2xl font-black tracking-tight text-slate-900">
                      Contact the RBP team
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Select the enquiry type that best matches your need so we can route your message properly.
                    </p>

                    {selectedReasonTitle && !isLegacyDiscoveryCall && (
                      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                        <div className="mb-1 text-xs font-bold uppercase tracking-widest text-blue-700">
                          Selected enquiry pathway
                        </div>
                        <p className="text-sm text-slate-700">
                          You followed a link for <strong>{selectedReasonTitle}</strong>. We have preselected the most
                          relevant enquiry type where possible.
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-slate-700">
                      Enquiry type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={form.enquiryType}
                      onChange={(event) => updateForm("enquiryType", event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select enquiry type...</option>
                      {enquiryTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-slate-700">
                        Full name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(event) => updateForm("name", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-slate-700">
                        Email address <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={(event) => updateForm("email", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-slate-700">
                        Company name
                      </label>
                      <input
                        type="text"
                        placeholder="Your business name"
                        value={form.company}
                        onChange={(event) => updateForm("company", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-slate-700">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        placeholder="Optional"
                        value={form.phone}
                        onChange={(event) => updateForm("phone", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-slate-700">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Tell us about your business and what you are looking for..."
                      value={form.message}
                      onChange={(event) => updateForm("message", event.target.value)}
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <label className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    <input
                      required
                      type="checkbox"
                      checked={form.consent}
                      onChange={(event) => updateForm("consent", event.target.checked)}
                      className="mt-1"
                    />
                    <span>
                      I agree to be contacted by Remote Business Partner about this enquiry.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-8 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-800"
                  >
                    Send Enquiry <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <h3 className="font-bold text-slate-900">What happens next?</h3>
                <div className="mt-4 space-y-4">
                  {nextSteps.map((step, index) => (
                    <div key={step} className="flex gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-bold text-slate-900">Contact details</h3>
                <div className="mt-4 space-y-3">
                  <a
                    href="mailto:info@remotebusinesspartner.com"
                    className="flex items-start gap-3 text-sm text-slate-600 transition hover:text-blue-700"
                  >
                    <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                    info@remotebusinesspartner.com
                  </a>

                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                    Remote-first business support
                  </div>

                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                    Response times vary by enquiry type
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-bold text-slate-900">Useful links</h3>
                <div className="mt-4 space-y-2">
                  {[
                    { label: "Book Discovery Call", href: "/about/discovery-call" },
                    { label: "Partner With Us", href: "/about/work-with-us" },
                    { label: "Work For Us", href: "/about/work-for-us" },
                    { label: "Help Center", href: "/help" },
                    { label: "Membership Hub", href: "/membership" },
                    { label: "Document Nucleus", href: "/document-nucleus/overview" },
                    { label: "Business Marketplace", href: "/marketplace" },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="flex items-center justify-between py-1 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
                    >
                      {link.label} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <HelpCircle className="mb-4 h-8 w-8 text-blue-700" />
                <h3 className="font-bold text-slate-900">Not sure where to start?</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Choose General enquiry and explain what you are trying to solve. We will help route it from there.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
