import { auditLog, ok, type ToolDefinition } from "./lib/tooling.ts";
import { adminTools } from "./tools/admin.ts";
import { databaseTools } from "./tools/databases.ts";
import { schemaTools } from "./tools/schema.ts";
import { storageTools } from "./tools/storage.ts";

const allTools: Record<string, ToolDefinition> = {
  ...databaseTools,
  ...schemaTools,
  ...storageTools,
  ...adminTools
};

const allowedOrigins = (process.env.MCP_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const destructiveToolsEnabled = process.env.MCP_ENABLE_DESTRUCTIVE_TOOLS === "true";

export type HttpLikeRequest = {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
};

export type HttpLikeResponse = {
  statusCode: number;
  body: Record<string, unknown>;
  headers?: Record<string, string>;
};

export function getToolCount() {
  return Object.keys(allTools).length;
}

export function getCorsHeaders(requestOrigin?: string) {
  const allowOrigin =
    allowedOrigins.length === 0
      ? "*"
      : requestOrigin && allowedOrigins.includes(requestOrigin)
        ? requestOrigin
        : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };
}

export async function handleHttpRequest(request: HttpLikeRequest): Promise<HttpLikeResponse> {
  if (request.method === "GET" && request.url === "/health") {
    return {
      statusCode: 200,
      body: {
        ok: true,
        service: "rbp-appwrite-mcp-server",
        toolCount: getToolCount(),
        environment: process.env.MCP_ENVIRONMENT ?? "qa"
      }
    };
  }

  if (request.method !== "POST" || request.url !== "/mcp") {
    return {
      statusCode: 404,
      body: { jsonrpc: "2.0", id: null, error: { code: -32601, message: "Not found" } }
    };
  }

  if (!String(request.headers["content-type"] ?? "").includes("application/json")) {
    return {
      statusCode: 415,
      body: {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32600, message: "Content-Type must be application/json" }
      }
    };
  }

  if (request.headers.authorization !== `Bearer ${process.env.MCP_AUTH_TOKEN}`) {
    return {
      statusCode: 401,
      body: {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32002, message: "Unauthorized" }
      }
    };
  }

  const body = (request.body ?? {}) as Record<string, unknown>;
  const id = body.id ?? null;

  try {
    if (body.method === "initialize") {
      return {
        statusCode: 200,
        body: {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: { name: "rbp-appwrite-mcp-server", version: "0.1.1" }
          }
        }
      };
    }

    if (body.method === "tools/list") {
      return {
        statusCode: 200,
        body: {
          jsonrpc: "2.0",
          id,
          result: {
            tools: Object.entries(allTools).map(([name, tool]) => ({
              name,
              description: tool.description,
              annotations: tool.annotations,
              inputSchema: tool.inputSchema
            }))
          }
        }
      };
    }

    if (body.method === "tools/call") {
      const params = (body.params ?? {}) as { name?: unknown; arguments?: unknown };
      const name = typeof params.name === "string" ? params.name : "";
      const tool = allTools[name];

      if (!tool) {
        return {
          statusCode: 404,
          body: {
            jsonrpc: "2.0",
            id,
            error: { code: -32601, message: `Unknown tool: ${name}` }
          }
        };
      }

      if (tool.annotations?.destructiveHint && !destructiveToolsEnabled) {
        return {
          statusCode: 403,
          body: {
            jsonrpc: "2.0",
            id,
            error: { code: -32001, message: "Destructive tools are disabled in this environment." }
          }
        };
      }

      const args = tool.parse(params.arguments ?? {});

      try {
        const result = await tool.handler(args);
        await auditLog(name, args, result, "success");
        return {
          statusCode: 200,
          body: { jsonrpc: "2.0", id, result: ok(result) }
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await auditLog(name, args, { error: message }, "error");
        return {
          statusCode: 500,
          body: {
            jsonrpc: "2.0",
            id,
            error: { code: -32000, message }
          }
        };
      }
    }

    return {
      statusCode: 400,
      body: {
        jsonrpc: "2.0",
        id,
        error: { code: -32600, message: `Unsupported method: ${String(body.method)}` }
      }
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: {
        jsonrpc: "2.0",
        id,
        error: { code: -32602, message: error instanceof Error ? error.message : String(error) }
      }
    };
  }
}
