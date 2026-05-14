function readBoolean(value: unknown, fallback: boolean) {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).toLowerCase() === "true";
}

function readString(value: unknown, fallback: string) {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

const enableApplications = readBoolean(import.meta.env.VITE_ENABLE_APPLICATIONS, false);
const enableApplicationInterest = readBoolean(
  import.meta.env.VITE_ENABLE_APPLICATION_INTEREST,
  true
);
const enableApplicationProvisioning = readBoolean(
  import.meta.env.VITE_ENABLE_APPLICATION_PROVISIONING,
  false
);
const enableAdminApplications = readBoolean(
  import.meta.env.VITE_ENABLE_ADMIN_APPLICATIONS,
  true
);
const enableStripeCheckout = readBoolean(
  import.meta.env.VITE_ENABLE_STRIPE_CHECKOUT,
  true
);
const enableEmailNotifications = readBoolean(
  import.meta.env.VITE_ENABLE_EMAIL_NOTIFICATIONS,
  true
);
const enableMockAuth = readBoolean(import.meta.env.VITE_ENABLE_MOCK_AUTH, true);

export const environment = {
  qaEnvironment: readBoolean(import.meta.env.VITE_QA_ENVIRONMENT, false),
  publicSiteUrl: readString(
    import.meta.env.VITE_PUBLIC_SITE_URL,
    "http://localhost:5173"
  ),
  apiBaseUrl: readString(import.meta.env.VITE_API_BASE_URL, "http://localhost:8000"),
  frappeDeskUrl: readString(import.meta.env.VITE_FRAPPE_DESK_URL, ""),
  enableApplications,
  enableApplicationInterest,
  enableApplicationProvisioning,
  enableAdminApplications,
  enableStripeCheckout,
  enableEmailNotifications,
  stripeMode: readString(import.meta.env.VITE_STRIPE_MODE, "test"),
  emailSandboxMode: readBoolean(import.meta.env.VITE_EMAIL_SANDBOX_MODE, true),
  enableMockAuth,
  features: {
    applications: enableApplications,
    application_interest: enableApplicationInterest,
    application_provisioning: enableApplicationProvisioning,
    admin_applications: enableAdminApplications,
    stripe_checkout: enableStripeCheckout,
    email_notifications: enableEmailNotifications,
    mock_auth: enableMockAuth,
  },
} as const;

export type RuntimeEnvironment = typeof environment;
