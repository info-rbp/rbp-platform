export type OfferStatus = "draft" | "published" | "paused" | "expired" | "archived";

export type OfferType = "exclusive" | "top" | "standard";

export type MemberVisibility = "public" | "members-only" | "admin-only";

export type RedemptionMethod =
  | "portal-gated-link"
  | "request-access"
  | "impact-link"
  | "manual-code"
  | "api-generated-link";

export type ApprovalStatus =
  | "draft"
  | "to-review"
  | "approved"
  | "rejected"
  | "legal-review";

export type TrackingRequired = "yes" | "no" | "optional";

export type TrackingMethod =
  | "manual"
  | "manual-plus-impact"
  | "impact-api"
  | "appwrite-only"
  | "none";

export type OfferCategory =
  | "operations-advisory"
  | "human-resource-advisory"
  | "accounting-finance"
  | "sales-marketing"
  | "management-consulting"
  | "change-management"
  | "ai-advisory"
  | "research-development"
  | "information-technology"
  | "public-relations"
  | "rbp-category"
  | "other";

export interface OfferCategoryFilter {
  id: OfferCategory;
  label: string;
}

export const offerCategoryFilters: OfferCategoryFilter[] = [
  { id: "operations-advisory", label: "Operations Advisory" },
  { id: "human-resource-advisory", label: "Human Resource Advisory" },
  { id: "accounting-finance", label: "Accounting & Finance" },
  { id: "sales-marketing", label: "Sales & Marketing" },
  { id: "management-consulting", label: "Management Consulting" },
  { id: "change-management", label: "Change Management" },
  { id: "ai-advisory", label: "AI Advisory" },
  { id: "research-development", label: "Research & Development" },
  { id: "information-technology", label: "Information Technology" },
  { id: "public-relations", label: "Public Relations" },
  { id: "rbp-category", label: "Remote Business Partner" },
  { id: "other", label: "Other" },
];

export type OfferFeaturedFilter = "top-offers" | "exclusive-offers";

export interface OfferFeaturedFilterOption {
  id: OfferFeaturedFilter;
  label: string;
  offerType: OfferType;
}

export const offerFeaturedFilters: OfferFeaturedFilterOption[] = [
  { id: "top-offers", label: "Top Offers", offerType: "top" },
  { id: "exclusive-offers", label: "Exclusive Offers", offerType: "exclusive" },
];

