import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { config } from "./lib/appwrite.ts";
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

function setCorsHeaders(req: IncomingMessage, res: ServerResponse) {
  const requestOrigin = req.headers.origin;
  const allowOrigin =
    allowedOrigins.length === 0
      ? "*"
      : requestOrigin && allowedOrigins.includes(requestOrigin)
        ? requestOrigin
        : allowedOrigins[0];

  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
}

function sendJson(res: ServerResponse, statusCode: number, payload: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function readJson(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

const server = createServer(async (req, res) => {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    sendJson(res, 200, {
      ok: true,
      service: "rbp-appwrite-mcp-server",
      toolCount: Object.keys(allTools).length,
      environment: process.env.MCP_ENVIRONMENT ?? "qa"
    });
    return;
  }

  if (req.method !== "POST" || req.url !== "/mcp") {
    sendJson(res, 404, { jsonrpc: "2.0", id: null, error: { code: -32601, message: "Not found" } });
    return;
  }

  if (!String(req.headers["content-type"] ?? "").includes("application/json")) {
    sendJson(res, 415, {
      jsonrpc: "2.0",
      id: null,
      error: { code: -32600, message: "Content-Type must be application/json" }
    });
    return;
  }

  if (req.headers.authorization !== `Bearer ${config.mcpAuthToken}`) {
    sendJson(res, 401, {
      jsonrpc: "2.0",
      id: null,
      error: { code: -32002, message: "Unauthorized" }
    });
    return;
  }

  let body: Record<string, unknown>;
  try {
    body = (await readJson(req)) as Record<string, unknown>;
  } catch (error) {
    sendJson(res, 400, {
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: error instanceof Error ? error.message : "Invalid JSON" }
    });
    return;
  }

  const id = body.id ?? null;

  try {
    if (body.method === "initialize") {
      sendJson(res, 200, {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "rbp-appwrite-mcp-server", version: "0.1.1" }
        }
      });
      return;
    }

    if (body.method === "tools/list") {
      sendJson(res, 200, {
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
      });
      return;
    }

    if (body.method === "tools/call") {
      const params = (body.params ?? {}) as { name?: unknown; arguments?: unknown };
      const name = typeof params.name === "string" ? params.name : "";
      const tool = allTools[name];

      if (!tool) {
        sendJson(res, 404, {
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Unknown tool: ${name}` }
        });
        return;
      }

      if (tool.annotations?.destructiveHint && !destructiveToolsEnabled) {
        sendJson(res, 403, {
          jsonrpc: "2.0",
          id,
          error: { code: -32001, message: "Destructive tools are disabled in this environment." }
        });
        return;
      }

      const args = tool.parse(params.arguments ?? {});

      try {
        const result = await tool.handler(args);
        await auditLog(name, args, result, "success");
        sendJson(res, 200, { jsonrpc: "2.0", id, result: ok(result) });
        return;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await auditLog(name, args, { error: message }, "error");
        sendJson(res, 500, {
          jsonrpc: "2.0",
          id,
          error: { code: -32000, message }
        });
        return;
      }
    }

    sendJson(res, 400, {
      jsonrpc: "2.0",
      id,
      error: { code: -32600, message: `Unsupported method: ${String(body.method)}` }
    });
  } catch (error) {
    sendJson(res, 400, {
      jsonrpc: "2.0",
      id,
      error: { code: -32602, message: error instanceof Error ? error.message : String(error) }
    });
  }
});

server.listen(config.port, () => {
  console.log(`RBP Appwrite MCP server listening on http://localhost:${config.port}`);
});
