export interface MembershipPageItem {
  id: string;
  title: string;
  summary: string;
  href: string;
  status: "ready" | "placeholder" | "content-required" | "backend-later" | "legal-review-required";
}

export const membershipPages: MembershipPageItem[] = [
  { id: "overview", title: "Membership Overview", summary: "A public overview of Remote Business Partner membership, including the value proposition, access model, and key benefits.", href: "/membership/overview", status: "ready" },
  { id: "remote-business-partner-membership", title: "Remote Business Partner Membership", summary: "Detailed membership positioning for businesses that want ongoing access to advisory support, tools, offers, resources, and structured assistance.", href: "/membership/remote-business-partner-membership", status: "ready" },
  { id: "inclusions", title: "Inclusions", summary: "A summary of membership inclusions, support areas, service access, resources, offers, and platform benefits.", href: "/membership/inclusions", status: "ready" },
  { id: "pricing", title: "Pricing", summary: "Membership pricing information and plan comparison. Final commercial details should be confirmed before launch.", href: "/membership/pricing", status: "content-required" },
  { id: "usage", title: "Usage", summary: "Explains how members access services, use inclusions, request support, engage with resources, and navigate member benefits.", href: "/membership/usage", status: "ready" },
  { id: "payment-terms", title: "Payment Terms", summary: "Payment terms, renewal conditions, billing rules, and commercial requirements. Requires final legal and commercial review.", href: "/membership/payment-terms", status: "legal-review-required" },
  { id: "sign-up-now", title: "Sign Up Now", summary: "Public sign-up pathway for membership enquiries and future membership onboarding. Backend workflow required later.", href: "/membership/sign-up-now", status: "backend-later" },
  { id: "frequently-asked-questions", title: "Membership FAQs", summary: "Common membership questions covering access, usage, inclusions, payments, support, and cancellation.", href: "/membership/frequently-asked-questions", status: "ready" },
];
