function readBoolean(value: unknown, fallback: boolean) {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).toLowerCase() === "true";
}

function readString(value: unknown, fallback: string) {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

export const environment = {
  qaEnvironment: readBoolean(import.meta.env.VITE_QA_ENVIRONMENT, false),
  publicSiteUrl: readString(import.meta.env.VITE_PUBLIC_SITE_URL, "http://localhost:5173"),
  apiBaseUrl: readString(import.meta.env.VITE_API_BASE_URL, ""),
  features: {
    applications: readBoolean(import.meta.env.VITE_ENABLE_APPLICATIONS, false),
    application_interest: readBoolean(import.meta.env.VITE_ENABLE_APPLICATION_INTEREST, true),
    application_provisioning: readBoolean(import.meta.env.VITE_ENABLE_APPLICATION_PROVISIONING, false),
    admin_applications: readBoolean(import.meta.env.VITE_ENABLE_ADMIN_APPLICATIONS, true),
    stripe_checkout: readBoolean(import.meta.env.VITE_ENABLE_STRIPE_CHECKOUT, true),
    email_notifications: readBoolean(import.meta.env.VITE_ENABLE_EMAIL_NOTIFICATIONS, true),
    mock_auth: readBoolean(import.meta.env.VITE_ENABLE_MOCK_AUTH, true),
  },
} as const;

export type RuntimeEnvironment = typeof environment;
