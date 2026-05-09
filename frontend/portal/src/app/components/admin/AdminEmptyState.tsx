import type { ElementType, ReactNode } from "react";
import { Inbox } from "lucide-react";

interface AdminEmptyStateProps {
  title: string;
  description?: string;
  icon?: ElementType;
  action?: ReactNode;
}

export function AdminEmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
}: AdminEmptyStateProps) {
  return (
    <div className="border border-dashed border-slate-200 rounded-3xl p-8 text-center bg-slate-50">
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 mx-auto flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-extrabold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
