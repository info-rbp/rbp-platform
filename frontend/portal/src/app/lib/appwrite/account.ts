import { ID } from "appwrite";
import { appwriteAccount } from "./client";

export type AppwriteSessionUser = {
  $id: string;
  email: string;
  name?: string;
};

export function createAccount(payload: { userId?: string; email: string; password: string; name: string }) {
  return appwriteAccount.create<AppwriteSessionUser>(
    payload.userId ?? ID.unique(),
    payload.email,
    payload.password,
    payload.name,
  );
}

export function createEmailPasswordSession(payload: { email: string; password: string }) {
  return appwriteAccount.createEmailPasswordSession(payload.email, payload.password);
}

export function getCurrentAccount() {
  return appwriteAccount.get<AppwriteSessionUser>();
}

export function deleteCurrentSession() {
  return appwriteAccount.deleteSession("current");
}
