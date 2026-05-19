import { Query } from "node-appwrite";
import { collectPaginatedItems, createAdminServices, readConfig, requireEnv } from "./_lib";

type LiveFunction = {
  $id: string;
  name?: string;
  enabled?: boolean;
  status?: string;
  execute?: string[];
};

type LiveDeployment = {
  $id: string;
  $createdAt?: string;
  status?: string;
  activate?: boolean;
};

type FunctionVerificationEntry = {
  id: string;
  name: string;
  enabled: boolean;
  status: string;
  latestDeploymentId: string | null;
  latestDeploymentCreatedAt: string | null;
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

async function getLatestDeployment(functions: ReturnType<typeof createAdminServices>["functions"], functionId: string) {
  const deployments = await functions.listDeployments(functionId, [Query.limit(1), Query.orderDesc("$createdAt")]) as unknown as {
    deployments?: LiveDeployment[];
  };
  return deployments.deployments?.[0] || null;
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
  const liveIds = liveFunctions.map((fn) => fn.$id).sort((left, right) => left.localeCompare(right));
  const byId = new Map(liveFunctions.map((fn) => [fn.$id, fn]));
  const report = {
    expected: expectedFunctions,
    live: liveIds,
    found: [] as FunctionVerificationEntry[],
    missing: [] as string[],
    unexpected: liveIds.filter((functionId) => !expectedFunctions.includes(functionId)),
    failed: [] as string[],
    manualVerificationRequired: [] as string[],
  };

  for (const functionId of expectedFunctions) {
    const live = byId.get(functionId);
    if (!live) {
      report.missing.push(functionId);
      continue;
    }

    const latestDeployment = await getLatestDeployment(functions, functionId);
    report.found.push({
      id: live.$id,
      name: live.name || live.$id,
      enabled: live.enabled !== false,
      status: live.status || "unknown",
      latestDeploymentId: latestDeployment?.$id || null,
      latestDeploymentCreatedAt: latestDeployment?.$createdAt || null,
    });

    if (!hasCallableState(live)) {
      report.failed.push(`${functionId}: function is disabled or failed`);
      continue;
    }

    if (!latestDeployment) {
      report.failed.push(`${functionId}: no deployment found`);
      continue;
    }

    if (latestDeployment.status !== "ready") {
      report.failed.push(`${functionId}: latest deployment status is ${latestDeployment.status || "unknown"}`);
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