export interface OfferTrackingConfig {
  required: TrackingRequired;
  method: TrackingMethod;
  impactProgramId?: string;
  impactAdId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface OfferAuditMetadata {
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface PublicOffer {
  id: string;
  partnerId: string;
  partner: string;
  title: string;
  summary: string;
  category: OfferCategory;
  offerType: OfferType;
  eligibility: string;
  memberVisibility: MemberVisibility;
  status: OfferStatus;
  startDate?: string;
  endDate?: string;
  redemptionMethod: RedemptionMethod;
  publicCtaLabel: "Get Offer";
  publicCtaDestination: string;
  portalOfferDestination: string;
  terms: string;
  approvalStatus: ApprovalStatus;
  trackingRequired: TrackingRequired;
  trackingMethod: TrackingMethod;
  tracking?: OfferTrackingConfig;
  audit?: OfferAuditMetadata;
  badge?: string;
  saving?: string;
  features?: string[];
  logo?: string;
  highlight?: boolean;
  availability?: string;
  accentClassName?: string;
}

const offerCategoryLabels = Object.fromEntries(
  offerCategoryFilters.map((category) => [category.id, category.label])
) as Record<OfferCategory, string>;

function createPortalOfferDestination(id: string) {
  return `/portal/offers/${id}`;
}

function createPublicOfferDestination(portalOfferDestination: string) {
  return `/signin?returnTo=${encodeURIComponent(portalOfferDestination)}`;
}

function createOffer(offer: Omit<PublicOffer, "publicCtaLabel" | "publicCtaDestination" | "portalOfferDestination">) {
  const portalOfferDestination = createPortalOfferDestination(offer.id);

  return {
    ...offer,
    publicCtaLabel: "Get Offer" as const,
    publicCtaDestination: createPublicOfferDestination(portalOfferDestination),
    portalOfferDestination,
  };
}

export const publicOffers: PublicOffer[] = [
  createOffer({
    id: "xero-member-offer",
    partnerId: "xero",
    partner: "Xero",
    title: "3 Months Free Then 25% Off Year One",
    summary:
      "Cloud accounting access for members who want invoicing, payroll, BAS, and GST workflows in one platform.",
    category: "accounting-finance",
    offerType: "top",
    eligibility: "Active RBP members and client accounts seeking a new Xero subscription.",
    memberVisibility: "members-only",
    status: "published",
    startDate: "2026-05-01",
    endDate: "2026-12-31",
    redemptionMethod: "portal-gated-link",
    terms:
      "New subscriptions only. Partner terms apply. RBP does not complete the subscription transaction inside the platform during this MVP.",
    approvalStatus: "approved",
    trackingRequired: "yes",
    trackingMethod: "appwrite-only",
    tracking: {
      required: "yes",
      method: "appwrite-only",
      utmSource: "rbp-platform",
      utmMedium: "member-portal",
      utmCampaign: "xero-mvp-offer",
    },
    audit: {
      createdBy: "product-offers-mvp",
      createdAt: "2026-05-07T00:00:00.000Z",
      updatedBy: "product-offers-mvp",
      updatedAt: "2026-05-15T00:00:00.000Z",
    },
    badge: "Most Viewed",
    saving: "Save up to $216",
    features: [
      "Cloud invoicing and quotes",
      "Single Touch Payroll support",
      "GST and BAS reporting workflows",
    ],
    logo: "XE",
    highlight: false,
    availability: "Available to eligible active members",
    accentClassName: "bg-sky-600",
  }),
  createOffer({
    id: "employment-hero-member-offer",
    partnerId: "employment-hero",
    partner: "Employment Hero",
    title: "6-Month Free Trial With Full Platform Access",
    summary:
      "HR, payroll, onboarding, leave, and people operations support packaged as a member-only access path.",
    category: "human-resource-advisory",
    offerType: "exclusive",
    eligibility: "RBP members who need a new HR and payroll operating stack.",
    memberVisibility: "members-only",
    status: "published",
    startDate: "2026-05-01",
    endDate: "2026-11-30",
    redemptionMethod: "request-access",
    terms:
      "Availability depends on partner approval and implementation fit. RBP records interest and coordinates access during this MVP.",
    approvalStatus: "approved",
    trackingRequired: "yes",
    trackingMethod: "manual",
    tracking: {
      required: "yes",
      method: "manual",
      utmSource: "rbp-platform",
      utmMedium: "member-portal",
      utmCampaign: "employment-hero-mvp-offer",
    },
    audit: {
      createdBy: "product-offers-mvp",
      createdAt: "2026-05-07T00:00:00.000Z",
      updatedBy: "product-offers-mvp",
      updatedAt: "2026-05-15T00:00:00.000Z",
    },
    badge: "Member Value",
    saving: "Save up to $600",
    features: [
      "Automated payroll and STP",
      "Employee onboarding flows",
      "Leave and rostering management",
    ],
    logo: "EH",
    highlight: true,
    availability: "Available to approved RBP member accounts",
    accentClassName: "bg-violet-600",
  }),
  createOffer({
    id: "legalvision-member-offer",
    partnerId: "legalvision",
    partner: "LegalVision",
    title: "First Review Free For Key Business Documents",
    summary:
      "Member-gated access to an initial contract or business document review with practical legal support.",
    category: "other",
    offerType: "standard",
    eligibility: "Members who need document review before engaging a longer legal service.",
    memberVisibility: "members-only",
    status: "published",
    startDate: "2026-05-01",
    endDate: "2026-10-31",
    redemptionMethod: "request-access",
    terms:
      "Offer scope is limited to the initial review pathway and remains subject to partner acceptance and legal scope review.",
    approvalStatus: "approved",
    trackingRequired: "optional",
    trackingMethod: "manual-plus-impact",
    tracking: {
      required: "optional",
      method: "manual-plus-impact",
      impactProgramId: "impact-legalvision-placeholder",
      utmSource: "rbp-platform",
      utmMedium: "member-portal",
      utmCampaign: "legalvision-mvp-offer",
    },
    audit: {
      createdBy: "product-offers-mvp",
      createdAt: "2026-05-07T00:00:00.000Z",
      updatedBy: "product-offers-mvp",
      updatedAt: "2026-05-15T00:00:00.000Z",
    },
    badge: "High Value",
    saving: "Save up to $350",
    features: [
      "Contract review and drafting",
      "Business structure guidance",
      "Compliance and IP support",
    ],
    logo: "LV",
    highlight: false,
    availability: "Available to new LegalVision clients",
    accentClassName: "bg-emerald-600",
  }),
  createOffer({
    id: "microsoft-365-member-offer",
    partnerId: "microsoft-365",
    partner: "Microsoft 365",
    title: "3 Months Free On Business Basic",
    summary:
      "Collaboration, business email, document storage, and productivity tooling for distributed teams.",
    category: "information-technology",
    offerType: "top",
    eligibility: "Members setting up or migrating a business collaboration stack.",
    memberVisibility: "members-only",
    status: "published",
    startDate: "2026-05-01",
    endDate: "2026-12-31",
    redemptionMethod: "portal-gated-link",
    terms:
      "New qualifying subscriptions only. RBP provides the gated path and referral context, not the final subscription transaction.",
    approvalStatus: "approved",
    trackingRequired: "yes",
    trackingMethod: "appwrite-only",
    tracking: {
      required: "yes",
      method: "appwrite-only",
      utmSource: "rbp-platform",
      utmMedium: "member-portal",
      utmCampaign: "m365-mvp-offer",
    },
    audit: {
      createdBy: "product-offers-mvp",
      createdAt: "2026-05-07T00:00:00.000Z",
      updatedBy: "product-offers-mvp",
      updatedAt: "2026-05-15T00:00:00.000Z",
    },
    badge: "Popular",
    saving: "Save up to $90",
    features: [
      "Teams and SharePoint collaboration",
      "OneDrive storage",
      "Business email and calendar",
    ],
    logo: "M3",
    highlight: false,
    availability: "Available to qualifying new subscriptions",
    accentClassName: "bg-blue-600",
  }),
  createOffer({
    id: "canva-pro-member-offer",
    partnerId: "canva",
    partner: "Canva Pro",
    title: "50% Off The Annual Plan For Year One",
    summary:
      "Design and campaign production support for members running lean marketing teams.",
    category: "sales-marketing",
    offerType: "standard",
    eligibility: "Members building a new design or campaign workflow with Canva Pro.",
    memberVisibility: "members-only",
    status: "published",
    startDate: "2026-05-01",
    endDate: "2026-09-30",
    redemptionMethod: "portal-gated-link",
    terms:
      "Discount applies to qualifying new annual plans only and remains subject to partner availability and campaign timing.",
    approvalStatus: "approved",
    trackingRequired: "optional",
    trackingMethod: "manual-plus-impact",
    tracking: {
      required: "optional",
      method: "manual-plus-impact",
      impactProgramId: "impact-canva-placeholder",
      utmSource: "rbp-platform",
      utmMedium: "member-portal",
      utmCampaign: "canva-mvp-offer",
    },
    audit: {
      createdBy: "product-offers-mvp",
      createdAt: "2026-05-07T00:00:00.000Z",
      updatedBy: "product-offers-mvp",
      updatedAt: "2026-05-15T00:00:00.000Z",
    },
    badge: "Great Value",
    saving: "Save about $80 per year",
    features: [
      "Brand kit and template library",
      "Social media scheduling",
      "Large stock asset library",
    ],
    logo: "CA",
    highlight: false,
    availability: "Available to new Canva Pro accounts",
    accentClassName: "bg-pink-500",
  }),
  createOffer({
    id: "rbp-operations-sprint-offer",
    partnerId: "rbp",
    partner: "Remote Business Partner",
    title: "Operations Sprint Planning Credit",
    summary:
      "An RBP-exclusive offer that helps members convert advisory recommendations into a practical 30-day operating sprint.",
    category: "rbp-category",
    offerType: "exclusive",
    eligibility: "Active members with an RBP advisory engagement or onboarding pathway.",
    memberVisibility: "members-only",
    status: "published",
    startDate: "2026-05-01",
    endDate: "2026-12-31",
    redemptionMethod: "request-access",
    terms:
      "This member benefit is coordinated by RBP and subject to consultant capacity, fit, and current advisory scope.",
    approvalStatus: "approved",
    trackingRequired: "yes",
    trackingMethod: "appwrite-only",
    tracking: {
      required: "yes",
      method: "appwrite-only",
      utmSource: "rbp-platform",
      utmMedium: "member-portal",
      utmCampaign: "rbp-operations-sprint-offer",
    },
    audit: {
      createdBy: "product-offers-mvp",
      createdAt: "2026-05-07T00:00:00.000Z",
      updatedBy: "product-offers-mvp",
      updatedAt: "2026-05-15T00:00:00.000Z",
    },
    badge: "RBP Exclusive",
    saving: "Planning credit included",
    features: [
      "30-day sprint planning outline",
      "Adviser-led operating priorities",
      "Member-only implementation guidance",
    ],
    logo: "RB",
    highlight: false,
    availability: "Available to active RBP advisory members",
    accentClassName: "bg-slate-800",
  }),
];

export const publishedPublicOffers = publicOffers.filter((offer) => offer.status === "published");

export function getOfferCategoryLabel(category: OfferCategory) {
  return offerCategoryLabels[category] ?? category;
}

export function findPublicOfferById(id: string) {
  return publicOffers.find((offer) => offer.id === id);
}
