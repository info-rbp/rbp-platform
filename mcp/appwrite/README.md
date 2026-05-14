# RBP Appwrite MCP Server

## Purpose
Initial scaffold exposing controlled Appwrite read/write tools over an MCP-compatible JSON-RPC endpoint for QA/backend implementation.

## Run locally
```bash
npm install
cp .env.example .env
npm run dev
```

Requires Node 22 or newer because the scaffold uses Node's native TypeScript support for execution and build output.

## Validate
```bash
npm run typecheck
npm run build
```

## Smoke tests
```bash
curl -s http://localhost:8787/health | jq
curl -s -X POST http://localhost:8787/mcp -H "Authorization: Bearer change_me" -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | jq
curl -s -X POST http://localhost:8787/mcp -H "Authorization: Bearer change_me" -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | jq
```

## Security model
- Bearer token required
- Appwrite server API key remains server-side
- Destructive tools disabled unless `MCP_ENABLE_DESTRUCTIVE_TOOLS=true`
- Audit logs written to `mcp_audit_logs` where available

## Production policy
Run read-only first; explicitly enable destructive tools only in controlled environments.
