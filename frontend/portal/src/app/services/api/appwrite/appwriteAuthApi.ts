import type { PortalCustomerAuthUser } from "../../../types/portal";
import { apiFailure, apiSuccess } from "../client";
import {
  createAccount,
  createEmailPasswordSession,
  deleteCurrentSession,
  getCurrentAccount,
} from "../../../lib/appwrite/account";
import { invokeAppwriteFunction } from "../../../lib/appwrite/functions";

function normaliseUser(payload: { $id: string; email: string; name?: string }): PortalCustomerAuthUser {
  return {
    id: payload.$id,
    name: payload.name ?? payload.email,
    email: payload.email,
  };
}

export const appwriteAuthApi = {
  async getCurrentUser() {
    try {
      const account = await getCurrentAccount();
      return apiSuccess("appwrite/account", normaliseUser(account));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load the current Appwrite account.";
      return apiFailure<PortalCustomerAuthUser>("appwrite/account", message, [
        { field: "account", code: "invalid", message },
      ]);
    }
  },

  async signIn(payload: { email: string; password: string }) {
    try {
      await createEmailPasswordSession(payload);
      return this.getCurrentUser();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in with Appwrite.";
      return apiFailure<PortalCustomerAuthUser>("appwrite/account/sessions/email", message, [
        { field: "account", code: "invalid", message },
      ]);
    }
  },

  async signUp(payload: { name: string; email: string; businessName?: string; password?: string }) {
    if (!payload.password) {
      return apiFailure<PortalCustomerAuthUser>("appwrite/account", "Password is required to create an Appwrite account.", [
        { field: "password", code: "required", message: "Password is required." },
      ]);
    }

    try {
      const account = await createAccount({
        email: payload.email,
        password: payload.password,
        name: payload.name,
      });
      await createEmailPasswordSession({ email: payload.email, password: payload.password });
      await invokeAppwriteFunction("bootstrap-tenant", {
        businessName: payload.businessName,
        accountId: account.$id,
        email: payload.email,
        name: payload.name,
      });

      return apiSuccess("appwrite/account", {
        ...normaliseUser(account),
        businessName: payload.businessName,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create an Appwrite account.";
      return apiFailure<PortalCustomerAuthUser>("appwrite/account", message, [
        { field: "account", code: "invalid", message },
      ]);
    }
  },

  async signOut() {
    try {
      await deleteCurrentSession();
      return apiSuccess("appwrite/account/sessions/current", { signedOut: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign out of Appwrite.";
      return apiFailure<{ signedOut: true }>("appwrite/account/sessions/current", message, [
        { field: "account", code: "invalid", message },
      ]);
    }
  },
};
