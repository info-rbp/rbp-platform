export interface MarketplaceSection {
  id: string;
  title: string;
  summary: string;
  href: string;
  status: "ready" | "placeholder" | "content-required" | "backend-later";
}

export const marketplaceSections: MarketplaceSection[] = [
  { id: "rbp-products", title: "RBP Products", summary: "Remote Business Partner products, templates, bundles, documents, application setup packages, and business support resources.", href: "/marketplace#rbp-products", status: "ready" },
  { id: "rbp-assets", title: "RBP Assets", summary: "Remote Business Partner-owned assets and resources that may be made available for business use, purchase, or deployment.", href: "/marketplace#rbp-assets", status: "ready" },
  { id: "third-party-products-assets", title: "Third Party Products & Assets", summary: "Approved third-party listings including products, services, assets, tools, documents, and business resources.", href: "/marketplace#third-party-products-assets", status: "ready" },
  { id: "buying-process", title: "Buying Process", summary: "A clear pathway covering enquiry, suitability, confirmation, purchase, delivery, and follow-up support.", href: "/marketplace#buying-process", status: "ready" },
  { id: "list-with-us", title: "List With Us", summary: "A listing pathway for suppliers, partners, and businesses interested in making approved products or services available.", href: "/marketplace#list-with-us", status: "ready" },
];
