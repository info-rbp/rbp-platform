interface AdminFieldRendererProps {
  label: string;
  type?: "text" | "textarea" | "select" | "checkbox" | "readonly";
  value?: string | boolean;
  placeholder?: string;
  options?: string[];
  helpText?: string;
  readOnly?: boolean;
}

const inputClass =
  "w-full border border-slate-200 bg-white text-slate-900 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

export function AdminFieldRenderer({
  label,
  type = "text",
  value = "",
  placeholder,
  options = [],
  helpText,
  readOnly = true,
}: AdminFieldRendererProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label}
      </label>

      {type === "textarea" && (
        <textarea
          className={inputClass}
          value={String(value)}
          placeholder={placeholder}
          readOnly={readOnly}
          rows={4}
        />
      )}

      {type === "select" && (
        <select className={inputClass} value={String(value)} disabled={readOnly}>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      )}

      {type === "checkbox" && (
        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5">
          <input type="checkbox" checked={Boolean(value)} readOnly={readOnly} />
          <span className="text-sm text-slate-600">{Boolean(value) ? "Enabled" : "Disabled"}</span>
        </div>
      )}

      {type === "readonly" && (
        <div className="border border-slate-200 bg-slate-50 text-slate-600 text-sm px-3 py-2.5 rounded-xl">
          {String(value || "Not set")}
        </div>
      )}

      {type === "text" && (
        <input
          className={inputClass}
          value={String(value)}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      )}

      {helpText && <p className="text-xs text-slate-400 mt-1.5">{helpText}</p>}
    </div>
  );
}
