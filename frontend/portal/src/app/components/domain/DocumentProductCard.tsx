export interface DocumentProductCardProps {
  title: string;
  category: string;
  description: string;
  href?: string;
}

export function DocumentProductCard({
  title,
  category,
  description,
  href = "/document-nucleus/overview",
}: DocumentProductCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{category}</p>
      <h3 className="mt-2 text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <a href={href} className="mt-4 inline-flex text-sm font-semibold text-blue-700">
        View document
      </a>
    </article>
  );
}
