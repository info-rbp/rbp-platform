import { Client, Databases, Functions, ID, Query, Storage, Teams, Users } from "node-appwrite";

type FunctionContext = {
  req?: {
    body?: string | Record<string, unknown> | null;
    headers?: Record<string, string | undefined>;
  };
};

export type CurrentUserContext = {
  userId: string;
  tenantId: string;
  role: string;
  userProfile: Record<string, unknown>;
};

export const collectionIds = {
  tenants: "tenants",
  businessProfiles: "business_profiles",
  userProfiles: "user_profiles",
  teamMemberships: "team_memberships",
  membershipPlans: "membership_plans",
  planEntitlements: "plan_entitlements",
  stripeCustomers: "stripe_customers",
  subscriptions: "subscriptions",
  paymentEvents: "payment_events",
  auditEvents: "audit_events",
  entitlements: "entitlements",
  tenantEntitlements: "tenant_entitlements",
  userEntitlements: "user_entitlements",
  applications: "applications",
  applicationInterest: "application_interest",
  notifications: "notifications",
  notificationDeliveries: "notification_deliveries",
  serviceRequests: "service_requests",
  decisionDeskRequests: "decision_desk_requests",
  docushareBriefs: "docushare_briefs",
  connectivityOrders: "connectivity_orders",
  riskAssessments: "risk_assessments",
  fixerRequests: "fixer_requests",
  marketplaceListings: "marketplace_listings",
  marketplaceEnquiries: "marketplace_enquiries",
} as const;

export function getRequiredAdminEnv() {
  return {
    endpoint: process.env.APPWRITE_ENDPOINT,
    projectId: process.env.APPWRITE_PROJECT_ID,
    apiKey: process.env.APPWRITE_API_KEY,
    databaseId: process.env.APPWRITE_DATABASE_ID,
    storageBucketId: process.env.APPWRITE_STORAGE_BUCKET_ID,
    adminTeamId: process.env.APPWRITE_ADMIN_TEAM_ID,
  };
}

function requireValue(value: string | undefined, label: string) {
  if (!value) {
    throw new Error(`Missing required runtime config: ${label}`);
  }

  return value;
}

export function getHeader(context: FunctionContext, key: string) {
  const headers = context.req?.headers || {};
  const matched = Object.entries(headers).find(([name]) => name.toLowerCase() === key.toLowerCase());
  return matched?.[1] || undefined;
}

function createRealAdminContext() {
  const env = getRequiredAdminEnv();
  const client = new Client()
    .setEndpoint(requireValue(env.endpoint, "APPWRITE_ENDPOINT"))
    .setProject(requireValue(env.projectId, "APPWRITE_PROJECT_ID"))
    .setKey(requireValue(env.apiKey, "APPWRITE_API_KEY"));

  const databaseId = requireValue(env.databaseId, "APPWRITE_DATABASE_ID");
  const databases = new Databases(client);
  const users = new Users(client);
  const teams = new Teams(client);
  const storage = new Storage(client);
  const functions = new Functions(client);

  return {
    client,
    databaseId,
    databases,
    users,
    teams,
    storage,
    functions,
    async listDocuments<T = Record<string, unknown>>(collectionId: string, queries: string[] = []) {
      return databases.listDocuments<T>(databaseId, collectionId, queries);
    },
    async getDocument<T = Record<string, unknown>>(collectionId: string, documentId: string) {
      return databases.getDocument<T>(databaseId, collectionId, documentId);
    },
    async createDocument<T = Record<string, unknown>>(collectionId: string, data: Record<string, unknown>) {
      return databases.createDocument<T>(databaseId, collectionId, ID.unique(), data);
    },
    async updateDocument<T = Record<string, unknown>>(collectionId: string, documentId: string, data: Record<string, unknown>) {
      return databases.updateDocument<T>(databaseId, collectionId, documentId, data);
    },
    async findOne<T = Record<string, unknown>>(collectionId: string, queries: string[]) {
      const listed = await databases.listDocuments<T>(databaseId, collectionId, [...queries, Query.limit(1)]);
      return listed.documents?.[0] || null;
    },
    async upsertByQuery<T = Record<string, unknown>>(collectionId: string, queries: string[], data: Record<string, unknown>) {
      const existing = await this.findOne<T & { $id: string }>(collectionId, queries);
      if (existing && "$id" in existing) {
        return {
          operation: "updated" as const,
          document: await this.updateDocument<T>(collectionId, String(existing.$id), data),
        };
      }

      return {
        operation: "created" as const,
        document: await this.createDocument<T>(collectionId, data),
      };
    },
  };
}

type AdminContext = ReturnType<typeof createRealAdminContext>;

let adminContextFactoryForTests: (() => AdminContext) | null = null;

export function setAdminContextFactoryForTests(factory: (() => AdminContext) | null) {
  adminContextFactoryForTests = factory;
}

export function createAdminContext() {
  return adminContextFactoryForTests ? adminContextFactoryForTests() : createRealAdminContext();
}

export function isTrustedInternalInvocation(context: FunctionContext) {
  const configuredToken = process.env.APPWRITE_TRUSTED_FUNCTION_TOKEN || process.env.RBP_INTERNAL_FUNCTION_TOKEN;
  if (!configuredToken) {
    return false;
  }

  const presentedToken = getHeader(context, "x-rbp-trusted-invocation") || getHeader(context, "x-rbp-internal-token");
  return Boolean(presentedToken && presentedToken === configuredToken);
}

export async function resolveCurrentUser(context: FunctionContext): Promise<CurrentUserContext> {
  const admin = createAdminContext();
  const userId = getHeader(context, "x-appwrite-user-id") || getHeader(context, "x-user-id");
  if (!userId) {
    throw new Error("Missing Appwrite user context.");
  }

  const userProfile = await admin.findOne<Record<string, unknown> & { $id: string }>(
    collectionIds.userProfiles,
    [Query.equal("appwrite_user_id", [userId])],
  );

  if (!userProfile) {
    throw new Error(`No user profile found for Appwrite user ${userId}.`);
  }

  return {
    userId,
    tenantId: String(userProfile.tenant_id || ""),
    role: String(userProfile.role || "member"),
    userProfile,
  };
}

export async function requireAdmin(context: FunctionContext): Promise<CurrentUserContext> {
  if (isTrustedInternalInvocation(context)) {
    try {
      return await resolveCurrentUser(context);
    } catch {
      return {
        userId: "trusted-internal",
        tenantId: "",
        role: "admin",
        userProfile: {},
      };
    }
  }

  const userId = getHeader(context, "x-appwrite-user-id") || getHeader(context, "x-user-id");
  const adminTeamId = process.env.APPWRITE_ADMIN_TEAM_ID;
  if (adminTeamId && userId) {
    const admin = createAdminContext();
    const memberships = await admin.teams.listMemberships(adminTeamId);
    const matched = memberships.memberships.find((membership) => membership.userId === userId);
    if (matched) {
      try {
        return await resolveCurrentUser(context);
      } catch {
        return {
          userId,
          tenantId: "",
          role: "admin",
          userProfile: {},
        };
      }
    }
  }

  await resolveCurrentUser(context);
  throw new Error("Administrator access is required.");
}

export function getDatabaseId() {
  return requireValue(process.env.APPWRITE_DATABASE_ID, "APPWRITE_DATABASE_ID");
}
