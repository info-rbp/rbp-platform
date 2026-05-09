export interface ImportedDocumentSeed {
  id: string;
  sourceFile: string;
  title: string;
  documentGroup: string;
  description: string;
  phase1Status: "approved" | "needs-review" | "deferred";
  notes: string;
}

export const importedDocumentSeeds: ImportedDocumentSeed[] = [
  {
    id: "imported-document-seed-001",
    sourceFile: "External document source material",
    title: "Document seed placeholder",
    documentGroup: "templates",
    description: "Placeholder seed record for future approved document/product content.",
    phase1Status: "needs-review",
    notes: "Document copy and legal positioning require review before production use.",
  },
];
