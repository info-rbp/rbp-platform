import { ok } from "../_shared/response";

export default async function main() {
  return ok({ action: "get-subscription-status", status: "pending" });
}
