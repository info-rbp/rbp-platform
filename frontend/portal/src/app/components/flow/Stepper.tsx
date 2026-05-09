export interface StepperStep {
  id: string;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStepId: string;
}

export function Stepper({ steps, currentStepId }: StepperProps) {
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === currentStepId)
  );

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = step.id === currentStepId;

          return (
            <li
              key={step.id}
              className={[
                "rounded-2xl border p-4",
                isCurrent
                  ? "border-blue-600 bg-blue-50"
                  : isComplete
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-white",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                    isCurrent
                      ? "bg-blue-600 text-white"
                      : isComplete
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600",
                  ].join(" ")}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{step.label}</p>
                  {step.description ? (
                    <p className="text-xs text-slate-500">{step.description}</p>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
