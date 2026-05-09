interface AdminStatusBadgeProps {
  label: string;
  status?: string;
}

function getStatusClass(status?: string) {
  const key = (status ?? "").toLowerCase();

  if (key.includes("ready") || key.includes("published") || key.includes("active")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }

  if (key.includes("backend") || key.includes("pending") || key.includes("draft")) {
    return "bg-amber-50 text-amber-700 border-amber-100";
  }

  if (key.includes("legal") || key.includes("review") || key.includes("approval")) {
    return "bg-rose-50 text-rose-700 border-rose-100";
  }

  if (key.includes("future") || key.includes("placeholder")) {
    return "bg-slate-100 text-slate-600 border-slate-200";
  }

  return "bg-blue-50 text-blue-700 border-blue-100";
}

export function AdminStatusBadge({ label, status }: AdminStatusBadgeProps) {
  return (
    <span className={`inline-flex border rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusClass(status ?? label)}`}>
      {label}
    </span>
  );
}
