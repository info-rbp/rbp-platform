import path from "node:path";
import { configPath, listJsonFiles, readConfig, readJson, requireEnv } from "./_lib";

type CollectionDefinition = {
  id: string;
  name: string;
  permissions?: Record<string, string[]>;
  attributes?: Array<{ key: string }>;
  indexes?: Array<{ key: string }>;
};

type BucketDefinition = { id?: string; name?: string };

type DriftReport = {
  missingDatabase: boolean;
  missingCollections: string[];
  missingAttributes: string[];
  missingIndexes: string[];
  missingBuckets: string[];
  permissionMismatches: string[];
};

function baseHeaders() {
  return {
    "content-type": "application/json",
    "x-appwrite-project": process.env.APPWRITE_PROJECT_ID || "",
    "x-appwrite-key": process.env.APPWRITE_API_KEY || "",
  };
}

async function appwriteGet<T>(route: string) {
  const endpoint = String(process.env.APPWRITE_ENDPOINT || "").replace(/\/$/, "");
  const response = await fetch(`${endpoint}${route}`, { headers: baseHeaders() });

  if (!response.ok) {
    throw new Error(`Appwrite request failed for ${route}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

function toPermissionFingerprint(permissions: Record<string, string[]> | undefined) {
  return JSON.stringify(permissions || {});
}

try {
  requireEnv(["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "APPWRITE_DATABASE_ID"]);

  const config = readConfig();
  const databaseId = process.env.APPWRITE_DATABASE_ID || config.database?.id || "";
  const collections = listJsonFiles("appwrite/collections").map((filePath) => readJson<CollectionDefinition>(filePath));
  const buckets = listJsonFiles("appwrite/buckets").map((filePath) => readJson<BucketDefinition>(filePath));
  const allowDrift = process.argv.includes("--allow-drift");

  const report: DriftReport = {
    missingDatabase: false,
    missingCollections: [],
    missingAttributes: [],
    missingIndexes: [],
    missingBuckets: [],
    permissionMismatches: [],
  };

  let liveDatabase: { $id: string } | null = null;
  try {
    liveDatabase = await appwriteGet<{ $id: string }>(`/databases/${databaseId}`);
  } catch {
    report.missingDatabase = true;
  }

  if (liveDatabase) {
    const liveCollections = await appwriteGet<{ collections: Array<{ $id: string; permissions?: Record<string, string[]> }> }>(`/databases/${databaseId}/collections`);
    const collectionMap = new Map(liveCollections.collections.map((collection) => [collection.$id, collection]));

    for (const definition of collections) {
      const liveCollection = collectionMap.get(definition.id);
      if (!liveCollection) {
        report.missingCollections.push(definition.id);
        continue;
      }

      if (toPermissionFingerprint(liveCollection.permissions) !== toPermissionFingerprint(definition.permissions)) {
        report.permissionMismatches.push(definition.id);
      }

      const liveAttributes = await appwriteGet<{ attributes: Array<{ key: string }> }>(`/databases/${databaseId}/collections/${definition.id}/attributes`);
      const liveAttributeKeys = new Set(liveAttributes.attributes.map((attribute) => attribute.key));
      for (const attribute of definition.attributes || []) {
        if (!liveAttributeKeys.has(attribute.key)) {
          report.missingAttributes.push(`${definition.id}.${attribute.key}`);
        }
      }

      const liveIndexes = await appwriteGet<{ indexes: Array<{ key: string }> }>(`/databases/${databaseId}/collections/${definition.id}/indexes`);
      const liveIndexKeys = new Set(liveIndexes.indexes.map((index) => index.key));
      for (const index of definition.indexes || []) {
        if (!liveIndexKeys.has(index.key)) {
          report.missingIndexes.push(`${definition.id}.${index.key}`);
        }
      }
    }
  }

  if (buckets.length) {
    const liveBuckets = await appwriteGet<{ buckets: Array<{ $id: string }> }>("/storage/buckets");
    const liveBucketIds = new Set(liveBuckets.buckets.map((bucket) => bucket.$id));
    for (const bucket of buckets) {
      const bucketId = bucket.id || bucket.name;
      if (bucketId && !liveBucketIds.has(bucketId)) {
        report.missingBuckets.push(bucketId);
      }
    }
  }

  console.log(JSON.stringify({
    config: path.relative(process.cwd(), configPath),
    report,
  }, null, 2));

  const hasDrift = report.missingDatabase
    || report.missingCollections.length > 0
    || report.missingAttributes.length > 0
    || report.missingIndexes.length > 0
    || report.missingBuckets.length > 0
    || report.permissionMismatches.length > 0;

  if (hasDrift && !allowDrift) {
    process.exit(1);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
