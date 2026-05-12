import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { useRuntimeConfig } from "../hooks/useRuntimeConfig";

export function EnvironmentBanner() {
  const { config, source, error } = useRuntimeConfig();

  const chips = [
    `Environment: ${config.environment.toUpperCase()}`,
    config.stripe.enabled ? `Stripe: ${config.stripe.mode}` : "Stripe: off",
    `Email: ${config.email.delivery_mode}`,
    config.features.application_provisioning ? "App provisioning: on" : "App provisioning: off",
  ];

  if (!config.qa_banner_enabled && source === "backend" && !error) {
    return null;
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-amber-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs font-semibold sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {error ? <AlertTriangle className="h-4 w-4 text-amber-700" /> : <CheckCircle2 className="h-4 w-4 text-amber-700" />}
          <span>Runtime status</span>
          <span className="text-amber-800/80">({source})</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <span key={chip} className="rounded-full border border-amber-200 bg-white/70 px-2 py-1">
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
