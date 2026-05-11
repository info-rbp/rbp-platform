export interface OperationArea {
  id: string;
  title: string;
  summary: string;
  href: string;
  status: "ready" | "placeholder" | "content-required" | "backend-later";
}

export const operationAreas: OperationArea[] = [
  { id: "insurance", title: "Business Insurance", summary: "Business insurance product information and BizCover quote referral pathways with RBP tracking.", href: "/operations/insurance", status: "ready" },
  { id: "finance", title: "Business Finance", summary: "Commercial finance product information, calculators, and an internal get-funded referral form.", href: "/operations/finance", status: "ready" },
  { id: "nbn-phone", title: "Business NBN", summary: "Coverage-first Business NBN information for plans, connection readiness, Wi-Fi modems, and phone setup.", href: "/operations/connectivity/nbn-phone", status: "ready" },
  { id: "coming-soon", title: "Coming Soon", summary: "New operational tools, referral pathways, partner services, and business support resources being prepared.", href: "/operations/coming-soon", status: "ready" },
];
