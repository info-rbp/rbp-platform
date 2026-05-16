import path from "node:path";
import { ID, Query } from "node-appwrite";
import { createAdminServices, createSummary, ensureQaGuard, isApplyMode, printSummary, readJson, upsertByField } from "./_lib";

const apply = isApplyMode();
const summary = createSummary();

function readSeedFile<T>(name: string) {
  return readJson<T>(path.join(process.cwd(), "appwrite", "seeds", "qa", `${name}.json`));
}

async function upsertSeedRecords(
  collectionId: string,
  field: string,
  rows: Array<Record<string, unknown>>,
  databaseId: string,
  dryRun: boolean,
) {
  const { databases } = createAdminServices();

  for (const row of rows) {
    const fingerprint = String(row[field] ?? row.email ?? row.reference_id ?? row.plan_code ?? row.application_key ?? "");
    if (!fingerprint) {
      summary.failed.push(`${collectionId}:missing-key`);
      continue;
    }

    if (dryRun) {
      summary.created.push(`${collectionId}:${fingerprint} (dry-run)`);
      continue;
    }

    const result = await upsertByField(databases, databaseId, collectionId, field, fingerprint, row);
    summary[result.operation].push(`${collectionId}:${fingerprint}`);
  }
}

async function upsertSeedRecordsByFields(
  collectionId: string,
  fields: string[],
  rows: Array<Record<string, unknown>>,
  databaseId: string,
  dryRun: boolean,
) {
  const { databases } = createAdminServices();

  for (const row of rows) {
    const fingerprint = fields.map((field) => String(row[field] ?? "")).join(":");
    if (!fields.every((field) => row[field] !== undefined && row[field] !== null && String(row[field]) !== "")) {
      summary.failed.push(`${collectionId}:missing-composite-key`);
      continue;
    }

    if (dryRun) {
      summary.created.push(`${collectionId}:${fingerprint} (dry-run)`);
      continue;
    }

    const existing = await databases.listDocuments(
      databaseId,
      collectionId,
      fields.map((field) => Query.equal(field, [String(row[field])])),
    );
    const document = existing.documents?.[0];

    if (document?.$id) {
      await databases.updateDocument(databaseId, collectionId, document.$id, row);
      summary.updated.push(`${collectionId}:${fingerprint}`);
    } else {
      await databases.createDocument(databaseId, collectionId, ID.unique(), row);
      summary.created.push(`${collectionId}:${fingerprint}`);
    }
  }
}

function acknowledgeConfigSeed(name: string) {
  readSeedFile<unknown>(name);
  summary.skipped.push(`${name}:config-only`);
}

try {
  ensureQaGuard();

  const { databaseId } = createAdminServices();

  await upsertSeedRecords("membership_plans", "plan_code", readSeedFile<Array<Record<string, unknown>>>("membership_plans"), databaseId, !apply);
  await upsertSeedRecords("entitlements", "entitlement_key", readSeedFile<Array<Record<string, unknown>>>("entitlements"), databaseId, !apply);
  await upsertSeedRecordsByFields("plan_entitlements", ["plan_code", "entitlement_key"], readSeedFile<Array<Record<string, unknown>>>("plan_entitlements"), databaseId, !apply);
  await upsertSeedRecords("tenants", "tenant_name", readSeedFile<Array<Record<string, unknown>>>("tenants"), databaseId, !apply);
  await upsertSeedRecords("applications", "application_key", readSeedFile<Array<Record<string, unknown>>>("applications"), databaseId, !apply);
  await upsertSeedRecords("application_interest", "application_id", readSeedFile<Array<Record<string, unknown>>>("application_interest"), databaseId, !apply);
  await upsertSeedRecords("notifications", "title", readSeedFile<Array<Record<string, unknown>>>("notifications"), databaseId, !apply);
  await upsertSeedRecords("service_requests", "reference_id", readSeedFile<Array<Record<string, unknown>>>("service_requests"), databaseId, !apply);
  acknowledgeConfigSeed("pricing_rules");
  acknowledgeConfigSeed("document_nucleus_rules");
  acknowledgeConfigSeed("support_rules");

  const users = readSeedFile<Array<Record<string, unknown>>>("users");
  for (const user of users) {
    const email = String(user.email || "");
    if (!email) {
      summary.failed.push("users:missing-email");
      continue;
    }

    if (!apply) {
      summary.created.push(`users:${email} (dry-run)`);
      continue;
    }

    try {
      const { users: appwriteUsers } = createAdminServices();
      const existing = await appwriteUsers.list([`email=${email}`] as never[]);
      if (existing.total > 0) {
        summary.skipped.push(`users:${email}`);
      } else {
        summary.manualActionRequired.push(`users:${email} must be created manually or by a dedicated user-provisioning script because list/create user compatibility varies across Appwrite plans.`);
      }
    } catch (error) {
      summary.manualActionRequired.push(`users:${email} user lookup failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  printSummary(summary);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
