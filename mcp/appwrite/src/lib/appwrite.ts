import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadDotEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadDotEnv();

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function requiredAny(...names: string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  throw new Error(`Missing required environment variable: one of ${names.join(", ")}`);
}

function buildUrl(path: string, search?: URLSearchParams) {
  const base = required("APPWRITE_ENDPOINT").replace(/\/+$/, "");
  const url = new URL(`${base}${path}`);
  if (search) url.search = search.toString();
  return url.toString();
}

async function request(method: string, path: string, body?: unknown, search?: URLSearchParams) {
  const response = await fetch(buildUrl(path, search), {
    method,
    headers: {
      "content-type": "application/json",
      "x-appwrite-project": required("APPWRITE_PROJECT_ID"),
      "x-appwrite-key": required("APPWRITE_API_KEY")
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message?: unknown }).message)
        : typeof payload === "string"
          ? payload
          : `Appwrite request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

function withQueries(values: string[] = []) {
  const search = new URLSearchParams();
  for (const value of values) search.append("queries[]", value);
  return search;
}

export const config = {
  port: Number(process.env.PORT ?? "8787"),
  mcpAuthToken: required("MCP_AUTH_TOKEN"),
  endpoint: required("APPWRITE_ENDPOINT"),
  projectId: requiredAny("APPWRITE_PROJECT_ID", "APPWRITE_FUNCTION_PROJECT_ID"),
  apiKey: requiredAny("APPWRITE_API_KEY", "APPWRITE_FUNCTION_API_KEY"),
  databaseId: process.env.APPWRITE_DATABASE_ID ?? "rbp_platform",
  collections: {
    products: process.env.APPWRITE_PRODUCTS_COLLECTION_ID ?? "products",
    productPrices: process.env.APPWRITE_PRODUCT_PRICES_COLLECTION_ID ?? "product_prices",
    serviceRequests: process.env.APPWRITE_SERVICE_REQUESTS_COLLECTION_ID ?? "service_requests",
    applicationInterests: process.env.APPWRITE_APPLICATION_INTERESTS_COLLECTION_ID ?? "application_interests",
    subscriptions: process.env.APPWRITE_SUBSCRIPTIONS_COLLECTION_ID ?? "subscriptions",
    paymentEvents: process.env.APPWRITE_PAYMENT_EVENTS_COLLECTION_ID ?? "payment_events",
    entitlements: process.env.APPWRITE_ENTITLEMENTS_COLLECTION_ID ?? "entitlements",
    notifications: process.env.APPWRITE_NOTIFICATIONS_COLLECTION_ID ?? "notifications",
    auditLogs: process.env.APPWRITE_AUDIT_LOGS_COLLECTION_ID ?? "mcp_audit_logs"
  }
};

export const databases = {
  list: async () => request("GET", "/databases"),
  create: async (databaseId: string, name: string) => request("POST", "/databases", { databaseId, name }),
  get: async (databaseId: string) => request("GET", `/databases/${encodeURIComponent(databaseId)}`),
  delete: async (databaseId: string) => request("DELETE", `/databases/${encodeURIComponent(databaseId)}`),
  listCollections: async (databaseId: string) =>
    request("GET", `/databases/${encodeURIComponent(databaseId)}/collections`),
  createCollection: async (
    databaseId: string,
    collectionId: string,
    name: string,
    permissions: string[],
    documentSecurity: boolean,
    enabled: boolean
  ) =>
    request("POST", `/databases/${encodeURIComponent(databaseId)}/collections`, {
      collectionId,
      name,
      permissions,
      documentSecurity,
      enabled
    }),
  getCollection: async (databaseId: string, collectionId: string) =>
    request("GET", `/databases/${encodeURIComponent(databaseId)}/collections/${encodeURIComponent(collectionId)}`),
  updateCollection: async (
    databaseId: string,
    collectionId: string,
    name: string,
    permissions: string[],
    documentSecurity: boolean,
    enabled: boolean
  ) =>
    request("PUT", `/databases/${encodeURIComponent(databaseId)}/collections/${encodeURIComponent(collectionId)}`, {
      name,
      permissions,
      documentSecurity,
      enabled
    }),
  deleteCollection: async (databaseId: string, collectionId: string) =>
    request("DELETE", `/databases/${encodeURIComponent(databaseId)}/collections/${encodeURIComponent(collectionId)}`),
  listDocuments: async (databaseId: string, collectionId: string, queries: string[] = []) =>
    request(
      "GET",
      `/databases/${encodeURIComponent(databaseId)}/collections/${encodeURIComponent(collectionId)}/documents`,
      undefined,
      withQueries(queries)
    ),
  getDocument: async (databaseId: string, collectionId: string, documentId: string) =>
    request(
      "GET",
      `/databases/${encodeURIComponent(databaseId)}/collections/${encodeURIComponent(collectionId)}/documents/${encodeURIComponent(documentId)}`
    ),
  createDocument: async (
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: Record<string, unknown>,
    permissions: string[]
  ) =>
    request("POST", `/databases/${encodeURIComponent(databaseId)}/collections/${encodeURIComponent(collectionId)}/documents`, {
      documentId,
      data,
      permissions
    }),
  updateDocument: async (
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: Record<string, unknown>,
    permissions?: string[]
  ) =>
    request(
      "PATCH",
      `/databases/${encodeURIComponent(databaseId)}/collections/${encodeURIComponent(collectionId)}/documents/${encodeURIComponent(documentId)}`,
      { data, permissions }
    ),
  deleteDocument: async (databaseId: string, collectionId: string, documentId: string) =>
    request(
      "DELETE",
      `/databases/${encodeURIComponent(databaseId)}/collections/${encodeURIComponent(collectionId)}/documents/${encodeURIComponent(documentId)}`
    ),
  createStringAttribute: async (
    databaseId: string,
    collectionId: string,
    key: string,
    size: number,
    requiredValue: boolean,
    defaultValue?: string,
    array = false
  ) =>
    request(
      "POST",
      `/databases/${encodeURIComponent(databaseId)}/collections/${encodeURIComponent(collectionId)}/attributes/string`,
      { key, size, required: requiredValue, default: defaultValue, array }
    ),
  createIntegerAttribute: async (
    databaseId: string,
    collectionId: string,
    key: string,
    requiredValue: boolean,
    min?: number,
    max?: number,
    defaultValue?: number,
    array = false
  ) =>
    request(
      "POST",
      `/databases/${encodeURIComponent(databaseId)}/collections/${encodeURIComponent(collectionId)}/attributes/integer`,
      { key, required: requiredValue, min, max, default: defaultValue, array }
    ),
  createIndex: async (
    databaseId: string,
    collectionId: string,
    key: string,
    type: string,
    attributes: string[],
    orders?: string[]
  ) =>
    request("POST", `/databases/${encodeURIComponent(databaseId)}/collections/${encodeURIComponent(collectionId)}/indexes`, {
      key,
      type,
      attributes,
      orders
    }),
  deleteAttribute: async (databaseId: string, collectionId: string, key: string) =>
    request(
      "DELETE",
      `/databases/${encodeURIComponent(databaseId)}/collections/${encodeURIComponent(collectionId)}/attributes/${encodeURIComponent(key)}`
    ),
  deleteIndex: async (databaseId: string, collectionId: string, key: string) =>
    request(
      "DELETE",
      `/databases/${encodeURIComponent(databaseId)}/collections/${encodeURIComponent(collectionId)}/indexes/${encodeURIComponent(key)}`
    )
};

export const storage = {
  listBuckets: async () => request("GET", "/storage/buckets"),
  createBucket: async (
    bucketId: string,
    name: string,
    permissions: string[],
    fileSecurity: boolean,
    enabled: boolean,
    maximumFileSize: number,
    allowedFileExtensions: string[],
    compression: string,
    encryption: boolean,
    antivirus: boolean
  ) =>
    request("POST", "/storage/buckets", {
      bucketId,
      name,
      permissions,
      fileSecurity,
      enabled,
      maximumFileSize,
      allowedFileExtensions,
      compression,
      encryption,
      antivirus
    })
};

export const functions = {
  list: async (queries: string[] = []) => request("GET", "/functions", undefined, withQueries(queries))
};

export const users = {
  list: async (queries: string[] = []) => request("GET", "/users", undefined, withQueries(queries)),
  get: async (userId: string) => request("GET", `/users/${encodeURIComponent(userId)}`)
};

export const teams = {
  create: async (teamId: string, name: string, roles: string[]) =>
    request("POST", "/teams", {
      teamId,
      name,
      roles
    })
};
