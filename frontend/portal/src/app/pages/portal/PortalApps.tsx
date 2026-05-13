import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Layers3,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

import { PortalAdminReference } from "./PortalAdminReference";
import { applicationRolloutCatalog } from "../../data/applicationRollout";
import { useRuntimeConfig } from "../../hooks/useRuntimeConfig";
import {
  applicationsApi,
  type RbpApplication,
} from "../../services/api/applicationsApi";

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
        application.short_description || existing?.shortDescription || "Application rollout planning is underway.",
      publicDescription:
        application.public_description ||
        existing?.publicDescription ||
        existing?.shortDescription ||
        "Application rollout planning is underway.",
      portalDescription:
        application.portal_description ||
        existing?.portalDescription ||
        existing?.publicDescription ||
        existing?.shortDescription ||
        "Application rollout planning is underway.",
      highlights: existing?.highlights || [existing?.category || "Applications"],
    });
  });

  return Array.from(merged.values()).sort((left, right) => {
    const leftOrder = applicationOrder.get(left.key) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = applicationOrder.get(right.key) ?? Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder || left.name.localeCompare(right.name);
  });
}

export function PortalApps() {
  const { config } = useRuntimeConfig();
  const [applications, setApplications] = useState<ApplicationViewModel[]>(
    applicationRolloutCatalog
  );
  const [selectedKey, setSelectedKey] = useState(applicationRolloutCatalog[0]?.key);
  const [loading, setLoading] = useState(true);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const interestEnabled = config.features.application_interest;

  useEffect(() => {
    let alive = true;

    applicationsApi.listPortalApplications().then((response) => {
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

  async function handleRegisterInterest(applicationKey?: string) {
    if (!applicationKey || !interestEnabled) {
      return;
    }

    setSubmitState("submitting");
    setSubmitMessage("");

    const response = await applicationsApi.registerApplicationInterest({
      application_key: applicationKey,
      source_channel: "Member Portal",
    });

    if (response.ok) {
      const applicationName =
        applications.find((application) => application.key === applicationKey)?.name ||
        "this application";
      setSubmitState("submitted");
      setSubmitMessage(
        `Interest registered for ${applicationName}. We will use this to help prioritise rollout planning.`
      );
      return;
    }

    setSubmitState("error");
    setSubmitMessage(response.message || "We could not register interest right now.");
  }

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <PortalAdminReference
        portalRoute="/portal/apps"
        controlledBy={["Admin Applications"]}
        status="Live"
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-blue-700">
              <Layers3 className="h-3.5 w-3.5" /> Applications rollout
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Applications are part of the next rollout
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Your membership will support access to selected business applications when this rollout is enabled. Register interest now so we can prioritise the applications most relevant to your business.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            No provisioning action is available yet.
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 font-semibold">
            <Clock3 className="h-4 w-4 text-amber-600" />
            Provisioning remains disabled
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 font-semibold">
            <Sparkles className="h-4 w-4 text-blue-700" />
            Interest registration stays open
          </div>
          {loading ? (
            <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-500">
              <LoaderCircle className="h-4 w-4 animate-spin" /> Loading catalogue
            </div>
          ) : null}
        </div>
      </section>

      {!interestEnabled ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          Application interest capture is disabled in this environment.
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-28">
          {selectedApplication ? (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-700">
                Member interest
              </p>
              <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                {selectedApplication.name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {selectedApplication.portalDescription}
              </p>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="text-sm font-bold text-slate-900">Rollout focus areas</h4>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {selectedApplication.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleRegisterInterest(selectedApplication.key)}
                disabled={!interestEnabled || submitState === "submitting"}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
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
      </section>
    </div>
  );
}
