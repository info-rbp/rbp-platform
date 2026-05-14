import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";

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

const targets = [
  ...(await listFiles(new URL("../src/", import.meta.url), [".ts"])),
  ...(await listFiles(new URL("./", import.meta.url), [".mjs"]))
];

for (const target of targets) {
  const args = target.pathname.endsWith(".ts")
    ? ["--check", "--experimental-strip-types", target.pathname]
    : ["--check", target.pathname];
  const result = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(`Checked ${targets.length} files.`);
