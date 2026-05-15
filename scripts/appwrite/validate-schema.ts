import fs from "node:fs";
import path from "node:path";
import { appwriteRoot, listJsonFiles, logSection, readJson } from "./_lib";

const configPath = path.join(appwriteRoot, "appwrite.config.json");
if (!fs.existsSync(configPath)) {
  console.error("Missing appwrite/appwrite.config.json");
  process.exit(1);
}

const config = readJson<{ database?: { id?: string; name?: string } }>(configPath);
if (!config.database?.id) {
  console.error("Appwrite config must define a database id.");
  process.exit(1);
}

if (!config.database?.name) {
  console.error("Appwrite config must define a database name.");
  process.exit(1);
}

const collectionFiles = listJsonFiles("appwrite/collections");
if (!collectionFiles.length) {
  console.error("No Appwrite collection JSON files found.");
  process.exit(1);
}

let foundProvisioningCollection = false;

for (const filePath of collectionFiles) {
  const data = readJson<{ id?: string; name?: string; attributes?: unknown[]; permissions?: unknown }>(filePath);
  if (!data.id) {
    console.error(`Collection file missing id: ${filePath}`);
    process.exit(1);
  }
  if (!data.name) {
    console.error(`Collection file missing name: ${filePath}`);
    process.exit(1);
  }
  if (!Array.isArray(data.attributes)) {
    console.error(`Collection file missing attributes array: ${filePath}`);
    process.exit(1);
  }
  if (!data.permissions) {
    console.error(`Collection file missing permissions: ${filePath}`);
    process.exit(1);
  }
  if (data.id === "application_provisioning_requests") {
    foundProvisioningCollection = true;
  }
}

if (!foundProvisioningCollection) {
  console.error("Missing application_provisioning_requests collection definition.");
  process.exit(1);
}

logSection("Schema validation");
console.log(`Validated ${collectionFiles.length} collection definitions.`);