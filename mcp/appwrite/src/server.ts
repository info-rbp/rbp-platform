import "dotenv/config";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { config } from "./lib/appwrite.js";
import { auditLog, ok } from "./lib/tooling.js";
import { databaseTools } from "./tools/databases.js";
import { schemaTools } from "./tools/schema.js";
import { storageTools } from "./tools/storage.js";
import { adminTools } from "./tools/admin.js";

type ToolDefinition = { description: string; schema: Record<string, z.ZodTypeAny>; annotations?: { readOnlyHint?: boolean; destructiveHint?: boolean; openWorldHint?: boolean }; handler: (args: any) => Promise<any> };
const allTools: Record<string, ToolDefinition> = { ...databaseTools, ...schemaTools, ...storageTools, ...adminTools };
const allowedOrigins = (process.env.MCP_ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const destructiveToolsEnabled = process.env.MCP_ENABLE_DESTRUCTIVE_TOOLS === "true";

const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: allowedOrigins.length > 0 ? allowedOrigins : false }));
app.use(express.json({ limit: "10mb" }));
app.get("/health", (_req, res) => res.json({ ok: true, service: "rbp-appwrite-mcp-server", toolCount: Object.keys(allTools).length, environment: process.env.MCP_ENVIRONMENT ?? "qa" }));
app.post("/mcp", async (req, res) => {
  if (!req.is("application/json")) return res.status(415).json({ jsonrpc: "2.0", id: null, error: { code: -32600, message: "Content-Type must be application/json" } });
  if (req.header("authorization") !== `Bearer ${config.mcpAuthToken}`) return res.status(401).json({ jsonrpc: "2.0", id: null, error: { code: -32002, message: "Unauthorized" } });
  const b = req.body ?? {}; const id = b.id ?? null;
  try {
    if (b.method === "initialize") return res.json({ jsonrpc: "2.0", id, result: { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "rbp-appwrite-mcp-server", version: "0.1.1" } } });
    if (b.method === "tools/list") return res.json({ jsonrpc: "2.0", id, result: { tools: Object.entries(allTools).map(([name, t]) => ({ name, description: t.description, annotations: t.annotations, inputSchema: zodToJsonSchema(z.object(t.schema), { name: `${name}Input` }) })) } });
    if (b.method === "tools/call") {
      const name = b.params?.name; const t = allTools[name]; if (!t) return res.status(404).json({ jsonrpc: "2.0", id, error: { code: -32601, message: `Unknown tool: ${name}` } });
      if (t.annotations?.destructiveHint && !destructiveToolsEnabled) return res.status(403).json({ jsonrpc: "2.0", id, error: { code: -32001, message: "Destructive tools are disabled in this environment." } });
      const args = z.object(t.schema).parse(b.params?.arguments ?? {});
      try { const result = await t.handler(args); await auditLog(name, args, result, "success"); return res.json({ jsonrpc: "2.0", id, result: ok(result) }); }
      catch (e: any) { await auditLog(name, args, { error: String(e?.message ?? e) }, "error"); return res.status(500).json({ jsonrpc: "2.0", id, error: { code: -32000, message: String(e?.message ?? e) } }); }
    }
    return res.status(400).json({ jsonrpc: "2.0", id, error: { code: -32600, message: `Unsupported method: ${b.method}` } });
  } catch (e: any) {
    return res.status(400).json({ jsonrpc: "2.0", id, error: { code: -32602, message: String(e?.message ?? e) } });
  }
});
app.listen(config.port, () => console.log(`RBP Appwrite MCP server listening on http://localhost:${config.port}`));
const allTools: Record<string, any> = { ...databaseTools, ...schemaTools, ...storageTools, ...adminTools };
const app = express(); app.use(cors()); app.use(express.json({ limit: "10mb" }));
app.get('/health',(_q,res)=>res.json({ok:true,service:'rbp-appwrite-mcp-server',toolCount:Object.keys(allTools).length}));
app.post('/mcp',async(req,res)=>{if(req.header('authorization')!==`Bearer ${config.mcpAuthToken}`) return res.status(401).json({error:'Unauthorized'}); const b=req.body??{}; const id=b.id??null; try{ if(b.method==='initialize') return res.json({jsonrpc:'2.0',id,result:{protocolVersion:'2024-11-05',capabilities:{tools:{}},serverInfo:{name:'rbp-appwrite-mcp-server',version:'0.1.0'}}}); if(b.method==='tools/list') return res.json({jsonrpc:'2.0',id,result:{tools:Object.entries(allTools).map(([name,t]:any)=>({name,description:t.description,inputSchema:{type:'object',properties:Object.fromEntries(Object.keys(t.schema).map(k=>[k,{type:'string'}]))}}))}}); if(b.method==='tools/call'){const t=allTools[b.params?.name]; if(!t) return res.status(404).json({jsonrpc:'2.0',id,error:{code:-32601,message:'Unknown tool'}}); const args=z.object(t.schema).parse(b.params?.arguments??{}); try{const result=await t.handler(args); await auditLog(b.params?.name,args,result,'success'); return res.json({jsonrpc:'2.0',id,result:ok(result)});}catch(e:any){await auditLog(b.params?.name,args,{error:String(e?.message??e)},'error'); return res.status(500).json({jsonrpc:'2.0',id,error:{code:-32000,message:String(e?.message??e)}});} } return res.status(400).json({jsonrpc:'2.0',id,error:{code:-32600,message:`Unsupported method: ${b.method}`}});}catch(e:any){return res.status(400).json({jsonrpc:'2.0',id,error:{code:-32602,message:String(e?.message??e)}});} });
app.listen(config.port,()=>{console.log(`RBP Appwrite MCP server listening on http://localhost:${config.port}`)});
