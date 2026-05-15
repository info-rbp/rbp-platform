import { environment, type RuntimeEnvironment } from "./environment";

export type BackendProvider = "appwrite" | "frappe" | "mock";

export function getBackendProvider(
  config: Pick<RuntimeEnvironment, "backendProvider"> = environment
): BackendProvider {
  const raw = String(config.backendProvider || "appwrite").toLowerCase();
  if (raw === "frappe") return "frappe";
  if (raw === "mock") return "mock";
  return "appwrite";
}

export function isAppwriteProvider(config: Pick<RuntimeEnvironment, "backendProvider"> = environment) {
  return getBackendProvider(config) === "appwrite";
}
