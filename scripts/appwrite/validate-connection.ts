import { requireEnv } from "./_lib";

try {
  requireEnv([
    "APPWRITE_ENDPOINT",
    "APPWRITE_PROJECT_ID",
    "APPWRITE_API_KEY",
    "APPWRITE_DATABASE_ID",
    "APPWRITE_STORAGE_BUCKET_ID",
  ]);
  console.log("Appwrite connection variables are present.");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
