import { appwriteFunctions } from "./client";

export type FunctionExecutionResult<T = unknown> = {
  $id?: string;
  responseBody?: string;
  data?: T;
};

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

  if (response.responseBody) {
    return JSON.parse(response.responseBody) as T;
  }

  return (response as unknown as FunctionExecutionResult<T>).data as T;
}
