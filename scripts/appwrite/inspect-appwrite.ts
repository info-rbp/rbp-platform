import path from "node:path";
import { appwriteRoot, createAdminServices, listFunctionDirectories, listJsonFiles, logSection, readConfig } from "./_lib";

const config = readConfig();

logSection("Repository baseline");
console.log(`Project: ${config.project}`);
console.log(`Database definition: ${path.join("appwrite", "databases", "rbp-platform.json")}`);
console.log(`Collection definitions: ${listJsonFiles("appwrite/collections").length}`);
console.log(`Bucket definitions: ${listJsonFiles("appwrite/buckets").length}`);
console.log(`Function directories: ${listFunctionDirectories().length}`);

if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_PROJECT_ID || !process.env.APPWRITE_API_KEY) {
  logSection("Environment");
  console.log("Live Appwrite inspection skipped because APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, or APPWRITE_API_KEY is missing.");
  process.exit(0);
}

const { databases, functions, storage, databaseId, storageBucketId } = createAdminServices();

logSection("Live inventory");
const liveDatabase = await databases.get(databaseId);
const liveCollections = await databases.listCollections(databaseId);
const liveFunctions = await functions.list();
const liveBucket = await storage.getBucket(storageBucketId);

console.log(JSON.stringify({
  database: { id: liveDatabase.$id, name: liveDatabase.name },
  collections: liveCollections.collections.map((collection) => collection.$id),
  functions: liveFunctions.functions.map((fn) => fn.$id),
  bucket: { id: liveBucket.$id, name: liveBucket.name },
}, null, 2));
