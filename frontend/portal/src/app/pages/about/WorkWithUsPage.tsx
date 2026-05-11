import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import {
  ArrowRight,
  CheckCircle,
  FileText,
  Handshake,
  Lightbulb,
  Megaphone,
  Network,
  Send,
  Settings,
  Store,
  Users,
} from "lucide-react";

const partnershipTypes = [
  {
    icon: Lightbulb,
    title: "Advisory Partners",
    desc: "Specialists who can support business owners with practical advice across strategy, operations, finance, people, risk, digital, and growth.",
  },
  {
    icon: Settings,
    title: "Service Delivery Partners",
    desc: "Reliable operators and service providers who can help deliver support across defined business needs and managed service pathways.",
  },
  {
    icon: Network,
    title: "Technology & Application Partners",
    desc: "Product, software, integration, automation, and workflow partners who can strengthen the RBP platform ecosystem.",
  },
  {
    icon: Store,
    title: "Marketplace Partners",
    desc: "Businesses that want to list relevant products, services, offers, or opportunities for the RBP small business audience.",
  },
  {
    icon: Megaphone,
    title: "Referral Partners",
    desc: "Organisations and professionals who work with small businesses and want a structured way to refer clients into RBP pathways.",
  },
  {
    icon: FileText,
    title: "Content & Resource Partners",
    desc: "Partners who can contribute useful guides, tools, templates, education, or resources for small business users.",
  },
];

const partnerQualities = [
  "Practical specialists who understand small business realities",
  "Reliable partners who communicate clearly and follow through",
  "Commercially useful service providers with defined outcomes",
  "Technology and application providers that solve real workflow problems",
  "Partners who can support the RBP ecosystem without turning everything into corporate theatre",
];

const benefits = [
  "Access a growing small business audience",
  "Participate in structured service and referral pathways",
  "Support businesses through advisory, delivery, marketplace, or resource models",
  "Contribute to a connected business support ecosystem",
  "Create future opportunities for platform, marketplace, and membership alignment",
];

const partnershipOptions = [
  "Advisory partnership",
  "Service delivery partnership",
  "Technology or application partnership",
  "Marketplace partnership",
  "Referral partnership",
  "Content or resource partnership",
  "Other",
];

