import type { ApiResult, FrappeMethodResponse } from "./types";

const frappeApiBaseUrl = (import.meta.env.VITE_FRAPPE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

function normaliseError(payload: FrappeMethodResponse<unknown>, fallback: string) {
  if (payload.exception) return payload.exception;
  if (payload.exc) return payload.exc;
  if (payload._server_messages) return payload._server_messages;
  if (payload.traceback) return payload.traceback;
  return fallback;
}

function buildMethodUrl(methodPath: string) {
  const path = methodPath.startsWith("/api/method/") ? methodPath : `/api/method/${methodPath}`;
  return `${frappeApiBaseUrl}${path}`;
}

function isUnauthenticatedPayload(payload: FrappeMethodResponse<unknown>) {
  const text = JSON.stringify(payload).toLowerCase();
  return text.includes("login required") || text.includes("not permitted") || text.includes("guest");
}

export async function callFrappeMethod<T>(methodPath: string, init?: RequestInit): Promise<ApiResult<T>> {
  const url = buildMethodUrl(methodPath);

  try {
    const response = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      ...init,
    });

    const payload = (await response.json().catch(() => ({}))) as FrappeMethodResponse<T>;
    const unauthenticated = response.status === 401 || response.status === 403 || isUnauthenticatedPayload(payload);

    if (!response.ok || unauthenticated) {
      return {
        ok: false,
        status: response.status,
        unauthenticated,
        error: normaliseError(payload, unauthenticated ? "Login required." : "Request failed."),
      };
    }

    return {
      ok: true,
      status: response.status,
      data: (payload.message ?? payload) as T,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Network request failed.",
    };
  }
}

export function postFrappeMethod<T>(methodPath: string, payload: Record<string, unknown>) {
  return callFrappeMethod<T>(methodPath, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
