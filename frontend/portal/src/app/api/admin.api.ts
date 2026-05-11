import { callFrappeMethod } from "./client";

export interface AdminMetric {
  key: string;
  label: string;
  value: number;
  status: string;
  trend?: string;
  desk_url?: string;
  description?: string;
}

export interface AdminQueue {
  key: string;
  label: string;
  count: number;
  desk_url?: string;
  items?: Array<Record<string, unknown>>;
}

export interface AdminActivity {
  name?: string;
  event_type?: string;
  actor?: string;
  target_doctype?: string;
  target_name?: string;
  workflow_state?: string;
  summary?: string;
  timestamp?: string;
  desk_url?: string;
}

export interface AdminDashboardPayload {
  metrics: AdminMetric[];
  queues: AdminQueue[];
  recent_activity: AdminActivity[];
  recent_service_records?: Array<Record<string, unknown>>;
  alerts: Array<{ key: string; label: string; message: string; status: string; desk_url?: string }>;
  desk_links: Array<{ label: string; desk_url: string }>;
}

export function getAdminDashboard() {
  return callFrappeMethod<AdminDashboardPayload>("rbp_app.api.admin.get_dashboard");
}
