import { functions, teams, users } from "../lib/appwrite.ts";
import { defineTool, v } from "../lib/tooling.ts";

export const adminTools = {
  list_users: defineTool({
    description: "List users",
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    fields: { queries: v.array(v.string(), { defaultValue: [] }) },
    handler: async ({ queries }) => users.list(queries as string[])
  }),
  get_user: defineTool({
    description: "Get user",
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    fields: { userId: v.string() },
    handler: async ({ userId }) => users.get(userId as string)
  }),
  create_team: defineTool({
    description: "Create team",
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
    fields: {
      teamId: v.string(),
      name: v.string(),
      roles: v.array(v.string(), { defaultValue: [] })
    },
    handler: async ({ teamId, name, roles }) => teams.create(teamId as string, name as string, roles as string[])
  }),
  list_functions: defineTool({
    description: "List functions",
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    fields: { queries: v.array(v.string(), { defaultValue: [] }) },
    handler: async ({ queries }) => functions.list(queries as string[])
  })
};
