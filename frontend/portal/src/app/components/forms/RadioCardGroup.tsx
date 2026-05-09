export interface RadioCardOption {
  label: string;
  value: string;
  description?: string;
}

export interface RadioCardGroupProps {
  name: string;
  label: string;
  options: RadioCardOption[];
  value?: string;
  onChange?: (value: string) => void;
}

export function RadioCardGroup({ name, label, options, value, onChange }: RadioCardGroupProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-slate-800">{label}</legend>
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => {
          const checked = option.value === value;

          return (
            <label
              key={option.value}
              className={[
                "cursor-pointer rounded-2xl border p-4",
                checked ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white",
              ].join(" ")}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange?.(option.value)}
                className="sr-only"
              />
              <span className="block font-semibold text-slate-900">{option.label}</span>
              {option.description ? (
                <span className="mt-1 block text-sm text-slate-600">{option.description}</span>
              ) : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
