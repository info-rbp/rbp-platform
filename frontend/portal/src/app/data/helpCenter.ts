export type HelpSectionId = "faqs" | "knowledge-base" | "troubleshooting" | "support";

export interface HelpCategory {
  id: string;
  label: string;
}

export interface HelpArticle {
  id: string;
  section: HelpSectionId;
  category: string;
  question: string;
  answer: string;
  status: "ready" | "placeholder" | "content-required" | "backend-later";
}

export const helpSections: { id: HelpSectionId; label: string }[] = [
  { id: "faqs", label: "Frequently Asked Questions" },
  { id: "knowledge-base", label: "Knowledge Base" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "support", label: "Support Center" },
];

export const helpCategories: HelpCategory[] = [
  { id: "our-platform", label: "Our Platform" },
  { id: "on-demand-services", label: "On-Demand Services" },
  { id: "managed-services", label: "Managed Services" },
  { id: "applications", label: "Applications" },
  { id: "operations", label: "Operations" },
  { id: "marketplace", label: "Marketplace" },
  { id: "membership", label: "Membership" },
  { id: "offers", label: "Offers" },
  { id: "resources", label: "Resources" },
  { id: "other", label: "Other" },
];

export const helpArticles: HelpArticle[] = [
  {
    id: "membership-how-it-works",
    section: "faqs",
    category: "membership",
    question: "How does membership work?",
    answer: "Membership is designed to provide access to business support, resources, offers, tools, and structured service pathways. Final inclusions and commercial terms should be reviewed before launch.",
    status: "ready",
  },
  {
    id: "applications-configuration",
    section: "knowledge-base",
    category: "applications",
    question: "How are applications configured?",
    answer: "Applications are configured based on business needs, users, workflows, access requirements, and operating priorities. Setup requirements may vary depending on the application selected.",
    status: "ready",
  },
  {
    id: "operations-support",
    section: "faqs",
    category: "operations",
    question: "What support is available under Operations?",
    answer: "Operations includes business finance, insurance, connectivity, calculators, and future operational support pathways.",
    status: "ready",
  },
  {
    id: "support-contact",
    section: "support",
    category: "other",
    question: "How do I contact support?",
    answer: "Use the Contact page and select the most relevant enquiry type so the request can be routed correctly.",
    status: "ready",
  },
];
