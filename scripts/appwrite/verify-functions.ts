import { Query } from "node-appwrite";
import { collectPaginatedItems, createAdminServices, readConfig, requireEnv } from "./_lib";

type LiveFunction = {
  $id: string;
  name?: string;
  enabled?: boolean;
  status?: string;
  latestDeploymentId?: string;
  latestDeploymentCreatedAt?: string;
  execute?: string[];
};

const safeDryCallFunctions = new Set([
  "list-my-entitlements",
]);

function listFunctions(functions: ReturnType<typeof createAdminServices>["functions"]) {
  return collectPaginatedItems<LiveFunction>(
    (limit, offset) => functions.list([Query.limit(limit), Query.offset(offset)]) as Promise<Record<string, unknown>>,
    "functions",
    25,
  );
}

function hasCallableState(fn: LiveFunction) {
  if (fn.enabled === false) {
    return false;
  }

  if (typeof fn.status === "string" && ["disabled", "failed"].includes(fn.status.toLowerCase())) {
    return false;
  }

  return true;
}

try {
  requireEnv(["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY"]);

  const config = readConfig();
  const expectedFunctions = config.functions || [];
  const { functions } = createAdminServices();
  const liveFunctions = await listFunctions(functions);
  const byId = new Map(liveFunctions.map((fn) => [fn.$id, fn]));
  const report = {
    expected: expectedFunctions.length,
    live: liveFunctions.length,
    found: [] as Array<Record<string, unknown>>,
    missing: [] as string[],
    failed: [] as string[],
    manualVerificationRequired: [] as string[],
  };

  for (const functionId of expectedFunctions) {
    const live = byId.get(functionId);
    if (!live) {
      report.missing.push(functionId);
      continue;
    }

    const entry = {
      id: live.$id,
      name: live.name || live.$id,
      enabled: live.enabled !== false,
      status: live.status || "unknown",
      latestDeploymentId: live.latestDeploymentId || null,
      latestDeploymentCreatedAt: live.latestDeploymentCreatedAt || null,
    };
    report.found.push(entry);

    if (!hasCallableState(live)) {
      report.failed.push(`${functionId}: function is disabled or failed`);
      continue;
    }

    if (!live.latestDeploymentId && !live.latestDeploymentCreatedAt) {
      report.manualVerificationRequired.push(`${functionId}: no deployment metadata exposed; confirm Git integration deployment in Appwrite.`);
      continue;
    }

    if (safeDryCallFunctions.has(functionId)) {
      report.manualVerificationRequired.push(`${functionId}: metadata verified; safe execution requires a QA user context and is covered by smoke --execute.`);
    } else {
      report.manualVerificationRequired.push(`${functionId}: metadata verified; payload/secret-bearing execution is covered by targeted smoke checks or manual QA.`);
    }
  }

  console.log(JSON.stringify({ report }, null, 2));

  if (report.missing.length || report.failed.length) {
    process.exit(1);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
