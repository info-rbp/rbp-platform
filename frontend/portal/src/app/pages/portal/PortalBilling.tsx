import { CreditCard } from "lucide-react";

import { usePortalSession } from "../../context/PortalSessionContext";

export function PortalBilling() {
  const session = usePortalSession();
  const billing = session.billing;

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-1">Billing</h2>
        <p className="text-sm text-slate-500">Live billing and subscription summary for your member account.</p>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <CreditCard className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-extrabold text-slate-900">
              {billing?.plan_name ?? billing?.plan ?? billing?.membership_plan ?? "Billing summary"}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Status: <span className="font-semibold capitalize text-slate-700">{billing?.status ?? billing?.subscription_status ?? "Not available"}</span>
            </p>
            {!billing?.billing_enabled ? (
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Payments are managed through supported RBP billing processes. No fake payment or upload action is available from this portal page.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
