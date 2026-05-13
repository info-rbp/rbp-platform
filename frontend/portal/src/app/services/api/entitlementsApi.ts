import { callFrappeMethod } from "./client";

export const entitlementsApi = {
  listMyEntitlements() {
    return callFrappeMethod("rbp_app.api.entitlements.list_my_entitlements", {}, { method: "GET" });
  },
};
