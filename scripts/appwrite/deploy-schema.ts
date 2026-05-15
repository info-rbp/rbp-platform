import { createSummary, isApplyMode, isDestructiveMode, listJsonFiles, printSummary, readConfig, readJson, requireEnv } from "./_lib";

type CollectionDefinition = {
  id: string;
  name: string;
  documentSecurity?: boolean;
  enabled?: boolean;
  permissions?: Record<string, string[]>;
  attributes?: Array<Record<string, unknown>>;
  indexes?: Array<Record<string, unknown>>;
};

type BucketDefinition = {
  id: string;
  name?: string;
  permissions?: string[];
  fileSecurity?: boolean;
  enabled?: boolean;
  maximumFileSize?: number;
  allowedFileExtensions?: string[];
  compression?: string;
  encryption?: boolean;
  antivirus?: boolean;
};

function baseHeaders() {
  return {
    "content-type": "application/json",
    "x-appwrite-project": process.env.APPWRITE_PROJECT_ID || "",
    "x-appwrite-key": process.env.APPWRITE_API_KEY || "",
  };
}

async function appwriteRequest<T>(route: string, init?: RequestInit) {
  const endpoint = String(process.env.APPWRITE_ENDPOINT || "").replace(/\/$/, "");
  const response = await fetch(`${endpoint}${route}`, {
    ...init,
    headers: {
      ...baseHeaders(),
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
}

async function ensureDatabase(databaseId: string, name: string, apply: boolean, summary: ReturnType<typeof createSummary>) {
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

async function ensureCollection(databaseId: string, definition: CollectionDefinition, apply: boolean, summary: ReturnType<typeof createSummary>) {
  let exists = true;
  try {
    await appwriteRequest(`/databases/${databaseId}/collections/${definition.id}`);
  } catch {
    exists = false;
  }

  if (!exists) {
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
          permissions: definition.permissions?.read ?? [],
        }),
      });
      summary.created.push(`collection:${definition.id}`);
    }
  } else {
    summary.skipped.push(`collection:${definition.id}`);
  }

  const liveAttributes = exists
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

  const liveIndexes = exists
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

  if (definition.permissions) {
    summary.manualActionRequired.push(`permissions:${definition.id} create/update/delete should be verified manually in Appwrite; repo definition currently tracks ${JSON.stringify(definition.permissions)}`);
  }
}

async function ensureBucket(definition: BucketDefinition, apply: boolean, summary: ReturnType<typeof createSummary>) {
  let exists = true;
  try {
    await appwriteRequest(`/storage/buckets/${definition.id}`);
  } catch {
    exists = false;
  }

  if (exists) {
    summary.skipped.push(`bucket:${definition.id}`);
    return;
  }

  if (!apply) {
    summary.created.push(`bucket:${definition.id} (dry-run)`);
    return;
  }

  await appwriteRequest(`/storage/buckets`, {
    method: "POST",
    body: JSON.stringify({
      bucketId: definition.id,
      name: definition.name || definition.id,
      permissions: definition.permissions || [],
      fileSecurity: definition.fileSecurity ?? true,
      enabled: definition.enabled ?? true,
      maximumFileSize: definition.maximumFileSize,
      allowedFileExtensions: definition.allowedFileExtensions,
      compression: definition.compression,
      encryption: definition.encryption,
      antivirus: definition.antivirus,
    }),
  });
  summary.created.push(`bucket:${definition.id}`);
}

try {
  requireEnv(["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "APPWRITE_DATABASE_ID"]);

  const apply = isApplyMode();
  const allowDestructive = isDestructiveMode();
  const summary = createSummary();
  const config = readConfig();
  const databaseId = process.env.APPWRITE_DATABASE_ID || config.database?.id || "";

  if (!apply) {
    summary.skipped.push("Dry-run only. Pass --apply to mutate live Appwrite.");
  }

  if (!allowDestructive) {
    summary.skipped.push("Destructive operations disabled. Pass --allow-destructive to opt in.");
  }

  await ensureDatabase(databaseId, config.database?.name || databaseId, apply, summary);

  for (const filePath of listJsonFiles("appwrite/collections")) {
    await ensureCollection(databaseId, readJson<CollectionDefinition>(filePath), apply, summary);
  }

  for (const filePath of listJsonFiles("appwrite/buckets")) {
    await ensureBucket(readJson<BucketDefinition>(filePath), apply, summary);
  }

  if (!listJsonFiles("appwrite/buckets").length && (config.buckets || []).length) {
    for (const bucketId of config.buckets || []) {
      summary.manualActionRequired.push(`bucket:${bucketId} is declared in appwrite.config.json but has no repo bucket definition file.`);
    }
  }

  printSummary(summary);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
