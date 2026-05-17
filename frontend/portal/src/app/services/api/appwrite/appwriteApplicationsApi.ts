import { apiFailure, apiSuccess } from "../client";
import { listDocuments } from "../../../lib/appwrite/databases";
import {
  AppwriteFunctionError,
  invokeAppwriteFunction,
} from "../../../lib/appwrite/functions";

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

export type ApplicationInterestResult = {
  interest_id?: string;
  application?: string;
  already_registered?: boolean;
  message?: string;
};

function normaliseInterestResult(
  result: Record<string, unknown>,
  fallbackApplication: string,
): ApplicationInterestResult {
  const interestId = result.interest_id;
  const application = result.application;
  const alreadyRegistered = result.already_registered;
  const message = result.message;

  return {
    interest_id: typeof interestId === "string" ? interestId : undefined,
    application:
      typeof application === "string" && application.length > 0
        ? application
        : fallbackApplication,
    already_registered: alreadyRegistered === true,
    message: typeof message === "string" ? message : undefined,
  };
}

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
      const response = await invokeAppwriteFunction<Record<string, unknown>>(
        "admin-operations",
        {
          action: "register_application_interest",
          payload: input,
        }
      );
      return apiSuccess(
        "appwrite/functions/admin-operations",
        normaliseInterestResult(response, input.application_key),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to register application interest.";
      const functionErrors =
        error instanceof AppwriteFunctionError ? error.errors || [] : [];
      return apiFailure<ApplicationInterestResult>(
        "appwrite/functions/admin-operations",
        message,
        functionErrors.length > 0
          ? functionErrors.map((item) => ({
              field: item.field || "applications",
              code: item.code || "invalid",
              message: item.message || message,
            }))
          : [{ field: "applications", code: "invalid", message }],
      );
    }
  },
};
