import { storage } from "../lib/appwrite.ts";
import { defineTool, v } from "../lib/tooling.ts";

export const storageTools = {
  list_buckets: defineTool({
    description: "List buckets",
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    handler: async () => storage.listBuckets()
  }),
  create_bucket: defineTool({
    description: "Create bucket",
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
    fields: {
      bucketId: v.string(),
      name: v.string(),
      permissions: v.array(v.string(), { defaultValue: [] }),
      fileSecurity: v.boolean({ defaultValue: true }),
      enabled: v.boolean({ defaultValue: true }),
      maximumFileSize: v.number({ integer: true, defaultValue: 30000000 }),
      allowedFileExtensions: v.array(v.string(), { defaultValue: [] }),
      compression: v.enum(["none", "gzip", "zstd"], { defaultValue: "none" }),
      encryption: v.boolean({ defaultValue: true }),
      antivirus: v.boolean({ defaultValue: true })
    },
    handler: async (args) =>
      storage.createBucket(
        args.bucketId as string,
        args.name as string,
        args.permissions as string[],
        args.fileSecurity as boolean,
        args.enabled as boolean,
        args.maximumFileSize as number,
        args.allowedFileExtensions as string[],
        args.compression as string,
        args.encryption as boolean,
        args.antivirus as boolean
      )
  })
};
