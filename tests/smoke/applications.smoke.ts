// Foundation fixture only. This file captures intended smoke expectations,
// but it is not yet wired into an executable smoke runner.
export function applicationsSmokeSpec() {
  return [
    "public applications page renders next-rollout copy",
    "portal applications page offers register-interest actions only",
    "customer provisioning remains disabled",
  ];
}