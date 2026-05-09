import type { ReactNode } from "react";
import { Stepper, type StepperStep } from "./Stepper";

export interface WizardShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  steps: StepperStep[];
  currentStepId: string;
  children: ReactNode;
  aside?: ReactNode;
}

export function WizardShell({
  eyebrow,
  title,
  description,
  steps,
  currentStepId,
  children,
  aside,
}: WizardShellProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        {eyebrow ? (
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mb-8">
        <Stepper steps={steps} currentStepId={currentStepId} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {children}
        </div>
        {aside ? <aside className="lg:sticky lg:top-6 lg:self-start">{aside}</aside> : null}
      </div>
    </section>
  );
}
