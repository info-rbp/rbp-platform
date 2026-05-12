import { mockApplicationCategories } from "./applications.mock";
import { mockConnectivityOrders } from "./connectivity.mock";
import { mockDecisionDeskRequests } from "./decisionDesk.mock";
import { mockDocuShareBriefs } from "./docushare.mock";
import { mockPortalDocuments } from "./documents.mock";
import { mockFixerRequests } from "./fixer.mock";
import { mockMembershipPlans, mockMembershipTimeline } from "./membership.mock";
import { mockNotifications } from "./notifications.mock";
import { mockOffers } from "./offers.mock";
import { mockResources } from "./resources.mock";
import { mockRiskAssessments } from "./riskAdvisor.mock";
import type { MockStatus } from "./types.mock";
import { mockCurrentUser, mockGuestUser } from "./user.mock";
import type { PortalDashboardState } from "../types/portal";

export type MockPortalMembershipState = "active" | "pending" | "none";
export type MockPortalAccessState = "included" | "available" | "locked" | "coming-soon";

export interface MockPortalMetric {
  id: string;
  label: string;
  value: string;
  sub: string;
  icon: "zap" | "alert" | "file" | "check";
  tone: "blue" | "amber" | "emerald" | "violet";
  href: string;
}

export interface MockPortalActivity {
  id: string;
  type: "service" | "document" | "offer" | "session" | "application";
  title: string;
  date: string;
  status: string;
  href: string;
}

export interface MockPortalAction {
  id: string;
  label: string;
  icon: "plus" | "calendar" | "file" | "tag" | "app" | "support";
  href: string;
  emphasis: "primary" | "dark" | "secondary";
}

export interface MockPortalNextStep {
  id: string;
  title: string;
  description: string;
  status: MockStatus;
  href: string;
}

export interface MockPortalFlowStatus {
  id: string;
  title: string;
  description: string;
  status: MockStatus;
  href: string;
}

