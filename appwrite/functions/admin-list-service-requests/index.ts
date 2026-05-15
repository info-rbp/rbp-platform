import { ok } from "../_shared/response";

export default async function main() {
  return ok({ action: "admin-list-service-requests", requests: [] });
}
