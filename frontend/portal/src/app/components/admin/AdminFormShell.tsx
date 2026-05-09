import type { ReactNode } from "react";

interface AdminFormShellProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AdminFormShell({
  title,
  description,
  children,
  footer,
}: AdminFormShellProps) {
  return (
    <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-extrabold text-slate-900">{title}</h2>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      </div>
      <div className="p-5 space-y-4">{children}</div>
      {footer && <div className="px-5 py-4 border-t border-slate-100 bg-slate-50">{footer}</div>}
    </section>
  );
}
