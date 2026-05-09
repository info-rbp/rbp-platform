export interface PlanSelectionCardProps {
  title: string;
  description: string;
  priceLabel: string;
  selected?: boolean;
  onSelect?: () => void;
}

export function PlanSelectionCard({
  title,
  description,
  priceLabel,
  selected = false,
  onSelect,
}: PlanSelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "rounded-2xl border p-5 text-left",
        selected ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white",
      ].join(" ")}
    >
      <span className="block text-lg font-bold text-slate-950">{title}</span>
      <span className="mt-2 block text-sm text-slate-600">{description}</span>
      <span className="mt-4 block text-base font-semibold text-blue-700">{priceLabel}</span>
    </button>
  );
}
