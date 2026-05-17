import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  Bell,
  Briefcase,
  ChevronRight,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";

import { authApi, notificationsApi } from "../../services/api";
import {
  getPortalPageTitle,
  isPortalPathActive,
  portalNavigationSections,
} from "./portalNavigationModel";
import type {
  PortalCustomerAuthUser,
  PortalNotification,
} from "../../types/portal";

const CUSTOMER_AUTH_KEY = "rbp_customer_auth";
const PENDING_INTENT_KEY = "rbp_pending_account_intent";

function buildInitials(name: string, email: string) {
  const source = name || email || "RBP Member";
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "RB";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] || "R"}${parts[1][0] || "B"}`.toUpperCase();
}

export function buildPortalIdentity(user: PortalCustomerAuthUser | null) {
  const name = user?.name || user?.email || "RBP Member";
  const email = user?.email || "";
  const plan = user?.businessName || "Member portal";

  return {
    name,
    email,
    plan,
    initials: buildInitials(name, email),
  };
}

function isReadNotification(notification: PortalNotification) {
  if (notification.read !== undefined) {
    return notification.read;
  }

  if (notification.readAt) {
    return true;
  }

  return notification.status === "read";
}

export function normalisePortalNotifications(payload: unknown): PortalNotification[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map((item, index) => {
    const record = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
    const title = typeof record.title === "string" && record.title.length > 0
      ? record.title
      : "Notification";
    const message = typeof record.message === "string" && record.message.length > 0
      ? record.message
      : "A new update is available in your portal.";
    const href = typeof record.href === "string" && record.href.length > 0
      ? record.href
      : "/portal/dashboard";
    const updatedAt = typeof record.updated_at === "string"
      ? record.updated_at
      : typeof record.created_at === "string"
        ? record.created_at
        : "";
    const readAt = typeof record.read_at === "string" ? record.read_at : undefined;
    const status = typeof record.status === "string" && record.status.length > 0
      ? record.status
      : readAt
        ? "read"
        : "unread";
    const read = record.read === true || Boolean(readAt) || status === "read";

    return {
      id:
        typeof record.$id === "string"
          ? record.$id
          : typeof record.id === "string"
            ? record.id
            : `notification-${index + 1}`,
      title,
      message,
      status: status as PortalNotification["status"],
      href,
      read,
      readAt,
      updatedAt,
    };
  });
}

export function getUnreadNotificationCount(notifications: PortalNotification[]) {
  return notifications.filter((notification) => !isReadNotification(notification)).length;
}

export function PortalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<PortalCustomerAuthUser | null>(null);
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCurrentUser() {
      const response = await authApi.getCurrentUser();
      if (!active) {
        return;
      }

      setCurrentUser(response.ok && response.data ? response.data : null);
    }

    loadCurrentUser();
    window.addEventListener("rbp-auth-changed", loadCurrentUser);

    return () => {
      active = false;
      window.removeEventListener("rbp-auth-changed", loadCurrentUser);
    };
  }, []);

  async function loadNotifications() {
    setNotificationsLoading(true);
    setNotificationsError("");
    const response = await notificationsApi.listMyNotifications();

    if (response.ok && response.data) {
      setNotifications(normalisePortalNotifications(response.data));
      setNotificationsLoading(false);
      return;
    }

    setNotificationsError(response.message || "Unable to load notifications.");
    setNotificationsLoading(false);
  }

  async function handleSignOut() {
    await authApi.signOut();
    window.localStorage.removeItem(CUSTOMER_AUTH_KEY);
    window.sessionStorage.removeItem(PENDING_INTENT_KEY);
    window.dispatchEvent(new Event("rbp-auth-changed"));
    navigate("/signin");
  }

  async function handleToggleNotifications() {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);

    if (nextOpen) {
      await loadNotifications();
    }
  }

  async function handleMarkRead(notificationId: string) {
    const response = await notificationsApi.markRead(notificationId);

    if (!response.ok) {
      setNotificationsError(response.message || "Unable to update notification.");
      return;
    }

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              read: true,
              readAt: notification.readAt || new Date().toISOString(),
              status: "read",
            }
          : notification,
      ),
    );
  }

  async function handleMarkAllRead() {
    const response = await notificationsApi.markAllRead();

    if (!response.ok) {
      setNotificationsError(response.message || "Unable to update notifications.");
      return;
    }

    const timestamp = new Date().toISOString();
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
        readAt: notification.readAt || timestamp,
        status: "read",
      })),
    );
  }

  const today = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pageTitle = getPortalPageTitle(location.pathname);
  const identity = useMemo(() => buildPortalIdentity(currentUser), [currentUser]);
  const unreadCount = getUnreadNotificationCount(notifications);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-slate-100 bg-white transition-transform duration-200 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-700">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs font-black leading-tight tracking-tight text-slate-800">
              Remote Business
              <br />
              Partner
            </span>
          </Link>
          <button
            className="p-1 text-slate-400 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700">
              <span className="text-xs font-black text-white">{identity.initials}</span>
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-bold text-slate-800">{identity.name}</div>
              <div className="truncate text-[10px] font-semibold text-blue-700">{identity.plan}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {portalNavigationSections.map((section) => {
            const sectionActive =
              isPortalPathActive(location.pathname, section.href) ||
              section.children?.some((child) => isPortalPathActive(location.pathname, child.href));
            const SectionIcon = section.icon;

            if (!section.children?.length && section.href) {
              return (
                <Link
                  key={section.id}
                  to={section.href}
                  onClick={() => setSidebarOpen(false)}
                  className={[
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors",
                    sectionActive
                      ? "bg-blue-700 text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  <SectionIcon className="h-4 w-4 flex-shrink-0" />
                  {section.label}
                </Link>
              );
            }

            return (
              <div key={section.id} className="space-y-1.5">
                <div
                  className={[
                    "flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-[0.16em]",
                    sectionActive ? "bg-blue-50 text-blue-700" : "text-slate-500",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2">
                    <SectionIcon className="h-4 w-4" />
                    {section.label}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1 border-l border-slate-100 pl-3">
                  {section.children?.map((child) => {
                    const childActive = isPortalPathActive(location.pathname, child.href);
                    const ChildIcon = child.icon;
                    return (
                      <Link
                        key={child.id}
                        to={child.href}
                        onClick={() => setSidebarOpen(false)}
                        className={[
                          "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors",
                          childActive
                            ? "bg-blue-700 text-white"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        ].join(" ")}
                      >
                        <ChildIcon className="h-4 w-4 flex-shrink-0" />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="space-y-0.5 border-t border-slate-100 px-3 py-4">
          <Link
            to="/portal/settings"
            onClick={() => setSidebarOpen(false)}
            className={[
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors",
              isPortalPathActive(location.pathname, "/portal/settings")
                ? "bg-blue-700 text-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            ].join(" ")}
          >
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900">{pageTitle}</h1>
              <p className="hidden text-[10px] text-slate-400 sm:block">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={handleToggleNotifications}
                className="relative rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-50"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                ) : null}
              </button>

              {notificationsOpen ? (
                <div className="absolute right-0 top-11 z-30 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Notifications</h2>
                      <p className="text-[11px] text-slate-500">Unread: {unreadCount}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-semibold text-blue-700 hover:text-blue-800"
                    >
                      Mark all read
                    </button>
                  </div>

                  {notificationsLoading ? (
                    <div className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                      Loading notifications...
                    </div>
                  ) : notificationsError ? (
                    <div className="rounded-xl bg-rose-50 px-4 py-4 text-sm font-semibold text-rose-700">
                      {notificationsError}
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                      No notifications yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notification) => {
                        const read = isReadNotification(notification);
                        return (
                          <div
                            key={notification.id}
                            className={[
                              "rounded-xl border px-3 py-3",
                              read ? "border-slate-200 bg-white" : "border-blue-100 bg-blue-50/60",
                            ].join(" ")}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <Link
                                  to={notification.href || "/portal/dashboard"}
                                  className="block text-sm font-bold text-slate-900 hover:text-blue-700"
                                  onClick={() => setNotificationsOpen(false)}
                                >
                                  {notification.title}
                                </Link>
                                <p className="mt-1 text-[11px] leading-5 text-slate-600">
                                  {notification.message}
                                </p>
                                {notification.updatedAt ? (
                                  <p className="mt-2 text-[10px] text-slate-400">{notification.updatedAt}</p>
                                ) : null}
                              </div>
                              {!read ? (
                                <button
                                  type="button"
                                  onClick={() => handleMarkRead(notification.id)}
                                  className="shrink-0 text-[11px] font-semibold text-blue-700 hover:text-blue-800"
                                >
                                  Mark read
                                </button>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            <Link
              to="/portal/settings"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-700 transition-colors hover:bg-blue-800"
            >
              <span className="text-xs font-black text-white">{identity.initials}</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
