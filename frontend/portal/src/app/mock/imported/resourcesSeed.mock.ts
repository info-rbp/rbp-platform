export interface ImportedResourceSeed {
  id: string;
  sourceFile: string;
  title: string;
  resourceType: string;
  description: string;
  phase1Status: "approved" | "needs-review" | "deferred";
  notes: string;
}

export const importedResourceSeeds: ImportedResourceSeed[] = [
  {
    id: "imported-resource-seed-001",
    sourceFile: "External resource source material",
    title: "Resource seed placeholder",
    resourceType: "guide",
    description: "Placeholder seed record for future approved resource content.",
    phase1Status: "needs-review",
    notes: "Use approved rewritten content before surfacing in public resources.",
  },
];
