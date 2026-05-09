import type { MockContact, MockMoney, MockStatus, MockTimelineItem } from "./types.mock";

export type MockMarketplaceListingType =
  | "rbp-product"
  | "rbp-asset"
  | "third-party-product"
  | "third-party-asset"
  | "service";

export type MockMarketplaceCategory =
  | "rbp-products"
  | "rbp-assets"
  | "third-party-products-assets";

export interface MockMarketplaceItem {
  id: string;
  title: string;
  category: MockMarketplaceCategory;
  listingType: MockMarketplaceListingType;
  supplierName: string;
  description: string;
  price: MockMoney;
  location: string;
  status: MockStatus;
  deliveryLabel: string;
  timelineLabel: string;
  featured?: boolean;
  includes: string[];
  tags: string[];
}

export interface MockMarketplaceEnquiry {
  id: string;
  reference: string;
  itemId: string;
  buyer: MockContact;
  message: string;
  status: MockStatus;
}

export interface MockMarketplaceSellerListing {
  id: string;
  reference: string;
  listingTitle: string;
  listingCategory: string;
  listingType: MockMarketplaceListingType;
  sellerName: string;
  sellerEmail: string;
  description: string;
  priceLabel: string;
  status: MockStatus;
}

export interface MockMarketplaceMediaPlaceholder {
  id: string;
  label: string;
  description: string;
}

export const mockMarketplaceItems: MockMarketplaceItem[] = [
  {
    id: "market-001",
    title: "Business Process Toolkit",
    category: "rbp-products",
    listingType: "rbp-product",
    supplierName: "Remote Business Partner",
    description: "A mock business process toolkit for Phase 1 listing, enquiry, and buyer journey testing.",
    price: {
      amount: 250,
      currency: "AUD",
      gstIncluded: false,
      label: "$250 + GST",
    },
    location: "Online",
    status: "active",
    deliveryLabel: "Digital delivery",
    timelineLabel: "2-3 business days",
    featured: true,
    includes: [
      "Process mapping template",
      "Procedure checklist",
      "Responsibility matrix",
      "Implementation guide",
    ],
    tags: ["operations", "documents", "templates"],
  },
  {
    id: "market-002",
    title: "Office Asset Bundle",
    category: "third-party-products-assets",
    listingType: "third-party-asset",
    supplierName: "Example Supplier Pty Ltd",
    description: "A mock third-party asset listing for marketplace browsing and admin review concepts.",
    price: {
      amount: 1200,
      currency: "AUD",
      gstIncluded: false,
      label: "$1,200 + GST",
    },
    location: "Melbourne",
    status: "in-review",
    deliveryLabel: "Seller arranged",
    timelineLabel: "Subject to seller confirmation",
    includes: [
      "Office desks",
      "Chairs",
      "Storage units",
      "Basic handover notes",
    ],
    tags: ["assets", "office", "third-party"],
  },
  {
    id: "market-003",
    title: "CRM Setup Sprint",
    category: "rbp-products",
    listingType: "service",
    supplierName: "Remote Business Partner",
    description: "A mock application setup package for sales-led businesses preparing a CRM rollout.",
    price: {
      amount: 499,
      currency: "AUD",
      gstIncluded: false,
      label: "$499 + GST",
    },
    location: "Online",
    status: "active",
    deliveryLabel: "Setup + handover",
    timelineLabel: "5-7 business days",
    featured: true,
    includes: [
      "Pipeline setup",
      "Contact structure",
      "Dashboard briefing",
      "Mock implementation plan",
    ],
    tags: ["applications", "crm", "sales"],
  },
];

export const mockMarketplaceEnquiries: MockMarketplaceEnquiry[] = [
  {
    id: "market-enquiry-001",
    reference: "MKT-MOCK-001",
    itemId: "market-001",
    buyer: {
      name: "Demo Buyer",
      email: "buyer@example.com",
      businessName: "Buyer Demo Pty Ltd",
    },
    message: "I would like more information about this mock listing.",
    status: "submitted",
  },
];

export const mockMarketplaceSellerListings: MockMarketplaceSellerListing[] = [
  {
    id: "seller-listing-001",
    reference: "MKT-LIST-MOCK-001",
    listingTitle: "Mock Partner Service Listing",
    listingCategory: "third-party-products-assets",
    listingType: "service",
    sellerName: "Example Partner",
    sellerEmail: "partner@example.com",
    description: "A mock seller listing pending admin review.",
    priceLabel: "$750 + GST",
    status: "in-review",
  },
];

export const mockMarketplaceListingTypes = [
  {
    id: "rbp-product",
    title: "RBP Product",
    description: "A Remote Business Partner product, package, or toolkit.",
  },
  {
    id: "rbp-asset",
    title: "RBP Asset",
    description: "An RBP-owned asset or resource made available through the marketplace.",
  },
  {
    id: "third-party-product",
    title: "Third-party product",
    description: "A partner or supplier product requiring review before publication.",
  },
  {
    id: "third-party-asset",
    title: "Third-party asset",
    description: "A supplier-owned business asset or listing.",
  },
  {
    id: "service",
    title: "Service",
    description: "A service listing suitable for enquiry or review.",
  },
];

export const mockMarketplaceMediaPlaceholders: MockMarketplaceMediaPlaceholder[] = [
  {
    id: "primary-image",
    label: "Primary listing image",
    description: "Mock media slot only. No real image is uploaded in Phase 1.",
  },
  {
    id: "supporting-document",
    label: "Supporting document",
    description: "Mock document slot only. No real document is uploaded in Phase 1.",
  },
  {
    id: "seller-brochure",
    label: "Seller brochure",
    description: "Mock brochure placeholder for future listing review.",
  },
];

export const mockMarketplaceTimeline: MockTimelineItem[] = [
  {
    id: "marketplace-draft",
    label: "Draft created",
    description: "The marketplace request has been started in mock mode.",
    status: "draft",
    timestamp: "2026-05-07T10:00:00Z",
  },
  {
    id: "marketplace-submitted",
    label: "Submitted",
    description: "The mock marketplace request has been submitted.",
    status: "submitted",
    timestamp: "2026-05-07T10:10:00Z",
  },
  {
    id: "marketplace-review",
    label: "Admin review",
    description: "The mock listing or enquiry is visible in a simulated review state.",
    status: "in-review",
    timestamp: "2026-05-07T10:20:00Z",
  },
];

export const mockMarketplaceAdminReviewStates = [
  "pending",
  "in-review",
  "approved",
  "rejected",
  "needs-info",
];
