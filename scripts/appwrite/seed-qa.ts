import { listJsonFiles, parseFlag, requireEnv } from "./_lib";

const apply = parseFlag("--apply");

try {
  requireEnv(["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "APPWRITE_DATABASE_ID"]);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

console.log(apply ? "Applying QA seed data." : "Dry run only. Pass --apply to create seed records.");
for (const filePath of listJsonFiles("appwrite/seeds/qa")) {
  console.log(`${apply ? "seed" : "plan"}: ${filePath}`);
}
