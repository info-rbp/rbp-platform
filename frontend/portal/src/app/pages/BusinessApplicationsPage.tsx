import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Layers3,
  LoaderCircle,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
} from "lucide-react";

import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { applicationRolloutCatalog } from "../data/applicationRollout";
import { useRuntimeConfig } from "../hooks/useRuntimeConfig";
import {
  applicationsApi,
  type RbpApplication,
} from "../services/api/applicationsApi";

type ApplicationViewModel = {
  key: string;
  name: string;
  category: string;
  status: "Coming soon" | "Register interest";
  shortDescription: string;
  publicDescription: string;
  portalDescription: string;
  highlights: string[];
};

const applicationOrder = new Map(
  applicationRolloutCatalog.map((application, index) => [application.key, index])
);

function normaliseStatus(application: Partial<RbpApplication>) {
  if (application.interest_enabled === false) {
    return "Coming soon" as const;
  }

  return application.status === "Coming Soon"
    ? ("Coming soon" as const)
    : ("Register interest" as const);
}

function mergeApplications(apiApplications: RbpApplication[] = []): ApplicationViewModel[] {
  const merged = new Map(
    applicationRolloutCatalog.map((application) => [application.key, application])
  );

  apiApplications.forEach((application) => {
    const existing = merged.get(application.application_key);
    const status = normaliseStatus(application);

    merged.set(application.application_key, {
      key: application.application_key,
      name: application.application_name,
      category: application.category || existing?.category || "Applications",
      status,
      shortDescription:
        application.short_description || existing?.shortDescription || "Business application rollout planning is in progress.",
      publicDescription:
        application.public_description ||
        existing?.publicDescription ||
        existing?.shortDescription ||
        "Business application rollout planning is in progress.",
      portalDescription:
        application.portal_description ||
        existing?.portalDescription ||
        existing?.publicDescription ||
        existing?.shortDescription ||
        "Business application rollout planning is in progress.",
      highlights: existing?.highlights || [existing?.category || "Applications"],
    });
  });

  return Array.from(merged.values()).sort((left, right) => {
    const leftOrder = applicationOrder.get(left.key) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = applicationOrder.get(right.key) ?? Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder || left.name.localeCompare(right.name);
  });
}

export function BusinessApplicationsPage() {
  const { config } = useRuntimeConfig();
  const [applications, setApplications] = useState<ApplicationViewModel[]>(
    applicationRolloutCatalog
  );
  const [selectedKey, setSelectedKey] = useState(applicationRolloutCatalog[0]?.key);
  const [loading, setLoading] = useState(true);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [form, setForm] = useState({
    email: "",
    phone: "",
    interest_notes: "",
  });

  const interestEnabled = config.features.application_interest;

  useEffect(() => {
    let alive = true;

    applicationsApi.listPublicApplications().then((response) => {
      if (!alive) return;

      if (response.ok && response.data && response.data.length > 0) {
        setApplications(mergeApplications(response.data));
      } else {
        setApplications(mergeApplications());
      }

      setLoading(false);
    });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedKey && applications.length > 0) {
      setSelectedKey(applications[0].key);
    }
  }, [applications, selectedKey]);

  const selectedApplication = useMemo(
    () => applications.find((application) => application.key === selectedKey) ?? applications[0],
    [applications, selectedKey]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedApplication || !interestEnabled) {
      return;
    }

    setSubmitState("submitting");
    setSubmitMessage("");

    const response = await applicationsApi.registerApplicationInterest({
      application_key: selectedApplication.key,
      email: form.email,
      phone: form.phone || undefined,
      interest_notes: form.interest_notes || undefined,
      source_channel: "Public Website",
    });

    if (response.ok) {
      setSubmitState("submitted");
      setSubmitMessage(
        `Interest registered for ${selectedApplication.name}. We will use this to plan rollout priorities.`
      );
      setForm((current) => ({
        ...current,
        phone: "",
        interest_notes: "",
      }));
      return;
    }

    setSubmitState("error");
    setSubmitMessage(response.message || "We could not register interest right now.");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-blue-700">
                <Layers3 className="h-3.5 w-3.5" /> Applications rollout
              </div>
              <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Business Applications are coming in the next rollout
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                Remote Business Partner will support selected Frappe-powered business applications in a future rollout. For now, you can register interest and we will notify you when access planning begins.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 font-semibold">
                  <Clock3 className="h-4 w-4 text-amber-600" />
                  Provisioning is not available yet
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 font-semibold">
                  <Sparkles className="h-4 w-4 text-blue-700" />
                  Interest is available now
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#application-catalogue"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
                >
                  View rollout applications <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  to="/membership"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-100"
                >
                  Explore membership
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-7 text-white shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-200">
                Rollout focus
              </p>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
                <p>
                  Customers must be able to browse applications, register interest, and understand that access planning is still ahead of provisioning.
                </p>
                <p>
                  Admin management remains the operational source of truth while customer-facing provisioning stays disabled.
                </p>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-200">
                {[
                  "ERPNext",
                  "CRM",
                  "HRMS",
                  "Helpdesk",
                  "Drive",
                  "LMS",
                  "Payments",
                  "Builder",
                  "Insights",
                ].map((name) => (
                  <li key={name} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="application-catalogue" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">
                    Next rollout application catalogue
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    These applications are visible now for rollout planning and interest capture only.
                  </p>
                </div>
                {loading ? (
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <LoaderCircle className="h-4 w-4 animate-spin" /> Loading
                  </span>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {applications.map((application) => {
                  const isSelected = selectedApplication?.key === application.key;

                  return (
                    <button
                      key={application.key}
                      type="button"
                      onClick={() => setSelectedKey(application.key)}
                      className={[
                        "rounded-3xl border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
                        isSelected
                          ? "border-blue-300 ring-2 ring-blue-100"
                          : "border-slate-200",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                            {application.category}
                          </p>
                          <h3 className="mt-2 text-lg font-black text-slate-950">
                            {application.name}
                          </h3>
                        </div>
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
                            application.status === "Register interest"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-amber-50 text-amber-700",
                          ].join(" ")}
                        >
                          {application.status}
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-slate-600">
                        {application.shortDescription}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {application.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28 lg:h-fit">
              {selectedApplication ? (
                <>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-700">
                    Register interest
                  </p>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                    {selectedApplication.name}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {selectedApplication.publicDescription}
                  </p>
                  <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
                    This rollout is interest-only. No application will be launched or provisioned from this page.
                  </div>

                  <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Mail className="h-4 w-4 text-slate-400" /> Email
                      </span>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                        placeholder="you@business.com.au"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Phone className="h-4 w-4 text-slate-400" /> Phone
                      </span>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            phone: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                        placeholder="Optional"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <MessageSquare className="h-4 w-4 text-slate-400" /> Notes
                      </span>
                      <textarea
                        rows={4}
                        value={form.interest_notes}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            interest_notes: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                        placeholder="Tell us how you expect to use this application."
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={!interestEnabled || submitState === "submitting"}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitState === "submitting" ? (
                        <>
                          <LoaderCircle className="h-4 w-4 animate-spin" /> Register interest
                        </>
                      ) : (
                        <>
                          Register interest <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {submitMessage ? (
                    <div
                      className={[
                        "mt-4 rounded-2xl px-4 py-3 text-sm font-semibold",
                        submitState === "submitted"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700",
                      ].join(" ")}
                    >
                      {submitMessage}
                    </div>
                  ) : null}
                </>
              ) : null}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
