import {
  mockMarketplaceEnquiries,
  mockMarketplaceItems,
  mockMarketplaceListingTypes,
  mockMarketplaceMediaPlaceholders,
  mockMarketplaceSellerListings,
  mockMarketplaceTimeline,
} from "../../mock";
import type { MarketplaceService } from "../../types/portal";
import {
  createMockReference,
  mockFailure,
  mockGet,
  mockPost,
  requireFields,
} from "./mockClient";
import { listMockPortalActivity, recordMockPortalActivity } from "./portal.mockService";

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

export async function submitMockMarketplaceEnquiry(payload: MockMarketplaceEnquiryPayload) {
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

  const response = await mockPost(
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

  if (response.ok && response.data) {
    await recordMockPortalActivity({
      id: "marketplace-offer-current",
      product: "marketplace-offer",
      title: "Marketplace offer submitted",
      description: String(payload.message ?? "Buyer enquiry or offer submitted through the customer portal."),
      status: "submitted",
      reference: response.data.reference,
      href: "/portal/marketplace/offers/new",
      adminHref: "/admin/marketplace",
      nextAction: "Await marketplace team response",
    });
  }

  return response;
}

export async function submitMockMarketplaceListing(payload: MockMarketplaceListingPayload) {
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

  const response = await mockPost(
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

  if (response.ok && response.data) {
    await recordMockPortalActivity({
      id: "marketplace-listing-current",
      product: "marketplace-listing",
      title: String(payload.listingTitle ?? "Marketplace listing"),
      description: String(payload.description ?? "Seller listing submitted through the customer portal."),
      status: "in-review",
      reference: response.data.reference,
      href: "/portal/marketplace/listings/new",
      adminHref: "/admin/marketplace",
      nextAction: "Await admin review",
    });
  }

  return response;
}

export function listMyMarketplaceListings() {
  return Promise.resolve(listMockPortalActivity("marketplace-listing"));
}

export function listMyMarketplaceOffers() {
  return Promise.resolve(listMockPortalActivity("marketplace-offer"));
}

export const mockMarketplaceService: MarketplaceService = {
  createListingDraft(payload) {
    return recordMockPortalActivity({
      product: "marketplace-listing",
      title: String(payload.listingTitle ?? "Marketplace listing draft"),
      description: String(payload.description ?? "Draft seller listing."),
      status: "draft",
      href: "/portal/marketplace/listings/new",
      adminHref: "/admin/marketplace",
      nextAction: "Complete listing details and media",
    });
  },

  submitListing(id) {
    return recordMockPortalActivity({
      id,
      product: "marketplace-listing",
      title: "Marketplace listing",
      description: "Seller listing submitted for admin review.",
      status: "in-review",
      reference: createMockReference("MKT-LIST"),
      href: "/portal/marketplace/listings/new",
      adminHref: "/admin/marketplace",
      nextAction: "Await admin review",
    });
  },

  createOffer(payload) {
    return recordMockPortalActivity({
      product: "marketplace-offer",
      title: "Marketplace offer",
      description: String(payload.message ?? "Buyer offer submitted."),
      status: "submitted",
      reference: createMockReference("MKT-OFFER"),
      href: "/portal/marketplace/offers/new",
      adminHref: "/admin/marketplace",
      nextAction: "Await marketplace team response",
    });
  },

  listMyListings() {
    return Promise.resolve(listMockPortalActivity("marketplace-listing"));
  },

  listMyOffers() {
    return Promise.resolve(listMockPortalActivity("marketplace-offer"));
  },
};
