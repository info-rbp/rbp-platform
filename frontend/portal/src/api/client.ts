export interface RbpApiError {
  field: string;
  code: string;
  message: string;
}

export interface RbpApiResponse<T> {
  ok: boolean;
  data?: T;
  message: string;
  errors: RbpApiError[];
  meta: {
    requestId: string;
    timestamp: string;
    source: "frappe" | "mock";
    method: string;
  };
}

interface FrappeCallOptions {
  method?: "GET" | "POST";
  params?: Record<string, unknown>;
  body?: Record<string, unknown>;
}

const apiMethodBase = import.meta.env.VITE_FRAPPE_API_METHOD_BASE || "/api/method";

function requestId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `req-${Date.now()}`;
}

function normaliseError(error: unknown): RbpApiError {
  if (error && typeof error === "object" && "message" in error) {
    return {
      field: "root",
      code: "frappe_error",
      message: String((error as { message?: unknown }).message || "Request failed"),
    };
  }

  return {
    field: "root",
    code: "request_failed",
    message: String(error || "Request failed"),
  };
}

function extractFrappeMessage<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "message" in payload) {
    return (payload as { message: T }).message;
  }

  return payload as T;
}

function buildUrl(methodName: string, params?: Record<string, unknown>) {
  const url = new URL(`${apiMethodBase}/${methodName}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function callFrappeMethod<T>(
  methodName: string,
  options: FrappeCallOptions = {}
): Promise<RbpApiResponse<T>> {
  const method = options.method || "GET";
  const id = requestId();

  try {
    const response = await fetch(buildUrl(methodName, method === "GET" ? options.params : undefined), {
      method,
      credentials: "include",
      headers:
        method === "POST"
          ? {
              "Content-Type": "application/json",
              Accept: "application/json",
            }
          : {
              Accept: "application/json",
            },
      body: method === "POST" ? JSON.stringify(options.body || {}) : undefined,
    });

    let payload: unknown = null;

    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const message =
        payload && typeof payload === "object" && "exception" in payload
          ? String((payload as { exception?: unknown }).exception)
          : `Frappe request failed with HTTP ${response.status}`;

      return {
        ok: false,
        message,
        errors: [
          {
            field: "root",
            code: response.status === 401 ? "unauthenticated" : "frappe_http_error",
            message,
          },
        ],
        meta: {
          requestId: id,
          timestamp: new Date().toISOString(),
          source: "frappe",
          method: methodName,
        },
      };
    }

    return {
      ok: true,
      data: extractFrappeMessage<T>(payload),
      message: "Frappe request completed.",
      errors: [],
      meta: {
        requestId: id,
        timestamp: new Date().toISOString(),
        source: "frappe",
        method: methodName,
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: "Frappe request failed.",
      errors: [normaliseError(error)],
      meta: {
        requestId: id,
        timestamp: new Date().toISOString(),
        source: "frappe",
        method: methodName,
      },
    };
  }
}
