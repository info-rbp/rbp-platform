import { environment } from "../../config/environment";
import { buildAppwriteUrl } from "./client";

export function getFilePreviewUrl(fileId: string) {
  return buildAppwriteUrl(
    `storage/buckets/${environment.appwriteStorageBucketId}/files/${fileId}/preview`
  );
}
