import { callFrappeMethod } from "./client";
import { selectApiImplementation } from "./provider";
import { appwriteNotificationsApi } from "./appwrite/appwriteNotificationsApi";

// Legacy Frappe reference only. Not used by the Appwrite QA runtime.
const legacyFrappeNotificationsApi = {
  listMyNotifications() {
    return callFrappeMethod("rbp_app.api.notifications.get_notifications", {}, { method: "GET" });
  },

  markRead(name: string) {
    return callFrappeMethod("rbp_app.api.notifications.mark_notification_read", { name });
  },

  markAllRead() {
    return callFrappeMethod("rbp_app.api.notifications.mark_all_notifications_read", {});
  },
};

export const notificationsApi = selectApiImplementation({
  appwrite: appwriteNotificationsApi,
  legacyFrappe: legacyFrappeNotificationsApi,
});