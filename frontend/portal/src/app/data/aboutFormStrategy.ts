import type { AboutFormBackendTarget, ContactEnquiryType } from "../types/aboutForms";

export const contactEnquiryTypes: ContactEnquiryType[] = [
  "General enquiry",
  "Membership enquiry",
  "Services enquiry",
  "Document Nucleus / DocuShare enquiry",
  "Marketplace enquiry",
  "Applications enquiry",
  "Operations enquiry",
  "Partnership enquiry",
  "Employment / future opportunities",
  "Support request",
  "Billing enquiry",
];

export const discoveryCallReasons = [
  "I want to understand RBP membership",
  "I need help choosing the right service",
  "I want business advisory support",
  "I need document or process support",
  "I want to discuss partnership opportunities",
  "I am exploring marketplace or application options",
  "Other",
];

export const businessStages = [
  "Idea or early-stage business",
  "Established small business",
  "Growing business",
  "Business going through change",
  "Business preparing for sale, funding, or expansion",
  "Other",
];

export const timeZones = [
  "Australian Eastern Time",
  "Australian Central Time",
  "Australian Western Time",
  "New Zealand Time",
  "United Kingdom Time",
  "United States / Canada Time",
  "Other",
];

export const partnershipOptions = [
  "Advisory partnership",
  "Service delivery partnership",
  "Technology or application partnership",
  "Marketplace partnership",
  "Referral partnership",
  "Content or resource partnership",
  "Other",
];

export const workTypes = [
  "Employee",
  "Contractor",
  "Advisor",
  "Internship or future graduate opportunity",
  "General future opportunity",
];

export const interestAreas = [
  "Business advisory",
  "Finance advisory",
  "HR and people operations",
  "Digital transformation",
  "AI and automation",
  "Documents and process",
  "Customer success",
  "Operations support",
  "Software or product",
  "Marketplace and partnerships",
  "Other",
];

export const aboutFormBackendTargets: AboutFormBackendTarget[] = [
  {
    formName: "Contact enquiry",
    route: "/contact",
    futureBackendMethod: "rbp_app.api.contact.create_contact_enquiry",
    futureDocType: "RBP Contact Enquiry",
    currentMode: "frontend-local",
  },
  {
    formName: "Discovery call",
    route: "/about/discovery-call",
    futureBackendMethod: "rbp_app.api.booking.create_discovery_call_request",
    futureDocType: "RBP Discovery Call Request",
    currentMode: "frontend-local",
  },
  {
    formName: "Partnership enquiry",
    route: "/about/work-with-us",
    futureBackendMethod: "rbp_app.api.partnership.create_partner_enquiry",
    futureDocType: "RBP Partner Enquiry",
    currentMode: "frontend-local",
  },
  {
    formName: "Expression of interest",
    route: "/about/work-for-us",
    futureBackendMethod: "rbp_app.api.recruitment.create_expression_of_interest",
    futureDocType: "RBP Candidate Expression of Interest",
    currentMode: "frontend-local",
  },
];
