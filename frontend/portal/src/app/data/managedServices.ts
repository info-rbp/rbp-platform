export interface ManagedService {
  id: string;
  title: string;
  summary: string;
  href: string;
  type: "route" | "anchor";
  status: "ready" | "placeholder" | "content-required" | "backend-later";
}

export const managedServices: ManagedService[] = [
  { id: "bid-management", title: "Bid Management", summary: "End-to-end support for tenders, bids, proposals, response planning, document coordination, and submission readiness.", href: "/managed-services/bid-management", type: "route", status: "ready" },
  { id: "real-estate", title: "Real Estate", summary: "Operational support for real estate businesses, including administration, documentation, process management, and business coordination.", href: "/managed-services/real-estate", type: "route", status: "ready" },
  { id: "hr-services", title: "HR Services", summary: "Managed HR support for documentation, onboarding, role clarity, people processes, internal records, and practical employment administration.", href: "/managed-services/hr-services", type: "route", status: "ready" },
  { id: "document-management", title: "Document Management", summary: "Ongoing document control, template maintenance, register updates, policy management, and business documentation support.", href: "/managed-services#document-management", type: "anchor", status: "ready" },
  { id: "change-management", title: "Change Management", summary: "Support for operational change, system adoption, process transitions, internal communications, and implementation planning.", href: "/managed-services#change-management", type: "anchor", status: "ready" },
  { id: "business-sale-support", title: "Business Sale Support", summary: "Preparation support for business owners organising operational information, processes, records, and documentation for sale readiness.", href: "/managed-services#business-sale-support", type: "anchor", status: "ready" },
  { id: "franchise", title: "Franchise", summary: "Support for franchise manuals, onboarding material, operating procedures, documentation standards, and franchise administration.", href: "/managed-services#franchise", type: "anchor", status: "ready" },
  { id: "lms", title: "LMS", summary: "Learning management support for onboarding, training resources, internal education, course structures, and knowledge delivery.", href: "/managed-services#lms", type: "anchor", status: "ready" },
  { id: "custom-solutions", title: "Custom Solutions", summary: "Tailored retained support for complex, mixed, or specialised business needs that require a custom operating model.", href: "/managed-services#custom-solutions", type: "anchor", status: "ready" },
  { id: "engagement-process", title: "Engagement Process", summary: "A clear pathway for scoping, onboarding, delivery, reporting, review, and continuous improvement.", href: "/managed-services#engagement-process", type: "anchor", status: "ready" },
];
