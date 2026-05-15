import { ok } from "../_shared/response";

export default async function main() {
  return ok({ action: "list-my-service-requests", requests: [] });
}
