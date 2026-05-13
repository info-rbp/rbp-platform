import type { PortalCustomerAuthUser } from "../../types/portal";
import { apiFailure, apiSuccess, callFrappeMethod } from "./client";

interface FrappeUserPayload {
  user?: string;
  name?: string;
  email?: string;
  full_name?: string;
  user_type?: string;
  roles?: string[];
  is_admin?: boolean;
  is_system_manager?: boolean;
}

function normaliseUser(payload: FrappeUserPayload): PortalCustomerAuthUser {
  const email = payload.email ?? payload.user ?? payload.name ?? "";
  return {
    id: payload.name ?? payload.user ?? email,
    name: payload.full_name ?? email,
    email,
  };
}

export const authApi = {
  async getCurrentUser() {
    const response = await callFrappeMethod<FrappeUserPayload>("rbp_app.api.me.get_current_user", {}, { method: "GET" });

    if (!response.ok || !response.data) {
      return apiFailure<PortalCustomerAuthUser>(
        "/api/method/rbp_app.api.me.get_current_user",
        response.message,
        response.errors
      );
    }

    return apiSuccess("/api/method/rbp_app.api.me.get_current_user", normaliseUser(response.data));
  },

  async signIn(payload: { email: string; password: string }) {
    const response = await callFrappeMethod<unknown>("login", {
      usr: payload.email,
      pwd: payload.password,
    });

    if (!response.ok) {
      return apiFailure<PortalCustomerAuthUser>("/api/method/login", response.message, response.errors);
    }

    return this.getCurrentUser();
  },

  async signUp(payload: { name: string; email: string; businessName?: string }) {
    const response = await callFrappeMethod<unknown>("rbp_app.api.membership.create_signup", {
      payload: {
        name: payload.name,
        email: payload.email,
        business_name: payload.businessName,
      },
    });

    if (!response.ok) {
      return apiFailure<PortalCustomerAuthUser>(
        "/api/method/rbp_app.api.membership.create_signup",
        response.message,
        response.errors
      );
    }

    return apiSuccess("/api/method/rbp_app.api.membership.create_signup", {
      id: payload.email,
      name: payload.name,
      email: payload.email,
      businessName: payload.businessName,
    });
  },

  async signOut() {
    const response = await callFrappeMethod<unknown>("logout", {});
    if (!response.ok) {
      return apiFailure<{ signedOut: true }>("/api/method/logout", response.message, response.errors);
    }

    return apiSuccess("/api/method/logout", { signedOut: true });
  },
};
