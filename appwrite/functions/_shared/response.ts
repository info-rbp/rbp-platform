export type FunctionResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

function json(body: Record<string, unknown>, statusCode: number): FunctionResponse {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

export function ok(data: unknown = {}, message = "ok", status = 200) {
  return json({ ok: true, message, data }, status);
}

export function fail(message: string, status = 400, errors: unknown[] = []) {
  return json({ ok: false, message, errors, data: null }, status);
}

export function unauthorized(message = "Authentication is required.") {
  return fail(message, 401);
}

export function forbidden(message = "You do not have access to perform this action.") {
  return fail(message, 403);
}

export function notFound(message = "The requested resource was not found.") {
  return fail(message, 404);
}

export function validationError(errors: unknown[]) {
  return fail("Validation failed.", 422, errors);
}

export function parseJsonBody(context: { req?: { body?: string | Record<string, unknown> | null } }) {
  const raw = context.req?.body;
  if (!raw) return {} as Record<string, unknown>;
  if (typeof raw === "object") {
    return raw as Record<string, unknown>;
  }

  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new Error("Request body must be valid JSON.");
  }
}
