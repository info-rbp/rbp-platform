import { stripTypeScriptTypes } from "node:module";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

const srcDir = new URL("../src/", import.meta.url);
const distDir = new URL("../dist/", import.meta.url);

async function listTypeScriptFiles(dirUrl) {
  const entries = await readdir(dirUrl, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, dirUrl);
    if (entry.isDirectory()) {
      files.push(...(await listTypeScriptFiles(child)));
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      files.push(child);
    }
  }
  return files;
}

await rm(distDir, { recursive: true, force: true });
const files = await listTypeScriptFiles(srcDir);

for (const fileUrl of files) {
  const source = await readFile(fileUrl, "utf8");
  const transformed = stripTypeScriptTypes(source, { mode: "transform", sourceUrl: fileUrl.href }).replace(
    /\.ts(["'])/g,
    ".js$1"
  );
  const relativePath = relative(srcDir.pathname, fileUrl.pathname).replace(/\.ts$/, ".js");
  const outputPath = join(distDir.pathname, relativePath);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, transformed, "utf8");
}

console.log(`Built ${files.length} files into dist/`);
