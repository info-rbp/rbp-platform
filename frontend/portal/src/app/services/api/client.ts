import type {
  MockApiMeta,
  MockApiResponse,
  MockValidationError,
} from "../mock/mockClient";
import { environment } from "../../config/environment";

export type FrappeHttpMethod = "GET" | "POST";

interface FrappeCallOptions {
  method?: FrappeHttpMethod;
  headers?: Record<string, string>;
}

function createRequestId(prefix = "api") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createMeta(endpoint: string): MockApiMeta {
  return {
    requestId: createRequestId("api"),
    timestamp: new Date().toISOString(),
    mockEndpoint: endpoint,
    simulated: true,
  };
}

export function apiSuccess<T>(
  endpoint: string,
  data: T,
  message = "API request completed successfully."
): MockApiResponse<T> {
  return {
    ok: true,
    data,
    message,
    errors: [],
    meta: createMeta(endpoint),
  };
}

export function apiFailure<T>(
  endpoint: string,
  message = "API request failed.",
  errors: MockValidationError[] = []
): MockApiResponse<T> {
  return {
    ok: false,
    data: null,
    message,
    errors,
    meta: createMeta(endpoint),
  };
}

function getBaseUrl() {
  return environment.apiBaseUrl.replace(/\/$/, "");
}

function buildMethodUrl(method: string, params?: Record<string, unknown>, httpMethod: FrappeHttpMethod = "POST") {
  const baseUrl = getBaseUrl();
  const path = `/api/method/${method}`;
  const url = new URL(`${baseUrl}${path}`, window.location.origin);

  if (httpMethod === "GET" && params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      url.searchParams.set(key, typeof value === "string" ? value : JSON.stringify(value));
    });
  }

  return url.toString();
}

function extractFrappePayload<T>(raw: unknown): T {
  const value = raw as { message?: T };
  return value && Object.prototype.hasOwnProperty.call(value, "message")
    ? (value.message as T)
    : (raw as T);
}

export async function callFrappeMethod<T>(
  method: string,
  params: Record<string, unknown> = {},
  options: FrappeCallOptions = {}
): Promise<MockApiResponse<T>> {
  const httpMethod = options.method ?? "POST";
  const endpoint = `/api/method/${method}`;
  const url = buildMethodUrl(method, params, httpMethod);

  try {
    const response = await fetch(url, {
      method: httpMethod,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(httpMethod === "POST" ? { "Content-Type": "application/json" } : {}),
        ...(options.headers ?? {}),
      },
      body: httpMethod === "POST" ? JSON.stringify(params) : undefined,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const raw = contentType.includes("application/json") ? await response.json() : await response.text();

    if (!response.ok) {
      const message =
        typeof raw === "object" && raw !== null && "message" in raw
          ? String((raw as { message?: unknown }).message ?? response.statusText)
          : response.statusText;

      return apiFailure<T>(endpoint, message, [
        {
          field: "api",
          code: "invalid",
          message,
        },
      ]);
    }

    return apiSuccess<T>(endpoint, extractFrappePayload<T>(raw));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network request failed.";
    return apiFailure<T>(endpoint, message, [
      {
        field: "network",
        code: "invalid",
        message,
      },
    ]);
  }
}
