import { execFile } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { Client, Functions, Role, Runtime } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { createSummary, parseFlag, printSummary, requireEnv, type Summary } from "./_lib";

const execFileAsync = promisify(execFile);

export const functionRuntime = Runtime.Node22;
export const functionEntrypoint = "index.js";
export const functionBuildCommand = "npm install && npm run build";
export const functionTimeoutSeconds = 30;

type AppwriteConfig = {
  functions?: string[];
};

export type FunctionManifestEntry = {
  id: string;
  name: string;
  runtime: Runtime;
  entrypoint: string;
  commands: string;
  execute: string[];
  timeout: number;
  sourceEntry: string;
  sourceDirectory: string;
};

export type FunctionDeploymentManifest = {
  generatedAt: string;
  functions: FunctionManifestEntry[];
};

export type AppwriteFunctionsApi = Pick<Functions, "get" | "create" | "update" | "createDeployment">;

type ArchiveResult = {
  archivePath: string;
  cleanup?: () => void | Promise<void>;
};

export type DeployFunctionsOptions = {
  apply: boolean;
  rootDir?: string;
  env?: NodeJS.ProcessEnv;
  now?: () => Date;
  functionsApi?: AppwriteFunctionsApi;
  createFunctionsApi?: () => AppwriteFunctionsApi;
  archiveFunctionSource?: (entry: FunctionManifestEntry, rootDir: string) => Promise<ArchiveResult>;
  summary?: Summary;
};

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function toRelative(rootDir: string, targetPath: string) {
  return path.relative(rootDir, targetPath).split(path.sep).join("/");
}

function getFunctionRoot(rootDir: string) {
  return path.join(rootDir, "appwrite", "functions");
}

function readFunctionIds(rootDir: string) {
  const configPath = path.join(rootDir, "appwrite", "appwrite.config.json");
  const config = readJson<AppwriteConfig>(configPath);
  const functionIds = config.functions || [];
  if (!functionIds.length) {
    throw new Error(`No functions configured in ${toRelative(rootDir, configPath)}`);
  }

  return functionIds;
}

function executeAccessForFunction(functionId: string) {
  if (functionId === "stripe-webhook") {
    return [Role.any()];
  }

  return [Role.users()];
}

export function buildFunctionManifest(rootDir = process.cwd(), now: () => Date = () => new Date()): FunctionDeploymentManifest {
  const functionRoot = getFunctionRoot(rootDir);
  const functions = readFunctionIds(rootDir).map((functionId) => {
    const sourceDirectory = path.join(functionRoot, functionId);
    if (!fs.existsSync(sourceDirectory) || !fs.statSync(sourceDirectory).isDirectory()) {
      throw new Error(`Missing function directory: ${toRelative(rootDir, sourceDirectory)}`);
    }

    const sourceEntry = path.join(sourceDirectory, "index.ts");
    if (!fs.existsSync(sourceEntry)) {
      throw new Error(`Missing function entrypoint: ${toRelative(rootDir, sourceEntry)}`);
    }

    return {
      id: functionId,
      name: functionId,
      runtime: functionRuntime,
      entrypoint: functionEntrypoint,
      commands: functionBuildCommand,
      execute: executeAccessForFunction(functionId),
      timeout: functionTimeoutSeconds,
      sourceEntry: toRelative(rootDir, sourceEntry),
      sourceDirectory: toRelative(rootDir, sourceDirectory),
    };
  });

  return {
    generatedAt: now().toISOString(),
    functions,
  };
}

export function writeFunctionManifest(
  manifest: FunctionDeploymentManifest,
  rootDir = process.cwd(),
) {
  const manifestPath = path.join(getFunctionRoot(rootDir), "deployment-manifest.json");
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  return manifestPath;
}

function copyDirectory(source: string, destination: string) {
  fs.mkdirSync(destination, { recursive: true });
  fs.cpSync(source, destination, {
    recursive: true,
    filter: (filePath) => {
      const name = path.basename(filePath);
      return name !== "node_modules" && !name.endsWith(".tar.gz");
    },
  });
}

function readRootDependencies(rootDir: string) {
  const rootPackagePath = path.join(rootDir, "package.json");
  const rootPackage = fs.existsSync(rootPackagePath)
    ? readJson<{ dependencies?: Record<string, string> }>(rootPackagePath)
    : {};

  return {
    "node-appwrite": rootPackage.dependencies?.["node-appwrite"] || "^15.0.1",
    stripe: rootPackage.dependencies?.stripe || "^18.3.0",
  };
}

