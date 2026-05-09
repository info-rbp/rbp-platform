export type MockStatus =
  | "draft"
  | "ready"
  | "submitted"
  | "in-review"
  | "assigned"
  | "in-progress"
  | "outcome-ready"
  | "closed"
  | "pending"
  | "active"
  | "failed"
  | "cancelled"
  | "placeholder";

export type MockPriority = "low" | "medium" | "high" | "urgent";

export type MockPaymentStatus =
  | "not-required"
  | "pending"
  | "simulated-success"
  | "simulated-failed"
  | "cancelled";

export interface MockTimelineItem {
  id: string;
  label: string;
  description: string;
  status: MockStatus;
  timestamp: string;
}

export interface MockCta {
  label: string;
  href: string;
}

export interface MockFileReference {
  id: string;
  fileName: string;
  fileType: string;
  sizeLabel: string;
  status: "mock-only" | "attached-placeholder";
}

export interface MockContact {
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
}

export interface MockMoney {
  amount: number;
  currency: "AUD";
  gstIncluded: boolean;
  label: string;
}
