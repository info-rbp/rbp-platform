import { callFrappeMethod } from "./client";
import { selectApiImplementation } from "./provider";
import { appwriteEntitlementsApi } from "./appwrite/appwriteEntitlementsApi";

// Legacy Frappe reference only. Not used by the Appwrite QA runtime.
const legacyFrappeEntitlementsApi = {
  listMyEntitlements() {
    return callFrappeMethod("rbp_app.api.entitlements.list_my_entitlements", {}, { method: "GET" });
  },
};

export const entitlementsApi = selectApiImplementation({
  appwrite: appwriteEntitlementsApi,
  legacyFrappe: legacyFrappeEntitlementsApi,
});