import type { ElementType } from "react";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  icon: ElementType;
  tone?: "blue" | "emerald" | "amber" | "rose" | "slate";
}

const toneClasses = {
  blue: "bg-blue-50 text-blue-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  slate: "bg-slate-100 text-slate-600",
};

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  tone = "blue",
}: AdminStatCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${toneClasses[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
        {label}
      </div>
    </div>
  );
}
