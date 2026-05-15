import path from "node:path";
import { appwriteRoot, listFunctionDirectories, listJsonFiles, logSection, readJson } from "./_lib";

const config = readJson<Record<string, unknown>>(path.join(appwriteRoot, "appwrite.config.json"));

logSection("Repository baseline");
console.log(`Project: ${config.project}`);
console.log(`Database definition: ${path.join("appwrite", "databases", "rbp-platform.json")}`);
console.log(`Collection definitions: ${listJsonFiles("appwrite/collections").length}`);
console.log(`Bucket definitions: ${listJsonFiles("appwrite/buckets").length}`);
console.log(`Function directories: ${listFunctionDirectories().length}`);

logSection("Environment");
console.log(`APPWRITE_ENDPOINT=${process.env.APPWRITE_ENDPOINT ? "set" : "missing"}`);
console.log(`APPWRITE_PROJECT_ID=${process.env.APPWRITE_PROJECT_ID ? "set" : "missing"}`);
console.log(`APPWRITE_DATABASE_ID=${process.env.APPWRITE_DATABASE_ID ? "set" : "missing"}`);
console.log(`APPWRITE_STORAGE_BUCKET_ID=${process.env.APPWRITE_STORAGE_BUCKET_ID ? "set" : "missing"}`);
console.log(`APPWRITE_API_KEY=${process.env.APPWRITE_API_KEY ? "set" : "missing"}`);
