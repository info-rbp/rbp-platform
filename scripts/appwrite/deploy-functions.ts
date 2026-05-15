import path from "node:path";
import { listFunctionDirectories, parseFlag, requireEnv } from "./_lib";

const apply = parseFlag("--apply");

try {
  requireEnv(["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY"]);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

console.log(apply ? "Applying Appwrite function deployment." : "Dry run only. Pass --apply to deploy functions.");
for (const dir of listFunctionDirectories()) {
  console.log(`${apply ? "deploy" : "plan"}: ${path.basename(dir)}`);
}
