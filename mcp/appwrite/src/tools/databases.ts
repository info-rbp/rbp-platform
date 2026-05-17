import { databases } from "../lib/appwrite.ts";
import { defineTool, v } from "../lib/tooling.ts";

export const databaseTools = {
  list_databases: defineTool({
    description: "List Appwrite databases.",
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    handler: async () => databases.list()
  }),
  create_database: defineTool({
    description: "Create an Appwrite database.",
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
    fields: { databaseId: v.uniqueId(), name: v.string({ minLength: 1 }) },
    handler: async ({ databaseId, name }) => databases.create(databaseId as string, name as string)
  }),
  get_database: defineTool({
    description: "Get an Appwrite database by ID.",
    fields: { databaseId: v.string() },
    handler: async ({ databaseId }) => databases.get(databaseId as string)
  }),
  delete_database: defineTool({
    description: "Delete an Appwrite database. Dangerous.",
    annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
    fields: { databaseId: v.string(), confirm: v.literal("DELETE_DATABASE") },
    handler: async ({ databaseId }) => databases.delete(databaseId as string)
  }),
  list_collections: defineTool({
    description: "List collections in an Appwrite database.",
    fields: { databaseId: v.string() },
    handler: async ({ databaseId }) => databases.listCollections(databaseId as string)
  }),
  create_collection: defineTool({
    description: "Create an Appwrite collection.",
    fields: {
      databaseId: v.string(),
      collectionId: v.uniqueId(),
      name: v.string({ minLength: 1 }),
      documentSecurity: v.boolean({ defaultValue: true }),
      enabled: v.boolean({ defaultValue: true }),
      permissions: v.array(v.string(), { defaultValue: [] })
    },
    handler: async (args) =>
      databases.createCollection(
        args.databaseId as string,
        args.collectionId as string,
        args.name as string,
        args.permissions as string[],
        args.documentSecurity as boolean,
        args.enabled as boolean
      )
  }),
  get_collection: defineTool({
    description: "Get an Appwrite collection.",
    fields: { databaseId: v.string(), collectionId: v.string() },
    handler: async ({ databaseId, collectionId }) =>
      databases.getCollection(databaseId as string, collectionId as string)
  }),
  update_collection: defineTool({
    description: "Update collection metadata and permissions.",
    fields: {
      databaseId: v.string(),
      collectionId: v.string(),
      name: v.string(),
      permissions: v.array(v.string(), { defaultValue: [] }),
      documentSecurity: v.boolean({ defaultValue: true }),
      enabled: v.boolean({ defaultValue: true })
    },
    handler: async (args) =>
      databases.updateCollection(
        args.databaseId as string,
        args.collectionId as string,
        args.name as string,
        args.permissions as string[],
        args.documentSecurity as boolean,
        args.enabled as boolean
      )
  }),
  delete_collection: defineTool({
    description: "Delete an Appwrite collection. Dangerous.",
    annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
    fields: {
      databaseId: v.string(),
      collectionId: v.string(),
      confirm: v.literal("DELETE_COLLECTION")
    },
    handler: async ({ databaseId, collectionId }) =>
      databases.deleteCollection(databaseId as string, collectionId as string)
  }),
  list_documents: defineTool({
    description: "List documents from any collection.",
    fields: {
      databaseId: v.string(),
      collectionId: v.string(),
      queries: v.array(v.string(), { defaultValue: [] }),
      limit: v.number({ integer: true, min: 1, max: 100, defaultValue: 25 })
    },
    handler: async ({ databaseId, collectionId, queries, limit }) =>
      databases.listDocuments(databaseId as string, collectionId as string, [
        ...(queries as string[]),
        `limit(${String(limit)})`
      ])
  }),
  get_document: defineTool({
    description: "Get a document by ID.",
    fields: { databaseId: v.string(), collectionId: v.string(), documentId: v.string() },
    handler: async ({ databaseId, collectionId, documentId }) =>
      databases.getDocument(databaseId as string, collectionId as string, documentId as string)
  }),
  create_document: defineTool({
    description: "Create a document in any collection.",
    fields: {
      databaseId: v.string(),
      collectionId: v.string(),
      documentId: v.uniqueId(),
      data: v.record(),
      permissions: v.array(v.string(), { defaultValue: [] })
    },
    handler: async ({ databaseId, collectionId, documentId, data, permissions }) =>
      databases.createDocument(
        databaseId as string,
        collectionId as string,
        documentId as string,
        data as Record<string, unknown>,
        permissions as string[]
      )
  }),
  update_document: defineTool({
    description: "Update a document in any collection.",
    fields: {
      databaseId: v.string(),
      collectionId: v.string(),
      documentId: v.string(),
      data: v.record(),
      permissions: v.array(v.string(), { optional: true })
    },
    handler: async ({ databaseId, collectionId, documentId, data, permissions }) =>
      databases.updateDocument(
        databaseId as string,
        collectionId as string,
        documentId as string,
        data as Record<string, unknown>,
        permissions as string[] | undefined
      )
  }),
  delete_document: defineTool({
    description: "Delete a document. Dangerous.",
    annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
    fields: {
      databaseId: v.string(),
      collectionId: v.string(),
      documentId: v.string(),
      confirm: v.literal("DELETE_DOCUMENT")
    },
    handler: async ({ databaseId, collectionId, documentId }) =>
      databases.deleteDocument(databaseId as string, collectionId as string, documentId as string)
  })
};
