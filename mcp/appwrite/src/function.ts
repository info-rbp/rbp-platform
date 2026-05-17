type AppwriteRequest = {
  method?: string;
  path?: string;
  headers?: Record<string, string | undefined>;
  bodyJson?: unknown;
  bodyText?: string;
};

type AppwriteResponse = {
  json: (body: unknown, statusCode?: number, headers?: Record<string, string>) => unknown;
};

type AppwriteContext = {
  req: AppwriteRequest;
  res: AppwriteResponse;
  log?: (message: string) => void;
  error?: (message: string) => void;
};

export default async function ({ req, res, log, error }: AppwriteContext) {
  const normalizedHeaders = Object.fromEntries(
    Object.entries(req.headers ?? {}).map(([key, value]) => [key.toLowerCase(), value ?? ""])
  );

  if (!process.env.APPWRITE_API_KEY) {
    process.env.APPWRITE_API_KEY =
      normalizedHeaders["x-appwrite-key"] || process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY;
  }

  if (!process.env.APPWRITE_PROJECT_ID) {
    process.env.APPWRITE_PROJECT_ID = process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID;
  }

  try {
    const { getCorsHeaders, handleHttpRequest } = await import("./runtime.ts");
    const response = await handleHttpRequest({
      method: req.method ?? "GET",
      url: req.path ?? "/",
      headers: normalizedHeaders,
      body: req.bodyJson ?? (req.bodyText ? JSON.parse(req.bodyText) : {})
    });

    return res.json(response.body, response.statusCode, {
      ...getCorsHeaders(normalizedHeaders.origin),
      ...(response.headers ?? {})
    });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : String(caught);
    if (error) error(message);
    else if (log) log(message);
    return res.json(
      { jsonrpc: "2.0", id: null, error: { code: -32000, message } },
      500,
      { "Content-Type": "application/json; charset=utf-8" }
    );
  }
}
