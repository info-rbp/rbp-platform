export interface MembershipPageItem {
  id: string;
  title: string;
  summary: string;
  href: string;
  status: "ready" | "placeholder" | "content-required" | "backend-later" | "legal-review-required";
}

export const membershipPages: MembershipPageItem[] = [
  { id: "overview", title: "Membership Overview", summary: "A public overview of the Lifetime RBP Membership early bird offer, including the discounted access model, core inclusions, and key business benefits.", href: "/membership/overview", status: "ready" },
  { id: "remote-business-partner-membership", title: "Lifetime RBP Membership", summary: "Detailed early bird membership positioning for business owners who want access to core services, Nucleus, resources, offers, and discounted on-demand support.", href: "/membership/remote-business-partner-membership", status: "ready" },
  { id: "inclusions", title: "Inclusions", summary: "A summary of membership inclusions, support areas, service access, resources, offers, and platform benefits.", href: "/membership/inclusions", status: "ready" },
  { id: "pricing", title: "Pricing", summary: "Membership pricing information and plan comparison. Final commercial details should be confirmed before launch.", href: "/membership/pricing", status: "content-required" },
  { id: "usage", title: "Usage", summary: "Explains how members access services, use inclusions, request support, engage with resources, and navigate member benefits.", href: "/membership/usage", status: "ready" },
  { id: "payment-terms", title: "Payment Terms", summary: "Payment terms, renewal conditions, billing rules, and commercial requirements. Requires final legal and commercial review.", href: "/membership/payment-terms", status: "legal-review-required" },
  { id: "sign-up-now", title: "Sign Up Now", summary: "Public sign-up pathway for membership enquiries and future membership onboarding. Backend workflow required later.", href: "/membership/sign-up-now", status: "backend-later" },
  { id: "frequently-asked-questions", title: "Membership FAQs", summary: "Common membership questions covering access, usage, inclusions, payments, support, and cancellation.", href: "/membership/frequently-asked-questions", status: "ready" },
];
