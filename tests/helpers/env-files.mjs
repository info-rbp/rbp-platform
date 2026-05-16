import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

export function readRepoFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

export function parseEnvExample(relativePath) {
  const values = {};
  const raw = readRepoFile(relativePath);

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    values[key] = value;
  }

  return values;
}

export function readJson(relativePath) {
  return JSON.parse(readRepoFile(relativePath));
}

export function listJson(relativeDir) {
  return fs.readdirSync(path.join(repoRoot, relativeDir))
    .filter((name) => name.endsWith(".json"))
    .map((name) => path.join(relativeDir, name));
}