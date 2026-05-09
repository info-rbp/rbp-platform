import type { MockStatus } from "../../mock";

export interface StatusBadgeProps {
  status: MockStatus | string;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const displayLabel = label ?? status.replace(/-/g, " ");

  return (
    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
      {displayLabel}
    </span>
  );
}
