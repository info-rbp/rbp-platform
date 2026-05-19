import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildFrontendDiagnostics,
  describeAppwriteErrorWithDiagnostics,
  getMissingAppwriteConfig,
} from "../../frontend/portal/src/app/config/frontendDiagnostics";

const completeAppwriteEnv = {
  VITE_BACKEND_PROVIDER: "appwrite",
  VITE_APPWRITE_ENDPOINT: "https://syd.cloud.appwrite.io/v1",
  VITE_APPWRITE_PROJECT_ID: "project-id",
  VITE_APPWRITE_DATABASE_ID: "database-id",
  VITE_APPWRITE_STORAGE_BUCKET_ID: "bucket-id",
  VITE_ENABLE_STRIPE_CHECKOUT: "true",
  VITE_ENABLE_MOCK_FALLBACK: "false",
  VITE_QA_ENVIRONMENT: "true",
  VITE_BUILD_COMMIT: "abc123def456",
};

test("Appwrite frontend diagnostics pass with all required Vite variables", () => {
  const diagnostics = buildFrontendDiagnostics(completeAppwriteEnv);

  assert.deepEqual(diagnostics.missingAppwriteConfig, []);
  assert.equal(diagnostics.backendProvider, "appwrite");
  assert.equal(diagnostics.appwriteEndpointHost, "syd.cloud.appwrite.io");
  assert.equal(diagnostics.projectIdLoaded, true);
  assert.equal(diagnostics.databaseIdLoaded, true);
  assert.equal(diagnostics.storageBucketIdLoaded, true);
  assert.equal(diagnostics.stripeCheckoutEnabled, true);
  assert.equal(diagnostics.stripeCheckoutRawValue, "true");
  assert.equal(diagnostics.buildCommit, "abc123def456");
});

test("Appwrite frontend diagnostics fail clearly when endpoint is missing", () => {
  const missing = getMissingAppwriteConfig({
    ...completeAppwriteEnv,
    VITE_APPWRITE_ENDPOINT: "",
  });

  assert.deepEqual(missing, ["VITE_APPWRITE_ENDPOINT"]);
});

test("Appwrite frontend diagnostics fail clearly when project ID is missing", () => {
  const missing = getMissingAppwriteConfig({
    ...completeAppwriteEnv,
    VITE_APPWRITE_PROJECT_ID: "",
  });

  assert.deepEqual(missing, ["VITE_APPWRITE_PROJECT_ID"]);
});

test("QA frontend diagnostics keep mock fallback disabled", () => {
  const diagnostics = buildFrontendDiagnostics(completeAppwriteEnv);

  assert.equal(diagnostics.mockFallbackEnabled, false);
  assert.equal(diagnostics.qaEnvironment, true);
});

test("frontend diagnostics expose public config state only", () => {
  const diagnostics = buildFrontendDiagnostics({
    ...completeAppwriteEnv,
    APPWRITE_API_KEY: "secret-api-key",
    STRIPE_SECRET_KEY: "secret-stripe-key",
    STRIPE_WEBHOOK_SECRET: "secret-webhook-key",
  });

  const serialized = JSON.stringify(diagnostics);
  assert.equal(serialized.includes("secret-api-key"), false);
  assert.equal(serialized.includes("secret-stripe-key"), false);
  assert.equal(serialized.includes("secret-webhook-key"), false);
});

test("Appwrite auth network errors surface diagnostic context", () => {
  const diagnostics = buildFrontendDiagnostics(completeAppwriteEnv);
  const message = describeAppwriteErrorWithDiagnostics(
    new TypeError("Failed to fetch"),
    "Sign-in",
    diagnostics,
  );

  assert.match(message, /Sign-in could not reach Appwrite/);
  assert.match(message, /syd\.cloud\.appwrite\.io/);
  assert.match(message, /network\/CORS/i);
});
