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
  subscription_status?: string;
  current_period_end?: string;
  [key: string]: unknown;
}

export interface PublicRuntimeConfigPayload {
  environment: string;
  qa_banner_enabled: boolean;
  stripe: {
    enabled: boolean;
    mode: "test" | "live";
    test_mode: boolean;
  };
  email: {
    notifications_enabled: boolean;
    sandbox_mode: boolean;
    delivery_mode: "disabled" | "sandbox" | "enabled";
  };
  features: {
    application_provisioning: boolean;
    application_interest: boolean;
    admin_applications: boolean;
  };
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
  notifications: NotificationSummary[];
  billing: BillingSummary;
  integrations: IntegrationStatus[] | Record<string, IntegrationStatus>;
  runtime?: PublicRuntimeConfigPayload;
}
