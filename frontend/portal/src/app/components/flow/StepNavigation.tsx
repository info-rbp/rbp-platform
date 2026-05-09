export interface StepNavigationProps {
  canGoBack?: boolean;
  canContinue?: boolean;
  backLabel?: string;
  continueLabel?: string;
  onBack?: () => void;
  onContinue?: () => void;
}

export function StepNavigation({
  canGoBack = true,
  canContinue = true,
  backLabel = "Back",
  continueLabel = "Continue",
  onBack,
  onContinue,
}: StepNavigationProps) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {backLabel}
      </button>
      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        {continueLabel}
      </button>
    </div>
  );
}
