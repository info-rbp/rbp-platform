import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import type { PortalDashboardState } from "../../frontend/portal/src/app/types/portal";

const PORTAL_STATE_KEY = "rbp.mockPortalState";

function createMemoryStorage() {
  const store = new Map<string, string>();

  return {
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

function installBrowserStorage() {
  const sessionStorage = createMemoryStorage();
  const localStorage = createMemoryStorage();

  globalThis.window = {
    sessionStorage,
    localStorage,
  } as unknown as Window & typeof globalThis;
}

function validState(): PortalDashboardState {
  return {
    membershipStatus: "active",
    membershipPlan: "RBP Premium Membership",
    customer: {
      id: "customer-1",
      name: "QA Member",
      email: "qa@example.com",
      businessName: "QA Business",
    },
    activities: [],
    notifications: [],
  };
}

beforeEach(() => {
  process.env.VITE_APPWRITE_ENDPOINT = "https://syd.cloud.appwrite.io/v1";
  process.env.VITE_APPWRITE_PROJECT_ID = "69ff55980009b1cd7dbe";
  process.env.VITE_APPWRITE_DATABASE_ID = "database-id";
  process.env.VITE_APPWRITE_STORAGE_BUCKET_ID = "bucket-id";
  installBrowserStorage();
});

test("unwrapPortalDashboardPayload unwraps Appwrite response envelopes", async () => {
  const { unwrapPortalDashboardPayload } = await import(
    "../../frontend/portal/src/app/services/api/portalDashboardState"
  );
  const state = validState();
  const unwrapped = unwrapPortalDashboardPayload({
    ok: true,
    message: "ok",
    data: state,
  });

  assert.deepEqual(unwrapped, state);
});

test("normalisePortalDashboardState accepts an Appwrite envelope with valid dashboard state", async () => {
  const { normalisePortalDashboardState } = await import(
    "../../frontend/portal/src/app/services/api/portalDashboardState"
  );
  const { createDefaultPortalState } = await import(
    "../../frontend/portal/src/app/services/mock/portal.mockService"
  );
  const fallback = createDefaultPortalState();
  const state = validState();
  const normalised = normalisePortalDashboardState(
    {
      ok: true,
      message: "ok",
      data: state,
    },
    fallback,
  );

  assert.deepEqual(normalised, state);
});

test("normalisePortalDashboardState fills fallback customer for partial envelope data", async () => {
  const { normalisePortalDashboardState } = await import(
    "../../frontend/portal/src/app/services/api/portalDashboardState"
  );
  const { createDefaultPortalState } = await import(
    "../../frontend/portal/src/app/services/mock/portal.mockService"
  );
  const fallback = createDefaultPortalState();
  const normalised = normalisePortalDashboardState(
    {
      ok: true,
      message: "ok",
      data: {
        membershipStatus: "active",
        membershipPlan: "RBP Premium Membership",
        activities: [],
        notifications: [],
      },
    },
    fallback,
  );

  assert.deepEqual(normalised.customer, {
    ...fallback.customer,
    businessName: fallback.customer.businessName || "Your business",
  });
  assert.equal(normalised.membershipStatus, "active");
});

test("readPortalState unwraps an existing bad session storage envelope", async () => {
  const { readPortalState } = await import(
    "../../frontend/portal/src/app/services/mock/portal.mockService"
  );
  const state = validState();
  window.sessionStorage.setItem(
    PORTAL_STATE_KEY,
    JSON.stringify({
      ok: true,
      message: "ok",
      data: state,
    }),
  );

  const readState = readPortalState();
  const stored = JSON.parse(window.sessionStorage.getItem(PORTAL_STATE_KEY) || "{}");

  assert.deepEqual(readState, state);
  assert.equal("ok" in stored, false);
  assert.equal(stored.customer.name, "QA Member");
});

test("mockPortalService.getDashboard writes only normalised dashboard state", async () => {
  const { mockPortalService } = await import(
    "../../frontend/portal/src/app/services/mock/portal.mockService"
  );
  const { portalApi } = await import("../../frontend/portal/src/app/services/api/portalApi");
  const originalGetDashboardState = portalApi.getDashboardState;
  const state = validState();

  portalApi.getDashboardState = async () => ({
    ok: true,
    data: {
      ok: true,
      message: "ok",
      data: state,
    } as unknown as PortalDashboardState,
    message: "Portal dashboard returned from Appwrite.",
    errors: [],
    meta: {
      requestId: "test",
      timestamp: new Date().toISOString(),
      mockEndpoint: "appwrite/functions/admin-operations",
      simulated: true,
    },
  });

  try {
    const response = await mockPortalService.getDashboard();
    const stored = JSON.parse(window.sessionStorage.getItem(PORTAL_STATE_KEY) || "{}");

    assert.equal(response.ok, true);
    assert.deepEqual(response.data, state);
    assert.equal("ok" in stored, false);
    assert.equal("data" in stored, false);
    assert.deepEqual(stored, state);
  } finally {
    portalApi.getDashboardState = originalGetDashboardState;
  }
});

test("PortalDashboard view model does not crash if customer is missing", async () => {
  const { getPortalDashboardViewModel } = await import(
    "../../frontend/portal/src/app/pages/portal/PortalDashboard"
  );
  const viewModel = getPortalDashboardViewModel({
    membershipStatus: "active",
    membershipPlan: "RBP Premium Membership",
    activities: [],
    notifications: [],
  });

  assert.equal(viewModel.memberName, "RBP Member");
  assert.equal(viewModel.businessName, "Your business");
  assert.deepEqual(viewModel.activePortalActivities, []);
  assert.deepEqual(viewModel.notifications, []);
});

test("PortalDashboard view model falls back when businessName is missing", async () => {
  const { getPortalDashboardViewModel } = await import(
    "../../frontend/portal/src/app/pages/portal/PortalDashboard"
  );
  const viewModel = getPortalDashboardViewModel({
    customer: {
      id: "customer-1",
      name: "QA Member",
      email: "qa@example.com",
    },
    activities: [],
    notifications: [],
  });

  assert.equal(viewModel.memberName, "QA Member");
  assert.equal(viewModel.businessName, "Your business");
});
