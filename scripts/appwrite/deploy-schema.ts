import { pathToFileURL } from "node:url";
import { createAdminServices, createSummary, isApplyMode, isDestructiveMode, listJsonFiles, printSummary, readConfig, readJson, type AppwriteConfig, type Summary } from "./_lib";
import { buildPermissions, comparePermissions, type PermissionSpec } from "./permissions";

type CollectionDefinition = {
  id: string;
  name: string;
  documentSecurity?: boolean;
  enabled?: boolean;
  permissions?: PermissionSpec;
  attributes?: Array<Record<string, unknown>>;
  indexes?: Array<Record<string, unknown>>;
};

type BucketDefinition = {
  id: string;
  name?: string;
  permissions?: PermissionSpec;
  fileSecurity?: boolean;
  enabled?: boolean;
  maximumFileSize?: number;
  allowedFileExtensions?: string[];
  compression?: string;
  encryption?: boolean;
  antivirus?: boolean;
  transformations?: boolean;
};

type LiveCollection = {
  $id: string;
  name?: string;
  $permissions?: string[];
  permissions?: string[] | PermissionSpec;
  documentSecurity?: boolean;
  enabled?: boolean;
};

type LiveBucket = {
  $id: string;
  name?: string;
  $permissions?: string[];
  permissions?: string[] | PermissionSpec;
  fileSecurity?: boolean;
  enabled?: boolean;
  maximumFileSize?: number;
  allowedFileExtensions?: string[];
  compression?: string;
  encryption?: boolean;
  antivirus?: boolean;
  transformations?: boolean;
};

type DeploySchemaEnv = NodeJS.ProcessEnv;

export type AppwriteRequest = <T>(route: string, init?: RequestInit) => Promise<T>;

export type AppwriteDatabasesApi = {
  updateCollection(params: {
    databaseId: string;
    collectionId: string;
    name?: string;
    permissions?: string[];
    documentSecurity?: boolean;
    enabled?: boolean;
    purge?: boolean;
  }): Promise<unknown>;
};

export type AppwriteStorageApi = {
  updateBucket(params: {
    bucketId: string;
    name: string;
    permissions?: string[];
    fileSecurity?: boolean;
    enabled?: boolean;
    maximumFileSize?: number;
    allowedFileExtensions?: string[];
    compression?: string;
    encryption?: boolean;
    antivirus?: boolean;
    transformations?: boolean;
  }): Promise<unknown>;
};

export type DeploySchemaOptions = {
  apply: boolean;
  allowDestructive?: boolean;
  env?: DeploySchemaEnv;
  config?: AppwriteConfig;
  collectionDefinitions?: CollectionDefinition[];
  bucketDefinitions?: BucketDefinition[];
  summary?: Summary;
  appwriteRequest?: AppwriteRequest;
  createAdminServices?: () => {
    databases: AppwriteDatabasesApi;
    storage: AppwriteStorageApi;
  };
};

function baseHeaders(env: DeploySchemaEnv) {
  return {
    "content-type": "application/json",
    "x-appwrite-project": env.APPWRITE_PROJECT_ID || "",
    "x-appwrite-key": env.APPWRITE_API_KEY || "",
  };
}

