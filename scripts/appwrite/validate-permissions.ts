import { listJsonFiles, readJson } from "./_lib";

for (const filePath of listJsonFiles("appwrite/collections")) {
  const data = readJson<{ id?: string; permissions?: Record<string, string[]> }>(filePath);
  const createRules = data.permissions?.create ?? [];
  const updateRules = data.permissions?.update ?? [];
  const deleteRules = data.permissions?.delete ?? [];
  const unsafe = [...createRules, ...updateRules, ...deleteRules].filter((value) => value === "role:all" || value === "any");

  if (unsafe.length) {
    console.error(`Unsafe broad write permission found in ${data.id ?? filePath}: ${unsafe.join(", ")}`);
    process.exit(1);
  }
}

console.log("Collection permission definitions passed the broad-write safety check.");
