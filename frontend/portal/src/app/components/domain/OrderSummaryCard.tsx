export interface OrderSummaryLine {
  label: string;
  value: string;
}

export interface OrderSummaryCardProps {
  title?: string;
  lines: OrderSummaryLine[];
}

export function OrderSummaryCard({ title = "Mock order summary", lines }: OrderSummaryCardProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <dl className="mt-4 space-y-3">
        {lines.map((line) => (
          <div key={line.label} className="flex justify-between gap-4 text-sm">
            <dt className="text-slate-500">{line.label}</dt>
            <dd className="font-medium text-slate-900">{line.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
