import { listJsonFiles, requireEnv } from "./_lib";

try {
  requireEnv(["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "APPWRITE_DATABASE_ID"]);
} catch (error) {
  console.error(error instanceof Error ? `${error.message}. Live diff skipped.` : String(error));
  process.exit(1);
}

console.log("Live schema diff requires reachable Appwrite credentials.");
console.log(`Desired collection definitions: ${listJsonFiles("appwrite/collections").length}`);
console.log("Compare this count and collection ids against the live Appwrite database during QA deploy.");
