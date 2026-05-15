import { ok } from "../_shared/response";

export default async function main() {
  return ok({ action: "cancel-subscription", cancelled: false, note: "Implementation requires live Stripe and Appwrite credentials." });
}
