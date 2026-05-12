import type { ReactNode } from "react";
import { useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { ArrowRight, Briefcase, LockKeyhole } from "lucide-react";

import {
  createAuthHref,
  getSafeReturnTo,
  mockAdminAuthService,
  mockAuthService,
  savePendingAccountIntent,
} from "../../services/mock/auth.mockService";
import type { PortalProductKey } from "../../types/portal";

function inferIntentFromPath(pathname: string): { label: string; product?: PortalProductKey } {
  if (pathname.includes("/decision-desk")) {
    return { label: "Start a Decision Desk request", product: "decision-desk" };
  }

  if (pathname.includes("/docushare")) {
    return { label: "Submit a DocuShare brief", product: "docushare" };
  }

  if (pathname.includes("/nbn")) {
    return { label: "Order NBN through your account", product: "connectivity" };
  }

  if (pathname.includes("/risk-advisor")) {
    return { label: "Start a Risk Advisor assessment", product: "risk-advisor" };
  }

  if (pathname.includes("/the-fixer")) {
    return { label: "Start a Fixer request", product: "the-fixer" };
  }

  if (pathname.includes("/marketplace/listings")) {
    return { label: "Create a marketplace listing", product: "marketplace-listing" };
  }

  if (pathname.includes("/marketplace/offers")) {
    return { label: "Make a marketplace offer", product: "marketplace-offer" };
  }

  if (pathname.includes("/membership/checkout")) {
    return { label: "Complete membership checkout", product: "membership" };
  }

  return { label: "Continue in portal" };
}

interface GateIntent {
  label: string;
  returnTo: string;
  product?: PortalProductKey;
  authPath?: "/signin" | "/signup";
}

export function useAccountGate(intent: GateIntent) {
  const location = useLocation();
  const returnTo = getSafeReturnTo(intent.returnTo);
  const authPath = intent.authPath ?? "/signin";

  function rememberIntent() {
    savePendingAccountIntent({
      label: intent.label,
      returnTo,
      sourcePath: `${location.pathname}${location.search}${location.hash}`,
      product: intent.product,
    });
  }

  return {
    isAuthenticated: mockAuthService.isAuthenticated(),
    href: createAuthHref(returnTo, authPath),
    returnTo,
    rememberIntent,
  };
}

export function RequireAccountGate({
  children,
  returnTo,
  label,
  product,
  authPath = "/signin",
}: {
  children: ReactNode;
  returnTo?: string;
  label?: string;
  product?: PortalProductKey;
  authPath?: "/signin" | "/signup";
}) {
  const location = useLocation();
  const target = returnTo ?? `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    if (!mockAuthService.isAuthenticated()) {
      savePendingAccountIntent({
        label: label ?? "Continue in portal",
        returnTo: target,
        sourcePath: `${location.pathname}${location.search}${location.hash}`,
        product,
      });
    }
  }, [label, location.hash, location.pathname, location.search, product, target]);

  if (!mockAuthService.isAuthenticated()) {
    return <Navigate to={createAuthHref(target, authPath)} replace />;
  }

  return <>{children}</>;
}

export function AccountGatePage({
  title = "Sign in to continue",
  description = "This action needs an RBP account so requests, orders, listings, payments, and status updates stay inside the secure portal.",
  returnTo,
  label = "Continue in portal",
  product,
  authPath = "/signin",
}: {
  title?: string;
  description?: string;
  returnTo: string;
  label?: string;
  product?: PortalProductKey;
  authPath?: "/signin" | "/signup";
}) {
  const gate = useAccountGate({ label, returnTo, product, authPath });

  useEffect(() => {
    gate.rememberIntent();
  }, []);

  if (gate.isAuthenticated) {
    return <Navigate to={gate.returnTo} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-7 shadow-xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-black text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white">
            <Briefcase className="h-4 w-4" />
          </span>
          Remote Business Partner
        </Link>

        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Pending action</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{label}</p>
          <p className="mt-1 break-all text-xs text-slate-500">{gate.returnTo}</p>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            to={gate.href}
            onClick={gate.rememberIntent}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800"
          >
            {authPath === "/signup" ? "Create account to continue" : "Sign in to continue"}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to={`/signup?returnTo=${encodeURIComponent(gate.returnTo)}`}
            onClick={gate.rememberIntent}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export function RequireCustomerAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const target = `${location.pathname}${location.search}${location.hash}`;

  if (!mockAuthService.isAuthenticated()) {
    const inferred = inferIntentFromPath(location.pathname);

    savePendingAccountIntent({
      ...inferred,
      returnTo: target,
      sourcePath: target,
    });

    return <Navigate to={createAuthHref(target)} replace />;
  }

  return <>{children}</>;
}

export function RequireAdminAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const customerSignedIn = mockAuthService.isAuthenticated();

  if (mockAdminAuthService.isAuthenticated()) {
    return <>{children}</>;
  }

  if (customerSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
        <div className="max-w-md rounded-2xl border border-red-900/60 bg-slate-900 p-7">
          <h1 className="text-2xl font-extrabold">Access denied</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Customer portal access does not grant administrator permissions. Sign out of the customer account or use an administrator account.
          </p>
          <Link
            to="/admin/signin"
            state={{ from: location.pathname }}
            className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-600"
          >
            Admin sign-in
          </Link>
        </div>
      </div>
    );
  }

  return <Navigate to="/admin/signin" replace state={{ from: location.pathname }} />;
}
