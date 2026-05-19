import { ChevronDown, Shield } from "lucide-react";

export function PortalAdminReference({
  portalRoute,
  controlledBy,
  status = "Live",
  futureRoute,
}: {
  portalRoute: string;
  controlledBy: string | string[];
  status?: "Live" | "Planned" | "Placeholder";
  futureRoute?: string;
}) {
  const controllers = Array.isArray(controlledBy) ? controlledBy : [controlledBy];

  return (
    <details className="group rounded-2xl border border-blue-100 bg-slate-50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100/60">
            <Shield className="h-4 w-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-700">
                Admin Control Map
              </span>
              <span
                className={[
                  "rounded-lg border px-2 py-0.5 text-[10px] font-bold",
                  status === "Live"
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : status === "Planned"
                      ? "border-amber-100 bg-amber-50 text-amber-700"
                      : "border-slate-200 bg-slate-100 text-slate-600",
                ].join(" ")}
              >
                {status}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Collapsed by default so member content stays visually primary in QA.
            </p>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400 transition group-open:rotate-180" />
      </summary>

      <div className="border-t border-blue-100 px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Portal Route</span>
            <code className="w-fit rounded border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-[11px] text-blue-700">
              {portalRoute}
            </code>
          </div>

          {futureRoute ? (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Future Route</span>
              <code className="w-fit rounded border border-amber-100 bg-amber-50 px-1.5 py-0.5 text-[11px] text-amber-700">
                {futureRoute}
              </code>
            </div>
          ) : null}

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Admin Controllers</span>
            <div className="flex flex-wrap gap-1.5">
              {controllers.map((controller) => (
                <span
                  key={controller}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600"
                >
                  <Shield className="h-3 w-3 text-slate-400" />
                  {controller}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </details>
  );
}
