import type { Phase1FlowStateMap } from "../../config/phase1FlowStates";
import { StatusBadge } from "../status/StatusBadge";

export interface FlowStateSummaryProps {
  flow: Phase1FlowStateMap;
}

export function FlowStateSummary({ flow }: FlowStateSummaryProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          Phase 1 flow states
        </p>
        <h3 className="mt-1 text-lg font-bold text-slate-950">{flow.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{flow.notes}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {flow.requiredStates.map((item) => (
          <div
            key={item.state}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-950">{item.label}</p>
              <StatusBadge status={item.required ? "required" : "optional"} />
            </div>
            <p className="text-xs leading-5 text-slate-600">{item.objective}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
