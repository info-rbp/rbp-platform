import test from "node:test";
import assert from "node:assert/strict";

import { parseEnvExample, readRepoFile } from "../helpers/env-files.mjs";

const rootEnv = parseEnvExample(".env.example");
const productionEnv = parseEnvExample(".env.production.example");
const portalAppsPage = readRepoFile("frontend/portal/src/app/pages/portal/PortalApps.tsx");
const applicationsApi = readRepoFile("frontend/portal/src/app/services/api/applicationsApi.ts");

test("application provisioning remains disabled across QA and production examples", () => {
  assert.equal(rootEnv.VITE_ENABLE_APPLICATION_PROVISIONING, "false");
  assert.equal(productionEnv.VITE_ENABLE_APPLICATION_PROVISIONING, "false");
  assert.equal(rootEnv.VITE_ENABLE_APPLICATION_INTEREST, "true");
  assert.equal(productionEnv.VITE_ENABLE_APPLICATION_INTEREST, "true");
});

test("portal UI presents applications as interest-only", () => {
  assert.match(portalAppsPage, /No provisioning action is available yet\./);
  assert.match(portalAppsPage, /Register interest/);
  assert.doesNotMatch(portalAppsPage, /Launch app/i);
  assert.doesNotMatch(portalAppsPage, /Open app/i);
});

test("applications API surface is interest-oriented", () => {
  assert.match(applicationsApi, /registerApplicationInterest/);
  assert.doesNotMatch(applicationsApi, /provision/i);
});