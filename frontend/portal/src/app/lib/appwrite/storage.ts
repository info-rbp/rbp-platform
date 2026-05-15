import { environment } from "../../config/environment";
import { appwriteStorage } from "./client";

export function getFilePreviewUrl(fileId: string) {
  return appwriteStorage.getFilePreview(
    environment.appwriteStorageBucketId,
    fileId,
  ).toString();
}
