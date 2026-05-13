import { callFrappeMethod } from "./client";

export type RbpApplication = {
  name: string;
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
  public_cta_label: string;
  portal_cta_label: string;
};

export async function listPublicApplications() {
  return callFrappeMethod<RbpApplication[]>(
    "rbp_app.api.applications.list_public_applications",
    {},
    { method: "GET" }
  );
}

export async function listPortalApplications() {
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
}

export async function registerApplicationInterest(input: {
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
}

export const applicationsApi = {
  listPublicApplications,
  listPortalApplications,
  registerInterest: registerApplicationInterest,
  registerApplicationInterest,
};
