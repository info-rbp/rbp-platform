import type { MockTimelineItem } from "../../mock";

export interface StatusTimelineProps {
  items: MockTimelineItem[];
}

export function StatusTimeline({ items }: StatusTimelineProps) {
  return (
    <ol className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="mt-1 h-3 w-3 rounded-full bg-blue-600" />
            <div>
              <p className="font-semibold text-slate-900">{item.label}</p>
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              <p className="mt-2 text-xs text-slate-400">{item.timestamp}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
