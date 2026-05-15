import { environment } from "../../config/environment";
import { getBackendProvider, type BackendProvider } from "../../config/backendProvider";

export function getActiveBackendProvider(): BackendProvider {
  return getBackendProvider(environment);
}

export function selectApiImplementation<T>(implementations: {
  appwrite: T;
  mock?: T;
  legacyFrappe?: T;
}): T {
  const provider = getActiveBackendProvider();

  if (provider === "mock" && implementations.mock) {
    return implementations.mock;
  }

  // Legacy Frappe adapters may remain in the codebase for comparison or migration
  // reference, but active QA and production traffic must resolve to Appwrite.
  return implementations.appwrite;
}