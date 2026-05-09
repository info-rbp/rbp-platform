export interface ServiceabilityCheckPanelProps {
  address?: string;
  status?: "not-checked" | "available" | "manual-review" | "not-available";
}

export function ServiceabilityCheckPanel({
  address,
  status = "not-checked",
}: ServiceabilityCheckPanelProps) {
  const labelByStatus = {
    "not-checked": "Not checked",
    available: "Mock available",
    "manual-review": "Mock manual review",
    "not-available": "Mock not available",
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-950">Serviceability check</h3>
      <p className="mt-2 text-sm text-slate-600">
        {address ? `Address: ${address}` : "Enter an address to simulate serviceability."}
      </p>
      <p className="mt-3 text-sm font-semibold text-blue-700">{labelByStatus[status]}</p>
    </section>
  );
}
