import { callFrappeMethod } from "./client";

export const applicationsApi = {
  listPortalApplications() {
    return callFrappeMethod("rbp_app.api.apps.get_available_apps", {}, { method: "GET" });
  },

  listPublicApplications() {
    return callFrappeMethod("rbp_app.api.applications.list_public_applications", {}, { method: "GET" });
  },

  registerInterest(payload: Record<string, unknown>) {
    return callFrappeMethod("rbp_app.api.applications.register_application_interest", {
      payload,
    });
  },
};
