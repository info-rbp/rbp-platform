import type { DesignStatusTone } from "./status";
import { statusToneClasses } from "./status";

export const buttonVariants = {
  primary:
    "inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50",
  secondary:
    "inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50",
  ghost:
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50",
  danger:
    "inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50",
  success:
    "inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50",
} as const;

export const cardVariants = {
  default: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm",
  panel: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm",
  subtle: "rounded-2xl border border-slate-200 bg-slate-50 p-5",
  selected: "rounded-2xl border border-blue-600 bg-blue-50 p-5",
  warning: "rounded-2xl border border-amber-200 bg-amber-50 p-5",
  success: "rounded-2xl border border-emerald-200 bg-emerald-50 p-5",
  danger: "rounded-2xl border border-red-200 bg-red-50 p-5",
} as const;

export const formFieldVariants = {
  input:
    "mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100",
  textarea:
    "mt-2 min-h-32 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100",
  select:
    "mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100",
  label: "text-sm font-semibold text-slate-800",
  helpText: "mt-1 text-xs text-slate-500",
  error: "mt-1 text-sm font-medium text-red-600",
} as const;

export const badgeVariants: Record<DesignStatusTone, string> = {
  neutral: `inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusToneClasses.neutral}`,
  info: `inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusToneClasses.info}`,
  success: `inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusToneClasses.success}`,
  warning: `inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusToneClasses.warning}`,
  danger: `inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusToneClasses.danger}`,
  premium: `inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusToneClasses.premium}`,
  locked: `inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusToneClasses.locked}`,
};

export const emptyStateVariants = {
  default:
    "rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center",
  compact:
    "rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center",
} as const;

export const wizardVariants = {
  shell: "mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8",
  bodyGrid: "grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]",
  contentPanel: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm",
  aside: "lg:sticky lg:top-6 lg:self-start",
  stepCurrent: "border-blue-600 bg-blue-50",
  stepComplete: "border-emerald-300 bg-emerald-50",
  stepUpcoming: "border-slate-200 bg-white",
} as const;

export const confirmationVariants = {
  success: "rounded-3xl border border-emerald-200 bg-emerald-50 p-6",
  warning: "rounded-3xl border border-amber-200 bg-amber-50 p-6",
  danger: "rounded-3xl border border-red-200 bg-red-50 p-6",
  neutral: "rounded-3xl border border-slate-200 bg-white p-6",
} as const;

export const tableVariants = {
  wrapper: "overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm",
  table: "min-w-full divide-y divide-slate-200",
  head: "bg-slate-50",
  headerCell: "px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500",
  body: "divide-y divide-slate-100 bg-white",
  cell: "px-5 py-4 text-sm text-slate-700",
} as const;