export function WorkWithUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    organisationName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    partnershipType: "",
    servicesOffered: "",
    regionsServed: "",
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
        <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-16 text-white sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-200">
                <Handshake className="h-3.5 w-3.5" />
                Work With Us
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Partner with Remote Business Partner.
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Work with us to support small businesses through advisory, services, applications, marketplace offers,
                resources, and specialist delivery pathways.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#partner-enquiry"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
                >
                  Submit Partnership Enquiry <ArrowRight className="h-4 w-4" />
                </a>

                <Link
                  to="/about/discovery-call"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-slate-900 transition hover:bg-slate-100"
                >
                  Book Discovery Call
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership types */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <p className="mb-4 text-xs font-extrabold uppercase tracking-widest text-blue-700">
                Partnership Types
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                We are building a practical partner ecosystem around small business support.
              </h2>
              <p className="mt-5 leading-relaxed text-slate-600">
                RBP is designed to connect small businesses with the right support pathways. That includes trusted
                partners who can contribute expertise, services, technology, marketplace value, referrals, and useful
                resources.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {partnershipTypes.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why partner */}
        <section className="bg-slate-50 py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-700">
                Why Partner With RBP
              </p>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Help small businesses access better support through a clearer platform model.
              </h2>

              <div className="mt-6 space-y-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex gap-3 rounded-xl bg-slate-50 p-4">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-700" />
                    <p className="text-sm leading-relaxed text-slate-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8 shadow-sm">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-700">
                Who We Are Looking For
              </p>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Partners who can be useful, reliable, and clear.
              </h2>

              <div className="mt-6 space-y-3">
                {partnerQualities.map((quality) => (
                  <div key={quality} className="flex gap-3 rounded-xl bg-white p-4">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-700" />
                    <p className="text-sm leading-relaxed text-slate-700">{quality}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Partner enquiry form */}
        <section id="partner-enquiry" className="py-16 lg:py-24 scroll-mt-28">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <aside className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Users className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Partnership focus</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  This page is for organisations, advisors, service providers, suppliers, technology providers, and
                  collaborators. Employment interest belongs on the Work For Us page, because mixing those together is
                  how inboxes become compost heaps.
                </p>
                <Link
                  to="/about/work-for-us"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800"
                >
                  Looking for future roles? <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
                <h2 className="font-bold text-slate-900">What happens next?</h2>
                <div className="mt-4 space-y-4">
                  {[
                    "We review the partnership enquiry.",
                    "We assess fit against RBP platform pathways.",
                    "We follow up if there is a clear next step.",
                  ].map((item, index) => (
                    <div key={item} className="flex gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="font-bold text-slate-900">Prefer a conversation?</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  If you want to discuss the partnership fit first, book a discovery call.
                </p>
                <Link
                  to="/about/discovery-call"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800"
                >
                  Book Discovery Call <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>

            <div className="lg:col-span-2">
              {submitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm sm:p-10">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h2 className="mt-5 text-2xl font-black text-slate-900">Partnership enquiry received</h2>
                  <p className="mt-3 text-slate-600">
                    Thanks, <strong>{form.contactName}</strong>. We will review the partnership details for{" "}
                    <strong>{form.organisationName}</strong> and follow up if there is a clear fit.
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
                <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-blue-700">
                      <Send className="h-3.5 w-3.5" />
                      Partnership Enquiry
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Tell us about the partnership opportunity</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Share enough context for us to understand who you are, what you offer, and how the partnership may
                      support the RBP ecosystem.
                    </p>
                  </div>

                  <div className="mt-8 grid gap-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                        Organisation name <span className="text-red-500">*</span>
                        <input
                          required
                          type="text"
                          value={form.organisationName}
                          onChange={(event) => updateForm("organisationName", event.target.value)}
                          className="rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="Organisation name"
                        />
                      </label>

                      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                        Contact name <span className="text-red-500">*</span>
                        <input
                          required
                          type="text"
                          value={form.contactName}
                          onChange={(event) => updateForm("contactName", event.target.value)}
                          className="rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="Your name"
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                        Email address <span className="text-red-500">*</span>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(event) => updateForm("email", event.target.value)}
                          className="rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="you@company.com"
                        />
                      </label>

                      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                        Phone number
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(event) => updateForm("phone", event.target.value)}
                          className="rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="Optional"
                        />
                      </label>
                    </div>

                    <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                      Website
                      <input
                        type="url"
                        value={form.website}
                        onChange={(event) => updateForm("website", event.target.value)}
                        className="rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        placeholder="https://example.com"
                      />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                        Partnership type <span className="text-red-500">*</span>
                        <select
                          required
                          value={form.partnershipType}
                          onChange={(event) => updateForm("partnershipType", event.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Select partnership type...</option>
                          {partnershipOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                        Regions served
                        <input
                          type="text"
                          value={form.regionsServed}
                          onChange={(event) => updateForm("regionsServed", event.target.value)}
                          className="rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="Example: Australia, remote, global"
                        />
                      </label>
                    </div>

                    <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                      Services or products offered <span className="text-red-500">*</span>
                      <textarea
                        required
                        rows={4}
                        value={form.servicesOffered}
                        onChange={(event) => updateForm("servicesOffered", event.target.value)}
                        className="resize-none rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        placeholder="Summarise what your organisation offers..."
                      />
                    </label>

                    <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                      Message / partnership context <span className="text-red-500">*</span>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(event) => updateForm("message", event.target.value)}
                        className="resize-none rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        placeholder="Tell us how you think the partnership could work..."
                      />
                    </label>

                    <label className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      <input
                        required
                        type="checkbox"
                        checked={form.consent}
                        onChange={(event) => updateForm("consent", event.target.checked)}
                        className="mt-1"
                      />
                      <span>
                        I agree to be contacted by Remote Business Partner about this partnership enquiry.
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-700 px-8 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-800"
                    >
                      Submit Partnership Enquiry <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
