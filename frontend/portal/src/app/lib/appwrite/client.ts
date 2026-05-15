import { Account, Client, Databases, Functions, Storage } from "appwrite";
import { environment } from "../../config/environment";

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "");
}

function requireConfig(value: string, label: string) {
  if (!value) {
    throw new Error(`${label} is required for the Appwrite runtime.`);
  }

  return value;
}

const client = new Client()
  .setEndpoint(requireConfig(environment.appwriteEndpoint, "VITE_APPWRITE_ENDPOINT"))
  .setProject(requireConfig(environment.appwriteProjectId, "VITE_APPWRITE_PROJECT_ID"));

export const appwriteClient = client;
export const appwriteAccount = new Account(client);
export const appwriteDatabases = new Databases(client);
export const appwriteFunctions = new Functions(client);
export const appwriteStorage = new Storage(client);

export function buildAppwriteUrl(path: string) {
  const endpoint = environment.appwriteEndpoint.replace(/\/$/, "");
  return `${endpoint}/${trimSlashes(path)}`;
}
