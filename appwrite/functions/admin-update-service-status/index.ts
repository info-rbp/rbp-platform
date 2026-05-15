import { ok } from "../_shared/response";

export default async function main() {
  return ok({ action: "admin-update-service-status", updated: false });
}
