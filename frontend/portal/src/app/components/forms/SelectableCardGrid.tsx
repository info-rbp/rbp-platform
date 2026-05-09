import type { ReactNode } from "react";

export interface SelectableCardOption {
  id: string;
  title: string;
  description?: string;
  meta?: ReactNode;
}

export interface SelectableCardGridProps {
  options: SelectableCardOption[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export function SelectableCardGrid({ options, selectedId, onSelect }: SelectableCardGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {options.map((option) => {
        const selected = option.id === selectedId;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect?.(option.id)}
            className={[
              "rounded-2xl border p-5 text-left transition",
              selected ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300",
            ].join(" ")}
          >
            <span className="block text-base font-semibold text-slate-950">{option.title}</span>
            {option.description ? (
              <span className="mt-2 block text-sm leading-6 text-slate-600">{option.description}</span>
            ) : null}
            {option.meta ? <span className="mt-3 block">{option.meta}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
