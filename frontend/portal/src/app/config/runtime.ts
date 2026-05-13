import { environment, type RuntimeEnvironment } from "./environment";

export type RuntimeConfig = RuntimeEnvironment;

export function getRuntimeConfig(): RuntimeConfig {
  return environment;
}

export function canShowPublicApplications(config: RuntimeConfig = environment) {
  return config.features.applications || config.features.application_interest;
}
