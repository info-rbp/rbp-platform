import fs from "node:fs";
import path from "node:path";
import { createSummary, listFunctionDirectories, parseFlag, printSummary, readConfig, requireEnv } from "./_lib";

const apply = parseFlag("--apply");
const summary = createSummary();

try {
  requireEnv(["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY"]);

  const config = readConfig();
  const directories = listFunctionDirectories();
  const configured = new Set(config.functions || []);
  const manifest = directories.map((dir) => {
    const name = path.basename(dir);
    const entry = path.join(dir, "index.ts");
    if (!fs.existsSync(entry)) {
      throw new Error(`Missing function entrypoint: ${entry}`);
    }

    return {
      name,
      configured: configured.has(name),
      entry: path.relative(process.cwd(), entry),
      sourceDirectory: path.relative(process.cwd(), dir),
    };
  });

  const manifestPath = path.join(process.cwd(), "appwrite", "functions", "deployment-manifest.json");
  fs.writeFileSync(manifestPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), functions: manifest }, null, 2)}\n`);

  if (!apply) {
    summary.created.push(`manifest:${path.relative(process.cwd(), manifestPath)}`);
    summary.skipped.push("Function deployment is in dry-run mode. Pass --apply after packaging support is configured.");
    printSummary(summary);
    process.exit(0);
  }

  summary.manualActionRequired.push("Automated function packaging is not yet configured in this branch. Use appwrite/functions/deployment-manifest.json to create Appwrite deployments once packaging credentials and archive strategy are available.");
  printSummary(summary);
  process.exit(1);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
