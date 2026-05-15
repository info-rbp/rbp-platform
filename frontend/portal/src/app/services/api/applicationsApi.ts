import { callFrappeMethod } from "./client";
import { selectApiImplementation } from "./provider";
import {
  appwriteApplicationsApi,
  type RbpApplication,
} from "./appwrite/appwriteApplicationsApi";

const legacyApplicationsApi = {
  async listPublicApplications() {
    return callFrappeMethod<RbpApplication[]>(
      "rbp_app.api.applications.list_public_applications",
      {},
      { method: "GET" }
    );
  },

  async listPortalApplications() {
    const response = await callFrappeMethod<RbpApplication[]>(
      "rbp_app.api.applications.list_portal_applications",
      {},
      { method: "GET" }
    );

    if (response.ok) {
      return response;
    }

    return callFrappeMethod<RbpApplication[]>(
      "rbp_app.api.apps.get_available_apps",
      {},
      { method: "GET" }
    );
  },

  async registerInterest(input: {
    application_key: string;
    email?: string;
    phone?: string;
    interest_notes?: string;
    source_channel?: string;
  }) {
    return callFrappeMethod<{
      ok: boolean;
      interest_id?: string;
      application?: string;
    }>("rbp_app.api.applications.register_application_interest", input);
  },
};

export const applicationsApi = selectApiImplementation({
  appwrite: appwriteApplicationsApi,
  frappe: legacyApplicationsApi,
});

export type { RbpApplication } from "./appwrite/appwriteApplicationsApi";
export const listPublicApplications = (...args: Parameters<typeof applicationsApi.listPublicApplications>) => applicationsApi.listPublicApplications(...args);
export const listPortalApplications = (...args: Parameters<typeof applicationsApi.listPortalApplications>) => applicationsApi.listPortalApplications(...args);
export const registerApplicationInterest = (...args: Parameters<typeof applicationsApi.registerInterest>) => applicationsApi.registerInterest(...args);