function createAppwriteRequest(env: DeploySchemaEnv): AppwriteRequest {
  return async function appwriteRequest<T>(route: string, init?: RequestInit) {
    const endpoint = String(env.APPWRITE_ENDPOINT || "").replace(/\/$/, "");
    const response = await fetch(`${endpoint}${route}`, {
      ...init,
      headers: {
        ...baseHeaders(env),
        ...(init?.headers || {}),
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Appwrite request failed for ${route}: ${response.status} ${response.statusText} ${body}`.trim());
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json() as Promise<T>;
  };
}

function pushUnique(items: string[], value: string) {
  if (!items.includes(value)) {
    items.push(value);
  }
}

async function ensureDatabase(
  databaseId: string,
  name: string,
  apply: boolean,
  appwriteRequest: AppwriteRequest,
  summary: Summary,
) {
  try {
    await appwriteRequest(`/databases/${databaseId}`);
    summary.skipped.push(`database:${databaseId}`);
  } catch {
    if (!apply) {
      summary.created.push(`database:${databaseId} (dry-run)`);
      return;
    }

    await appwriteRequest(`/databases`, {
      method: "POST",
      body: JSON.stringify({ databaseId, name, enabled: true }),
    });
    summary.created.push(`database:${databaseId}`);
  }
}

async function reconcileCollectionPermissions(
  databaseId: string,
  definition: CollectionDefinition,
  liveCollection: LiveCollection,
  apply: boolean,
  env: DeploySchemaEnv,
  databases: AppwriteDatabasesApi,
  summary: Summary,
) {
  if (!definition.permissions) {
    return;
  }

  const comparison = comparePermissions(
    definition.permissions,
    liveCollection.$permissions || liveCollection.permissions,
    { adminTeamId: env.APPWRITE_ADMIN_TEAM_ID },
  );

  if (comparison.status === "match") {
    return;
  }

  if (comparison.status === "manual") {
    if (apply) {
      throw new Error(comparison.reason || `Unable to reconcile permissions for ${definition.id}.`);
    }

    summary.manualActionRequired.push(`permissions:${definition.id} ${comparison.reason || "Permission comparison requires manual verification."}`);
    return;
  }

  if (!apply) {
    summary.drift.push(`permissions:${definition.id}`);
    pushUnique(summary.skipped, "Dry-run only. Pass --apply to update live permissions.");
    return;
  }

  const expectedPermissions = buildPermissions(definition.permissions, {
    adminTeamId: env.APPWRITE_ADMIN_TEAM_ID,
  });

  await databases.updateCollection({
    databaseId,
    collectionId: definition.id,
    name: liveCollection.name || definition.name,
    permissions: expectedPermissions,
    documentSecurity: liveCollection.documentSecurity ?? definition.documentSecurity ?? true,
    enabled: liveCollection.enabled ?? definition.enabled ?? true,
  });

  summary.updated.push(`permissions:${definition.id}`);
}

async function ensureCollection(
  databaseId: string,
  definition: CollectionDefinition,
  apply: boolean,
  env: DeploySchemaEnv,
  appwriteRequest: AppwriteRequest,
  databases: AppwriteDatabasesApi,
  summary: Summary,
) {
  let liveCollection: LiveCollection | null = null;
  try {
    liveCollection = await appwriteRequest<LiveCollection>(`/databases/${databaseId}/collections/${definition.id}`);
  } catch {
    liveCollection = null;
  }

  if (!liveCollection) {
    if (!apply) {
      summary.created.push(`collection:${definition.id} (dry-run)`);
    } else {
      await appwriteRequest(`/databases/${databaseId}/collections`, {
        method: "POST",
        body: JSON.stringify({
          collectionId: definition.id,
          name: definition.name,
          documentSecurity: definition.documentSecurity ?? true,
          enabled: definition.enabled ?? true,
          permissions: buildPermissions(definition.permissions ?? {}, { adminTeamId: env.APPWRITE_ADMIN_TEAM_ID }),
        }),
      });
      summary.created.push(`collection:${definition.id}`);
    }
  } else {
    summary.skipped.push(`collection:${definition.id}`);
  }

  const liveAttributes = liveCollection
    ? await appwriteRequest<{ attributes: Array<{ key: string }> }>(`/databases/${databaseId}/collections/${definition.id}/attributes`)
    : { attributes: [] };
  const liveAttributeKeys = new Set(liveAttributes.attributes.map((attribute) => attribute.key));

  for (const attribute of definition.attributes || []) {
    const key = String(attribute.key || "");
    if (!key || liveAttributeKeys.has(key)) {
      summary.skipped.push(`attribute:${definition.id}.${key}`);
      continue;
    }

    if (!apply) {
      summary.created.push(`attribute:${definition.id}.${key} (dry-run)`);
      continue;
    }

    const type = String(attribute.type || "string");
    const route = `/databases/${databaseId}/collections/${definition.id}/attributes/${type}`;
    await appwriteRequest(route, {
      method: "POST",
      body: JSON.stringify(attribute),
    });
    summary.created.push(`attribute:${definition.id}.${key}`);
  }

  const liveIndexes = liveCollection
    ? await appwriteRequest<{ indexes: Array<{ key: string }> }>(`/databases/${databaseId}/collections/${definition.id}/indexes`)
    : { indexes: [] };
  const liveIndexKeys = new Set(liveIndexes.indexes.map((index) => index.key));

  for (const index of definition.indexes || []) {
    const key = String(index.key || "");
    if (!key || liveIndexKeys.has(key)) {
      summary.skipped.push(`index:${definition.id}.${key}`);
      continue;
    }

    if (!apply) {
      summary.created.push(`index:${definition.id}.${key} (dry-run)`);
      continue;
    }

    await appwriteRequest(`/databases/${databaseId}/collections/${definition.id}/indexes`, {
      method: "POST",
      body: JSON.stringify(index),
    });
    summary.created.push(`index:${definition.id}.${key}`);
  }

  if (liveCollection) {
    await reconcileCollectionPermissions(databaseId, definition, liveCollection, apply, env, databases, summary);
  }
}

async function reconcileBucketPermissions(
  definition: BucketDefinition,
  liveBucket: LiveBucket,
  apply: boolean,
  env: DeploySchemaEnv,
  storage: AppwriteStorageApi,
  summary: Summary,
) {
  if (!definition.permissions) {
    return;
  }

  const bucketId = definition.id;
  const comparison = comparePermissions(
    definition.permissions,
    liveBucket.$permissions || liveBucket.permissions,
    { adminTeamId: env.APPWRITE_ADMIN_TEAM_ID },
  );

  if (comparison.status === "match") {
    return;
  }

  if (comparison.status === "manual") {
    if (apply) {
      throw new Error(comparison.reason || `Unable to reconcile bucket permissions for ${bucketId}.`);
    }

    summary.manualActionRequired.push(`permissions:bucket:${bucketId} ${comparison.reason || "Permission comparison requires manual verification."}`);
    return;
  }

  if (!apply) {
    summary.drift.push(`permissions:bucket:${bucketId}`);
    pushUnique(summary.skipped, "Dry-run only. Pass --apply to update live permissions.");
    return;
  }

  const expectedPermissions = buildPermissions(definition.permissions, {
    adminTeamId: env.APPWRITE_ADMIN_TEAM_ID,
  });

  await storage.updateBucket({
    bucketId,
    name: liveBucket.name || definition.name || bucketId,
    permissions: expectedPermissions,
    fileSecurity: liveBucket.fileSecurity ?? definition.fileSecurity ?? true,
    enabled: liveBucket.enabled ?? definition.enabled ?? true,
    maximumFileSize: liveBucket.maximumFileSize ?? definition.maximumFileSize,
    allowedFileExtensions: liveBucket.allowedFileExtensions ?? definition.allowedFileExtensions,
    compression: liveBucket.compression ?? definition.compression,
    encryption: liveBucket.encryption ?? definition.encryption,
    antivirus: liveBucket.antivirus ?? definition.antivirus,
    transformations: liveBucket.transformations,
  });

  summary.updated.push(`permissions:bucket:${bucketId}`);
}

async function ensureBucket(
  definition: BucketDefinition,
  apply: boolean,
  env: DeploySchemaEnv,
  appwriteRequest: AppwriteRequest,
  storage: AppwriteStorageApi,
  summary: Summary,
) {
  let liveBucket: LiveBucket | null = null;
  try {
    liveBucket = await appwriteRequest<LiveBucket>(`/storage/buckets/${definition.id}`);
  } catch {
    liveBucket = null;
  }

  if (!liveBucket) {
    if (!apply) {
      summary.created.push(`bucket:${definition.id} (dry-run)`);
      return;
    }

    await appwriteRequest(`/storage/buckets`, {
      method: "POST",
      body: JSON.stringify({
        bucketId: definition.id,
        name: definition.name || definition.id,
        permissions: buildPermissions(definition.permissions ?? {}, { adminTeamId: env.APPWRITE_ADMIN_TEAM_ID }),
        fileSecurity: definition.fileSecurity ?? true,
        enabled: definition.enabled ?? true,
        maximumFileSize: definition.maximumFileSize,
        allowedFileExtensions: definition.allowedFileExtensions,
        compression: definition.compression,
        encryption: definition.encryption,
        antivirus: definition.antivirus,
        transformations: definition.transformations,
      }),
    });
    summary.created.push(`bucket:${definition.id}`);
    return;
  }

  summary.skipped.push(`bucket:${definition.id}`);
  await reconcileBucketPermissions(definition, liveBucket, apply, env, storage, summary);
}

export async function runDeploySchema(options: DeploySchemaOptions) {
  const env = options.env || process.env;
  const summary = options.summary || createSummary();
  const config = options.config || readConfig();
  const databaseId = env.APPWRITE_DATABASE_ID || config.database?.id || "";
  const apply = options.apply;
  const allowDestructive = options.allowDestructive ?? false;
  const collectionDefinitions = options.collectionDefinitions || listJsonFiles("appwrite/collections").map((filePath) => readJson<CollectionDefinition>(filePath));
  const bucketDefinitions = options.bucketDefinitions || listJsonFiles("appwrite/buckets").map((filePath) => readJson<BucketDefinition>(filePath));
  const appwriteRequest = options.appwriteRequest || createAppwriteRequest(env);
  const adminServices = options.createAdminServices
    ? options.createAdminServices()
    : createAdminServices();

  for (const key of ["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "APPWRITE_DATABASE_ID"]) {
    if (!env[key]) {
      throw new Error(`Missing required environment variables: ${key}`);
    }
  }

  if (!apply) {
    summary.skipped.push("Dry-run only. Pass --apply to mutate live Appwrite.");
  }

  if (!allowDestructive) {
    summary.skipped.push("Destructive operations disabled. Pass --allow-destructive to opt in.");
  }

  await ensureDatabase(databaseId, config.database?.name || databaseId, apply, appwriteRequest, summary);

  for (const definition of collectionDefinitions) {
    await ensureCollection(databaseId, definition, apply, env, appwriteRequest, adminServices.databases, summary);
  }

  for (const definition of bucketDefinitions) {
    await ensureBucket(definition, apply, env, appwriteRequest, adminServices.storage, summary);
  }

  if (!bucketDefinitions.length && (config.buckets || []).length) {
    for (const bucketId of config.buckets || []) {
      summary.manualActionRequired.push(`bucket:${bucketId} is declared in appwrite.config.json but has no repo bucket definition file.`);
    }
  }

  return { summary };
}

async function main() {
  try {
    const result = await runDeploySchema({
      apply: isApplyMode(),
      allowDestructive: isDestructiveMode(),
    });
    printSummary(result.summary);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
