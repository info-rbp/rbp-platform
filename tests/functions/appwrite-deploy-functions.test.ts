import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  buildFunctionManifest,
  runDeployFunctions,
  type AppwriteFunctionsApi,
  type FunctionManifestEntry,
} from "../../scripts/appwrite/deploy-functions";

function createFixture(functionIds: string[], directories = functionIds) {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "rbp-functions-deploy-test-"));
  const functionsRoot = path.join(rootDir, "appwrite", "functions");
  fs.mkdirSync(functionsRoot, { recursive: true });
  fs.writeFileSync(
    path.join(rootDir, "appwrite", "appwrite.config.json"),
    `${JSON.stringify({ functions: functionIds }, null, 2)}\n`,
  );

  for (const functionId of directories) {
    const functionDir = path.join(functionsRoot, functionId);
    fs.mkdirSync(functionDir, { recursive: true });
    fs.writeFileSync(
      path.join(functionDir, "index.ts"),
      `export default async function main() { return "${functionId}"; }\n`,
    );
  }

  return {
    rootDir,
    cleanup: () => fs.rmSync(rootDir, { recursive: true, force: true }),
  };
}

const fakeEnv = {
  APPWRITE_ENDPOINT: "https://cloud.appwrite.io/v1",
  APPWRITE_PROJECT_ID: "project",
  APPWRITE_API_KEY: "key",
  APPWRITE_DATABASE_ID: "rbp_platform",
};

test("generates a deployment manifest from configured function ids", async () => {
  const fixture = createFixture(["alpha-function", "beta-function"]);
  try {
    const result = await runDeployFunctions({
      apply: false,
      rootDir: fixture.rootDir,
      env: fakeEnv,
      now: () => new Date("2026-05-16T00:00:00.000Z"),
    });

    assert.equal(result.manifest.generatedAt, "2026-05-16T00:00:00.000Z");
    assert.deepEqual(result.manifest.functions.map((entry) => entry.id), ["alpha-function", "beta-function"]);
    assert.equal(result.manifest.functions[0].entrypoint, "index.js");
    assert.equal(result.manifest.functions[0].sourceEntry, "appwrite/functions/alpha-function/index.ts");
    assert.deepEqual(result.summary.skipped, [
      "Dry-run only. Pass --apply to create/update live Appwrite Functions and deployments.",
    ]);

    const written = JSON.parse(fs.readFileSync(result.manifestPath, "utf8"));
    assert.deepEqual(written, result.manifest);
  } finally {
    fixture.cleanup();
  }
});

test("fails when a configured function directory is missing", () => {
  const fixture = createFixture(["alpha-function", "missing-function"], ["alpha-function"]);
  try {
    assert.throws(
      () => buildFunctionManifest(fixture.rootDir),
      /Missing function directory: appwrite\/functions\/missing-function/,
    );
  } finally {
    fixture.cleanup();
  }
});

test("--apply creates missing functions, updates existing functions, and deploys archives", async () => {
  const fixture = createFixture(["existing-function", "new-function"]);
  const calls: Array<{ method: string; args: unknown[] }> = [];
  const existing = new Set(["existing-function"]);
  const archives: string[] = [];
  const variables = new Map<string, Array<{ $id: string; key: string }>>([
    ["existing-function", [{ $id: "var_endpoint", key: "APPWRITE_ENDPOINT" }]],
    ["new-function", []],
  ]);

  const functionsApi: AppwriteFunctionsApi = {
    async get(functionId: string) {
      calls.push({ method: "get", args: [functionId] });
      if (!existing.has(functionId)) {
        throw Object.assign(new Error("Function not found"), { code: 404 });
      }
      return { $id: functionId } as never;
    },
    async create(...args: Parameters<AppwriteFunctionsApi["create"]>) {
      calls.push({ method: "create", args });
      return { $id: args[0] } as never;
    },
    async update(...args: Parameters<AppwriteFunctionsApi["update"]>) {
      calls.push({ method: "update", args });
      return { $id: args[0] } as never;
    },
    async createDeployment(...args: Parameters<AppwriteFunctionsApi["createDeployment"]>) {
      calls.push({ method: "createDeployment", args });
      return { $id: `${args[0]}-deployment` } as never;
    },
    async listVariables(functionId: string) {
      calls.push({ method: "listVariables", args: [functionId] });
      return { variables: variables.get(functionId) || [] } as never;
    },
    async createVariable(...args: Parameters<NonNullable<AppwriteFunctionsApi["createVariable"]>>) {
      calls.push({ method: "createVariable", args });
      return { $id: `${args[0]}-${args[1]}`, key: args[1] } as never;
    },
    async updateVariable(...args: Parameters<NonNullable<AppwriteFunctionsApi["updateVariable"]>>) {
      calls.push({ method: "updateVariable", args });
      return { $id: args[1], key: args[2] } as never;
    },
  };

  async function archiveFunctionSource(entry: FunctionManifestEntry) {
    const archivePath = path.join(fixture.rootDir, `${entry.id}.tar.gz`);
    fs.writeFileSync(archivePath, "archive");
    archives.push(entry.id);
    return {
      archivePath,
      cleanup: () => fs.rmSync(archivePath, { force: true }),
    };
  }

  try {
    const result = await runDeployFunctions({
      apply: true,
      rootDir: fixture.rootDir,
      env: fakeEnv,
      functionsApi,
      archiveFunctionSource,
      now: () => new Date("2026-05-16T00:00:00.000Z"),
    });

    assert.deepEqual(calls.filter((call) => call.method === "update").map((call) => call.args[0]), ["existing-function"]);
    assert.deepEqual(calls.filter((call) => call.method === "create").map((call) => call.args[0]), ["new-function"]);
    assert.deepEqual(calls.filter((call) => call.method === "createDeployment").map((call) => call.args[0]), [
      "existing-function",
      "new-function",
    ]);
    assert.deepEqual(calls.filter((call) => call.method === "listVariables").map((call) => call.args[0]), [
      "existing-function",
      "new-function",
    ]);
    assert.deepEqual(calls.filter((call) => call.method === "updateVariable").map((call) => call.args.slice(0, 3)), [
      ["existing-function", "var_endpoint", "APPWRITE_ENDPOINT"],
    ]);
    assert.ok(calls.some((call) => call.method === "createVariable" && call.args[0] === "new-function" && call.args[1] === "APPWRITE_DATABASE_ID"));
    assert.deepEqual(archives, ["existing-function", "new-function"]);
    assert.ok(result.summary.updated.includes("function:existing-function"));
    assert.ok(result.summary.created.includes("function:new-function"));
    assert.ok(result.summary.updated.includes("deployment:existing-function"));
    assert.ok(result.summary.updated.includes("deployment:new-function"));
    assert.ok(result.summary.updated.includes("variable:existing-function:APPWRITE_ENDPOINT"));
    assert.ok(result.summary.created.includes("variable:new-function:APPWRITE_DATABASE_ID"));
    assert.equal(fs.existsSync(path.join(fixture.rootDir, "existing-function.tar.gz")), false);
    assert.equal(fs.existsSync(path.join(fixture.rootDir, "new-function.tar.gz")), false);
  } finally {
    fixture.cleanup();
  }
});
