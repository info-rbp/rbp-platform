import path from "node:path";
import { Query } from "node-appwrite";
import { collectPaginatedItems, configPath, createAdminServices, listJsonFiles, readConfig, readJson, requireEnv } from "./_lib";
import { comparePermissions, type PermissionSpec } from "./permissions";

type CollectionDefinition = {
  id: string;
  name: string;
  permissions?: PermissionSpec;
  attributes?: Array<{ key: string }>;
  indexes?: Array<{ key: string }>;
};

type BucketDefinition = {
  id?: string;
  name?: string;
  permissions?: PermissionSpec;
};

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

function listCollections(databases: ReturnType<typeof createAdminServices>["databases"], databaseId: string) {
  return collectPaginatedItems<LiveCollection>(
    (limit, offset) => databases.listCollections(databaseId, [Query.limit(limit), Query.offset(offset)]) as Promise<Record<string, unknown>>,
    "collections",
    25,
  );
}

function listAttributes(databases: ReturnType<typeof createAdminServices>["databases"], databaseId: string, collectionId: string) {
  return collectPaginatedItems<{ key: string }>(
    (limit, offset) => databases.listAttributes(databaseId, collectionId, [Query.limit(limit), Query.offset(offset)]) as Promise<Record<string, unknown>>,
    "attributes",
    25,
  );
}

function listIndexes(databases: ReturnType<typeof createAdminServices>["databases"], databaseId: string, collectionId: string) {
  return collectPaginatedItems<{ key: string }>(
    (limit, offset) => databases.listIndexes(databaseId, collectionId, [Query.limit(limit), Query.offset(offset)]) as Promise<Record<string, unknown>>,
    "indexes",
    25,
  );
}

function listBuckets(storage: ReturnType<typeof createAdminServices>["storage"]) {
  return collectPaginatedItems<LiveBucket>(
    (limit, offset) => storage.listBuckets([Query.limit(limit), Query.offset(offset)]) as Promise<Record<string, unknown>>,
    "buckets",
    25,
  );
}

function listFunctions(functions: ReturnType<typeof createAdminServices>["functions"]) {
  return collectPaginatedItems<{ $id: string }>(
    (limit, offset) => functions.list([Query.limit(limit), Query.offset(offset)]) as Promise<Record<string, unknown>>,
    "functions",
    25,
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
  const { databases, functions, storage } = createAdminServices();

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
    liveDatabase = await databases.get(databaseId) as { $id: string };
  } catch {
    report.missingDatabase = true;
  }

  if (liveDatabase) {
    const liveCollections = await listCollections(databases, databaseId);
    report.inventory.liveCollections = liveCollections.length;
    const collectionMap = new Map(liveCollections.map((collection) => [collection.$id, collection]));

    for (const definition of collections) {
      const liveCollection = collectionMap.get(definition.id);
      if (!liveCollection) {
        report.missingCollections.push(definition.id);
        continue;
      }

      if (definition.permissions) {
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
      }

      const liveAttributes = await listAttributes(databases, databaseId, definition.id);
      const liveAttributeKeys = new Set(liveAttributes.map((attribute) => attribute.key));
      for (const attribute of definition.attributes || []) {
        if (!liveAttributeKeys.has(attribute.key)) {
          report.missingAttributes.push(`${definition.id}.${attribute.key}`);
        }
      }

      const liveIndexes = await listIndexes(databases, databaseId, definition.id);
      const liveIndexKeys = new Set(liveIndexes.map((index) => index.key));
      for (const index of definition.indexes || []) {
        if (!liveIndexKeys.has(index.key)) {
          report.missingIndexes.push(`${definition.id}.${index.key}`);
        }
      }
    }
  }

  if (buckets.length) {
    const liveBuckets = await listBuckets(storage);
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
        const permissionComparison = comparePermissions(
          bucket.permissions,
          liveBucket.$permissions || liveBucket.permissions,
          { adminTeamId },
        );

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
    const liveFunctions = await listFunctions(functions);
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
