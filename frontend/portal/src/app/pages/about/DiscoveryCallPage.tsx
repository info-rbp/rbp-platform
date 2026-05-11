import { useState } from "react";
import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  Clock,
  Compass,
  FileText,
  HelpCircle,
  MessageSquare,
  PhoneCall,
  Route,
  Users,
} from "lucide-react";

const callPurposes = [
  {
    icon: Compass,
    title: "Understand your business",
    desc: "Share where the business is now, what is changing, and what kind of support you are exploring.",
  },
  {
    icon: Route,
    title: "Identify the right pathway",
    desc: "We help determine whether services, membership, documents, applications, marketplace support, or another pathway fits best.",
  },
  {
    icon: FileText,
    title: "Clarify next steps",
    desc: "The goal is to leave the conversation with a clearer direction, not another vague meeting about having more meetings.",
  },
];

const bookingReasons = [
  "I want to understand RBP membership",
  "I need help choosing the right service",
  "I want business advisory support",
  "I need document or process support",
  "I want to discuss partnership opportunities",
  "I am exploring marketplace or application options",
  "Other",
];

const businessStages = [
  "Idea or early-stage business",
  "Established small business",
  "Growing business",
  "Business going through change",
  "Business preparing for sale, funding, or expansion",
  "Other",
];

const timeZones = [
  "Australian Eastern Time",
  "Australian Central Time",
  "Australian Western Time",
  "New Zealand Time",
  "United Kingdom Time",
  "United States / Canada Time",
  "Other",
];

export function DiscoveryCallPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    website: "",
    businessStage: "",
    reason: "",
    preferredTime: "",
    timeZone: "",
    message: "",
    consent: false,
  });

  const updateForm = (
    key: keyof typeof form,
    value: string | boolean
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
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
                <CalendarDays className="h-3.5 w-3.5" />
                Discovery Call
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Book a discovery call with Remote Business Partner.
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Tell us where your business is now, what you are trying to solve, and we will help identify the right
                next step across services, membership, documents, applications, marketplace support, or partnerships.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#booking-form"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
                >
                  Request a Call <ArrowRight className="h-4 w-4" />
                </a>

                <Link
                  to="/about/our-platform"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-slate-900 transition hover:bg-slate-100"
                >
                  Explore Our Platform
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What the call is for */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <p className="mb-4 text-xs font-extrabold uppercase tracking-widest text-blue-700">
                What The Call Is For
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                A practical conversation about the best next move for your business.
              </h2>
              <p className="mt-5 leading-relaxed text-slate-600">
                The discovery call is designed to understand your situation, clarify your priorities, and point you
                toward a useful pathway. Revolutionary stuff: a call with an actual purpose.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {callPurposes.map((item) => {
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

        {/* Booking form */}
        <section id="booking-form" className="bg-slate-50 py-16 lg:py-20 scroll-mt-28">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <aside className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Who should book?</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Business owners, founders, operators, and managers exploring advisory, services, membership,
                  document support, marketplace pathways, applications, or partnerships.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
                <h2 className="font-bold text-slate-900">What happens next?</h2>
                <div className="mt-4 space-y-4">
                  {[
                    "We review the details you submit.",
                    "We identify the most relevant RBP pathway.",
                    "We follow up with a booking option or recommended next step.",
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
                <h2 className="font-bold text-slate-900">Not ready to book?</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Send a general enquiry instead and we will route your message.
                </p>
                <Link
                  to="/contact"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800"
                >
                  Contact Us <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>

            <div className="lg:col-span-2">
              {submitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm sm:p-10">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h2 className="mt-5 text-2xl font-black text-slate-900">Discovery call request received</h2>
                  <p className="mt-3 text-slate-600">
                    Thanks, <strong>{form.fullName}</strong>. We will review your details and follow up with the next
                    available booking option or recommended pathway.
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
                      <MessageSquare className="h-3.5 w-3.5" />
                      Booking Request
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Request a discovery call</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Share a few details so we can understand the context and recommend the right next step.
                    </p>
                  </div>

                  <div className="mt-8 grid gap-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                        Full name <span className="text-red-500">*</span>
                        <input
                          required
                          type="text"
                          value={form.fullName}
                          onChange={(event) => updateForm("fullName", event.target.value)}
                          className="rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="Your name"
                        />
                      </label>

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
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
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

                      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                        Business name
                        <input
                          type="text"
                          value={form.businessName}
                          onChange={(event) => updateForm("businessName", event.target.value)}
                          className="rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="Your business"
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
                        Business stage <span className="text-red-500">*</span>
                        <select
                          required
                          value={form.businessStage}
                          onChange={(event) => updateForm("businessStage", event.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Select business stage...</option>
                          {businessStages.map((stage) => (
                            <option key={stage} value={stage}>
                              {stage}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                        Main reason for call <span className="text-red-500">*</span>
                        <select
                          required
                          value={form.reason}
                          onChange={(event) => updateForm("reason", event.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Select a reason...</option>
                          {bookingReasons.map((reason) => (
                            <option key={reason} value={reason}>
                              {reason}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                        Preferred date/time
                        <input
                          type="text"
                          value={form.preferredTime}
                          onChange={(event) => updateForm("preferredTime", event.target.value)}
                          className="rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="Example: Tuesday morning"
                        />
                      </label>

                      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                        Time zone
                        <select
                          value={form.timeZone}
                          onChange={(event) => updateForm("timeZone", event.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Select time zone...</option>
                          {timeZones.map((timeZone) => (
                            <option key={timeZone} value={timeZone}>
                              {timeZone}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                      Message / context <span className="text-red-500">*</span>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(event) => updateForm("message", event.target.value)}
                        className="resize-none rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        placeholder="Tell us what you would like to discuss..."
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
                        I agree to be contacted by Remote Business Partner about this discovery call request.
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-700 px-8 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-800"
                    >
                      Request Discovery Call <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FAQ / reassurance */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <HelpCircle className="mb-4 h-8 w-8 text-blue-700" />
                <h3 className="font-bold text-slate-900">Is this a sales call?</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  It is a discovery conversation. The aim is to understand fit and recommend the right next step.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <Clock className="mb-4 h-8 w-8 text-blue-700" />
                <h3 className="font-bold text-slate-900">How long does it take?</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Discovery calls should be short, focused, and useful. The booking details can be confirmed after review.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <Users className="mb-4 h-8 w-8 text-blue-700" />
                <h3 className="font-bold text-slate-900">Who will respond?</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Your request will be reviewed and routed toward the most relevant RBP pathway or contact point.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
