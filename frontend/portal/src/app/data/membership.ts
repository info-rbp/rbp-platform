import { premiumMembershipNavigationPages } from "./premiumMembership";

export interface MembershipPageItem {
  id: string;
  title: string;
  summary: string;
  href: string;
  status:
    | "ready"
    | "placeholder"
    | "content-required"
    | "backend-later"
    | "legal-review-required";
}

export const membershipPages: MembershipPageItem[] = premiumMembershipNavigationPages.map(
  (page) => ({
    id: page.id,
    title: page.title,
    summary: page.summary,
    href: page.href,
    status: page.status,
  })
);
