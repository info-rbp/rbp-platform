import { apiFailure, apiSuccess } from "../client";
import { invokeAppwriteFunction } from "../../../lib/appwrite/functions";

export const appwriteNotificationsApi = {
  async listMyNotifications() {
    try {
      const response = await invokeAppwriteFunction("admin-operations", { action: "list_my_notifications" });
      return apiSuccess("appwrite/functions/admin-operations", response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load notifications from Appwrite.";
      return apiFailure<unknown>("appwrite/functions/admin-operations", message, [
        { field: "notifications", code: "invalid", message },
      ]);
    }
  },

  markRead(name: string) {
    return invokeAppwriteFunction("admin-operations", { action: "mark_notification_read", name });
  },

  markAllRead() {
    return invokeAppwriteFunction("admin-operations", { action: "mark_all_notifications_read" });
  },
};
