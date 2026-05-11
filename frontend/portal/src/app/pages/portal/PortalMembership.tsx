import { Link } from "react-router";
import { BadgeCheck, ArrowRight } from "lucide-react";

import { usePortalSession } from "../../context/PortalSessionContext";

export function PortalMembership() {
  const session = usePortalSession();
  const tier = session.billing?.membership_tier ?? session.billing?.plan_name ?? session.membershipStatus ?? "Member";

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-1">Membership</h2>
        <p className="text-sm text-slate-500">Review your current RBP membership and account status.</p>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-extrabold text-slate-900 capitalize">{String(tier).replace(/_/g, " ")}</div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Membership data is loaded from your live Frappe portal session. Plan changes and onboarding actions remain handled through the supported membership flows.
            </p>
          </div>
        </div>
      </div>
      <Link to="/membership/overview" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800">
        View membership options <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
