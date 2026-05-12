import { Navigate, Outlet, useLocation } from "react-router";

import { getAuthSession } from "./authSession";

function currentPath(location: ReturnType<typeof useLocation>) {
  return `${location.pathname}${location.search}${location.hash}`;
}

export function RequireAuth() {
  const location = useLocation();
  const session = getAuthSession();

  if (!session) {
    return <Navigate to={`/sign-in?returnTo=${encodeURIComponent(currentPath(location))}`} replace />;
  }

  return <Outlet />;
}
