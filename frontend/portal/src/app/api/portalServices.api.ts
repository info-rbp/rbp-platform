import { callFrappeMethod, postFrappeMethod } from "./client";

export interface PortalServiceListItem {
  id: string;
  reference: string;
  service_type: string;
  service_label: string;
  title: string;
  summary?: string;
  status?: string;
  workflow_state?: string;
  priority?: string;
  created_on?: string;
  modified_on?: string;
  submitted_on?: string;
  assigned_to?: string;
  next_action?: string;
  detail_route: string;
  source_doctype: string;
  source_name: string;
}

export interface AllowedPortalServiceAction {
  action: string;
  label: string;
}

export interface PortalServiceDetail {
  metadata: PortalServiceListItem;
  record: Record<string, unknown>;
  status_timeline: Array<{ label: string; at?: string; status?: string }>;
  attached_files: Array<Record<string, unknown>>;
  notes: Array<{ message?: string }>;
  allowed_actions: AllowedPortalServiceAction[];
  source_doctype: string;
  source_name: string;
}

export interface PortalServiceFilters {
  service_type?: string;
  status?: string;
  priority?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
}

export interface PortalServiceCreatePayload {
  title?: string;
  summary?: string;
  context?: string;
  priority?: string;
  contact_method?: string;
  [key: string]: unknown;
}

export type PortalServiceCreateResult = PortalServiceDetail;

export interface PortalServiceListResponse {
  services: PortalServiceListItem[];
  groups: Record<string, { service_type: string; service_label: string; count: number; available: boolean }>;
  count: number;
}

export function listMyServices(filters: PortalServiceFilters = {}) {
  return postFrappeMethod<PortalServiceListResponse>("rbp_app.api.portal.list_my_services", { filters });
}

export function getServiceRecord(serviceType: string, name?: string) {
  return postFrappeMethod<PortalServiceDetail>("rbp_app.api.portal.get_service_record", { service_type: serviceType, name });
}

export function createServiceRequestRouter(serviceType: string, payload: PortalServiceCreatePayload) {
  return postFrappeMethod<PortalServiceCreateResult>("rbp_app.api.portal.create_service_request_router", {
    service_type: serviceType,
    payload,
  });
}

export function listMyServicesGet(filters: PortalServiceFilters = {}) {
  const search = new URLSearchParams({ filters: JSON.stringify(filters) });
  return callFrappeMethod<PortalServiceListResponse>(`rbp_app.api.portal.list_my_services?${search.toString()}`);
}
