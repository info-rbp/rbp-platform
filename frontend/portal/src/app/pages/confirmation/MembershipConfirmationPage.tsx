import { Link } from "react-router";

import { ConfirmationPanel } from "../../components/flow";
import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import { StatusBadge } from "../../components/status";
import { membershipFlowStorageKey } from "../../features/membership/MembershipPurchaseOnboardingFlow";

interface StoredMembershipConfirmation {
  signupReference?: string;
  onboardingReference?: string;
  membershipStatus?: string;
  paymentStatus?: string;
  onboardingStatus?: string;
  portalHref?: string;
  businessName?: string;
  primaryContactName?: string;
  selectedPlan?: string;
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

function formatPaymentStatus(status: string | undefined) {
  if (status === "simulated-success") {
    return "payment preview complete";
  }

  if (status === "simulated-failed") {
    return "payment preview failed";
  }

  if (status === "pending") {
    return "payment preview pending";
  }

  return status ? status.replace(/-/g, " ") : "not started";
}

export function MembershipConfirmationPage() {
  const confirmation = readStoredConfirmation();
  const primaryReference =
    confirmation?.onboardingReference ?? confirmation?.signupReference ?? "MEM-PREVIEW-001";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <ConfirmationPanel
            title={
              confirmation?.onboardingStatus === "complete"
                ? "Membership onboarding preview complete"
                : "RBP Premium Membership Preview Confirmed"
            }
            statusLabel="Membership preview saved"
            message={
              confirmation
                ? "This confirmation reflects the latest membership preview state saved in this browser session. This frontend preview does not process a real payment or create a live account."
                : "This confirmation preview is shown when the sign-up flow has not been completed in the current browser session."
            }
            reference={primaryReference}
            primaryAction={
              <Link
                to={confirmation?.portalHref ?? "/portal/dashboard"}
                className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white"
              >
                Go to portal dashboard
              </Link>
            }
            secondaryAction={
              <Link
                to="/membership/sign-up-now"
                className="rounded-xl border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-700"
              >
                Return to sign-up
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
                label={`Payment: ${formatPaymentStatus(confirmation?.paymentStatus)}`}
              />
              <StatusBadge
                status={confirmation?.onboardingStatus ?? "placeholder"}
                label={`Onboarding: ${formatLifecycleStatus(confirmation?.onboardingStatus, "not started")}`}
              />
            </div>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-slate-500">Business</dt>
                <dd className="mt-1 text-slate-900">
                  {confirmation?.businessName ?? "Not captured"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Contact</dt>
                <dd className="mt-1 text-slate-900">
                  {confirmation?.primaryContactName ?? "Not captured"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Plan</dt>
                <dd className="mt-1 text-slate-900">
                  {confirmation?.selectedPlan ?? "RBP Premium Membership"}
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
