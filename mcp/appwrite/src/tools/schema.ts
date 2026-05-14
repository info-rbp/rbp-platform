import { databases } from "../lib/appwrite.ts";
import { defineTool, v } from "../lib/tooling.ts";

export const schemaTools = {
  create_string_attribute: defineTool({
    description: "Create string attribute",
    fields: {
      databaseId: v.string(),
      collectionId: v.string(),
      key: v.string(),
      size: v.number({ integer: true, min: 1 }),
      required: v.boolean({ defaultValue: false }),
      defaultValue: v.string({ optional: true }),
      array: v.boolean({ defaultValue: false })
    },
    handler: async (args) =>
      databases.createStringAttribute(
        args.databaseId as string,
        args.collectionId as string,
        args.key as string,
        args.size as number,
        args.required as boolean,
        args.defaultValue as string | undefined,
        args.array as boolean
      )
  }),
  create_integer_attribute: defineTool({
    description: "Create integer attribute",
    fields: {
      databaseId: v.string(),
      collectionId: v.string(),
      key: v.string(),
      required: v.boolean({ defaultValue: false }),
      min: v.number({ optional: true }),
      max: v.number({ optional: true }),
      defaultValue: v.number({ optional: true }),
      array: v.boolean({ defaultValue: false })
    },
    handler: async (args) =>
      databases.createIntegerAttribute(
        args.databaseId as string,
        args.collectionId as string,
        args.key as string,
        args.required as boolean,
        args.min as number | undefined,
        args.max as number | undefined,
        args.defaultValue as number | undefined,
        args.array as boolean
      )
  }),
  create_index: defineTool({
    description: "Create index",
    fields: {
      databaseId: v.string(),
      collectionId: v.string(),
      key: v.string(),
      type: v.enum(["key", "fulltext", "unique"]),
      attributes: v.array(v.string(), { minItems: 1 }),
      orders: v.array(v.enum(["ASC", "DESC"]), { optional: true })
    },
    handler: async (args) =>
      databases.createIndex(
        args.databaseId as string,
        args.collectionId as string,
        args.key as string,
        args.type as string,
        args.attributes as string[],
        args.orders as string[] | undefined
      )
  }),
  delete_attribute: defineTool({
    description: "Delete attribute",
    annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
    fields: {
      databaseId: v.string(),
      collectionId: v.string(),
      key: v.string(),
      confirm: v.literal("DELETE_ATTRIBUTE")
    },
    handler: async (args) =>
      databases.deleteAttribute(args.databaseId as string, args.collectionId as string, args.key as string)
  }),
  delete_index: defineTool({
    description: "Delete index",
    annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
    fields: {
      databaseId: v.string(),
      collectionId: v.string(),
      key: v.string(),
      confirm: v.literal("DELETE_INDEX")
    },
    handler: async (args) =>
      databases.deleteIndex(args.databaseId as string, args.collectionId as string, args.key as string)
  })
};
