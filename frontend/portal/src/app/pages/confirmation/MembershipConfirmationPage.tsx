import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router";

import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import { StatusBadge } from "../../components/status";
import { isAuthenticated } from "../../auth/authSession";
import {
  getDevelopmentMembershipConfirmationFromBrowserSession,
  getMembershipConfirmation,
  type MembershipConfirmation,
} from "../../services/membershipConfirmationService";

function formatStatus(status: string | undefined) {
  return status ? status.replace(/_/g, " ").replace(/-/g, " ") : "unknown";
}

function useConfirmationReference() {
  const [searchParams] = useSearchParams();

  return useMemo(
    () => searchParams.get("confirmationId") ?? searchParams.get("reference") ?? "",
    [searchParams]
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  message,
  tone = "neutral",
  children,
}: {
  eyebrow: string;
  title: string;
  message: string;
  tone?: "success" | "warning" | "neutral";
  children?: ReactNode;
}) {
  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    neutral: "border-slate-200 bg-white text-slate-700",
  };

  return (
    <section className={`rounded-3xl border p-6 shadow-sm ${styles[tone]}`}>
      <p className="text-sm font-semibold uppercase tracking-wide">{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-950">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{message}</p>
      {children}
    </section>
  );
}

function DetailSummary({ confirmation, isDevelopmentPreview }: {
  confirmation: MembershipConfirmation;
  isDevelopmentPreview?: boolean;
}) {
  const prefix = isDevelopmentPreview ? "Development mock" : "Verified";

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-950">Confirmation summary</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge
          status={confirmation.status}
          label={`${prefix} membership: ${formatStatus(confirmation.status)}`}
        />
        {confirmation.paymentStatus ? (
          <StatusBadge
            status={confirmation.paymentStatus}
            label={`${prefix} payment: ${formatStatus(confirmation.paymentStatus)}`}
          />
        ) : null}
        {confirmation.onboardingStatus ? (
          <StatusBadge
            status={confirmation.onboardingStatus}
            label={`${prefix} onboarding: ${formatStatus(confirmation.onboardingStatus)}`}
          />
        ) : null}
      </div>
      <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-slate-500">Reference</dt>
          <dd className="mt-1 break-all text-slate-900">{confirmation.reference}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Plan</dt>
          <dd className="mt-1 text-slate-900">{confirmation.selectedPlan ?? "Not provided"}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Business</dt>
          <dd className="mt-1 text-slate-900">{confirmation.businessName ?? "Not provided"}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Contact</dt>
          <dd className="mt-1 text-slate-900">{confirmation.contactName ?? "Not provided"}</dd>
        </div>
      </dl>
    </section>
  );
}

function RealConfirmationState({ confirmation }: { confirmation: MembershipConfirmation }) {
  const canOpenPortal = Boolean(confirmation.portalHref || isAuthenticated());
  const portalHref = confirmation.portalHref ?? "/portal/dashboard";

  return (
    <>
      <Panel
        tone="success"
        eyebrow="Membership confirmation verified"
        title="Your membership confirmation is verified"
        message="We verified this confirmation from the backend confirmation source. Use the actions below to continue."
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {canOpenPortal ? (
            <Link
              to={portalHref}
              className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white"
            >
              Open portal dashboard
            </Link>
          ) : null}
          <Link
            to="/membership/overview"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Return to membership
          </Link>
        </div>
      </Panel>
      <DetailSummary confirmation={confirmation} />
    </>
  );
}

function DevelopmentPreviewState({ confirmation }: { confirmation: MembershipConfirmation }) {
  return (
    <>
      <Panel
        tone="warning"
        eyebrow="Development preview only"
        title="Mock browser session confirmation"
        message="This page is using mock browser session data. No real membership, payment, account, or portal access has been created."
      >
        <div className="mt-6 rounded-2xl border border-amber-200 bg-white p-4 text-sm leading-6 text-amber-900">
          Use this state only for local frontend QA. Staging and production must verify membership
          status through the backend confirmation API before showing a success state.
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/membership/overview"
            className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white"
          >
            Return to membership
          </Link>
          {confirmation.portalHref ? (
            <Link
              to={confirmation.portalHref}
              className="rounded-xl border border-amber-300 bg-white px-5 py-3 text-sm font-semibold text-amber-800"
            >
              Open development portal preview
            </Link>
          ) : null}
        </div>
      </Panel>
      <DetailSummary confirmation={confirmation} isDevelopmentPreview />
    </>
  );
}

function SafeFallbackState({ reference }: { reference: string }) {
  return (
    <Panel
      eyebrow="Confirmation not verified"
      title="We could not verify a membership confirmation for this session"
      message={
        reference
          ? "A confirmation reference was provided, but this frontend could not verify it with a backend confirmation source."
          : "No backend confirmation reference was provided. Browser session data is not enough to confirm a real membership, payment, account, or portal access."
      }
    >
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/membership/overview"
          className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white"
        >
          Return to membership
        </Link>
        <Link
          to="/contact"
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
        >
          Contact support
        </Link>
        <Link
          to="/sign-in"
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
        >
          Sign in
        </Link>
      </div>
    </Panel>
  );
}

export function MembershipConfirmationPage() {
  const reference = useConfirmationReference();
  const [backendConfirmation, setBackendConfirmation] =
    useState<MembershipConfirmation | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(reference));

  useEffect(() => {
    let mounted = true;

    if (!reference) {
      setBackendConfirmation(null);
      setIsLoading(false);
      return () => {
        mounted = false;
      };
    }

    setIsLoading(true);
    getMembershipConfirmation(reference).then((confirmation) => {
      if (!mounted) {
        return;
      }

      setBackendConfirmation(confirmation);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [reference]);

  const developmentConfirmation = backendConfirmation
    ? null
    : getDevelopmentMembershipConfirmationFromBrowserSession();

  if (isLoading) {
    return (
      <PageShell>
        <Panel
          eyebrow="Verifying confirmation"
          title="Checking membership confirmation"
          message="We are checking the confirmation reference against the membership confirmation service."
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      {backendConfirmation ? (
        <RealConfirmationState confirmation={backendConfirmation} />
      ) : developmentConfirmation ? (
        <DevelopmentPreviewState confirmation={developmentConfirmation} />
      ) : (
        <SafeFallbackState reference={reference} />
      )}
    </PageShell>
  );
}
