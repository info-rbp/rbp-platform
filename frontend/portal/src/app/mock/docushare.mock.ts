import type { MockFileReference, MockStatus, MockTimelineItem } from "./types.mock";

export interface MockDocumentProduct {
  id: string;
  title: string;
  category: string;
  description: string;
  priceLabel: string;
  status: "available" | "placeholder";
}

export interface MockDocuShareDocumentGroup {
  id: string;
  title: string;
  description: string;
  tag: string;
  color: string;
  lightBg: string;
  accent: string;
  tagColor: string;
}

export interface MockDocuShareBrief {
  id: string;
  reference: string;
  documentType: string;
  category: string;
  jurisdiction: string;
  intendedUse: string;
  status: MockStatus;
  files: MockFileReference[];
}

export const mockDocuShareDocumentGroups: MockDocuShareDocumentGroup[] = [
  {
    id: "templates",
    title: "Templates",
    description: "Reusable policy, proposal, profile and operating templates for common business needs.",
    tag: "Fast start",
    color: "bg-blue-700",
    lightBg: "bg-blue-50",
    accent: "text-blue-700",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "documentation-suites",
    title: "Documentation Suites",
    description: "Bundled operating, HR, governance and sales documentation for a complete business area.",
    tag: "Structured suite",
    color: "bg-violet-700",
    lightBg: "bg-violet-50",
    accent: "text-violet-700",
    tagColor: "bg-violet-100 text-violet-700",
  },
  {
    id: "toolkits",
    title: "Toolkits",
    description: "Practical document kits that combine templates, checklists, instructions and sample wording.",
    tag: "Practical kit",
    color: "bg-emerald-700",
    lightBg: "bg-emerald-50",
    accent: "text-emerald-700",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "process",
    title: "Process Documents",
    description: "Process maps, SOPs and workflow guides that turn internal know-how into usable documents.",
    tag: "Operations",
    color: "bg-sky-700",
    lightBg: "bg-sky-50",
    accent: "text-sky-700",
    tagColor: "bg-sky-100 text-sky-700",
  },
];

export const mockDocumentProducts: MockDocumentProduct[] = [
  {
    id: "template-policy-001",
    title: "Business Policy Template Pack",
    category: "templates",
    description: "Mock document product for frontend browsing and brief simulation.",
    priceLabel: "Mock price only",
    status: "placeholder",
  },
  {
    id: "suite-operations-001",
    title: "Operations Documentation Suite",
    category: "documentation-suites",
    description: "Mock suite used for Document Nucleus product detail pages.",
    priceLabel: "Mock price only",
    status: "placeholder",
  },
  {
    id: "toolkit-people-001",
    title: "People Operations Toolkit",
    category: "toolkits",
    description: "Mock HR and people operations toolkit for onboarding, policies and review rhythms.",
    priceLabel: "Mock price only",
    status: "placeholder",
  },
  {
    id: "process-sop-001",
    title: "Standard Operating Procedure Brief",
    category: "process",
    description: "Mock SOP brief for turning a recurring workflow into clear operating documentation.",
    priceLabel: "Mock price only",
    status: "placeholder",
  },
];

export const mockDocuShareBriefs: MockDocuShareBrief[] = [
  {
    id: "doc-brief-001",
    reference: "DOC-MOCK-001",
    documentType: "Policy Pack",
    category: "templates",
    jurisdiction: "Australia",
    intendedUse: "Internal operations",
    status: "submitted",
    files: [
      {
        id: "file-001",
        fileName: "business-context-placeholder.pdf",
        fileType: "PDF",
        sizeLabel: "Mock file",
        status: "mock-only",
      },
    ],
  },
];

export const mockDocumentCategories = mockDocuShareDocumentGroups.map((group) => group.id);

export const mockDocuSharePurposeOptions = [
  { label: "Internal operations", value: "internal-operations", description: "Used by staff, managers or contractors inside the business." },
  { label: "Client or partner communication", value: "client-partner", description: "Shared externally with clients, suppliers, investors or partners." },
  { label: "Compliance or governance", value: "compliance-governance", description: "Supports a policy, legal, board or regulatory requirement." },
  { label: "Sales or growth", value: "sales-growth", description: "Helps pitch, explain, sell or expand an offer." },
];

export const mockDocuShareAudienceOptions = [
  { label: "Owners and leadership", value: "owners-leadership", description: "Directors, founders, senior managers or advisers." },
  { label: "Employees and contractors", value: "employees-contractors", description: "Operational team members who need clear guidance." },
  { label: "Clients and customers", value: "clients-customers", description: "External readers evaluating or using your offer." },
  { label: "Regulators, lenders or investors", value: "formal-stakeholders", description: "Formal stakeholders who expect structured, precise information." },
];

export const mockDocuShareStyleOptions = [
  { label: "Executive precision", value: "executive-precision", description: "Concise, polished and board-ready." },
  { label: "Practical operator", value: "practical-operator", description: "Plain English with clear steps and responsibilities." },
  { label: "Warm professional", value: "warm-professional", description: "Approachable, clear and client-friendly." },
  { label: "Formal compliance", value: "formal-compliance", description: "Structured and careful for policy or governance use." },
];

export const mockDocuShareBrandingOptions = [
  { label: "Use existing brand", value: "existing-brand", description: "Represent logo, colours and brand notes as mock placeholders." },
  { label: "Clean RBP house style", value: "rbp-house-style", description: "Use a restrained professional style for the mock brief." },
  { label: "Minimal formatting", value: "minimal-formatting", description: "Focus on structure and wording over visual polish." },
];

export const mockDocuShareGroupQuestions: Record<string, string[]> = {
  templates: [
    "Which recurring business situation should this template support?",
    "What sections or fields must be reusable each time?",
    "Who will customise or approve the template before use?",
  ],
  "documentation-suites": [
    "Which business area should the suite cover end-to-end?",
    "What existing documents should be aligned or replaced?",
    "Which roles need responsibilities documented in the suite?",
  ],
  toolkits: [
    "What outcome should the toolkit help someone complete?",
    "Which checklists, scripts or examples would make it practical?",
    "How experienced is the person using the toolkit?",
  ],
  process: [
    "Which workflow or procedure needs to be documented?",
    "What triggers the process and what marks it complete?",
    "What handoffs, approvals or exceptions need to be captured?",
  ],
};

export const mockDocuShareTimeline: MockTimelineItem[] = [
  {
    id: "docushare-draft",
    label: "Draft brief started",
    description: "The DocuShare brief exists as a frontend-only Phase 1 draft.",
    status: "draft",
    timestamp: "2026-05-07T10:00:00Z",
  },
  {
    id: "docushare-submitted",
    label: "Mock brief submitted",
    description: "The brief was submitted through the mock service simulation.",
    status: "submitted",
    timestamp: "2026-05-07T10:15:00Z",
  },
  {
    id: "docushare-placeholder-files",
    label: "Supporting placeholders noted",
    description: "No real files were uploaded; placeholders indicate the intended support material only.",
    status: "placeholder",
    timestamp: "2026-05-07T10:16:00Z",
  },
  {
    id: "docushare-portal-handoff",
    label: "Portal handoff ready",
    description: "The simulated status can be reviewed from portal documents or services.",
    status: "ready",
    timestamp: "2026-05-07T10:20:00Z",
  },
];

export const mockDocuShareBriefStatuses = [
  "draft",
  "submitted",
  "placeholder",
  "ready",
];
