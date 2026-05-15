import { appwriteRequest } from "./client";

export type FunctionExecutionResult<T = unknown> = {
  $id?: string;
  responseBody?: string;
  data?: T;
};

export async function invokeAppwriteFunction<T>(
  functionId: string,
  payload: Record<string, unknown> = {}
): Promise<T> {
  const response = await appwriteRequest<FunctionExecutionResult>(
    `functions/${functionId}/executions`,
    "POST",
    {
      body: JSON.stringify(payload),
    }
  );

  if (response.responseBody) {
    return JSON.parse(response.responseBody) as T;
  }

  return (response.data ?? response) as T;
}
