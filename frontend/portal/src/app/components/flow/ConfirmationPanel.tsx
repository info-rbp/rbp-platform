import type { ReactNode } from "react";

export interface ConfirmationPanelProps {
  title: string;
  message: string;
  reference?: string;
  statusLabel?: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}

export function ConfirmationPanel({
  title,
  message,
  reference,
  statusLabel = "Submission received",
  primaryAction,
  secondaryAction,
}: ConfirmationPanelProps) {
  return (
    <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
        ✓
      </div>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          {statusLabel}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-700">{message}</p>
        {reference ? (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Reference
            </p>
            <p className="mt-1 text-lg font-bold text-slate-950">{reference}</p>
          </div>
        ) : null}
      </div>
      {(primaryAction || secondaryAction) ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {primaryAction}
          {secondaryAction}
        </div>
      ) : null}
    </section>
  );
}
