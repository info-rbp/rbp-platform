import type { MockStatus, MockTimelineItem } from "../../mock";

export interface MockValidationError {
  field: string;
  code: "required" | "invalid" | "mock-failure";
  message: string;
}

export interface MockApiMeta {
  requestId: string;
  timestamp: string;
  mockEndpoint: string;
  simulated: true;
}

export interface MockApiResponse<T> {
  ok: boolean;
  data: T | null;
  message: string;
  errors: MockValidationError[];
  meta: MockApiMeta;
}

export interface MockRequestOptions {
  delayMs?: number;
  shouldFail?: boolean;
  failureMessage?: string;
}

export const DEFAULT_MOCK_DELAY_MS = 250;

function createRequestId(): string {
  return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createMeta(mockEndpoint: string): MockApiMeta {
  return {
    requestId: createRequestId(),
    timestamp: new Date().toISOString(),
    mockEndpoint,
    simulated: true,
  };
}

export function waitForMockDelay(delayMs = DEFAULT_MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delayMs);
  });
}

export function createMockReference(prefix: string): string {
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-MOCK-${suffix}`;
}

export function createMockTimeline(
  items: Array<{
    id: string;
    label: string;
    description: string;
    status: MockStatus;
  }>
): MockTimelineItem[] {
  const now = new Date().toISOString();

  return items.map((item) => ({
    ...item,
    timestamp: now,
  }));
}

export function requireFields(
  payload: Record<string, unknown>,
  fields: string[]
): MockValidationError[] {
  return fields
    .filter((field) => {
      const value = payload[field];
      return value === undefined || value === null || value === "";
    })
    .map((field) => ({
      field,
      code: "required" as const,
      message: `${field} is required for this mock submission.`,
    }));
}

export function mockSuccess<T>(
  mockEndpoint: string,
  data: T,
  message = "Mock request completed successfully."
): MockApiResponse<T> {
  return {
    ok: true,
    data,
    message,
    errors: [],
    meta: createMeta(mockEndpoint),
  };
}

export function mockFailure<T>(
  mockEndpoint: string,
  message = "Mock request failed.",
  errors: MockValidationError[] = []
): MockApiResponse<T> {
  return {
    ok: false,
    data: null,
    message,
    errors,
    meta: createMeta(mockEndpoint),
  };
}

export async function mockGet<T>(
  mockEndpoint: string,
  data: T,
  message = "Mock data returned.",
  options: MockRequestOptions = {}
): Promise<MockApiResponse<T>> {
  await waitForMockDelay(options.delayMs);

  if (options.shouldFail) {
    return mockFailure<T>(
      mockEndpoint,
      options.failureMessage ?? "Mock GET request failed.",
      [
        {
          field: "mock",
          code: "mock-failure",
          message: options.failureMessage ?? "Simulated mock failure.",
        },
      ]
    );
  }

  return mockSuccess(mockEndpoint, data, message);
}

export async function mockPost<TPayload extends Record<string, unknown>, TData>(
  mockEndpoint: string,
  payload: TPayload,
  handler: (payload: TPayload) => TData,
  message = "Mock submission completed.",
  options: MockRequestOptions = {}
): Promise<MockApiResponse<TData>> {
  await waitForMockDelay(options.delayMs);

  if (options.shouldFail) {
    return mockFailure<TData>(
      mockEndpoint,
      options.failureMessage ?? "Mock POST request failed.",
      [
        {
          field: "mock",
          code: "mock-failure",
          message: options.failureMessage ?? "Simulated mock failure.",
        },
      ]
    );
  }

  return mockSuccess(mockEndpoint, handler(payload), message);
}
