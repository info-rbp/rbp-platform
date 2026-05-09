import { ReviewStatusBadge } from "../status/ReviewStatusBadge";

export interface AdminReviewQueueCardProps {
  title: string;
  description: string;
  count: number;
  status?: "pending" | "approved" | "rejected" | "needs-info" | "in-review";
}

export function AdminReviewQueueCard({
  title,
  description,
  count,
  status = "pending",
}: AdminReviewQueueCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold text-slate-950">{title}</h3>
        <ReviewStatusBadge state={status} />
      </div>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <p className="mt-4 text-2xl font-bold text-slate-950">{count}</p>
    </article>
  );
}
