import { ok } from "../_shared/response";
import { createAuditEvent } from "../_shared/audit";

export default async function main(context: { req?: { body?: string } }) {
  const payload = context.req?.body ? JSON.parse(context.req.body) : {};
  return ok({
    action: "bootstrap-tenant",
    payload,
    audit: createAuditEvent("bootstrap_tenant_requested", payload),
  });
}
