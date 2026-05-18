import assert from "node:assert/strict";
import test from "node:test";
import { runDeploySchema, type AppwriteDatabasesApi, type AppwriteRequest, type AppwriteStorageApi } from "../../scripts/appwrite/deploy-schema";

const baseEnv = {
  APPWRITE_ENDPOINT: "https://cloud.appwrite.io/v1",
  APPWRITE_PROJECT_ID: "project",
  APPWRITE_API_KEY: "key",
  APPWRITE_DATABASE_ID: "rbp_platform",
  APPWRITE_ADMIN_TEAM_ID: "team_live_admins",
};

const baseConfig = {
  project: "rbp-platform",
  database: {
    id: "rbp_platform",
    name: "RBP Platform",
  },
  buckets: ["rbp_documents"],
};

const notificationDefinition = {
  id: "notifications",
  name: "Notifications",
  documentSecurity: true,
  permissions: {
    read: ["team:admins"],
    create: ["team:admins"],
    update: ["team:admins"],
    delete: ["team:admins"],
  },
  attributes: [],
  indexes: [],
};

const bucketDefinition = {
  id: "rbp_documents",
  name: "RBP Documents",
  fileSecurity: true,
  permissions: {
    read: ["team:admins"],
    create: ["team:admins"],
    update: ["team:admins"],
    delete: ["team:admins"],
  },
};

function createRequest(routes: Record<string, unknown>): AppwriteRequest {
  return async (route) => {
    if (!(route in routes)) {
      throw new Error(`Unexpected route: ${route}`);
    }

    const response = routes[route];
    if (response instanceof Error) {
      throw response;
    }

    return response as never;
  };
}

function createAdminServices(overrides?: {
  databases?: Partial<AppwriteDatabasesApi>;
  storage?: Partial<AppwriteStorageApi>;
}) {
  return () => ({
    databases: {
      async updateCollection() {},
      ...overrides?.databases,
    } satisfies AppwriteDatabasesApi,
    storage: {
      async updateBucket() {},
      ...overrides?.storage,
    } satisfies AppwriteStorageApi,
  });
}

test("dry-run reports collection permission drift", async () => {
  const result = await runDeploySchema({
    apply: false,
    env: baseEnv,
    config: baseConfig,
    collectionDefinitions: [notificationDefinition],
    bucketDefinitions: [],
    appwriteRequest: createRequest({
      "/databases/rbp_platform": { $id: "rbp_platform" },
      "/databases/rbp_platform/collections/notifications": {
        $id: "notifications",
        name: "Notifications",
        documentSecurity: true,
        enabled: true,
        $permissions: ['read("users")'],
      },
      "/databases/rbp_platform/collections/notifications/attributes": { attributes: [] },
      "/databases/rbp_platform/collections/notifications/indexes": { indexes: [] },
    }),
    createAdminServices: createAdminServices(),
  });

  assert.deepEqual(result.summary.drift, ["permissions:notifications"]);
  assert.deepEqual(result.summary.updated, []);
  assert.ok(result.summary.skipped.includes("Dry-run only. Pass --apply to update live permissions."));
});

test("apply updates collection permissions", async () => {
  let updateCollectionCalled = false;
  let updatedPermissions: string[] = [];
  let updatedCollectionParams: Parameters<AppwriteDatabasesApi["updateCollection"]>[0] | null = null;

  const result = await runDeploySchema({
    apply: true,
    env: baseEnv,
    config: baseConfig,
    collectionDefinitions: [notificationDefinition],
    bucketDefinitions: [],
    appwriteRequest: createRequest({
      "/databases/rbp_platform": { $id: "rbp_platform" },
      "/databases/rbp_platform/collections/notifications": {
        $id: "notifications",
        name: "Live Notifications",
        documentSecurity: false,
        enabled: false,
        $permissions: ['read("users")'],
      },
      "/databases/rbp_platform/collections/notifications/attributes": { attributes: [] },
      "/databases/rbp_platform/collections/notifications/indexes": { indexes: [] },
    }),
    createAdminServices: createAdminServices({
      databases: {
        async updateCollection(params) {
          updateCollectionCalled = true;
          updatedPermissions = params.permissions || [];
          updatedCollectionParams = params;
        },
      },
    }),
  });

  assert.equal(updateCollectionCalled, true);
  assert.equal(updatedCollectionParams?.name, "Live Notifications");
  assert.equal(updatedCollectionParams?.documentSecurity, false);
  assert.equal(updatedCollectionParams?.enabled, false);
  assert.deepEqual(result.summary.updated, ["permissions:notifications"]);
  assert.ok(updatedPermissions.includes('read("team:team_live_admins")'));
});

