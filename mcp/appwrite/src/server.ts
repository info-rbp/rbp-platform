import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { config } from "./lib/appwrite.ts";
import { getCorsHeaders, handleHttpRequest } from "./runtime.ts";

function sendJson(res: ServerResponse, statusCode: number, payload: unknown, headers: Record<string, string>) {
  res.statusCode = statusCode;
  for (const [name, value] of Object.entries(headers)) {
    res.setHeader(name, value);
  }
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
  const headers = Object.fromEntries(
    Object.entries(req.headers).map(([key, value]) => [key, Array.isArray(value) ? value.join(", ") : value ?? ""])
  );
  const corsHeaders = getCorsHeaders(headers.origin);

  if (req.method === "OPTIONS") {
    sendJson(res, 204, {}, corsHeaders);
    return;
  }

  let body: unknown = {};
  if (req.method === "POST") {
    try {
      body = await readJson(req);
    } catch (error) {
      sendJson(
        res,
        400,
        {
          jsonrpc: "2.0",
          id: null,
          error: { code: -32700, message: error instanceof Error ? error.message : "Invalid JSON" }
        },
        corsHeaders
      );
      return;
    }
  }

  const response = await handleHttpRequest({
    method: req.method ?? "GET",
    url: req.url ?? "/",
    headers,
    body
  });

  sendJson(res, response.statusCode, response.body, { ...corsHeaders, ...(response.headers ?? {}) });
});

server.listen(config.port, () => {
  console.log(`RBP Appwrite MCP server listening on http://localhost:${config.port}`);
});
