import {
  mockMarketplaceEnquiries,
  mockMarketplaceItems,
  mockMarketplaceListingTypes,
  mockMarketplaceMediaPlaceholders,
  mockMarketplaceSellerListings,
  mockMarketplaceTimeline,
} from "../../mock";
import {
  createMockReference,
  mockFailure,
  mockGet,
  mockPost,
  requireFields,
} from "./mockClient";

export interface MockMarketplaceEnquiryPayload extends Record<string, unknown> {
  itemId?: string;
  buyerName?: string;
  buyerEmail?: string;
  businessName?: string;
  message?: string;
}

export interface MockMarketplaceListingPayload extends Record<string, unknown> {
  listingTitle?: string;
  listingCategory?: string;
  listingType?: string;
  sellerName?: string;
  sellerEmail?: string;
  description?: string;
  price?: string;
  acceptedTerms?: boolean;
}

export interface MockMarketplaceResult {
  reference: string;
  status: "submitted" | "in-review";
  marketplaceHref: string;
  adminReviewHref?: string;
  timeline: typeof mockMarketplaceTimeline;
}

export function getMockMarketplaceItems() {
  return mockGet(
    "/mock/marketplace/items",
    {
      items: mockMarketplaceItems,
      enquiries: mockMarketplaceEnquiries,
      sellerListings: mockMarketplaceSellerListings,
      listingTypes: mockMarketplaceListingTypes,
      mediaPlaceholders: mockMarketplaceMediaPlaceholders,
    },
    "Mock marketplace items returned."
  );
}

export function submitMockMarketplaceEnquiry(payload: MockMarketplaceEnquiryPayload) {
  const errors = requireFields(payload, ["itemId", "buyerName", "buyerEmail", "message"]);

  if (errors.length > 0) {
    return Promise.resolve(
      mockFailure<MockMarketplaceResult>(
        "/mock/marketplace/enquiry",
        "Mock marketplace enquiry validation failed.",
        errors
      )
    );
  }

  return mockPost(
    "/mock/marketplace/enquiry",
    payload,
    () => ({
      reference: createMockReference("MKT-ENQ"),
      status: "submitted" as const,
      marketplaceHref: "/marketplace",
      adminReviewHref: "/admin/marketplace",
      timeline: mockMarketplaceTimeline,
    }),
    "Mock marketplace enquiry submitted."
  );
}

export function submitMockMarketplaceListing(payload: MockMarketplaceListingPayload) {
  const errors = requireFields(payload, [
    "listingTitle",
    "listingCategory",
    "listingType",
    "sellerName",
    "sellerEmail",
    "description",
    "price",
  ]);

  if (!payload.acceptedTerms) {
    errors.push({
      field: "acceptedTerms",
      code: "required",
      message: "Terms must be accepted for this mock marketplace listing.",
    });
  }

  if (errors.length > 0) {
    return Promise.resolve(
      mockFailure<MockMarketplaceResult>(
        "/mock/marketplace/listing",
        "Mock marketplace listing validation failed.",
        errors
      )
    );
  }

  return mockPost(
    "/mock/marketplace/listing",
    payload,
    () => ({
      reference: createMockReference("MKT-LIST"),
      status: "in-review" as const,
      marketplaceHref: "/marketplace",
      adminReviewHref: "/admin/marketplace",
      timeline: mockMarketplaceTimeline,
    }),
    "Mock marketplace listing submitted for review."
  );
}