function writePackageFiles(packageRoot: string, rootDir: string, functionId: string) {
  const packageJson = {
    private: true,
    type: "commonjs",
    scripts: {
      build: "tsc -p tsconfig.json",
    },
    dependencies: readRootDependencies(rootDir),
    devDependencies: {
      "@types/node": "^22.0.0",
      typescript: "^5.8.0",
    },
  };
  const tsconfig = {
    compilerOptions: {
      target: "ES2022",
      module: "CommonJS",
      moduleResolution: "Node",
      esModuleInterop: true,
      skipLibCheck: true,
      strict: false,
      rootDir: ".",
      outDir: "dist",
    },
    include: ["functions/**/*.ts"],
  };
  const wrapper = [
    `"use strict";`,
    `const handlerModule = require("./dist/functions/${functionId}/index.js");`,
    `module.exports = handlerModule.default || handlerModule;`,
    "",
  ].join("\n");

  fs.writeFileSync(path.join(packageRoot, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);
  fs.writeFileSync(path.join(packageRoot, "tsconfig.json"), `${JSON.stringify(tsconfig, null, 2)}\n`);
  fs.writeFileSync(path.join(packageRoot, "index.js"), wrapper);
}

export async function createFunctionArchive(
  entry: FunctionManifestEntry,
  rootDir = process.cwd(),
): Promise<ArchiveResult> {
  const stagingRoot = fs.mkdtempSync(path.join(os.tmpdir(), `rbp-appwrite-${entry.id}-`));
  const packageRoot = path.join(stagingRoot, "package");
  const packageFunctionsRoot = path.join(packageRoot, "functions");
  fs.mkdirSync(packageFunctionsRoot, { recursive: true });

  copyDirectory(path.join(getFunctionRoot(rootDir), "_shared"), path.join(packageFunctionsRoot, "_shared"));
  copyDirectory(path.join(rootDir, entry.sourceDirectory), path.join(packageFunctionsRoot, entry.id));
  writePackageFiles(packageRoot, rootDir, entry.id);

  const archivePath = path.join(stagingRoot, `${entry.id}.tar.gz`);
  try {
    await execFileAsync("tar", ["-czf", archivePath, "-C", packageRoot, "."]);
  } catch (error) {
    fs.rmSync(stagingRoot, { recursive: true, force: true });
    throw error;
  }

  return {
    archivePath,
    cleanup: () => fs.rmSync(stagingRoot, { recursive: true, force: true }),
  };
}

function isMissingAppwriteResource(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as { code?: number; response?: { code?: number }; message?: string };
  return maybeError.code === 404
    || maybeError.response?.code === 404
    || String(maybeError.message || "").toLowerCase().includes("not found");
}

async function ensureFunction(
  functions: AppwriteFunctionsApi,
  entry: FunctionManifestEntry,
  summary: Summary,
) {
  let exists = true;
  try {
    await functions.get(entry.id);
  } catch (error) {
    if (!isMissingAppwriteResource(error)) {
      throw error;
    }
    exists = false;
  }

  if (exists) {
    await functions.update(
      entry.id,
      entry.name,
      entry.runtime,
      entry.execute,
      [],
      "",
      entry.timeout,
      true,
      true,
      entry.entrypoint,
      entry.commands,
    );
    summary.updated.push(`function:${entry.id}`);
    return;
  }

  await functions.create(
    entry.id,
    entry.name,
    entry.runtime,
    entry.execute,
    [],
    "",
    entry.timeout,
    true,
    true,
    entry.entrypoint,
    entry.commands,
  );
  summary.created.push(`function:${entry.id}`);
}

async function deployFunctionCode(
  functions: AppwriteFunctionsApi,
  entry: FunctionManifestEntry,
  rootDir: string,
  archiveFunctionSource: NonNullable<DeployFunctionsOptions["archiveFunctionSource"]>,
  summary: Summary,
) {
  const archive = await archiveFunctionSource(entry, rootDir);
  try {
    await functions.createDeployment(
      entry.id,
      InputFile.fromPath(archive.archivePath, `${entry.id}.tar.gz`),
      true,
      entry.entrypoint,
      entry.commands,
    );
    summary.updated.push(`deployment:${entry.id}`);
  } finally {
    await archive.cleanup?.();
  }
}

function defaultFunctionsApi(env: NodeJS.ProcessEnv) {
  const client = new Client()
    .setEndpoint(env.APPWRITE_ENDPOINT || "")
    .setProject(env.APPWRITE_PROJECT_ID || "")
    .setKey(env.APPWRITE_API_KEY || "");
  return new Functions(client);
}

export async function runDeployFunctions(options: DeployFunctionsOptions) {
  const rootDir = options.rootDir || process.cwd();
  const env = options.env || process.env;
  const summary = options.summary || createSummary();

  for (const key of ["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY"]) {
    if (!env[key]) {
      throw new Error(`Missing required environment variables: ${key}`);
    }
  }

  const manifest = buildFunctionManifest(rootDir, options.now);
  const manifestPath = writeFunctionManifest(manifest, rootDir);
  summary.created.push(`manifest:${toRelative(rootDir, manifestPath)}`);

  if (!options.apply) {
    summary.skipped.push("Dry-run only. Pass --apply to create/update live Appwrite Functions and deployments.");
    return { manifest, manifestPath, summary };
  }

  const functions = options.functionsApi || options.createFunctionsApi?.() || defaultFunctionsApi(env);
  const archiveFunctionSource = options.archiveFunctionSource || createFunctionArchive;

  for (const entry of manifest.functions) {
    await ensureFunction(functions, entry, summary);
    await deployFunctionCode(functions, entry, rootDir, archiveFunctionSource, summary);
  }

  return { manifest, manifestPath, summary };
}

async function main() {
  try {
    requireEnv(["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY"]);
    const result = await runDeployFunctions({ apply: parseFlag("--apply") });
    printSummary(result.summary);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
