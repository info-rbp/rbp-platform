import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

function installEnv() {
  process.env.VITE_APPWRITE_ENDPOINT = "https://syd.cloud.appwrite.io/v1";
  process.env.VITE_APPWRITE_PROJECT_ID = "project-id";
  process.env.VITE_APPWRITE_DATABASE_ID = "database-id";
  process.env.VITE_APPWRITE_STORAGE_BUCKET_ID = "bucket-id";
}

beforeEach(() => {
  installEnv();
});

test("invokeAppwriteFunction returns raw JSON payloads", async () => {
  const { appwriteFunctions } = await import(
    "../../frontend/portal/src/app/lib/appwrite/client"
  );
  const { invokeAppwriteFunction } = await import(
    "../../frontend/portal/src/app/lib/appwrite/functions"
  );
  const originalCreateExecution = appwriteFunctions.createExecution;

  appwriteFunctions.createExecution = async () => ({
    responseBody: JSON.stringify({ checkout_url: "https://checkout.stripe.test/session" }),
  }) as never;

  try {
    const result = await invokeAppwriteFunction<{ checkout_url: string }>("create-membership-checkout", {});
    assert.equal(result.checkout_url, "https://checkout.stripe.test/session");
  } finally {
    appwriteFunctions.createExecution = originalCreateExecution;
  }
});

test("invokeAppwriteFunction unwraps ok/data envelopes", async () => {
  const { appwriteFunctions } = await import(
    "../../frontend/portal/src/app/lib/appwrite/client"
  );
  const { invokeAppwriteFunction } = await import(
    "../../frontend/portal/src/app/lib/appwrite/functions"
  );
  const originalCreateExecution = appwriteFunctions.createExecution;

  appwriteFunctions.createExecution = async () => ({
    responseBody: JSON.stringify({
      ok: true,
      data: { interest_id: "interest-123", application: "ERPNext" },
    }),
  }) as never;

  try {
    const result = await invokeAppwriteFunction<{ interest_id: string; application: string }>("admin-operations", {});
    assert.deepEqual(result, {
      interest_id: "interest-123",
      application: "ERPNext",
    });
  } finally {
    appwriteFunctions.createExecution = originalCreateExecution;
  }
});

test("invokeAppwriteFunction throws structured errors for failed envelopes", async () => {
  const { appwriteFunctions } = await import(
    "../../frontend/portal/src/app/lib/appwrite/client"
  );
  const { AppwriteFunctionError, invokeAppwriteFunction } = await import(
    "../../frontend/portal/src/app/lib/appwrite/functions"
  );
  const originalCreateExecution = appwriteFunctions.createExecution;

  appwriteFunctions.createExecution = async () => ({
    responseBody: JSON.stringify({
      ok: false,
      message: "Stripe checkout could not be started.",
      errors: [{ field: "billing", code: "invalid", message: "Missing planCode." }],
    }),
  }) as never;

  try {
    await assert.rejects(
      () => invokeAppwriteFunction("create-membership-checkout", {}),
      (error: unknown) => {
        assert.ok(error instanceof AppwriteFunctionError);
        assert.equal(error.message, "Stripe checkout could not be started.");
        assert.deepEqual(error.errors, [
          { field: "billing", code: "invalid", message: "Missing planCode." },
        ]);
        return true;
      },
    );
  } finally {
    appwriteFunctions.createExecution = originalCreateExecution;
  }
});

test("invokeAppwriteFunction supports missing responseBody when direct data is present", async () => {
  const { appwriteFunctions } = await import(
    "../../frontend/portal/src/app/lib/appwrite/client"
  );
  const { invokeAppwriteFunction } = await import(
    "../../frontend/portal/src/app/lib/appwrite/functions"
  );
  const originalCreateExecution = appwriteFunctions.createExecution;

  appwriteFunctions.createExecution = async () => ({
    data: { status: "active" },
  }) as never;

  try {
    const result = await invokeAppwriteFunction<{ status: string }>("get-subscription-status", {});
    assert.equal(result.status, "active");
  } finally {
    appwriteFunctions.createExecution = originalCreateExecution;
  }
});

test("invokeAppwriteFunction fails clearly on invalid JSON", async () => {
  const { appwriteFunctions } = await import(
    "../../frontend/portal/src/app/lib/appwrite/client"
  );
  const { AppwriteFunctionError, invokeAppwriteFunction } = await import(
    "../../frontend/portal/src/app/lib/appwrite/functions"
  );
  const originalCreateExecution = appwriteFunctions.createExecution;

  appwriteFunctions.createExecution = async () => ({
    responseBody: "{",
  }) as never;

  try {
    await assert.rejects(
      () => invokeAppwriteFunction("admin-operations", {}),
      (error: unknown) => {
        assert.ok(error instanceof AppwriteFunctionError);
        assert.equal(error.message, "Appwrite function returned invalid JSON.");
        return true;
      },
    );
  } finally {
    appwriteFunctions.createExecution = originalCreateExecution;
  }
});
