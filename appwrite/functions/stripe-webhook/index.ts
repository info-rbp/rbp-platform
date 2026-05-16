import { runNamedHandler } from "../_shared/runtime";

export default async function main(context: { req?: { body?: string; headers?: Record<string, string | undefined> } }) {
  return runNamedHandler("stripe-webhook", context);
}
