import { parseFlag } from "./_lib";

if (!parseFlag("--confirm-reset")) {
  console.error("Refusing to reset QA data without --confirm-reset.");
  process.exit(1);
}

console.log("QA reset requested. Implement runtime deletion only inside a controlled deployment environment.");
