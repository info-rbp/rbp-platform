import type { ElementType, ReactNode } from "react";

interface AdminPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ElementType;
  actions?: ReactNode;
}

export function AdminPageHeader({
  eyebrow = "Admin",
  title,
  description,
  icon: Icon,
  actions,
}: AdminPageHeaderProps) {
  return (
    <section className="bg-slate-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-700/20" />
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-200 bg-blue-500/10 border border-blue-400/20 rounded-full px-3 py-1 mb-4">
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {eyebrow}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </section>
  );
}
