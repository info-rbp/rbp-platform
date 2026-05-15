import { invokeAppwriteFunction } from "../../../lib/appwrite/functions";

export const appwriteAdminApi = {
  run(action: string, payload: Record<string, unknown> = {}) {
    return invokeAppwriteFunction("admin-operations", { action, payload });
  },
};
