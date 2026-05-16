import path from "node:path";
import { Query } from "node-appwrite";
import { collectPaginatedItems, createAdminServices, listFunctionDirectories, listJsonFiles, logSection, readConfig } from "./_lib";
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
const liveCollections = await collectPaginatedItems<{ $id: string }>(
  (limit, offset) => databases.listCollections(databaseId, [Query.limit(limit), Query.offset(offset)]),
  "collections",
  25,
);
const liveFunctions = await collectPaginatedItems<{ $id: string }>(
  (limit, offset) => functions.list([Query.limit(limit), Query.offset(offset)]),
  "functions",
  25,
);
const liveBuckets = await collectPaginatedItems<{ $id: string; name: string }>(
  (limit, offset) => storage.listBuckets([Query.limit(limit), Query.offset(offset)]),
  "buckets",
  25,
);

console.log(JSON.stringify({
  database: { id: liveDatabase.$id, name: liveDatabase.name },
  collectionCount: liveCollections.length,
  collections: liveCollections.map((collection) => collection.$id),
  functionCount: liveFunctions.length,
  functions: liveFunctions.map((fn) => fn.$id),
  configuredStorageBucketId: storageBucketId,
  bucketCount: liveBuckets.length,
  buckets: liveBuckets.map((bucket) => ({ id: bucket.$id, name: bucket.name })),
const liveCollections = await databases.listCollections(databaseId);
const liveFunctions = await functions.list();
const liveBucket = await storage.getBucket(storageBucketId);

console.log(JSON.stringify({
  database: { id: liveDatabase.$id, name: liveDatabase.name },
  collections: liveCollections.collections.map((collection) => collection.$id),
  functions: liveFunctions.functions.map((fn) => fn.$id),
  bucket: { id: liveBucket.$id, name: liveBucket.name },
}, null, 2));
