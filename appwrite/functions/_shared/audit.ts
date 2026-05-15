import { collectionIds, createAdminContext } from "./appwriteAdmin";

const SENSITIVE_KEYS = ["secret", "token", "password", "signature", "webhook", "authorization", "apiKey"];

export function sanitizeAuditPayload(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeAuditPayload(item));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const record = value as Record<string, unknown>;
  const sanitized: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(record)) {
    if (SENSITIVE_KEYS.some((fragment) => key.toLowerCase().includes(fragment))) {
      sanitized[key] = "[redacted]";
      continue;
    }

    sanitized[key] = sanitizeAuditPayload(entry);
  }

  return sanitized;
}

export function createAuditEvent(eventName: string, payload: Record<string, unknown> = {}) {
  return {
    event_name: eventName,
    payload: sanitizeAuditPayload(payload),
    timestamp: new Date().toISOString(),
  };
}

export async function persistAuditEvent(input: {
  eventName: string;
  actorId?: string | null;
  tenantId?: string | null;
  payload?: Record<string, unknown>;
}) {
  const admin = createAdminContext();
  const event = createAuditEvent(input.eventName, input.payload || {});
  return admin.createDocument(collectionIds.auditEvents, {
    tenant_id: input.tenantId || undefined,
    event_name: event.event_name,
    actor_id: input.actorId || undefined,
  });
}
