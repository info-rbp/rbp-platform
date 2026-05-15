import fs from "node:fs";
import path from "node:path";

export const repoRoot = process.cwd();
export const appwriteRoot = path.join(repoRoot, "appwrite");

export function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function readJsonIfExists<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  return readJson<T>(filePath);
}

export function listJsonFiles(relativeDir: string) {
  const dir = path.join(repoRoot, relativeDir);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => path.join(dir, name));
}

export function listFunctionDirectories() {
  const dir = path.join(appwriteRoot, "functions");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => path.join(dir, entry.name));
}

export function requireEnv(keys: string[]) {
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

export function logSection(title: string) {
  console.log(`\n## ${title}`);
}

export function parseFlag(flag: string) {
  return process.argv.includes(flag);
}
