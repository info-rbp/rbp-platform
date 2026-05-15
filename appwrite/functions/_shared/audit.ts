export function createAuditEvent(eventName: string, payload: Record<string, unknown> = {}) {
  return {
    eventName,
    payload,
    timestamp: new Date().toISOString(),
  };
}
