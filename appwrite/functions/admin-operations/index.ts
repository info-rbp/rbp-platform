import { ok } from "../_shared/response";

export default async function main(context: { req?: { body?: string } }) {
  const payload = context.req?.body ? JSON.parse(context.req.body) : {};
  return ok({ action: payload.action ?? "admin-operations", payload });
}
