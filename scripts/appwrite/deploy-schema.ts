import { listJsonFiles, parseFlag, requireEnv } from "./_lib";

const apply = parseFlag("--apply");

try {
  requireEnv(["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "APPWRITE_DATABASE_ID"]);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

console.log(
  apply
    ? "Foundation scaffold only: emitting planned Appwrite schema apply steps. Full live deployment automation is still required in a follow-up implementation PR."
    : "Foundation scaffold only: dry run planning output. Pass --apply to emit the same planned steps, but this script does not yet perform live schema mutations."
);
for (const filePath of listJsonFiles("appwrite/collections")) {
  console.log(`${apply ? "plan-apply" : "plan"}: ${filePath}`);
}