export interface MockPortalServiceRequest {
  id: string;
  title: string;
  source: "Decision Desk" | "DocuShare" | "Connectivity" | "Risk Advisor" | "The Fixer";
  category: string;
  status: MockStatus;
  description: string;
  lastUpdated: string;
  nextAction: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface MockPortalDocumentActivity {
  id: string;
  name: string;
  category: string;
  date: string;
  size: string;
  status: MockStatus;
}

export interface MockPortalApplication {
  id: string;
  name: string;
  backendLabel: string;
  description: string;
  accessState: MockPortalAccessState;
  icon: "layers" | "users" | "trending" | "file" | "support" | "learning" | "chart" | "billing";
  actionLabel: string;
  helpsWith: string[];
  capabilities: string[];
}

export interface MockPortalOffer {
  id: string;
  partner: string;
  logo: string;
  title: string;
  description: string;
  category: string;
  saving: string;
  accessState: MockPortalAccessState;
  rating: number;
}

export interface MockPortalResource {
  id: string;
  title: string;
  category: string;
  typeLabel: "Guide" | "Video" | "Podcast" | "Tool";
  readTime: string;
  icon: "file" | "video" | "mic";
  href: string;
}

export interface MockPortalSupportTicket {
  id: string;
  subject: string;
  status: "Open" | "Resolved";
  updated: string;
  priority: "High" | "Normal" | "Low";
}

export const mockPortalMembershipScenarios = {
  active: {
    user: mockCurrentUser,
    label: "Active premium membership preview",
    status: "active" as MockPortalMembershipState,
    plan: mockMembershipPlans[0],
  },
  pending: {
    user: { ...mockCurrentUser, membershipStatus: "pending" as const },
    label: "Pending membership preview",
    status: "pending" as MockPortalMembershipState,
    plan: mockMembershipPlans[0],
  },
  none: {
    user: mockGuestUser,
    label: "Guest preview",
    status: "none" as MockPortalMembershipState,
    plan: null,
  },
};

export const mockPortalMetrics: MockPortalMetric[] = [
  {
    id: "active-services",
    label: "Active Services",
    value: "4",
    sub: "2 in progress",
    icon: "zap",
    tone: "blue",
    href: "/portal/services",
  },
  {
    id: "pending-requests",
    label: "Pending Requests",
    value: "2",
    sub: "Awaiting RBP review",
    icon: "alert",
    tone: "amber",
    href: "/portal/services",
  },
  {
    id: "documents",
    label: "Documents",
    value: "8",
    sub: "2 placeholders ready",
    icon: "file",
    tone: "emerald",
    href: "/portal/documents",
  },
  {
    id: "action-items",
    label: "Action Items",
    value: "5",
    sub: "3 recommended next",
    icon: "check",
    tone: "violet",
    href: "/portal/services",
  },
];

export const mockPortalRecentActivity: MockPortalActivity[] = [
  {
    id: "activity-decision",
    type: "service",
    title: "Decision Desk request moved to review",
    date: "7 May 2026",
    status: "In review",
    href: "/portal/services/decision-desk",
  },
  {
    id: "activity-risk",
    type: "service",
    title: "Risk Advisor outcome is ready",
    date: "6 May 2026",
    status: "Outcome ready",
    href: "/portal/services/risk-advisor",
  },
  {
    id: "activity-doc",
    type: "document",
    title: "Decision summary placeholder added",
    date: "6 May 2026",
    status: "Ready",
    href: "/portal/documents",
  },
  {
    id: "activity-offer",
    type: "offer",
    title: "Xero member offer marked active",
    date: "5 May 2026",
    status: "Included",
    href: "/portal/offers",
  },
];

export const mockPortalQuickActions: MockPortalAction[] = [
  { id: "request-service", label: "Request a Service", icon: "plus", href: "/portal/services/request", emphasis: "primary" },
  { id: "book-session", label: "Book a Session", icon: "calendar", href: "/portal/sessions", emphasis: "dark" },
  { id: "view-documents", label: "View Documents", icon: "file", href: "/portal/documents", emphasis: "secondary" },
  { id: "browse-offers", label: "Browse Partner Offers", icon: "tag", href: "/portal/offers", emphasis: "secondary" },
  { id: "open-apps", label: "Open Applications", icon: "app", href: "/portal/apps", emphasis: "secondary" },
  { id: "contact-support", label: "Contact Support", icon: "support", href: "/portal/support", emphasis: "secondary" },
];

export const mockPortalNextSteps: MockPortalNextStep[] = [
  {
    id: "answer-decision-questions",
    title: "Answer Decision Desk clarification questions",
    description: "Add the missing cost range so the adviser can complete the recommendation state.",
    status: "in-review",
    href: "/portal/services/decision-desk",
  },
  {
    id: "review-risk-outcome",
    title: "Review Risk Advisor outcome",
    description: "The sample risk score is ready with three recommended control actions.",
    status: "outcome-ready",
    href: "/on-demand/risk-advisor",
  },
  {
    id: "confirm-connectivity",
    title: "Confirm connectivity service address",
    description: "The NBN order is submitted and waiting on serviceability confirmation.",
    status: "submitted",
    href: "/operations/connectivity",
  },
];

export const mockPortalFlowStatuses: MockPortalFlowStatus[] = [
  {
    id: "flow-decision-desk",
    title: "Decision Desk",
    description: "Request DD-MOCK-001 is in adviser review.",
    status: "in-review",
    href: "/on-demand/decision-desk",
  },
  {
    id: "flow-docushare",
    title: "DocuShare brief",
    description: "DOC-MOCK-001 has supporting preview files attached.",
    status: "submitted",
    href: "/document-nucleus/brief",
  },
  {
    id: "flow-connectivity",
    title: "Connectivity order",
    description: "NBN-MOCK-001 is submitted for serviceability review.",
    status: "submitted",
    href: "/operations/connectivity",
  },
  {
    id: "flow-risk",
    title: "Risk Advisor",
    description: "RISK-MOCK-001 outcome is ready for review.",
    status: "outcome-ready",
    href: "/on-demand/risk-advisor",
  },
  {
    id: "flow-fixer",
    title: "The Fixer",
    description: "FIX-MOCK-001 has been assigned to the triage queue.",
    status: "assigned",
    href: "/on-demand/the-fixer",
  },
];

export const mockPortalServiceRequests: MockPortalServiceRequest[] = [
  ...mockDecisionDeskRequests.map((request) => ({
    id: "decision-desk",
    title: request.title,
    source: "Decision Desk" as const,
    category: request.category,
    status: request.status,
    description: request.summary,
    lastUpdated: "7 May 2026",
    nextAction: "Review consultant questions",
    ctaLabel: "Continue Decision Desk",
    ctaHref: "/portal/services/decision-desk/start",
  })),
  ...mockDocuShareBriefs.map((brief) => ({
    id: "docushare-brief",
    title: `${brief.documentType} brief`,
    source: "DocuShare" as const,
    category: brief.category,
    status: brief.status,
    description: `${brief.jurisdiction} document brief for ${brief.intendedUse.toLowerCase()}.`,
    lastUpdated: "7 May 2026",
    nextAction: "Review document status",
    ctaLabel: "Open DocuShare brief",
    ctaHref: "/portal/services/docushare/start",
  })),
  ...mockConnectivityOrders.map((order) => ({
    id: "connectivity-order",
    title: "Business connectivity order",
    source: "Connectivity" as const,
    category: order.serviceabilityStatus,
    status: order.status,
    description: `Service order for ${order.serviceAddress}.`,
    lastUpdated: "6 May 2026",
    nextAction: "Confirm serviceability",
    ctaLabel: "View Connectivity",
    ctaHref: "/portal/services/nbn/start",
  })),
  ...mockRiskAssessments.map((assessment) => ({
    id: "risk-advisor",
    title: `${assessment.businessName} risk assessment`,
    source: "Risk Advisor" as const,
    category: assessment.industry,
    status: assessment.status,
    description: assessment.summary,
    lastUpdated: "6 May 2026",
    nextAction: `Review score ${assessment.score}/100`,
    ctaLabel: "Review Risk Advisor",
    ctaHref: "/portal/services/risk-advisor/start",
  })),
  ...mockFixerRequests.map((request) => ({
    id: "the-fixer",
    title: request.issueTitle,
    source: "The Fixer" as const,
    category: request.urgency,
    status: request.status,
    description: request.issueDescription,
    lastUpdated: "5 May 2026",
    nextAction: "Assigned for triage",
    ctaLabel: "Open The Fixer",
    ctaHref: "/portal/services/the-fixer/start",
  })),
];

export const mockPortalDocumentActivity: MockPortalDocumentActivity[] = [
  ...mockPortalDocuments.map((document, index) => ({
    id: document.id,
    name: document.title,
    category: document.category,
    date: index === 0 ? "7 May 2026" : "6 May 2026",
    size: document.file.sizeLabel,
    status: document.status,
  })),
  {
    id: "portal-doc-004",
    name: "Cash Flow Forecast Template",
    category: "Finance",
    date: "5 May 2026",
    size: "Preview file",
    status: "in-progress",
  },
  {
    id: "portal-doc-005",
    name: "Tender Submission Review",
    category: "Bids",
    date: "4 May 2026",
    size: "Preview file",
    status: "in-review",
  },
];

export const mockPortalApplications: MockPortalApplication[] = [
  {
    id: "operations-finance",
    name: "Operations & Finance",
    backendLabel: "Powered by ERPNext",
    description: "Manage accounting, operations, projects, purchasing, sales and finance workflows.",
    accessState: "included",
    icon: "layers",
    actionLabel: "Open",
    helpsWith: ["Track income, expenses and cash flow", "Manage purchase orders and suppliers", "Run projects and task workflows"],
    capabilities: ["Accounting & Ledger", "Accounts Payable / Receivable", "Project Management", "Purchase Orders", "Sales Orders", "Inventory"],
  },
  {
    id: "people-hr",
    name: "People & HR",
    backendLabel: "Powered by HRMS",
    description: "Manage employees, leave, attendance, payroll and HR workflows.",
    accessState: "available",
    icon: "users",
    actionLabel: "Request Access",
    helpsWith: ["Onboard new team members", "Manage leave balances", "Store employee contracts"],
    capabilities: ["Employee Records", "Leave Management", "Attendance Tracking", "Payroll", "Onboarding Workflows", "HR Policies"],
  },
  {
    id: "sales-crm",
    name: "Sales & CRM",
    backendLabel: "Powered by CRM",
    description: "Manage leads, deals, customers, pipelines and relationship tracking.",
    accessState: "available",
    icon: "trending",
    actionLabel: "Request Access",
    helpsWith: ["Track leads", "Manage customer relationships", "Monitor your pipeline"],
    capabilities: ["Lead Management", "Deal Pipelines", "Contact Records", "Sales Reporting", "Activity Tracking"],
  },
  {
    id: "documents",
    name: "Documents",
    backendLabel: "Powered by Drive",
    description: "Store, share and manage business documents, templates and deliverables.",
    accessState: "included",
    icon: "file",
    actionLabel: "Open",
    helpsWith: ["Access RBP-delivered documents", "Download templates", "Share files securely"],
    capabilities: ["Document Storage", "Folder Organisation", "File Sharing", "Version History", "Template Library"],
  },
  {
    id: "support-desk",
    name: "Support Desk",
    backendLabel: "Powered by Helpdesk",
    description: "Track support requests, service tickets and help workflows.",
    accessState: "included",
    icon: "support",
    actionLabel: "Open",
    helpsWith: ["Track support status", "View request history", "Receive notifications"],
    capabilities: ["Ticket Status", "Priority Labels", "Request History", "Knowledge Base"],
  },
  {
    id: "learning",
    name: "Learning",
    backendLabel: "Powered by LMS",
    description: "Access onboarding, training, courses and learning content.",
    accessState: "coming-soon",
    icon: "learning",
    actionLabel: "Learn More",
    helpsWith: ["Complete onboarding modules", "Access training courses", "Track learning progress"],
    capabilities: ["Onboarding Modules", "Business Courses", "Progress Tracking", "Certificates"],
  },
  {
    id: "analytics",
    name: "Analytics",
    backendLabel: "Powered by Insights",
    description: "View dashboards, reports and business performance insights.",
    accessState: "locked",
    icon: "chart",
    actionLabel: "Request Upgrade",
    helpsWith: ["Monitor KPIs", "Build dashboards", "Identify trends"],
    capabilities: ["Custom Dashboards", "Reports", "KPI Tracking", "Data Visualisation"],
  },
  {
    id: "payments-billing",
    name: "Payments & Billing",
    backendLabel: "Powered by Payments",
    description: "View billing placeholders and planned payments workflows.",
    accessState: "coming-soon",
    icon: "billing",
    actionLabel: "Learn More",
    helpsWith: ["View billing placeholders", "Plan future payment workflows", "Track subscription concepts"],
    capabilities: ["Invoice Placeholders", "Billing History", "Payment Planning"],
  },
];

export const mockPortalIntegrations = [
  { name: "ERPNext", status: "Connected", sync: "Healthy" },
  { name: "Frappe CRM", status: "Requested", sync: "Pending Setup" },
  { name: "HRMS", status: "Coming Soon", sync: "N/A" },
  { name: "Helpdesk", status: "Connected", sync: "Healthy" },
  { name: "OpenAI", status: "Requested", sync: "Pending Setup" },
  { name: "Google Drive", status: "Coming Soon", sync: "N/A" },
  { name: "Microsoft 365", status: "Coming Soon", sync: "N/A" },
  { name: "Xero", status: "Manual Setup", sync: "Action Required" },
];

export const mockPortalOffers: MockPortalOffer[] = [
  {
    id: "offer-xero-member",
    partner: "Xero",
    logo: "X",
    title: "3 months free subscription",
    description: "Member value card for accounting software offer states.",
    category: "Accounting",
    saving: "Up to $294",
    accessState: "included",
    rating: 5,
  },
  ...mockOffers.map((offer, index) => ({
    id: offer.id,
    partner: offer.title.replace(/^Mock /, "").replace(" Offer", ""),
    logo: offer.title.slice(5, 7).toUpperCase(),
    title: offer.badge,
    description: offer.description,
    category: offer.category,
    saving: index === 0 ? "Member rate" : "Exclusive access",
    accessState: index === 1 ? "locked" as const : "available" as const,
    rating: 4,
  })),
];

export const mockPortalFeaturedResource = {
  title: "How to Build a 90-Day Business Action Plan",
  description: "A step-by-step guide to setting quarterly goals, identifying priorities, and building accountability systems.",
  category: "Strategy",
  readTime: "12 min read",
  typeLabel: "Guide" as const,
  href: "/resources",
};

export const mockPortalResources: MockPortalResource[] = [
  ...mockResources.map((resource) => ({
    id: resource.id,
    title: resource.title,
    category: resource.category,
    typeLabel: resource.type === "tools" ? "Tool" as const : "Guide" as const,
    readTime: resource.type === "tools" ? "Interactive preview" : "8 min",
    icon: "file" as const,
    href: resource.href,
  })),
  {
    id: "resource-video-hiring",
    title: "Hiring Your First Employee",
    category: "human-resources",
    typeLabel: "Video",
    readTime: "15 min",
    icon: "video",
    href: "/resources",
  },
  {
    id: "resource-podcast-scaling",
    title: "Scaling a Service Business",
    category: "strategy",
    typeLabel: "Podcast",
    readTime: "32 min",
    icon: "mic",
    href: "/resources",
  },
];

export const mockPortalSupportTickets: MockPortalSupportTicket[] = [
  { id: "RBP-1042", subject: "Unable to access Xero integration preview", status: "Open", updated: "7 May 2026", priority: "High" },
  { id: "RBP-1038", subject: "Question about membership plan upgrade", status: "Resolved", updated: "4 May 2026", priority: "Normal" },
  { id: "RBP-1031", subject: "Document template formatting issue", status: "Resolved", updated: "30 Apr 2026", priority: "Low" },
];

export const mockPortalKnowledgeBase = [
  { q: "How do I book an advisory session?", a: "Use the portal sessions area or the public contact flow; no real booking is created in this preview." },
  { q: "Can I change my membership plan?", a: "The settings page shows preview membership states only. Real account changes are deferred." },
  { q: "How do I access my documents?", a: "Document placeholders appear under the Documents section without real file upload or storage." },
  { q: "How do partner offers work?", a: "Offer cards show entitlement and eligibility states only; no redemption is processed." },
];

export const mockPortalSettingsProfile = {
  firstName: "Pablo",
  lastName: "Demo",
  email: mockCurrentUser.contact.email,
  phone: mockCurrentUser.contact.phone ?? "0400 000 000",
  business: mockCurrentUser.contact.businessName ?? "Demo Business Pty Ltd",
  abn: "12 345 678 901",
  plan: "RBP Premium Membership",
  renewalDate: "1 July 2026",
  membershipStatus: "active" as MockPortalMembershipState,
};

export const mockPortalDashboard = {
  user: mockCurrentUser,
  membershipStatus: "active" as MockPortalMembershipState,
  membershipScenarios: mockPortalMembershipScenarios,
  membershipTimeline: mockMembershipTimeline,
  notifications: mockNotifications,
  documents: mockPortalDocuments,
  documentActivity: mockPortalDocumentActivity,
  activeRequests: mockPortalServiceRequests,
  applicationCategories: mockApplicationCategories,
  applications: mockPortalApplications,
  offers: mockPortalOffers,
  resources: mockPortalResources,
  metrics: mockPortalMetrics,
  recentActivity: mockPortalRecentActivity,
  quickLinks: mockPortalQuickActions,
  nextSteps: mockPortalNextSteps,
  flowStatuses: mockPortalFlowStatuses,
};

export const mockPortalState: PortalDashboardState = {
  customer: {
    id: mockCurrentUser.id,
    name: mockCurrentUser.contact.name,
    email: mockCurrentUser.contact.email,
    businessName: mockCurrentUser.contact.businessName,
  },
  membershipStatus: "active",
  membershipPlan: "RBP Premium Membership",
  activities: mockPortalServiceRequests.map((request) => ({
    id: request.id,
    product:
      request.source === "Decision Desk"
        ? "decision-desk"
        : request.source === "DocuShare"
          ? "docushare"
          : request.source === "Connectivity"
            ? "connectivity"
            : request.source === "Risk Advisor"
              ? "risk-advisor"
              : "the-fixer",
    title: request.title,
    description: request.description,
    status: request.status as PortalDashboardState["activities"][number]["status"],
    href: request.ctaHref,
    nextAction: request.nextAction,
    updatedAt: request.lastUpdated,
  })),
  notifications: mockNotifications.map((notification) => ({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    status: notification.status as PortalDashboardState["notifications"][number]["status"],
    href: notification.href ?? "/portal/dashboard",
  })),
};
