import { createAdminServices, logSection, requireEnv } from "./_lib";

try {
  requireEnv([
    "APPWRITE_ENDPOINT",
    "APPWRITE_PROJECT_ID",
    "APPWRITE_API_KEY",
    "APPWRITE_DATABASE_ID",
    "APPWRITE_STORAGE_BUCKET_ID",
  ]);

  const { databases, functions, storage, databaseId, storageBucketId } = createAdminServices();

  logSection("Connection");
  await databases.get(databaseId);
  console.log(`Database reachable: ${databaseId}`);

  logSection("Storage");
  await storage.getBucket(storageBucketId);
  console.log(`Bucket reachable: ${storageBucketId}`);

  logSection("Functions");
  const liveFunctions = await functions.list();
  console.log(`Functions visible: ${liveFunctions.total}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
