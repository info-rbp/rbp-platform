import { Link } from "react-router";

import { ConfirmationPanel } from "../../components/flow";
import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import { StatusBadge } from "../../components/status";
import { membershipFlowStorageKey } from "../../features/membership/MembershipPurchaseOnboardingFlow";

interface StoredMembershipConfirmation {
  signupReference?: string;
  onboardingReference?: string;
  membershipTier?: "free" | "premium";
  membershipStatus?: string;
  paymentStatus?: string;
  onboardingStatus?: string;
  portalHref?: string;
  businessName?: string;
  primaryContactName?: string;
  selectedPlan?: string;
  returnTo?: string;
}

function readStoredConfirmation(): StoredMembershipConfirmation | null {
  const rawValue = window.sessionStorage.getItem(membershipFlowStorageKey);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as StoredMembershipConfirmation;
  } catch {
    return null;
  }
}

function formatLifecycleStatus(status: string | undefined, fallback: string) {
  return status ? status.replace(/-/g, " ") : fallback;
}

function formatPaymentStatus(status: string | undefined, membershipTier?: "free" | "premium") {
  if (membershipTier === "free" || status === "not-required") {
    return "No payment required";
  }

  if (status === "preview-complete" || status === "simulated-success") {
    return "Payment preview complete";
  }

  if (status === "simulated-failed") {
    return "Payment preview failed";
  }

  if (status === "pending") {
    return "Payment preview pending";
  }

  return status ? status.replace(/-/g, " ") : "not started";
}

export function MembershipConfirmationPage() {
  const confirmation = readStoredConfirmation();
  const isFree = confirmation?.membershipTier === "free";
  const primaryReference =
    confirmation?.onboardingReference ?? confirmation?.signupReference ?? "MEM-PREVIEW-001";

  const title = !confirmation
    ? "Membership Preview"
    : isFree
      ? "RBP Free Membership Activated"
      : "RBP Premium Membership Preview Confirmed";

  const message = !confirmation
    ? "No membership preview has been completed in this browser session."
    : isFree
      ? "Your Free Membership preview has been activated. You can now continue to onboarding, purchase products and services online, and manage your basic member profile."
      : "Your Premium Membership preview has been completed. Continue to the portal dashboard or review your premium membership inclusions.";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <ConfirmationPanel
            title={title}
            statusLabel={formatPaymentStatus(confirmation?.paymentStatus, confirmation?.membershipTier)}
            message={message}
            reference={primaryReference}
            primaryAction={
              <Link
                to={confirmation?.portalHref ?? "/portal/membership/checkout"}
                className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white"
              >
                {confirmation ? "Go to portal dashboard" : "Create account to continue"}
              </Link>
            }
            secondaryAction={
              <Link
                to={
                  !confirmation
                    ? "/membership/overview"
                    : isFree
                      ? confirmation.returnTo || "/marketplace"
                      : "/membership/inclusions"
                }
                className="rounded-xl border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-700"
              >
                {!confirmation
                  ? "View Membership Options"
                  : isFree
                    ? confirmation.returnTo
                      ? "Continue Purchase"
                      : "Browse Marketplace"
                    : "View Premium Inclusions"}
              </Link>
            }
          />

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Membership status summary</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge
                status={confirmation?.membershipStatus ?? "placeholder"}
                label={`Membership: ${formatLifecycleStatus(confirmation?.membershipStatus, "preview")}`}
              />
              <StatusBadge
                status={confirmation?.paymentStatus ?? "placeholder"}
                label={`Payment: ${formatPaymentStatus(confirmation?.paymentStatus, confirmation?.membershipTier)}`}
              />
              <StatusBadge
                status={confirmation?.onboardingStatus ?? "placeholder"}
                label={`Onboarding: ${formatLifecycleStatus(confirmation?.onboardingStatus, "not started")}`}
              />
            </div>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-slate-500">Business</dt>
                <dd className="mt-1 text-slate-900">{confirmation?.businessName ?? "Not captured"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Contact</dt>
                <dd className="mt-1 text-slate-900">{confirmation?.primaryContactName ?? "Not captured"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Plan</dt>
                <dd className="mt-1 text-slate-900">
                  {confirmation?.selectedPlan ?? (isFree ? "RBP Free Membership" : "RBP Premium Membership")}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
