import { environment, type RuntimeEnvironment } from "./environment";

export type PublicRuntimeSettingsPayload = {
  environment?: string;
  enable_application_provisioning?: boolean;
  enable_application_interest?: boolean;
  stripe_mode?: string;
  email_sandbox_mode?: boolean;
};

export type PublicRuntimeConfig = RuntimeEnvironment & {
  environment: string;
  stripeMode: string;
  emailSandboxMode: boolean;
};

function buildRuntimeConfig(
  payload: PublicRuntimeSettingsPayload = {}
): PublicRuntimeConfig {
  const enableApplicationInterest =
    payload.enable_application_interest ?? environment.enableApplicationInterest;
  const enableApplicationProvisioning =
    payload.enable_application_provisioning ??
    environment.enableApplicationProvisioning;

  return {
    ...environment,
    environment:
      payload.environment ?? (environment.qaEnvironment ? "qa" : "local"),
    enableApplicationInterest,
    enableApplicationProvisioning,
    stripeMode: payload.stripe_mode ?? environment.stripeMode,
    emailSandboxMode:
      payload.email_sandbox_mode ?? environment.emailSandboxMode,
    features: {
      ...environment.features,
      application_interest: enableApplicationInterest,
      application_provisioning: enableApplicationProvisioning,
    },
  };
}

export function getInitialRuntimeConfig(): PublicRuntimeConfig {
  return buildRuntimeConfig();
}

export function mergeRuntimeConfig(
  current: PublicRuntimeConfig,
  payload: PublicRuntimeSettingsPayload = {}
): PublicRuntimeConfig {
  return {
    ...current,
    ...buildRuntimeConfig(payload),
  };
}

export function getRuntimeConfig(): PublicRuntimeConfig {
  return getInitialRuntimeConfig();
}

export function canShowPublicApplications(
  config: PublicRuntimeConfig = getInitialRuntimeConfig()
) {
  return config.enableApplications || config.features.application_interest;
}
