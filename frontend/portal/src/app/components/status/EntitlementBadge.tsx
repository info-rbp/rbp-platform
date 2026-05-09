export interface EntitlementBadgeProps {
  state: "available" | "included" | "locked" | "coming-soon";
}

export function EntitlementBadge({ state }: EntitlementBadgeProps) {
  const labelByState = {
    available: "Available",
    included: "Included",
    locked: "Locked",
    "coming-soon": "Coming soon",
  };

  return (
    <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
      {labelByState[state]}
    </span>
  );
}
