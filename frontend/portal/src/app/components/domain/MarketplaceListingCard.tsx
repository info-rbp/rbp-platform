export interface MarketplaceListingCardProps {
  title: string;
  description: string;
  priceLabel: string;
  href?: string;
}

export function MarketplaceListingCard({
  title,
  description,
  priceLabel,
  href = "/marketplace",
}: MarketplaceListingCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <p className="mt-4 font-semibold text-blue-700">{priceLabel}</p>
      <a href={href} className="mt-4 inline-flex text-sm font-semibold text-blue-700">
        View listing
      </a>
    </article>
  );
}
