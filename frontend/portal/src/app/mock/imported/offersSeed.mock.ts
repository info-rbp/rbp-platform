export interface ImportedOfferSeed {
  id: string;
  sourceFile: string;
  title: string;
  offerType: string;
  description: string;
  phase1Status: "approved" | "needs-review" | "deferred";
  notes: string;
}

export const importedOfferSeeds: ImportedOfferSeed[] = [
  {
    id: "imported-offer-seed-001",
    sourceFile: "External offer source material",
    title: "Offer seed placeholder",
    offerType: "partner-offer",
    description: "Placeholder seed record for future approved offer content.",
    phase1Status: "needs-review",
    notes: "Offer terms require review before production or public use.",
  },
];
