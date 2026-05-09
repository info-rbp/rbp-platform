import { StatusBadge } from "../status/StatusBadge";

export interface PortalStatusCardProps {
  title: string;
  description: string;
  status: string;
  href?: string;
}

export function PortalStatusCard({ title, description, status, href }: PortalStatusCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold text-slate-950">{title}</h3>
        <StatusBadge status={status} />
      </div>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {href ? (
        <a href={href} className="mt-4 inline-flex text-sm font-semibold text-blue-700">
          View details
        </a>
      ) : null}
    </article>
  );
}
