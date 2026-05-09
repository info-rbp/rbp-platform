export interface MockSubmissionStateProps {
  state: "idle" | "loading" | "success" | "error";
  idleMessage?: string;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

export function MockSubmissionState({
  state,
  idleMessage = "Ready for mock submission.",
  loadingMessage = "Simulating submission...",
  successMessage = "Mock submission completed.",
  errorMessage = "Mock submission failed. Review the highlighted fields.",
}: MockSubmissionStateProps) {
  const messageByState = {
    idle: idleMessage,
    loading: loadingMessage,
    success: successMessage,
    error: errorMessage,
  };

  const classByState = {
    idle: "border-slate-200 bg-slate-50 text-slate-700",
    loading: "border-blue-200 bg-blue-50 text-blue-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <div className={`rounded-2xl border p-4 text-sm font-medium ${classByState[state]}`}>
      {messageByState[state]}
    </div>
  );
}
