export type LegalPageStatus = "legal-review-required" | "placeholder" | "ready";

export interface LegalPage {
  id: string;
  title: string;
  href: string;
  summary: string;
  status: LegalPageStatus;
}

export const legalPages: LegalPage[] = [
  { id: "privacy-policy", title: "Privacy Policy", href: "/legal/privacy-policy", summary: "Explains how personal information may be collected, used, stored, and managed. Requires final legal review before launch.", status: "legal-review-required" },
  { id: "terms-of-use", title: "Terms of Use", href: "/legal/terms-of-use", summary: "Sets out website access, permitted use, limitations, disclaimers, and general user obligations. Requires final legal review.", status: "legal-review-required" },
  { id: "terms-of-engagement", title: "Terms of Engagement", href: "/legal/terms-of-engagement", summary: "Outlines the terms applying to service engagements, scope, delivery, responsibilities, and client obligations. Requires legal and commercial review.", status: "legal-review-required" },
  { id: "payment-policy", title: "Payment Policy", href: "/legal/payment-policy", summary: "Covers payment timing, billing, refunds, failed payments, subscriptions, and related commercial rules. Requires legal and commercial review.", status: "legal-review-required" },
  { id: "services-policy", title: "Services Policy", href: "/legal/services-policy", summary: "Explains how services are requested, scoped, delivered, revised, and supported. Requires review before publication.", status: "legal-review-required" },
];
