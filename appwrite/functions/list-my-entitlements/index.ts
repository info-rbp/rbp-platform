import { ok } from "../_shared/response";
import { entitlementKeys } from "../_shared/entitlements";

export default async function main() {
  return ok({ action: "list-my-entitlements", entitlements: entitlementKeys });
}
