import fs from "node:fs";
import path from "node:path";
import { listFunctionDirectories } from "./_lib";

const functionDirs = listFunctionDirectories();
if (!functionDirs.length) {
  console.error("No Appwrite function directories found.");
  process.exit(1);
}

for (const dir of functionDirs) {
  const entry = path.join(dir, "index.ts");
  if (!fs.existsSync(entry)) {
    console.error(`Missing function entrypoint: ${entry}`);
    process.exit(1);
  }
}

console.log(`Validated ${functionDirs.length} Appwrite function directories.`);
