import { callFrappeMethod } from "./client";
import type { PublicRuntimeSettingsPayload } from "../config/runtime";

const runtimeMethods = [
  "rbp_app.api.runtime.get_public_runtime_config",
  "rbp_app.services.settings.get_public_runtime_settings",
] as const;

export async function getPublicRuntimeConfig() {
  const [primary, fallbackMethod] = runtimeMethods;
  const response = await callFrappeMethod<PublicRuntimeSettingsPayload>(primary);

  if (response.ok) {
    return response;
  }

  return callFrappeMethod<PublicRuntimeSettingsPayload>(fallbackMethod);
}
