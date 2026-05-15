import { environment } from "../../config/environment";

export type AppwriteHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "");
}

function baseHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Project": environment.appwriteProjectId,
  };
}

export function buildAppwriteUrl(path: string) {
  const endpoint = environment.appwriteEndpoint.replace(/\/$/, "");
  return `${endpoint}/${trimSlashes(path)}`;
}

export async function appwriteRequest<T>(
  path: string,
  method: AppwriteHttpMethod = "GET",
  body?: unknown
): Promise<T> {
  const response = await fetch(buildAppwriteUrl(path), {
    method,
    credentials: "include",
    headers: baseHeaders(),
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message?: unknown }).message ?? response.statusText)
        : response.statusText;
    throw new Error(message || "Appwrite request failed.");
  }

  return payload as T;
}
