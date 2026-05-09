import type { MockPriority, MockStatus, MockTimelineItem } from "./types.mock";

export type MockAdminReviewState =
  | "pending"
  | "in-review"
  | "approved"
  | "rejected"
  | "needs-info";

export type MockAdminQueueType =
  | "content"
  | "requests"
  | "marketplace"
  | "membership"
  | "audit-review";

export interface MockAdminMetric {
  id: string;
  label: string;
  value: string;
  description: string;
  status: MockStatus;
}

export interface MockAdminReviewRecord {
  id: string;
  reference: string;
  title: string;
  type: MockAdminQueueType;
  owner: string;
  submittedBy: string;
  submittedAt: string;
  priority: MockPriority;
  state: MockAdminReviewState;
  summary: string;
  routeHint: string;
}

export interface MockAdminContentRecord {
  id: string;
  title: string;
  section: string;
  status: MockAdminReviewState;
  lastUpdated: string;
  owner: string;
}

export interface MockAdminAuditRecord {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  notes: string;
}

export interface MockAdminQueue {
  id: MockAdminQueueType;
  title: string;
  description: string;
  count: number;
  status: MockAdminReviewState;
  href: string;
}

export const mockAdminMetrics: MockAdminMetric[] = [
  {
    id: "open-requests",
    label: "Open requests",
    value: "18",
    description: "Mock service requests across Decision Desk, DocuShare, Connectivity, Risk Advisor and The Fixer.",
    status: "in-review",
  },
  {
    id: "marketplace-review",
    label: "Marketplace review",
    value: "7",
    description: "Mock listings, enquiries and seller submissions awaiting review.",
    status: "pending",
  },
  {
    id: "membership-activity",
    label: "Membership activity",
    value: "12",
    description: "Mock membership sign-ups, onboarding records and payment simulations.",
    status: "active",
  },
  {
    id: "audit-items",
    label: "Audit items",
    value: "24",
    description: "Mock admin actions, review decisions and content changes.",
    status: "submitted",
  },
];

export const mockAdminQueues: MockAdminQueue[] = [
  {
    id: "content",
    title: "Content review",
    description: "Review website content, resources, offers, help centre entries and legal placeholders.",
    count: 5,
    status: "in-review",
    href: "/admin/content",
  },
  {
    id: "requests",
    title: "Service requests",
    description: "Review mock submissions from Membership, Decision Desk, DocuShare, Connectivity, Risk Advisor and The Fixer.",
    count: 18,
    status: "pending",
    href: "/admin/requests",
  },
  {
    id: "marketplace",
    title: "Marketplace review",
    description: "Review mock seller listings, buyer enquiries, listing updates and marketplace status changes.",
    count: 7,
    status: "in-review",
    href: "/admin/marketplace",
  },
  {
    id: "membership",
    title: "Membership review",
    description: "Review membership sign-ups, onboarding states, billing simulation and account status.",
    count: 12,
    status: "pending",
    href: "/admin/membership",
  },
  {
    id: "audit-review",
    title: "Audit and review",
    description: "Review simulated admin actions, decision history, compliance notes and future approval states.",
    count: 24,
    status: "needs-info",
    href: "/admin/audit-review",
  },
];

export const mockAdminReviewRecords: MockAdminReviewRecord[] = [
  {
    id: "admin-request-001",
    reference: "DD-MOCK-001",
    title: "Choose operating model for expansion",
    type: "requests",
    owner: "Decision Desk",
    submittedBy: "Demo Business Pty Ltd",
    submittedAt: "2026-05-07T10:15:00Z",
    priority: "high",
    state: "in-review",
    summary: "Mock Decision Desk request awaiting advisor review.",
    routeHint: "/admin/requests/decision-desk",
  },
  {
    id: "admin-request-002",
    reference: "DOC-MOCK-001",
    title: "Operations Documentation Suite brief",
    type: "requests",
    owner: "DocuShare",
    submittedBy: "Demo Business Pty Ltd",
    submittedAt: "2026-05-07T10:30:00Z",
    priority: "medium",
    state: "pending",
    summary: "Mock document brief awaiting review and assignment.",
    routeHint: "/admin/requests/docushare",
  },
  {
    id: "admin-request-003",
    reference: "NBN-MOCK-001",
    title: "Business connectivity order",
    type: "requests",
    owner: "Connectivity",
    submittedBy: "Demo Business Pty Ltd",
    submittedAt: "2026-05-07T11:15:00Z",
    priority: "medium",
    state: "in-review",
    summary: "Mock NBN/connectivity order awaiting provisioning review.",
    routeHint: "/admin/requests/connectivity",
  },
  {
    id: "admin-request-004",
    reference: "RISK-MOCK-001",
    title: "Risk Advisor assessment",
    type: "requests",
    owner: "Risk Advisor",
    submittedBy: "Demo Business Pty Ltd",
    submittedAt: "2026-05-07T12:20:00Z",
    priority: "high",
    state: "approved",
    summary: "Mock risk assessment result ready for portal status display.",
    routeHint: "/admin/requests/risk-advisor",
  },
  {
    id: "admin-request-005",
    reference: "FIX-MOCK-001",
    title: "Urgent process breakdown",
    type: "requests",
    owner: "The Fixer",
    submittedBy: "Demo Business Pty Ltd",
    submittedAt: "2026-05-07T13:10:00Z",
    priority: "urgent",
    state: "in-review",
    summary: "Mock Fixer request awaiting triage and assignment.",
    routeHint: "/admin/requests/fixer",
  },
  {
    id: "admin-marketplace-001",
    reference: "MKT-LIST-MOCK-001",
    title: "Mock Partner Service Listing",
    type: "marketplace",
    owner: "Marketplace",
    submittedBy: "Example Partner",
    submittedAt: "2026-05-07T14:00:00Z",
    priority: "medium",
    state: "pending",
    summary: "Mock seller listing pending admin review.",
    routeHint: "/admin/marketplace",
  },
  {
    id: "admin-membership-001",
    reference: "MEM-MOCK-001",
    title: "Remote Business Partner Membership",
    type: "membership",
    owner: "Membership",
    submittedBy: "Demo Business Pty Ltd",
    submittedAt: "2026-05-07T09:10:00Z",
    priority: "medium",
    state: "approved",
    summary: "Mock membership sign-up and onboarding state.",
    routeHint: "/admin/membership",
  },
];

