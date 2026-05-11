import type { ApiResult, FrappeMethodResponse } from "./types";

function normaliseError(payload: FrappeMethodResponse<unknown>, fallback: string) {
  if (payload.exception) return payload.exception;
  if (payload.exc) return payload.exc;
  if (payload._server_messages) return payload._server_messages;
  if (payload.traceback) return payload.traceback;
  return fallback;
}

export async function callFrappeMethod<T>(methodPath: string, init?: RequestInit): Promise<ApiResult<T>> {
  const url = methodPath.startsWith("/api/method/") ? methodPath : `/api/method/${methodPath}`;

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

    if (!response.ok) {
      const unauthenticated = response.status === 401 || response.status === 403;
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
      data: payload.message as T,
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
