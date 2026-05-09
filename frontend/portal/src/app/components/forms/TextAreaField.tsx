import type { TextareaHTMLAttributes } from "react";
import { FormError } from "./FormError";

export interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helpText?: string;
}

export function TextAreaField({
  label,
  error,
  helpText,
  id,
  className = "",
  ...props
}: TextAreaFieldProps) {
  const fieldId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="block" htmlFor={fieldId}>
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <textarea
        id={fieldId}
        className={`mt-2 min-h-32 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 ${className}`}
        {...props}
      />
      {helpText ? <p className="mt-1 text-xs text-slate-500">{helpText}</p> : null}
      <FormError message={error} />
    </label>
  );
}
