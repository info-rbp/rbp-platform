import { spawnSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";

async function listFiles(dirUrl, suffixes) {
  const entries = await readdir(dirUrl, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, dirUrl);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(child, suffixes)));
    } else if (entry.isFile() && suffixes.some((suffix) => entry.name.endsWith(suffix))) {
      files.push(child);
    }
  }
  return files;
}

const typeScriptTargets = await listFiles(new URL("../src/", import.meta.url), [".ts"]);
const scriptTargets = await listFiles(new URL("./", import.meta.url), [".mjs"]);

for (const target of typeScriptTargets) {
  const source = await readFile(target, "utf8");
  stripTypeScriptTypes(source, { mode: "transform", sourceUrl: target.href });
}

for (const target of scriptTargets) {
  const result = spawnSync(process.execPath, ["--check", target.pathname], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(`Checked ${typeScriptTargets.length + scriptTargets.length} files.`);
