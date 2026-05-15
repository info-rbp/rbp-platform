import { callFrappeMethod } from "./client";
import { selectApiImplementation } from "./provider";
import { appwriteEntitlementsApi } from "./appwrite/appwriteEntitlementsApi";

const legacyEntitlementsApi = {
  listMyEntitlements() {
    return callFrappeMethod("rbp_app.api.entitlements.list_my_entitlements", {}, { method: "GET" });
  },
};

export const entitlementsApi = selectApiImplementation({
  appwrite: appwriteEntitlementsApi,
  frappe: legacyEntitlementsApi,
});
