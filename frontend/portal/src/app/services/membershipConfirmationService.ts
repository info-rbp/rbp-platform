import { isMockMembershipConfirmationEnabled } from "../config/runtime";

export const membershipFlowStorageKey = "rbp.mockMembershipPurchaseOnboarding";

export interface MembershipConfirmation {
  reference: string;
  status: "confirmed" | "pending" | "failed" | "unknown";
  paymentStatus?: "paid" | "pending" | "failed" | "not_required";
  onboardingStatus?: "complete" | "pending" | "not_started";
  businessName?: string;
  contactName?: string;
  selectedPlan?: string;
  portalHref?: string;
  source: "backend" | "mock-dev";
}

interface StoredMembershipConfirmation {
  signupReference?: string;
  onboardingReference?: string;
  membershipTier?: "free" | "premium";
  membershipStatus?: string;
  paymentStatus?: string;
  onboardingStatus?: string;
  portalHref?: string;
  businessName?: string;
  primaryContactName?: string;
  selectedPlan?: string;
}

function canUseBrowserStorage() {
  return typeof window !== "undefined" && Boolean(window.sessionStorage);
}

function safeInternalHref(value: string | undefined) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : undefined;
}

function normaliseConfirmationStatus(status: string | undefined): MembershipConfirmation["status"] {
  if (status === "active" || status === "confirmed" || status === "complete") {
    return "confirmed";
  }

  if (status === "pending" || status === "in-progress") {
    return "pending";
  }

  if (status === "failed" || status === "error") {
    return "failed";
  }

  return "unknown";
}

function normalisePaymentStatus(
  status: string | undefined,
  membershipTier?: "free" | "premium"
): MembershipConfirmation["paymentStatus"] {
  if (membershipTier === "free" || status === "not-required" || status === "not_required") {
    return "not_required";
  }

  if (status === "simulated-success" || status === "preview-complete" || status === "paid") {
    return "paid";
  }

  if (status === "pending") {
    return "pending";
  }

  if (status === "simulated-failed" || status === "failed") {
    return "failed";
  }

  return undefined;
}

function normaliseOnboardingStatus(status: string | undefined): MembershipConfirmation["onboardingStatus"] {
  if (status === "complete") {
    return "complete";
  }

  if (status === "pending" || status === "in-progress") {
    return "pending";
  }

  return "not_started";
}

export async function getMembershipConfirmation(
  reference: string
): Promise<MembershipConfirmation | null> {
  if (!reference.trim()) {
    return null;
  }

  // Future Frappe integration point: fetch the confirmation by reference from
  // a backend endpoint that validates payment, membership, account, and portal
  // access server-side. Browser storage must never be treated as this source.
  return null;
}

export function getDevelopmentMembershipConfirmationFromBrowserSession(): MembershipConfirmation | null {
  if (!isMockMembershipConfirmationEnabled() || !canUseBrowserStorage()) {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(membershipFlowStorageKey);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as StoredMembershipConfirmation;
    const reference = parsed.onboardingReference ?? parsed.signupReference;

    if (!reference) {
      return null;
    }

    return {
      reference,
      status: normaliseConfirmationStatus(parsed.membershipStatus),
      paymentStatus: normalisePaymentStatus(parsed.paymentStatus, parsed.membershipTier),
      onboardingStatus: normaliseOnboardingStatus(parsed.onboardingStatus),
      businessName: parsed.businessName,
      contactName: parsed.primaryContactName,
      selectedPlan: parsed.selectedPlan,
      portalHref: safeInternalHref(parsed.portalHref),
      source: "mock-dev",
    };
  } catch {
    return null;
  }
}
