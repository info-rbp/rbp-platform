import path from "node:path";
import { listFunctionDirectories, parseFlag, requireEnv } from "./_lib";

const apply = parseFlag("--apply");

try {
  requireEnv(["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY"]);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

console.log(
  apply
    ? "Foundation scaffold only: emitting planned Appwrite Function deploy steps. Full live deployment automation is still required in a follow-up implementation PR."
    : "Foundation scaffold only: dry run planning output. Pass --apply to emit the same planned steps, but this script does not yet perform live Function deployment."
);
for (const dir of listFunctionDirectories()) {
  console.log(`${apply ? "plan-deploy" : "plan"}: ${path.basename(dir)}`);
}