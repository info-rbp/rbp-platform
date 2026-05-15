import { environment } from "../../config/environment";
import { getBackendProvider, type BackendProvider } from "../../config/backendProvider";

export function getActiveBackendProvider(): BackendProvider {
  return getBackendProvider(environment);
}

export function selectApiImplementation<T>(implementations: {
  appwrite: T;
  frappe: T;
  mock?: T;
}): T {
  const provider = getActiveBackendProvider();

  if (provider === "appwrite") {
    return implementations.appwrite;
  }

  if (provider === "mock" && implementations.mock) {
    return implementations.mock;
  }

  return implementations.frappe;
}
