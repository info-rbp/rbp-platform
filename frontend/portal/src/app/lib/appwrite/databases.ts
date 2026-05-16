import { ID } from "appwrite";
import { environment } from "../../config/environment";
import { appwriteDatabases } from "./client";

export function listDocuments<T>(collectionId: string, queries: string[] = []) {
  return appwriteDatabases.listDocuments<T>(
    environment.appwriteDatabaseId,
    collectionId,
    queries,
  );
}

export function createDocument<T>(collectionId: string, documentId: string, data: Record<string, unknown>) {
  return appwriteDatabases.createDocument<T>(
    environment.appwriteDatabaseId,
    collectionId,
    documentId || ID.unique(),
    data,
  );
}
