import {
  mockAdminActionOptions,
  mockAdminAuditRecords,
  mockAdminAuditTrail,
  mockAdminContentRecords,
  mockAdminMetrics,
  mockAdminQueues,
  mockAdminReviewQueues,
  mockAdminReviewRecords,
} from "../../mock";
import {
  createMockReference,
  mockFailure,
  mockGet,
  mockPost,
  requireFields,
} from "./mockClient";

export interface MockAdminReviewActionPayload extends Record<string, unknown> {
  recordId?: string;
  action?: "approve" | "reject" | "request-more-info";
  notes?: string;
}

export interface MockAdminReviewActionResult {
  reference: string;
  status: "submitted";
  reviewQueueHref: string;
  auditHref: string;
}

export function getMockAdminReviewQueues() {
  return mockGet(
    "/mock/admin/review-queues",
    {
      metrics: mockAdminMetrics,
      queues: mockAdminQueues,
      records: mockAdminReviewRecords,
      content: mockAdminContentRecords,
      auditRecords: mockAdminAuditRecords,
      auditTrail: mockAdminAuditTrail,
      actions: mockAdminActionOptions,
      grouped: mockAdminReviewQueues,
    },
    "Mock admin review queues returned."
  );
}

export function submitMockAdminReviewAction(payload: MockAdminReviewActionPayload) {
  const errors = requireFields(payload, ["recordId", "action", "notes"]);

  if (errors.length > 0) {
    return Promise.resolve(
      mockFailure<MockAdminReviewActionResult>(
        "/mock/admin/review-action",
        "Mock admin review action validation failed.",
        errors
      )
    );
  }

  return mockPost(
    "/mock/admin/review-action",
    payload,
    () => ({
      reference: createMockReference("ADM"),
      status: "submitted" as const,
      reviewQueueHref: "/admin/requests",
      auditHref: "/admin/audit-review",
    }),
    "Mock admin review action submitted."
  );
}
