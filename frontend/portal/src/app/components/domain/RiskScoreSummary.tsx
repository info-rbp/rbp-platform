export interface RiskScoreSummaryProps {
  score: number;
  summary: string;
}

export function RiskScoreSummary({ score, summary }: RiskScoreSummaryProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-semibold text-slate-600">Mock risk score</p>
      <p className="mt-2 text-5xl font-bold text-blue-700">{score}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{summary}</p>
    </section>
  );
}
