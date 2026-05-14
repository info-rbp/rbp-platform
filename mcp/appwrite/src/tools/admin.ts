import { z } from "zod";
import { users, teams, functions } from "../lib/appwrite.js";
export const adminTools = {
  list_users: { description: "List users", schema: { queries: z.array(z.string()).default([]) }, handler: async ({ queries }: any) => users.list(queries) },
  get_user: { description: "Get user", schema: { userId: z.string() }, handler: async ({ userId }: any) => users.get(userId) },
  create_team: { description: "Create team", schema: { teamId: z.string(), name: z.string(), roles: z.array(z.string()).default([]) }, handler: async ({ teamId, name, roles }: any) => teams.create(teamId, name, roles) },
  list_functions: { description: "List functions", schema: { queries: z.array(z.string()).default([]) }, handler: async ({ queries }: any) => functions.list(queries) }
};
