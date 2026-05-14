import { databases, config } from "./appwrite.js";
import { ID, Permission, Role } from "node-appwrite";

export async function auditLog(toolName: string, args: unknown, result: unknown, status: "success" | "error") {
  try {
    await databases.createDocument(config.databaseId, config.collections.auditLogs, ID.unique(), {
      toolName,
      actor: "chatgpt_mcp",
      environment: process.env.NODE_ENV ?? "development",
      requestJson: JSON.stringify(args).slice(0, 5000),
      resultJson: JSON.stringify(result).slice(0, 5000),
      status,
      createdAt: new Date().toISOString()
    }, [Permission.read(Role.label("admin")), Permission.update(Role.label("admin")), Permission.delete(Role.label("admin"))]);
  } catch {}
}

export function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }], structuredContent: data };
}
