import type { InputHTMLAttributes, ReactNode } from "react";

export interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  description?: string;
}

export function CheckboxField({ label, description, id, ...props }: CheckboxFieldProps) {
  const fieldId = id ?? props.name ?? "checkbox-field";

  return (
    <label htmlFor={fieldId} className="flex gap-3 rounded-2xl border border-slate-200 p-4">
      <input id={fieldId} type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300" {...props} />
      <span>
        <span className="block text-sm font-semibold text-slate-900">{label}</span>
        {description ? <span className="mt-1 block text-xs text-slate-500">{description}</span> : null}
      </span>
    </label>
  );
}
