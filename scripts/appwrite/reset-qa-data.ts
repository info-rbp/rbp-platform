import { createAdminServices, ensureQaGuard, parseFlag } from "./_lib";

const apply = parseFlag("--apply");
const confirm = parseFlag("--confirm-reset-qa");

if (!apply || !confirm) {
  console.error("Refusing to reset QA data without --apply and --confirm-reset-qa.");
  process.exit(1);
}

try {
  ensureQaGuard();
  const { databases, databaseId } = createAdminServices();

  const targets = [
    { collectionId: "notifications", field: "title", values: ["QA "] },
    { collectionId: "service_requests", field: "reference_id", values: ["RBP-"] },
    { collectionId: "application_interest", field: "status", values: ["seeded", "qa"] },
  ];

  for (const target of targets) {
    const listed = await databases.listDocuments(databaseId, target.collectionId, []);
    for (const document of listed.documents) {
      const value = String(document[target.field] || "");
      if (target.values.some((prefix) => value.startsWith(prefix) || value === prefix)) {
        await databases.deleteDocument(databaseId, target.collectionId, document.$id);
      }
    }
  }

  console.log("QA seed records with explicit QA markers were deleted.");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
