import type { SelectHTMLAttributes } from "react";
import { FormError } from "./FormError";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  helpText?: string;
  placeholder?: string;
}

export function SelectField({
  label,
  options,
  error,
  helpText,
  placeholder = "Select an option",
  id,
  className = "",
  ...props
}: SelectFieldProps) {
  const fieldId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="block" htmlFor={fieldId}>
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <select
        id={fieldId}
        className={`mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helpText ? <p className="mt-1 text-xs text-slate-500">{helpText}</p> : null}
      <FormError message={error} />
    </label>
  );
}