export const mockAdminContentRecords: MockAdminContentRecord[] = [
  {
    id: "content-001",
    title: "Home page service summary",
    section: "Public website",
    status: "in-review",
    lastUpdated: "2026-05-07",
    owner: "Content",
  },
  {
    id: "content-002",
    title: "Membership pricing copy",
    section: "Membership",
    status: "pending",
    lastUpdated: "2026-05-07",
    owner: "Commercial",
  },
  {
    id: "content-003",
    title: "Legal payment wording",
    section: "Legal",
    status: "needs-info",
    lastUpdated: "2026-05-07",
    owner: "Legal review",
  },
  {
    id: "content-004",
    title: "Marketplace category descriptions",
    section: "Marketplace",
    status: "approved",
    lastUpdated: "2026-05-07",
    owner: "Marketplace",
  },
];

export const mockAdminAuditTrail: MockTimelineItem[] = [
  {
    id: "audit-001",
    label: "Review opened",
    description: "Mock admin review queue opened for Phase 1 concept screen.",
    status: "in-review",
    timestamp: "2026-05-07T14:00:00Z",
  },
  {
    id: "audit-002",
    label: "Request more info",
    description: "Simulated admin action. No real notification or backend update is sent.",
    status: "pending",
    timestamp: "2026-05-07T14:10:00Z",
  },
  {
    id: "audit-003",
    label: "Decision recorded",
    description: "Mock audit decision shown for future backend contract planning.",
    status: "submitted",
    timestamp: "2026-05-07T14:20:00Z",
  },
];

export const mockAdminAuditRecords: MockAdminAuditRecord[] = [
  {
    id: "audit-record-001",
    action: "Approved mock Risk Advisor result",
    actor: "Phase 1 admin",
    target: "RISK-MOCK-001",
    timestamp: "2026-05-07T14:20:00Z",
    notes: "Frontend-only approval state for Risk Advisor outcome.",
  },
  {
    id: "audit-record-002",
    action: "Requested more info for legal wording",
    actor: "Phase 1 admin",
    target: "content-003",
    timestamp: "2026-05-07T14:30:00Z",
    notes: "Mock content review state for payment policy wording.",
  },
  {
    id: "audit-record-003",
    action: "Moved Fixer request to triage",
    actor: "Phase 1 admin",
    target: "FIX-MOCK-001",
    timestamp: "2026-05-07T14:40:00Z",
    notes: "Mock triage action. No real ticket was created.",
  },
];

export const mockAdminActionOptions = [
  {
    id: "approve",
    title: "Approve",
    description: "Simulate approving the record for the next frontend state.",
  },
  {
    id: "reject",
    title: "Reject",
    description: "Simulate rejecting the record and adding review notes.",
  },
  {
    id: "request-more-info",
    title: "Request more info",
    description: "Simulate asking for clarification. No notification is sent.",
  },
];

export const mockAdminReviewQueues = {
  metrics: mockAdminMetrics,
  queues: mockAdminQueues,
  content: mockAdminContentRecords,
  requests: mockAdminReviewRecords.filter((record) => record.type === "requests"),
  marketplace: mockAdminReviewRecords.filter((record) => record.type === "marketplace"),
  membership: mockAdminReviewRecords.filter((record) => record.type === "membership"),
  auditReview: mockAdminAuditRecords,
  actions: mockAdminActionOptions,
};
