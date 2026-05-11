import type { MockStatus } from "./types.mock";

export interface MockNotification {
  id: string;
  title: string;
  message: string;
  status: MockStatus;
  createdAt: string;
  href?: string;
}

export const mockNotifications: MockNotification[] = [
  {
    id: "notification-001",
    title: "Membership active",
    message: "Your membership preview is active for the portal demo.",
    status: "active",
    createdAt: "2026-05-07T10:00:00Z",
    href: "/portal/dashboard",
  },
  {
    id: "notification-002",
    title: "Decision Desk request in review",
    message: "Your mock Decision Desk request is being reviewed.",
    status: "in-review",
    createdAt: "2026-05-07T10:30:00Z",
    href: "/portal/services",
  },
];
