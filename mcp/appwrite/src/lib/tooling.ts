import { randomUUID } from "node:crypto";
import { config, databases } from "./appwrite.ts";

type AnnotationHints = {
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  openWorldHint?: boolean;
};

type StringRule = {
  kind: "string";
  optional?: boolean;
  defaultValue?: string;
  defaultFactory?: () => string;
  minLength?: number;
  enumValues?: string[];
  literalValue?: string;
};

type NumberRule = {
  kind: "number";
  optional?: boolean;
  defaultValue?: number;
  integer?: boolean;
  min?: number;
  max?: number;
};

type BooleanRule = {
  kind: "boolean";
  optional?: boolean;
  defaultValue?: boolean;
};

type ArrayRule = {
  kind: "array";
  optional?: boolean;
  defaultValue?: unknown[];
  minItems?: number;
  item: FieldRule;
};

type RecordRule = {
  kind: "record";
  optional?: boolean;
};

export type FieldRule = StringRule | NumberRule | BooleanRule | ArrayRule | RecordRule;
export type ToolFields = Record<string, FieldRule>;

export type ToolDefinition = {
  description: string;
  annotations?: AnnotationHints;
  inputSchema: Record<string, unknown>;
  parse: (input: unknown) => Record<string, unknown>;
  handler: (args: Record<string, unknown>) => Promise<unknown>;
};

function permission(action: "read" | "update" | "delete", subject: string) {
  return `${action}(\"${subject}\")`;
}

function getDefault(rule: FieldRule) {
  if ("defaultFactory" in rule && rule.defaultFactory) return rule.defaultFactory();
  if ("defaultValue" in rule) return rule.defaultValue;
  return undefined;
}

function validateValue(rule: FieldRule, value: unknown, path: string): unknown {
  if (value === undefined) {
    const defaultValue = getDefault(rule);
    if (defaultValue !== undefined) return defaultValue;
    if (rule.optional) return undefined;
    throw new Error(`Missing required field: ${path}`);
  }

  switch (rule.kind) {
    case "string": {
      if (typeof value !== "string") throw new Error(`Expected string for ${path}`);
      if (rule.literalValue !== undefined && value !== rule.literalValue) {
        throw new Error(`Expected ${path} to equal ${rule.literalValue}`);
      }
      if (rule.enumValues && !rule.enumValues.includes(value)) {
        throw new Error(`Expected ${path} to be one of ${rule.enumValues.join(", ")}`);
      }
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        throw new Error(`Expected ${path} to be at least ${rule.minLength} characters`);
      }
      return value;
    }
    case "number": {
      if (typeof value !== "number" || Number.isNaN(value)) throw new Error(`Expected number for ${path}`);
      if (rule.integer && !Number.isInteger(value)) throw new Error(`Expected integer for ${path}`);
      if (rule.min !== undefined && value < rule.min) throw new Error(`Expected ${path} to be >= ${rule.min}`);
      if (rule.max !== undefined && value > rule.max) throw new Error(`Expected ${path} to be <= ${rule.max}`);
      return value;
    }
    case "boolean": {
      if (typeof value !== "boolean") throw new Error(`Expected boolean for ${path}`);
      return value;
    }
    case "array": {
      if (!Array.isArray(value)) throw new Error(`Expected array for ${path}`);
      if (rule.minItems !== undefined && value.length < rule.minItems) {
        throw new Error(`Expected ${path} to contain at least ${rule.minItems} items`);
      }
      return value.map((item, index) => validateValue(rule.item, item, `${path}[${index}]`));
    }
    case "record": {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error(`Expected object for ${path}`);
      }
      return value;
    }
  }
}

