import { environment, type RuntimeEnvironment } from "./environment";

export type BackendProvider = "appwrite" | "mock";

export function getBackendProvider(
  config: Pick<RuntimeEnvironment, "backendProvider"> = environment
): BackendProvider {
  const raw = String(config.backendProvider || "appwrite").toLowerCase();

  if (raw === "mock") return "mock";

  // Frappe is intentionally not an active QA or production backend provider.
  // Historical Frappe assets may remain for migration/reference only, but runtime
  // traffic must resolve to Appwrite unless explicit mock mode is enabled.
  return "appwrite";
}

export function isAppwriteProvider(config: Pick<RuntimeEnvironment, "backendProvider"> = environment) {
  return getBackendProvider(config) === "appwrite";
}
