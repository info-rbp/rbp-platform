import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import {
  ArrowRight,
  Bot,
  Briefcase,
  CheckCircle,
  ClipboardList,
  FileText,
  HeartHandshake,
  Laptop,
  Lightbulb,
  Send,
  Settings,
  Users,
} from "lucide-react";

const opportunityAreas = [
  {
    icon: Briefcase,
    title: "Business Advisory",
    desc: "Support for strategy, operations, growth, commercial decision-making, and practical business improvement.",
  },
  {
    icon: ClipboardList,
    title: "Finance Advisory",
    desc: "Future support across funding, financial planning, business lending, insurance, and financial operations.",
  },
  {
    icon: Users,
    title: "HR and People Operations",
    desc: "Support for structure, people systems, workforce planning, policies, and small business people operations.",
  },
  {
    icon: Laptop,
    title: "Digital Transformation",
    desc: "Help businesses improve workflows, systems, tools, integrations, and digital ways of working.",
  },
  {
    icon: Bot,
    title: "AI and Automation",
    desc: "Practical AI adoption, automation, process improvement, and sensible technology implementation.",
  },
  {
    icon: FileText,
    title: "Documents and Process",
    desc: "Support for documentation, templates, operating procedures, process design, and DocuShare pathways.",
  },
  {
    icon: HeartHandshake,
    title: "Customer Success",
    desc: "Helping members and users navigate services, support pathways, onboarding, and platform experiences.",
  },
  {
    icon: Settings,
    title: "Operations Support",
    desc: "Supporting the operational backbone of the RBP platform, service delivery, and user support workflows.",
  },
];

const values = [
  "Practical thinking",
  "Clear communication",
  "Ownership and follow-through",
  "Small business empathy",
  "Remote working discipline",
  "Commercial judgement",
];

const workTypes = [
  "Employee",
  "Contractor",
  "Advisor",
  "Internship or future graduate opportunity",
  "General future opportunity",
];

const interestAreas = [
  "Business advisory",
  "Finance advisory",
  "HR and people operations",
  "Digital transformation",
  "AI and automation",
  "Documents and process",
  "Customer success",
  "Operations support",
  "Software or product",
  "Marketplace and partnerships",
  "Other",
];

export function WorkForUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    areaOfInterest: "",
    workType: "",
    linkedin: "",
    portfolio: "",
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
                <Briefcase className="h-3.5 w-3.5" />
                Work For Us
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Register interest in future opportunities with Remote Business Partner.
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
                We are building a remote-first business support platform and welcome expressions of interest from
                practical, commercially minded people who want to help small businesses grow.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#expression-of-interest"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
                >
                  Register Interest <ArrowRight className="h-4 w-4" />
                </a>

                <Link
                  to="/about/work-with-us"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-slate-900 transition hover:bg-slate-100"
                >
                  Partnership Enquiries
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Current status */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8 shadow-sm sm:p-10">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-700">
                Current Hiring Status
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                Future opportunities, not open job listings yet.
              </h2>
              <p className="mt-5 max-w-4xl leading-relaxed text-slate-700">
                RBP may not have active roles available today, but this page allows future team members, contractors,
                advisors, specialists, and contributors to register interest as the platform grows. A shocking concept:
                collecting interest before pretending every role is urgent.
              </p>
            </div>
          </div>
        </section>

        {/* Opportunity areas */}
        <section className="bg-slate-50 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <p className="mb-4 text-xs font-extrabold uppercase tracking-widest text-blue-700">
                Future Opportunity Areas
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                The kinds of people RBP may need as the platform grows.
              </h2>
              <p className="mt-5 leading-relaxed text-slate-600">
                Future roles may span advisory, operations, documents, digital systems, customer success, product,
                partnerships, and specialist support. The common thread is practical value for small businesses.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {opportunityAreas.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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

        {/* What we value */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="mb-4 text-xs font-extrabold uppercase tracking-widest text-blue-700">
                What We Value
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Practical people who can think clearly and get useful work done.
              </h2>
              <p className="mt-5 leading-relaxed text-slate-600">
                RBP is being built around usefulness, clarity, ownership, and small business realities. The ideal future
                contributor is someone who can communicate clearly, work remotely, and help turn messy business problems
                into practical next steps.
              </p>
            </div>

            <div className="grid gap-3">
              {values.map((value) => (
                <div key={value} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-700" />
                  <p className="text-sm font-semibold text-slate-700">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Expression of interest form */}
        <section id="expression-of-interest" className="bg-slate-50 py-16 lg:py-24 scroll-mt-28">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <aside className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Expression of interest</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  This is not a formal job application. It is a way to register interest in future employment,
                  contractor, advisory, internship, or specialist opportunities.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
                <h2 className="font-bold text-slate-900">What happens next?</h2>
                <div className="mt-4 space-y-4">
                  {[
                    "We capture your expression of interest.",
                    "Your details can be reviewed against future opportunity areas.",
                    "If there is a fit later, RBP can follow up with next steps.",
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
                <h2 className="font-bold text-slate-900">Looking to partner instead?</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Organisations, suppliers, advisors, and marketplace collaborators should use the Work With Us page.
                </p>
                <Link
                  to="/about/work-with-us"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800"
                >
                  Go to Work With Us <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>

            <div className="lg:col-span-2">
              {submitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm sm:p-10">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h2 className="mt-5 text-2xl font-black text-slate-900">
                    Expression of interest received
                  </h2>
                  <p className="mt-3 text-slate-600">
                    Thanks, <strong>{form.fullName}</strong>. Your interest in{" "}
                    <strong>{form.areaOfInterest || "future opportunities"}</strong> has been captured for future review.
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
                      Future Opportunities
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">
                      Register your interest
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Share your background, interest area, and preferred type of future opportunity.
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
                        Location / time zone
                        <input
                          type="text"
                          value={form.location}
                          onChange={(event) => updateForm("location", event.target.value)}
                          className="rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="Example: Sydney, AEST"
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                        Area of interest <span className="text-red-500">*</span>
                        <select
                          required
                          value={form.areaOfInterest}
                          onChange={(event) => updateForm("areaOfInterest", event.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Select an area...</option>
                          {interestAreas.map((area) => (
                            <option key={area} value={area}>
                              {area}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                        Preferred work type <span className="text-red-500">*</span>
                        <select
                          required
                          value={form.workType}
                          onChange={(event) => updateForm("workType", event.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Select work type...</option>
                          {workTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                        LinkedIn URL
                        <input
                          type="url"
                          value={form.linkedin}
                          onChange={(event) => updateForm("linkedin", event.target.value)}
                          className="rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="https://linkedin.com/in/..."
                        />
                      </label>

                      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                        Portfolio or website
                        <input
                          type="url"
                          value={form.portfolio}
                          onChange={(event) => updateForm("portfolio", event.target.value)}
                          className="rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="https://example.com"
                        />
                      </label>
                    </div>

                    <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                      Message <span className="text-red-500">*</span>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(event) => updateForm("message", event.target.value)}
                        className="resize-none rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        placeholder="Tell us about your background and the kind of future opportunity that interests you..."
                      />
                    </label>

                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                      <p className="text-sm font-bold text-slate-700">CV upload</p>
                      <p className="mt-1 text-sm text-slate-500">
                        CV upload can be added in a later backend/file-handling phase.
                      </p>
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
                        I agree to be contacted by Remote Business Partner about future opportunities.
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-700 px-8 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-800"
                    >
                      Register Interest <ArrowRight className="h-4 w-4" />
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
