import fs from "node:fs";
import path from "node:path";
import { Client, Databases, Functions, ID, Query, Storage, Users } from "node-appwrite";

export const repoRoot = process.cwd();
export const appwriteRoot = path.join(repoRoot, "appwrite");
export const configPath = path.join(appwriteRoot, "appwrite.config.json");

export type AppwriteConfig = {
  project: string;
  defaultEnvironment?: string;
  database?: { id: string; name?: string };
  buckets?: string[];
  functions?: string[];
};

export type SummaryKey =
  | "created"
  | "updated"
  | "skipped"
  | "drift"
  | "failed"
  | "manualActionRequired";

export type Summary = Record<SummaryKey, string[]>;

export function createSummary(): Summary {
  return {
    created: [],
    updated: [],
    skipped: [],
    drift: [],
    failed: [],
    manualActionRequired: [],
  };
}

export function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function readJsonIfExists<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  return readJson<T>(filePath);
}

export function readConfig() {
  return readJson<AppwriteConfig>(configPath);
}

export function listJsonFiles(relativeDir: string) {
  const dir = path.join(repoRoot, relativeDir);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort((left, right) => left.localeCompare(right))
    .map((name) => path.join(dir, name));
}

export function listFunctionDirectories() {
  const dir = path.join(appwriteRoot, "functions");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => path.join(dir, entry.name))
    .sort((left, right) => left.localeCompare(right));
}

export function requireEnv(keys: string[]) {
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

export function getRequiredEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function logSection(title: string) {
  console.log(`\n## ${title}`);
}

export function parseFlag(flag: string) {
  return process.argv.includes(flag);
}

export function parseOption(name: string) {
  const index = process.argv.findIndex((value) => value === name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

export function isApplyMode() {
  return parseFlag("--apply");
}

export function isDestructiveMode() {
  return parseFlag("--allow-destructive");
}

export function ensureQaGuard() {
  if (process.env.APPWRITE_ENVIRONMENT === "qa") {
    return;
  }

  if (parseFlag("--allow-non-qa")) {
    return;
  }

  throw new Error("This command is restricted to QA. Set APPWRITE_ENVIRONMENT=qa or pass --allow-non-qa.");
}

export function createAdminClient() {
  requireEnv(["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY"]);

  return new Client()
    .setEndpoint(getRequiredEnv("APPWRITE_ENDPOINT"))
    .setProject(getRequiredEnv("APPWRITE_PROJECT_ID"))
    .setKey(getRequiredEnv("APPWRITE_API_KEY"));
}

export function createAdminServices() {
  const client = createAdminClient();
  const config = readConfig();

  return {
    client,
    config,
    databases: new Databases(client),
    functions: new Functions(client),
    storage: new Storage(client),
    users: new Users(client),
    databaseId: process.env.APPWRITE_DATABASE_ID || config.database?.id || "",
    storageBucketId: process.env.APPWRITE_STORAGE_BUCKET_ID || config.buckets?.[0] || "",
  };
}

export async function collectPaginatedItems<TItem>(
  fetchPage: (limit: number, offset: number) => Promise<Record<string, unknown>>,
  itemsKey: string,
  pageSize = 25,
) {
  const items: TItem[] = [];
  let offset = 0;
  let total: number | null = null;

  while (true) {
    const page = await fetchPage(pageSize, offset);
    const pageItems = Array.isArray(page[itemsKey]) ? (page[itemsKey] as TItem[]) : [];
    const pageTotal = typeof page.total === "number" ? page.total : null;

    if (pageTotal !== null) {
      total = pageTotal;
    }

    items.push(...pageItems);

    if (pageItems.length === 0) {
      break;
    }

    offset += pageItems.length;

    if (total !== null && offset >= total) {
      break;
    }

    if (pageItems.length < pageSize) {
      break;
    }
  }

  return items;
}

export async function listExistingDocuments(
  databases: Databases,
  databaseId: string,
  collectionId: string,
  field: string,
  value: string,
) {
  return databases.listDocuments(databaseId, collectionId, [Query.equal(field, [value]), Query.limit(1)]);
}

export async function upsertByField(
  databases: Databases,
  databaseId: string,
  collectionId: string,
  field: string,
  value: string,
  data: Record<string, unknown>,
) {
  const existing = await listExistingDocuments(databases, databaseId, collectionId, field, value);
  const document = existing.documents?.[0];

  if (document?.$id) {
    return {
      operation: "updated" as const,
      document: await databases.updateDocument(databaseId, collectionId, document.$id, data),
    };
  }

  return {
    operation: "created" as const,
    document: await databases.createDocument(databaseId, collectionId, ID.unique(), data),
  };
}

export function printSummary(summary: Summary) {
  logSection("Summary");
  console.log(JSON.stringify({
    created: summary.created,
    updated: summary.updated,
    skipped: summary.skipped,
    drift: summary.drift,
    failed: summary.failed,
    manual_action_required: summary.manualActionRequired,
  }, null, 2));
}
