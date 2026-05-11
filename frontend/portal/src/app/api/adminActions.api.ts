import { postFrappeMethod } from "./client";

export interface AdminActionPayload {
  domain: string;
  record_doctype: string;
  record_name: string;
  action: string;
  notes?: string;
  assigned_to?: string;
  payload?: Record<string, unknown>;
}

export interface AdminActionResponse {
  ok: boolean;
  updated_record?: Record<string, unknown>;
  new_status?: string;
  audit_log_name?: string;
  notification_names?: string[];
  message?: string;
}

export interface AuditFilters {
  event_type?: string;
  actor?: string;
  target_doctype?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
}

export interface AuditLogEntry {
  name: string;
  event_type?: string;
  action?: string;
  actor?: string;
  actor_label?: string;
  target_doctype?: string;
  target_name?: string;
  tenant?: string;
  timestamp?: string;
  summary?: string;
  internal_notes?: string;
  metadata?: Record<string, unknown>;
}

export function performAdminAction(payload: AdminActionPayload) {
  return postFrappeMethod<AdminActionResponse>("rbp_app.api.admin.perform_action", { payload });
}

export function listAuditLogs(filters: AuditFilters = {}) {
  return postFrappeMethod<{ audit_logs: AuditLogEntry[]; count: number }>("rbp_app.api.audit.list_audit_logs", { filters });
}

export function listRecordAuditTrail(doctype: string, name: string) {
  return postFrappeMethod<{ timeline: AuditLogEntry[]; count: number }>("rbp_app.api.audit.list_record_audit_trail", {
    doctype,
    name,
  });
}

export function listMyRecordTimeline(doctype: string, name: string) {
  return postFrappeMethod<{ timeline: AuditLogEntry[]; count: number }>("rbp_app.api.audit.list_my_record_timeline", {
    doctype,
    name,
  });
}
