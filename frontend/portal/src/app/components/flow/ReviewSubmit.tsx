import type { ReactNode } from "react";

export interface ReviewSubmitItem {
  label: string;
  value: ReactNode;
}

export interface ReviewSubmitSection {
  title: string;
  description?: string;
  items: ReviewSubmitItem[];
}

export interface ReviewSubmitProps {
  title?: string;
  description?: string;
  sections: ReviewSubmitSection[];
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit?: () => void;
}

export function ReviewSubmit({
  title = "Review and submit",
  description = "Confirm the details below before completing this submission.",
  sections,
  submitLabel = "Submit",
  isSubmitting = false,
  onSubmit,
}: ReviewSubmitProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900">{section.title}</h3>
            {section.description ? (
              <p className="mt-1 text-sm text-slate-500">{section.description}</p>
            ) : null}
            <dl className="mt-4 divide-y divide-slate-100">
              {section.items.map((item) => (
                <div key={item.label} className="grid gap-2 py-3 sm:grid-cols-3">
                  <dt className="text-sm font-medium text-slate-500">{item.label}</dt>
                  <dd className="text-sm text-slate-900 sm:col-span-2">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {isSubmitting ? "Submitting..." : submitLabel}
      </button>
    </div>
  );
}
