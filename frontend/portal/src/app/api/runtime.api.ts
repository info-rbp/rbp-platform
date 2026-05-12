import { callFrappeMethod } from "./client";
import type { PublicRuntimeConfig } from "../config/runtime";

export function getPublicRuntimeConfig() {
  return callFrappeMethod<PublicRuntimeConfig>("rbp_app.api.runtime.get_public_runtime_config");
}
