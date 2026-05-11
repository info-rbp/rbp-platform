import { callFrappeMethod } from "./client";
import type { PortalDashboardPayload } from "./types";

export function getPortalDashboard() {
  return callFrappeMethod<PortalDashboardPayload>("rbp_app.api.dashboard.get_home");
}
