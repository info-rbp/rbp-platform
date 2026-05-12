import { Link, Navigate, Outlet, useLocation } from "react-router";
import { ArrowRight, ShieldAlert } from "lucide-react";

import { getAuthSession, isAdminUser } from "./authSession";

function currentPath(location: ReturnType<typeof useLocation>) {
  return `${location.pathname}${location.search}${location.hash}`;
}

function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-xl">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">Access denied</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Your current account is signed in, but it does not have the administrator role needed to
          view this area.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/portal/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800"
          >
            Back to dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function RequireAdmin() {
  const location = useLocation();
  const session = getAuthSession();

  if (!session) {
    return <Navigate to={`/admin/signin?returnTo=${encodeURIComponent(currentPath(location))}`} replace />;
  }

  if (!isAdminUser(session)) {
    return <AccessDeniedPage />;
  }

  return <Outlet />;
}
