import path from "node:path";
import { collectPaginatedItems, configPath, listJsonFiles, readConfig, readJson, requireEnv } from "./_lib";
import { comparePermissions, type PermissionSpec } from "./permissions";

type CollectionDefinition = {
  id: string;
  name: string;
  permissions?: PermissionSpec;
  attributes?: Array<{ key: string }>;
  indexes?: Array<{ key: string }>;
};

type BucketDefinition = { id?: string; name?: string; permissions?: string[] | PermissionSpec };

type WarningEntry = {
  resource: string;
  reason: string;
  expected?: string[];
  actual?: string[];
};

type DriftReport = {
  missingDatabase: boolean;
  missingCollections: string[];
  missingAttributes: string[];
  missingIndexes: string[];
  missingBuckets: string[];
  permissionMismatches: string[];
  warnings: WarningEntry[];
  inventory: {
    liveCollections: number;
    liveBuckets: number;
    liveFunctions: number;
  };
};

type LiveCollection = {
  $id: string;
  $permissions?: string[];
  permissions?: string[] | PermissionSpec;
};

type LiveBucket = {
  $id: string;
  $permissions?: string[];
  permissions?: string[] | PermissionSpec;
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

function buildPaginatedRoute(route: string, limit: number, offset: number) {
  const query = [
    `queries[]=${encodeURIComponent(`limit(${limit})`)}`,
    `queries[]=${encodeURIComponent(`offset(${offset})`)}`,
  ].join("&");

  return `${route}${route.includes("?") ? "&" : "?"}${query}`;
}

async function listPaginatedRoute<TItem>(route: string, itemsKey: string, pageSize = 25) {
  return collectPaginatedItems<TItem>(
    (limit, offset) => appwriteGet<Record<string, unknown>>(buildPaginatedRoute(route, limit, offset)),
    itemsKey,
    pageSize,
  );
}

try {
  requireEnv(["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "APPWRITE_DATABASE_ID"]);

  const config = readConfig();
  const databaseId = process.env.APPWRITE_DATABASE_ID || config.database?.id || "";
  const adminTeamId = process.env.APPWRITE_ADMIN_TEAM_ID;
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
    warnings: [],
    inventory: {
      liveCollections: 0,
      liveBuckets: 0,
      liveFunctions: 0,
    },
  };

  let liveDatabase: { $id: string } | null = null;
  try {
    liveDatabase = await appwriteGet<{ $id: string }>(`/databases/${databaseId}`);
  } catch {
    report.missingDatabase = true;
  }

  if (liveDatabase) {
    const liveCollections = await listPaginatedRoute<LiveCollection>(`/databases/${databaseId}/collections`, "collections", 25);
    report.inventory.liveCollections = liveCollections.length;
    const collectionMap = new Map(liveCollections.map((collection) => [collection.$id, collection]));

    for (const definition of collections) {
      const liveCollection = collectionMap.get(definition.id);
      if (!liveCollection) {
        report.missingCollections.push(definition.id);
        continue;
      }

      const permissionComparison = comparePermissions(
        definition.permissions,
        liveCollection.$permissions || liveCollection.permissions,
        { adminTeamId },
      );

      if (permissionComparison.status === "drift") {
        report.permissionMismatches.push(definition.id);
      } else if (permissionComparison.status === "manual") {
        report.warnings.push({
          resource: `collection:${definition.id}`,
          reason: permissionComparison.reason || "Permission comparison requires manual verification.",
          expected: permissionComparison.expected,
          actual: permissionComparison.actual,
        });
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
    const liveBuckets = await listPaginatedRoute<LiveBucket>("/storage/buckets", "buckets", 25);
    report.inventory.liveBuckets = liveBuckets.length;
    const liveBucketMap = new Map(liveBuckets.map((bucket) => [bucket.$id, bucket]));

    for (const bucket of buckets) {
      const bucketId = bucket.id || bucket.name;
      if (!bucketId) {
        continue;
      }

      const liveBucket = liveBucketMap.get(bucketId);
      if (!liveBucket) {
        report.missingBuckets.push(bucketId);
        continue;
      }

      if (bucket.permissions) {
        const permissionComparison = comparePermissions(bucket.permissions, liveBucket.$permissions || liveBucket.permissions, { adminTeamId });
        if (permissionComparison.status === "drift") {
          report.permissionMismatches.push(`bucket:${bucketId}`);
        } else if (permissionComparison.status === "manual") {
          report.warnings.push({
            resource: `bucket:${bucketId}`,
            reason: permissionComparison.reason || "Bucket permission comparison requires manual verification.",
            expected: permissionComparison.expected,
            actual: permissionComparison.actual,
          });
        }
      }
    }
  }

  try {
    const liveFunctions = await listPaginatedRoute<{ $id: string }>("/functions", "functions", 25);
    report.inventory.liveFunctions = liveFunctions.length;
  } catch (error) {
    report.warnings.push({
      resource: "functions",
      reason: error instanceof Error ? error.message : String(error),
    });
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
