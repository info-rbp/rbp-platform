export interface PaymentSimulationPanelProps {
  title?: string;
  amountLabel?: string;
}

export function PaymentSimulationPanel({
  title = "Payment Preview",
  amountLabel = "No real payment will be processed.",
}: PaymentSimulationPanelProps) {
  return (
    <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm text-slate-700">{amountLabel}</p>
      <p className="mt-3 text-xs font-medium text-blue-700">
        This frontend preview does not process a real payment or create a live account.
      </p>
    </section>
  );
}
