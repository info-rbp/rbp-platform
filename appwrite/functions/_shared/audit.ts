import { collectionIds, createAdminContext } from "./appwriteAdmin";

const SENSITIVE_KEY_FRAGMENTS = [
  "secret",
  "token",
  "password",
  "signature",
  "webhook",
  "authorization",
  "apikey",
  "api_key",
  "credential",
  "privatekey",
  "private_key",
  "clientsecret",
  "client_secret",
];

function normalizeKey(key: string) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isSensitiveKey(key: string) {
  const normalizedKey = normalizeKey(key);
  return SENSITIVE_KEY_FRAGMENTS.some((fragment) => normalizedKey.includes(normalizeKey(fragment)));
}

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
    if (isSensitiveKey(key)) {
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
