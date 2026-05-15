import { listJsonFiles, parseFlag, requireEnv } from "./_lib";

const apply = parseFlag("--apply");

try {
  requireEnv(["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "APPWRITE_DATABASE_ID"]);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

console.log(apply ? "Applying Appwrite schema changes." : "Dry run only. Pass --apply to perform deployment actions.");
for (const filePath of listJsonFiles("appwrite/collections")) {
  console.log(`${apply ? "apply" : "plan"}: ${filePath}`);
}
