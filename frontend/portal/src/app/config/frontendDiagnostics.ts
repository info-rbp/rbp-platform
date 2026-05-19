export type FrontendEnvSource = Record<string, unknown>;

export type FrontendDiagnostics = {
  backendProvider: string;
  buildCommit: string;
  appwriteEndpointHost: string;
  stripeCheckoutEnabled: boolean;
  stripeCheckoutRawValue: string;
  projectIdLoaded: boolean;
  databaseIdLoaded: boolean;
  storageBucketIdLoaded: boolean;
  mockFallbackEnabled: boolean;
  qaEnvironment: boolean;
  missingAppwriteConfig: string[];
};

const REQUIRED_APPWRITE_KEYS = [
  "VITE_BACKEND_PROVIDER",
  "VITE_APPWRITE_ENDPOINT",
  "VITE_APPWRITE_PROJECT_ID",
  "VITE_APPWRITE_DATABASE_ID",
  "VITE_APPWRITE_STORAGE_BUCKET_ID",
] as const;

function readString(env: FrontendEnvSource, key: string, fallback = "") {
  const value = env[key];
  return value === undefined || value === null || value === "" ? fallback : String(value);
}

function readBoolean(env: FrontendEnvSource, key: string, fallback: boolean) {
  const value = env[key];
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).toLowerCase() === "true";
}

function endpointHost(endpoint: string) {
  if (!endpoint) return "";

  try {
    return new URL(endpoint).host;
  } catch {
    return "invalid-url";
  }
}

export function getMissingAppwriteConfig(env: FrontendEnvSource) {
  const backendProvider = readString(env, "VITE_BACKEND_PROVIDER", "appwrite").toLowerCase();

  if (backendProvider !== "appwrite") {
    return [];
  }

  return REQUIRED_APPWRITE_KEYS.filter((key) => !readString(env, key));
}

export function buildFrontendDiagnostics(env: FrontendEnvSource): FrontendDiagnostics {
  const appwriteEndpoint = readString(env, "VITE_APPWRITE_ENDPOINT");

  return {
    backendProvider: readString(env, "VITE_BACKEND_PROVIDER", "appwrite"),
    buildCommit: readString(env, "VITE_BUILD_COMMIT"),
    appwriteEndpointHost: endpointHost(appwriteEndpoint),
    stripeCheckoutEnabled: readBoolean(env, "VITE_ENABLE_STRIPE_CHECKOUT", true),
    stripeCheckoutRawValue: readString(env, "VITE_ENABLE_STRIPE_CHECKOUT", "missing"),
    projectIdLoaded: Boolean(readString(env, "VITE_APPWRITE_PROJECT_ID")),
    databaseIdLoaded: Boolean(readString(env, "VITE_APPWRITE_DATABASE_ID")),
    storageBucketIdLoaded: Boolean(readString(env, "VITE_APPWRITE_STORAGE_BUCKET_ID")),
    mockFallbackEnabled: readBoolean(env, "VITE_ENABLE_MOCK_FALLBACK", false),
    qaEnvironment: readBoolean(env, "VITE_QA_ENVIRONMENT", true),
    missingAppwriteConfig: getMissingAppwriteConfig(env),
  };
}

export function describeAppwriteErrorWithDiagnostics(
  error: unknown,
  operation: string,
  diagnostics: FrontendDiagnostics,
) {
  const rawMessage = error instanceof Error ? error.message : "Unable to reach Appwrite.";
  const isFetchFailure =
    error instanceof TypeError && /failed to fetch|networkerror|load failed/i.test(rawMessage);
  const missingConfig = diagnostics.missingAppwriteConfig;

  if (missingConfig.length > 0) {
    return `${operation} cannot start because Appwrite frontend config is incomplete: ${missingConfig.join(", ")}.`;
  }

  if (isFetchFailure) {
    const host = diagnostics.appwriteEndpointHost || "the configured Appwrite endpoint";
    return `${operation} could not reach Appwrite at ${host}. Browser network/CORS failure detected; verify the Appwrite Web platform allows this site origin.`;
  }

  return rawMessage;
}
