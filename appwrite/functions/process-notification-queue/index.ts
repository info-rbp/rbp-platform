import { ok } from "../_shared/response";

export default async function main() {
  return ok({ action: "process-notification-queue", processed: 0 });
}
