import type {
  AboutFormResult,
  ContactEnquiryPayload,
  DiscoveryCallPayload,
  ExpressionOfInterestPayload,
  PartnershipEnquiryPayload,
} from "../types/aboutForms";

const makeReference = (prefix: string) => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const delay = async (milliseconds = 300) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

const success = async (prefix: string, message: string): Promise<AboutFormResult> => {
  await delay();

  return {
    ok: true,
    message,
    reference: makeReference(prefix),
  };
};

export async function submitContactEnquiry(
  payload: ContactEnquiryPayload
): Promise<AboutFormResult> {
  if (!payload.name || !payload.email || !payload.enquiryType || !payload.message || !payload.consent) {
    return {
      ok: false,
      message: "Please complete the required fields before sending your enquiry.",
    };
  }

  return success(
    "CONTACT",
    "Thanks, we have received your enquiry and will route it to the most relevant RBP pathway."
  );
}

export async function submitDiscoveryCallRequest(
  payload: DiscoveryCallPayload
): Promise<AboutFormResult> {
  if (!payload.fullName || !payload.email || !payload.businessStage || !payload.reason || !payload.message || !payload.consent) {
    return {
      ok: false,
      message: "Please complete the required fields before requesting a discovery call.",
    };
  }

  return success(
    "DISCOVERY",
    "Thanks, we have received your discovery call request and will follow up with the next available option."
  );
}

export async function submitPartnershipEnquiry(
  payload: PartnershipEnquiryPayload
): Promise<AboutFormResult> {
  if (
    !payload.organisationName ||
    !payload.contactName ||
    !payload.email ||
    !payload.partnershipType ||
    !payload.servicesOffered ||
    !payload.message ||
    !payload.consent
  ) {
    return {
      ok: false,
      message: "Please complete the required fields before submitting your partnership enquiry.",
    };
  }

  return success(
    "PARTNER",
    "Thanks, we have received your partnership enquiry and will review it for fit."
  );
}

export async function submitExpressionOfInterest(
  payload: ExpressionOfInterestPayload
): Promise<AboutFormResult> {
  if (
    !payload.fullName ||
    !payload.email ||
    !payload.areaOfInterest ||
    !payload.workType ||
    !payload.message ||
    !payload.consent
  ) {
    return {
      ok: false,
      message: "Please complete the required fields before registering your interest.",
    };
  }

  return success(
    "EOI",
    "Thanks, we have received your expression of interest for future opportunities."
  );
}
