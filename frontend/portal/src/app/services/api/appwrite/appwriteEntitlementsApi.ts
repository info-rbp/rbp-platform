import { apiFailure, apiSuccess } from "../client";
import { invokeAppwriteFunction } from "../../../lib/appwrite/functions";

export const appwriteEntitlementsApi = {
  async listMyEntitlements() {
    try {
      const response = await invokeAppwriteFunction("list-my-entitlements", {});
      return apiSuccess("appwrite/functions/list-my-entitlements", response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load entitlements from Appwrite.";
      return apiFailure<unknown>("appwrite/functions/list-my-entitlements", message, [
        { field: "entitlements", code: "invalid", message },
      ]);
    }
  },
};
