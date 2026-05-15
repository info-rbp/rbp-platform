import { appwriteRequest } from "./client";

export type AppwriteSessionUser = {
  $id: string;
  email: string;
  name?: string;
};

export function createAccount(payload: { userId?: string; email: string; password: string; name: string }) {
  return appwriteRequest<AppwriteSessionUser>("account", "POST", {
    userId: payload.userId ?? "unique()",
    email: payload.email,
    password: payload.password,
    name: payload.name,
  });
}

export function createEmailPasswordSession(payload: { email: string; password: string }) {
  return appwriteRequest("account/sessions/email", "POST", payload);
}

export function getCurrentAccount() {
  return appwriteRequest<AppwriteSessionUser>("account", "GET");
}

export function deleteCurrentSession() {
  return appwriteRequest("account/sessions/current", "DELETE");
}
