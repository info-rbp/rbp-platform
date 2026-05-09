export interface ProgressBadgeProps {
  current: number;
  total: number;
}

export function ProgressBadge({ current, total }: ProgressBadgeProps) {
  const safeTotal = Math.max(total, 1);
  const percent = Math.min(100, Math.round((current / safeTotal) * 100));

  return (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
      {percent}% complete
    </span>
  );
}
