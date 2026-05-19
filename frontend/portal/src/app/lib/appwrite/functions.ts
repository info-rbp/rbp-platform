import { appwriteFunctions } from "./client";

export type FunctionExecutionResult<T = unknown> = {
  $id?: string;
  responseBody?: string;
  data?: T;
};

export type AppwriteFunctionEnvelope<T> = {
  ok?: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field?: string; code?: string; message?: string }>;
};

export class AppwriteFunctionError extends Error {
  errors: AppwriteFunctionEnvelope<unknown>["errors"];

  constructor(
    message: string,
    errors: AppwriteFunctionEnvelope<unknown>["errors"] = [],
  ) {
    super(message);
    this.name = "AppwriteFunctionError";
    this.errors = errors;
  }
}

function parseExecutionResponse<T>(response: FunctionExecutionResult<T>) {
  const rawBody = response.responseBody?.trim();

  if (rawBody) {
    try {
      return JSON.parse(rawBody) as unknown;
    } catch {
      throw new AppwriteFunctionError(
        "Appwrite function returned invalid JSON.",
      );
    }
  }

  if (response.data !== undefined) {
    return response.data as unknown;
  }

  throw new AppwriteFunctionError("Appwrite function returned an empty response.");
}

export async function invokeAppwriteFunction<T>(
  functionId: string,
  payload: Record<string, unknown> = {}
): Promise<T> {
  const response = await appwriteFunctions.createExecution(
    functionId,
    JSON.stringify(payload),
    false,
    "/",
    "POST",
    {
      "content-type": "application/json",
    },
  );

  const parsed = parseExecutionResponse(
    response as unknown as FunctionExecutionResult<T>,
  );

  if (parsed && typeof parsed === "object" && "ok" in parsed) {
    const envelope = parsed as AppwriteFunctionEnvelope<T>;

    if (envelope.ok === false) {
      throw new AppwriteFunctionError(
        envelope.message || "Appwrite function failed.",
        envelope.errors || [],
      );
    }

    if (Object.prototype.hasOwnProperty.call(envelope, "data")) {
      return envelope.data as T;
    }
  }

  return parsed as T;
}
