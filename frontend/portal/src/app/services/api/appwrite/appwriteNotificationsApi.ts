import { apiFailure, apiSuccess } from "../client";
import {
  AppwriteFunctionError,
  invokeAppwriteFunction,
} from "../../../lib/appwrite/functions";

export type AppwriteNotificationRecord = {
  $id?: string;
  id?: string;
  title?: string;
  message?: string;
  status?: string;
  href?: string;
  read?: boolean;
  read_at?: string;
  created_at?: string;
  updated_at?: string;
};

function normaliseNotificationList(payload: unknown): AppwriteNotificationRecord[] {
  if (Array.isArray(payload)) {
    return payload as AppwriteNotificationRecord[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as { documents?: unknown; notifications?: unknown };

    if (Array.isArray(record.documents)) {
      return record.documents as AppwriteNotificationRecord[];
    }

    if (Array.isArray(record.notifications)) {
      return record.notifications as AppwriteNotificationRecord[];
    }
  }

  return [];
}

function formatNotificationErrors(error: unknown, fallbackMessage: string) {
  if (error instanceof AppwriteFunctionError && error.errors?.length) {
    return error.errors.map((item) => ({
      field: item.field || "notifications",
      code: item.code || "invalid",
      message: item.message || fallbackMessage,
    }));
  }

  return [{ field: "notifications", code: "invalid", message: fallbackMessage }];
}

export const appwriteNotificationsApi = {
  async listMyNotifications() {
    try {
      const response = await invokeAppwriteFunction<unknown>(
        "admin-operations",
        { action: "list_my_notifications", payload: {} },
      );
      return apiSuccess(
        "appwrite/functions/admin-operations",
        normaliseNotificationList(response),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load notifications from Appwrite.";
      return apiFailure<AppwriteNotificationRecord[]>(
        "appwrite/functions/admin-operations",
        message,
        formatNotificationErrors(error, message),
      );
    }
  },

  async markRead(notificationId: string) {
    try {
      const response = await invokeAppwriteFunction<Record<string, unknown>>(
        "admin-operations",
        {
          action: "mark_notification_read",
          payload: { notificationId },
        },
      );
      return apiSuccess("appwrite/functions/admin-operations", response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update notification status.";
      return apiFailure<Record<string, unknown>>(
        "appwrite/functions/admin-operations",
        message,
        formatNotificationErrors(error, message),
      );
    }
  },

  async markAllRead() {
    try {
      const response = await invokeAppwriteFunction<Record<string, unknown>>(
        "admin-operations",
        {
          action: "mark_all_notifications_read",
          payload: {},
        },
      );
      return apiSuccess("appwrite/functions/admin-operations", response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update notification status.";
      return apiFailure<Record<string, unknown>>(
        "appwrite/functions/admin-operations",
        message,
        formatNotificationErrors(error, message),
      );
    }
  },
};