function toJsonSchema(rule: FieldRule): Record<string, unknown> {
  switch (rule.kind) {
    case "string":
      return {
        type: "string",
        ...(rule.minLength !== undefined ? { minLength: rule.minLength } : {}),
        ...(rule.enumValues ? { enum: rule.enumValues } : {}),
        ...(rule.literalValue !== undefined ? { const: rule.literalValue } : {})
      };
    case "number":
      return {
        type: "number",
        ...(rule.integer ? { multipleOf: 1 } : {}),
        ...(rule.min !== undefined ? { minimum: rule.min } : {}),
        ...(rule.max !== undefined ? { maximum: rule.max } : {})
      };
    case "boolean":
      return { type: "boolean" };
    case "array":
      return {
        type: "array",
        items: toJsonSchema(rule.item),
        ...(rule.minItems !== undefined ? { minItems: rule.minItems } : {})
      };
    case "record":
      return { type: "object", additionalProperties: true };
  }
}

function buildInputSchema(fields: ToolFields) {
  const required = Object.entries(fields)
    .filter(([, rule]) => !rule.optional && getDefault(rule) === undefined)
    .map(([name]) => name);

  return {
    type: "object",
    additionalProperties: false,
    properties: Object.fromEntries(Object.entries(fields).map(([name, rule]) => [name, toJsonSchema(rule)])),
    required
  };
}

function parseArgs(fields: ToolFields, input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    if (Object.keys(fields).length === 0 && (input === undefined || input === null)) return {};
    throw new Error("Expected arguments object");
  }

  const source = input as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [name, rule] of Object.entries(fields)) {
    const value = validateValue(rule, source[name], name);
    if (value !== undefined) result[name] = value;
  }
  return result;
}

export function defineTool(options: {
  description: string;
  annotations?: AnnotationHints;
  fields?: ToolFields;
  handler: (args: Record<string, unknown>) => Promise<unknown>;
}): ToolDefinition {
  const fields = options.fields ?? {};
  return {
    description: options.description,
    annotations: options.annotations,
    inputSchema: buildInputSchema(fields),
    parse: (input: unknown) => parseArgs(fields, input),
    handler: options.handler
  };
}

export const v = {
  string: (options: Omit<StringRule, "kind"> = {}): StringRule => ({ kind: "string", ...options }),
  number: (options: Omit<NumberRule, "kind"> = {}): NumberRule => ({ kind: "number", ...options }),
  boolean: (options: Omit<BooleanRule, "kind"> = {}): BooleanRule => ({ kind: "boolean", ...options }),
  array: (item: FieldRule, options: Omit<ArrayRule, "kind" | "item"> = {}): ArrayRule => ({ kind: "array", item, ...options }),
  record: (options: Omit<RecordRule, "kind"> = {}): RecordRule => ({ kind: "record", ...options }),
  enum: (values: string[], options: Omit<StringRule, "kind" | "enumValues"> = {}): StringRule => ({
    kind: "string",
    enumValues: values,
    ...options
  }),
  literal: (value: string, options: Omit<StringRule, "kind" | "literalValue"> = {}): StringRule => ({
    kind: "string",
    literalValue: value,
    ...options
  }),
  uniqueId: (options: Omit<StringRule, "kind" | "defaultFactory"> = {}): StringRule => ({
    kind: "string",
    defaultFactory: () => `unique_${randomUUID()}`,
    ...options
  })
};

export async function auditLog(toolName: string, args: unknown, result: unknown, status: "success" | "error") {
  try {
    await databases.createDocument(
      config.databaseId,
      config.collections.auditLogs,
      `log_${randomUUID()}`,
      {
        toolName,
        actor: "chatgpt_mcp",
        environment: process.env.NODE_ENV ?? "development",
        requestJson: JSON.stringify(args).slice(0, 5000),
        resultJson: JSON.stringify(result).slice(0, 5000),
        status,
        createdAt: new Date().toISOString()
      },
      [permission("read", "label:admin"), permission("update", "label:admin"), permission("delete", "label:admin")]
    );
  } catch (error) {
    if (process.env.MCP_AUDIT_LOG_STRICT === "true") throw error;
    console.warn("Failed to write MCP audit log", { message: error instanceof Error ? error.message : String(error) });
  }
}

export function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }], structuredContent: data };
}
