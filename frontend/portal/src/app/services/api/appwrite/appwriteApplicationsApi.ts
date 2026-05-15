import { apiFailure, apiSuccess } from "../client";
import { listDocuments } from "../../../lib/appwrite/databases";
import { invokeAppwriteFunction } from "../../../lib/appwrite/functions";

export type RbpApplication = {
  name?: string;
  $id?: string;
  application_name: string;
  application_key: string;
  category?: string;
  short_description?: string;
  public_description?: string;
  portal_description?: string;
  icon?: string;
  status: string;
  visibility: string;
  interest_enabled: boolean;
  provisioning_enabled: boolean;
  public_cta_label?: string;
  portal_cta_label?: string;
};

export const appwriteApplicationsApi = {
  async listPublicApplications() {
    try {
      const response = await listDocuments<RbpApplication>("applications");
      return apiSuccess("appwrite/applications", response.documents ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load applications from Appwrite.";
      return apiFailure<RbpApplication[]>("appwrite/applications", message, [
        { field: "applications", code: "invalid", message },
      ]);
    }
  },

  listPortalApplications() {
    return this.listPublicApplications();
  },

  async registerInterest(input: {
    application_key: string;
    email?: string;
    phone?: string;
    interest_notes?: string;
    source_channel?: string;
  }) {
    try {
      const response = await invokeAppwriteFunction<{ ok: boolean; interest_id?: string; application?: string }>(
        "admin-operations",
        {
          action: "register_application_interest",
          payload: input,
        }
      );
      return apiSuccess("appwrite/functions/admin-operations", response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to register application interest.";
      return apiFailure<{ ok: boolean; interest_id?: string; application?: string }>(
        "appwrite/functions/admin-operations",
        message,
        [{ field: "applications", code: "invalid", message }]
      );
    }
  },
};
