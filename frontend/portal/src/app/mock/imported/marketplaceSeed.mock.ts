export interface ImportedMarketplaceSeed {
  id: string;
  sourceFile: string;
  title: string;
  category: string;
  description: string;
  phase1Status: "approved" | "needs-review" | "deferred";
  notes: string;
}

export const importedMarketplaceSeeds: ImportedMarketplaceSeed[] = [
  {
    id: "imported-marketplace-seed-001",
    sourceFile: "External marketplace source material",
    title: "Marketplace seed placeholder",
    category: "third-party-products-assets",
    description: "Placeholder seed record for future approved external marketplace content.",
    phase1Status: "needs-review",
    notes: "Do not replace with real supplier content until source and approval are confirmed.",
  },
];
