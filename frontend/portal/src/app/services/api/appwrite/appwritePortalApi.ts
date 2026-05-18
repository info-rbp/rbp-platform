import type { PortalDashboardState } from "../../../types/portal";
import { apiFailure, apiSuccess } from "../client";
import { invokeAppwriteFunction } from "../../../lib/appwrite/functions";
import { unwrapPortalDashboardPayload } from "../portalDashboardState";

export const appwritePortalApi = {
  async getDashboardState() {
    try {
      const response = await invokeAppwriteFunction<unknown>("admin-operations", {
        action: "get_portal_dashboard",
      });
      const dashboardState = unwrapPortalDashboardPayload(response) as PortalDashboardState;
      return apiSuccess("appwrite/functions/admin-operations", dashboardState, "Portal dashboard returned from Appwrite.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load the portal dashboard from Appwrite.";
      return apiFailure<PortalDashboardState>("appwrite/functions/admin-operations", message, [
        { field: "portal", code: "invalid", message },
      ]);
    }
  },
};
