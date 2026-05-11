export type AboutFormStatus = "idle" | "submitting" | "success" | "error";

export type ContactEnquiryType =
  | "General enquiry"
  | "Membership enquiry"
  | "Services enquiry"
  | "Document Nucleus / DocuShare enquiry"
  | "Marketplace enquiry"
  | "Applications enquiry"
  | "Operations enquiry"
  | "Partnership enquiry"
  | "Employment / future opportunities"
  | "Support request"
  | "Billing enquiry";

export interface ContactEnquiryPayload {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  enquiryType: ContactEnquiryType | "";
  message: string;
  consent: boolean;
}

export interface DiscoveryCallPayload {
  fullName: string;
  email: string;
  phone?: string;
  businessName?: string;
  website?: string;
  businessStage: string;
  reason: string;
  preferredTime?: string;
  timeZone?: string;
  message: string;
  consent: boolean;
}

export interface PartnershipEnquiryPayload {
  organisationName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  partnershipType: string;
  servicesOffered: string;
  regionsServed?: string;
  message: string;
  consent: boolean;
}

export interface ExpressionOfInterestPayload {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  areaOfInterest: string;
  workType: string;
  linkedin?: string;
  portfolio?: string;
  message: string;
  consent: boolean;
}

export interface AboutFormResult {
  ok: boolean;
  message: string;
  reference?: string;
}

export interface AboutFormBackendTarget {
  formName: string;
  route: string;
  futureBackendMethod: string;
  futureDocType: string;
  currentMode: "frontend-local";
}
