export interface ReviewStatusBadgeProps {
  state: "pending" | "approved" | "rejected" | "needs-info" | "in-review";
}

export function ReviewStatusBadge({ state }: ReviewStatusBadgeProps) {
  const labelByState = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    "needs-info": "Needs info",
    "in-review": "In review",
  };

  return (
    <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
      {labelByState[state]}
    </span>
  );
}
