function readBoolean(value: unknown, fallback: boolean) {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).toLowerCase() === "true";
}

function readString(value: unknown, fallback: string) {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

const enableApplications = readBoolean(import.meta.env.VITE_ENABLE_APPLICATIONS, false);
const enableApplicationInterest = readBoolean(
  import.meta.env.VITE_ENABLE_APPLICATION_INTEREST,
  true
);
const enableApplicationProvisioning = readBoolean(
  import.meta.env.VITE_ENABLE_APPLICATION_PROVISIONING,
  false
);
const enableAdminApplications = readBoolean(
  import.meta.env.VITE_ENABLE_ADMIN_APPLICATIONS,
  true
);
const enableStripeCheckout = readBoolean(
  import.meta.env.VITE_ENABLE_STRIPE_CHECKOUT,
  true
);
const enableEmailNotifications = readBoolean(
  import.meta.env.VITE_ENABLE_EMAIL_NOTIFICATIONS,
  true
);
const enableMockAuth = readBoolean(import.meta.env.VITE_ENABLE_MOCK_AUTH, false);
const enableMockFallback = readBoolean(import.meta.env.VITE_ENABLE_MOCK_FALLBACK, false);
const enableAppwriteAuth = readBoolean(import.meta.env.VITE_ENABLE_APPWRITE_AUTH, true);
const enableAppwriteDatabase = readBoolean(import.meta.env.VITE_ENABLE_APPWRITE_DATABASE, true);
const enableAppwriteStorage = readBoolean(import.meta.env.VITE_ENABLE_APPWRITE_STORAGE, true);
const enableAppwriteFunctions = readBoolean(import.meta.env.VITE_ENABLE_APPWRITE_FUNCTIONS, true);

export const environment = {
  backendProvider: readString(import.meta.env.VITE_BACKEND_PROVIDER, "appwrite"),
  qaEnvironment: readBoolean(import.meta.env.VITE_QA_ENVIRONMENT, true),
  cloudflareEnvironment: readString(import.meta.env.VITE_CLOUDFLARE_ENVIRONMENT, "qa"),
  publicSiteUrl: readString(
    import.meta.env.VITE_PUBLIC_SITE_URL,
    "http://localhost:5173"
  ),
  apiBaseUrl: readString(import.meta.env.VITE_API_BASE_URL, "http://localhost:8000"),
  appwriteEndpoint: readString(import.meta.env.VITE_APPWRITE_ENDPOINT, ""),
  appwriteProjectId: readString(import.meta.env.VITE_APPWRITE_PROJECT_ID, ""),
  appwriteDatabaseId: readString(import.meta.env.VITE_APPWRITE_DATABASE_ID, ""),
  appwriteStorageBucketId: readString(import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID, ""),
  enableApplications,
  enableApplicationInterest,
  enableApplicationProvisioning,
  enableAdminApplications,
  enableStripeCheckout,
  enableEmailNotifications,
  enableMockAuth,
  enableMockFallback,
  enableAppwriteAuth,
  enableAppwriteDatabase,
  enableAppwriteStorage,
  enableAppwriteFunctions,
  stripeMode: readString(import.meta.env.VITE_STRIPE_MODE, "test"),
  emailSandboxMode: readBoolean(import.meta.env.VITE_EMAIL_SANDBOX_MODE, true),
  features: {
    applications: enableApplications,
    application_interest: enableApplicationInterest,
    application_provisioning: enableApplicationProvisioning,
    admin_applications: enableAdminApplications,
    stripe_checkout: enableStripeCheckout,
    email_notifications: enableEmailNotifications,
    mock_auth: enableMockAuth,
    mock_fallback: enableMockFallback,
    appwrite_auth: enableAppwriteAuth,
    appwrite_database: enableAppwriteDatabase,
    appwrite_storage: enableAppwriteStorage,
    appwrite_functions: enableAppwriteFunctions,
  },
} as const;

export type RuntimeEnvironment = typeof environment;
