export function applicationProvisioningDisabledTest() {
  return {
    name: "application provisioning remains disabled",
    expectedFlags: {
      VITE_ENABLE_APPLICATIONS: false,
      VITE_ENABLE_APPLICATION_INTEREST: true,
      VITE_ENABLE_APPLICATION_PROVISIONING: false,
      VITE_ENABLE_ADMIN_APPLICATIONS: true,
    },
  };
}
