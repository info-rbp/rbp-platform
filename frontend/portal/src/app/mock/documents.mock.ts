import type { MockFileReference, MockStatus } from "./types.mock";

export interface MockPortalDocument {
  id: string;
  title: string;
  category: string;
  status: MockStatus;
  file: MockFileReference;
}

export const mockPortalDocuments: MockPortalDocument[] = [
  {
    id: "portal-doc-001",
    title: "Mock Membership Welcome Pack",
    category: "Membership",
    status: "active",
    file: {
      id: "file-membership-pack",
      fileName: "membership-welcome-pack-placeholder.pdf",
      fileType: "PDF",
      sizeLabel: "Mock file",
      status: "mock-only",
    },
  },
  {
    id: "portal-doc-002",
    title: "Mock Decision Summary",
    category: "Decision Desk",
    status: "outcome-ready",
    file: {
      id: "file-decision-summary",
      fileName: "decision-summary-placeholder.pdf",
      fileType: "PDF",
      sizeLabel: "Mock file",
      status: "mock-only",
    },
  },
  {
    id: "portal-doc-003",
    title: "Mock DocuShare Brief Placeholder",
    category: "DocuShare",
    status: "submitted",
    file: {
      id: "file-docushare-brief",
      fileName: "docushare-brief-placeholder.pdf",
      fileType: "PDF",
      sizeLabel: "Mock file",
      status: "mock-only",
    },
  },
];
