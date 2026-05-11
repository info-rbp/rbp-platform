export interface FrappeMethodResponse<T> {
  message?: T;
  exc?: string;
  exception?: string;
  traceback?: string;
  _server_messages?: string;
}

export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  status?: number;
  unauthenticated?: boolean;
}

export interface CurrentUser {
  user: string;
  name: string;
  email: string;
  full_name: string;
  user_type?: string;
  roles: string[];
  is_guest: boolean;
  is_system_manager: boolean;
  is_admin: boolean;
}

export interface FrappeNotificationPayload {
  notifications: NotificationSummary[];
  unread_count: number;
}

export interface AppCard {
  id?: string;
  name?: string;
  label?: string;
  title?: string;
  description?: string;
  route?: string;
  href?: string;
  category?: string;
  status?: string;
  icon?: string;
}

export interface QuickLink {
  label: string;
  route: string;
  href?: string;
  description?: string;
}

export interface NotificationSummary {
  name?: string;
  id?: string;
  title: string;
  message?: string;
  status?: string;
  priority?: string;
  related_route?: string;
  route?: string;
  created_on?: string;
  read_on?: string;
}

export interface BillingSummary {
  status?: string;
  plan?: string;
  plan_name?: string;
  membership_plan?: string;
  membership_tier?: "free" | "premium" | "none" | string;
  subscription_status?: string;
  current_period_end?: string;
  billing_enabled?: boolean;
  message?: string;
  [key: string]: unknown;
}

export interface IntegrationStatus {
  name?: string;
  label?: string;
  status?: string;
  connected?: boolean;
  [key: string]: unknown;
}

export interface PortalDashboardPayload {
  current_user: CurrentUser;
  available_apps: AppCard[];
  apps_by_category: Record<string, AppCard[]>;
  quick_links: QuickLink[];
  platform_modules: AppCard[];
  notifications: NotificationSummary[] | FrappeNotificationPayload;
  billing: BillingSummary;
  integrations: IntegrationStatus[] | Record<string, IntegrationStatus>;
}
