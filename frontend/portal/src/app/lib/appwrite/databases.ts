import { environment } from "../../config/environment";
import { appwriteRequest } from "./client";

export function listDocuments<T>(collectionId: string, queries: string[] = []) {
  return appwriteRequest<{ documents: T[] }>(
    `databases/${environment.appwriteDatabaseId}/collections/${collectionId}/documents`,
    "POST",
    { queries }
  );
}

export function createDocument<T>(collectionId: string, documentId: string, data: Record<string, unknown>) {
  return appwriteRequest<T>(
    `databases/${environment.appwriteDatabaseId}/collections/${collectionId}/documents`,
    "POST",
    { documentId, data }
  );
}