test("dry-run reports bucket permission drift", async () => {
  const result = await runDeploySchema({
    apply: false,
    env: baseEnv,
    config: baseConfig,
    collectionDefinitions: [],
    bucketDefinitions: [bucketDefinition],
    appwriteRequest: createRequest({
      "/databases/rbp_platform": { $id: "rbp_platform" },
      "/storage/buckets/rbp_documents": {
        $id: "rbp_documents",
        name: "RBP Documents",
        fileSecurity: true,
        enabled: true,
        $permissions: ['read("users")'],
      },
    }),
    createAdminServices: createAdminServices(),
  });

  assert.deepEqual(result.summary.drift, ["permissions:bucket:rbp_documents"]);
  assert.deepEqual(result.summary.updated, []);
});

test("apply updates bucket permissions", async () => {
  let updateBucketCalled = false;
  let updatedBucketParams: Parameters<AppwriteStorageApi["updateBucket"]>[0] | null = null;

  const result = await runDeploySchema({
    apply: true,
    env: baseEnv,
    config: baseConfig,
    collectionDefinitions: [],
    bucketDefinitions: [bucketDefinition],
    appwriteRequest: createRequest({
      "/databases/rbp_platform": { $id: "rbp_platform" },
      "/storage/buckets/rbp_documents": {
        $id: "rbp_documents",
        name: "RBP Documents",
        fileSecurity: true,
        enabled: true,
        maximumFileSize: 5000000,
        allowedFileExtensions: ["pdf"],
        compression: "gzip",
        encryption: true,
        antivirus: true,
        transformations: true,
        $permissions: ['read("users")'],
      },
    }),
    createAdminServices: createAdminServices({
      storage: {
        async updateBucket(params) {
          updateBucketCalled = true;
          updatedBucketParams = params;
        },
      },
    }),
  });

  assert.equal(updateBucketCalled, true);
  assert.equal(updatedBucketParams?.name, "RBP Documents");
  assert.equal(updatedBucketParams?.fileSecurity, true);
  assert.equal(updatedBucketParams?.enabled, true);
  assert.equal(updatedBucketParams?.maximumFileSize, 5000000);
  assert.deepEqual(updatedBucketParams?.allowedFileExtensions, ["pdf"]);
  assert.equal(updatedBucketParams?.compression, "gzip");
  assert.equal(updatedBucketParams?.encryption, true);
  assert.equal(updatedBucketParams?.antivirus, true);
  assert.equal(updatedBucketParams?.transformations, true);
  assert.deepEqual(result.summary.updated, ["permissions:bucket:rbp_documents"]);
});

test("missing admin team env fails apply", async () => {
  await assert.rejects(
    () => runDeploySchema({
      apply: true,
      env: {
        APPWRITE_ENDPOINT: "https://cloud.appwrite.io/v1",
        APPWRITE_PROJECT_ID: "project",
        APPWRITE_API_KEY: "key",
        APPWRITE_DATABASE_ID: "rbp_platform",
      },
      config: baseConfig,
      collectionDefinitions: [notificationDefinition],
      bucketDefinitions: [],
      appwriteRequest: createRequest({
        "/databases/rbp_platform": { $id: "rbp_platform" },
        "/databases/rbp_platform/collections/notifications": {
          $id: "notifications",
          name: "Notifications",
          documentSecurity: true,
          enabled: true,
          $permissions: ['read("users")'],
        },
        "/databases/rbp_platform/collections/notifications/attributes": { attributes: [] },
        "/databases/rbp_platform/collections/notifications/indexes": { indexes: [] },
      }),
      createAdminServices: createAdminServices(),
    }),
    /APPWRITE_ADMIN_TEAM_ID is required to resolve team:admins permissions\./,
  );
});

test("normalized permissions prevent false drift", async () => {
  let updateCollectionCalled = false;

  const result = await runDeploySchema({
    apply: true,
    env: baseEnv,
    config: baseConfig,
    collectionDefinitions: [notificationDefinition],
    bucketDefinitions: [],
    appwriteRequest: createRequest({
      "/databases/rbp_platform": { $id: "rbp_platform" },
      "/databases/rbp_platform/collections/notifications": {
        $id: "notifications",
        name: "Notifications",
        documentSecurity: true,
        enabled: true,
        $permissions: [
          'create("team:team_live_admins")',
          'delete("team:team_live_admins")',
          'read("team:team_live_admins")',
          'update("team:team_live_admins")',
        ],
      },
      "/databases/rbp_platform/collections/notifications/attributes": { attributes: [] },
      "/databases/rbp_platform/collections/notifications/indexes": { indexes: [] },
    }),
    createAdminServices: createAdminServices({
      databases: {
        async updateCollection() {
          updateCollectionCalled = true;
        },
      },
    }),
  });

  assert.equal(updateCollectionCalled, false);
  assert.deepEqual(result.summary.drift, []);
  assert.deepEqual(result.summary.updated, []);
});
