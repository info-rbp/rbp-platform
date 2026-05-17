import { environment, frontendDiagnostics } from "../config/environment";

export function EnvironmentBanner() {
  if (!environment.qaEnvironment) {
    return null;
  }

  const flags = [
    `Backend ${environment.backendProvider}`,
    frontendDiagnostics.appwriteEndpointHost
      ? `Appwrite ${frontendDiagnostics.appwriteEndpointHost}`
      : "Appwrite endpoint missing",
    frontendDiagnostics.projectIdLoaded ? "Project loaded" : "Project missing",
    frontendDiagnostics.databaseIdLoaded ? "Database loaded" : "Database missing",
    frontendDiagnostics.storageBucketIdLoaded ? "Storage loaded" : "Storage missing",
    frontendDiagnostics.mockFallbackEnabled ? "Mock fallback enabled" : "Mock fallback disabled",
    environment.features.stripe_checkout ? "Stripe checkout enabled" : "Stripe checkout disabled",
    environment.features.application_provisioning ? "Applications provisioning enabled" : "Applications provisioning delayed",
    environment.features.email_notifications ? "Email notifications enabled" : "Email notifications disabled",
  ];

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs font-bold text-amber-900">
      QA Environment · {flags.join(" · ")}
    </div>
  );
}
