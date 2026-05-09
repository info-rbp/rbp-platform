export type DesignStatusTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "premium"
  | "locked";

export type Phase1StatusKey =
  | "draft"
  | "submitted"
  | "pending"
  | "in-review"
  | "needs-info"
  | "approved"
  | "rejected"
  | "active"
  | "assigned"
  | "outcome-ready"
  | "complete"
  | "partial"
  | "placeholder"
  | "available"
  | "included"
  | "locked"
  | "coming-soon"
  | "simulated"
  | "error"
  | "warning"
  | "success";

export const phase1StatusLabels: Record<Phase1StatusKey, string> = {
  draft: "Draft",
  submitted: "Submitted",
  pending: "Pending",
  "in-review": "In review",
  "needs-info": "Needs info",
  approved: "Approved",
  rejected: "Rejected",
  active: "Active",
  assigned: "Assigned",
  "outcome-ready": "Outcome ready",
  complete: "Complete",
  partial: "Partial",
  placeholder: "Placeholder",
  available: "Available",
  included: "Included",
  locked: "Locked",
  "coming-soon": "Coming soon",
  simulated: "Simulated",
  error: "Error",
  warning: "Warning",
  success: "Success",
};

export const phase1StatusTones: Record<Phase1StatusKey, DesignStatusTone> = {
  draft: "neutral",
  submitted: "info",
  pending: "warning",
  "in-review": "warning",
  "needs-info": "warning",
  approved: "success",
  rejected: "danger",
  active: "success",
  assigned: "info",
  "outcome-ready": "success",
  complete: "success",
  partial: "warning",
  placeholder: "neutral",
  available: "success",
  included: "success",
  locked: "locked",
  "coming-soon": "neutral",
  simulated: "premium",
  error: "danger",
  warning: "warning",
  success: "success",
};

export const statusToneClasses: Record<DesignStatusTone, string> = {
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  premium: "border-indigo-200 bg-indigo-50 text-indigo-700",
  locked: "border-slate-300 bg-slate-100 text-slate-500",
};

export function getPhase1StatusLabel(status: string): string {
  return phase1StatusLabels[status as Phase1StatusKey] ?? status.replace(/-/g, " ");
}

export function getPhase1StatusTone(status: string): DesignStatusTone {
  return phase1StatusTones[status as Phase1StatusKey] ?? "neutral";
}

export function getPhase1StatusClasses(status: string): string {
  return statusToneClasses[getPhase1StatusTone(status)];
}
