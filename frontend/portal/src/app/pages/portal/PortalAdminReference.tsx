import { Shield, Info } from "lucide-react";

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
    <div className="bg-slate-50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start mb-6">
      <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center flex-shrink-0">
        <Shield className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Admin Control Map
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap ${
              status === "Live"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : status === "Planned"
                ? "bg-amber-50 text-amber-700 border border-amber-100"
                : "bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            {status}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-3 leading-relaxed max-w-2xl">
          This panel visually demonstrates how the member portal routes and content map to the underlying Admin Portal areas.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Portal Route</span>
            <code className="text-[11px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 w-fit">
              {portalRoute}
            </code>
          </div>

          {futureRoute && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Future Route</span>
              <code className="text-[11px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 w-fit">
                {futureRoute}
              </code>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Admin Controllers</span>
            <div className="flex flex-wrap gap-1.5">
              {controllers.map((ctrl, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-lg flex items-center gap-1"
                >
                  <Shield className="w-3 h-3 text-slate-400" />
                  {ctrl}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
