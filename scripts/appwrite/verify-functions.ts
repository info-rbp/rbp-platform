import { Functions, Query } from "node-appwrite";
import { createAdminClient, printSummary, readConfig, requireEnv } from "./_lib";

try {
  requireEnv(["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY"]);

  const config = readConfig();
  const expected = config.functions || [];
  const functions = new Functions(createAdminClient());
  const liveFunctions = await functions.list([Query.limit(100)]);
  const live = liveFunctions.functions.map((fn) => fn.$id).sort((left, right) => left.localeCompare(right));
  const liveSet = new Set(live);
  const missing = expected.filter((functionId) => !liveSet.has(functionId));
  const unexpected = live.filter((functionId) => !expected.includes(functionId));

  console.log(JSON.stringify({
    expected,
    live,
    missing,
    unexpected,
  }, null, 2));

  if (missing.length) {
    process.exit(1);
  }

  const summary = {
    created: [],
    updated: [],
    skipped: expected.map((functionId) => `function:${functionId}`),
    drift: unexpected.map((functionId) => `function:${functionId}`),
    failed: [],
    manualActionRequired: [],
  };
  printSummary(summary);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
