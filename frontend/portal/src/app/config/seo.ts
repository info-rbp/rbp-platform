import {
  organizationStructuredData,
  serviceStructuredData,
  websiteStructuredData,
} from "./structuredData";

export type SeoEntry = {
  title: string;
  description: string;
  canonicalPath: string;
  robots: "index,follow" | "noindex,nofollow";
  ogTitle?: string;
  ogDescription?: string;
  structuredData?: Record<string, unknown>[];
};

export const PUBLIC_SITE_NAME = "Remote Business Partner";

const defaultPublicDescription =
  "Business support, advisory services, resources, and membership benefits for Australian small businesses.";

export const seoRegistry: Record<string, SeoEntry> = {
  "/": {
    title: "Remote Business Partner | Business Support, Advisory & Services",
    description:
      "Remote Business Partner helps Australian small businesses access advisory support, service pathways, resources, marketplace opportunities, and member benefits.",
    canonicalPath: "/",
    robots: "index,follow",
    structuredData: [organizationStructuredData(), websiteStructuredData()],
  },
  "/about": {
    title: "About Remote Business Partner",
    description:
      "Learn how Remote Business Partner supports Australian small businesses through advisory, member services, practical tools, and delivery pathways.",
    canonicalPath: "/about",
    robots: "index,follow",
    structuredData: [organizationStructuredData()],
  },
  "/contact": {
    title: "Contact Remote Business Partner",
    description:
      "Contact Remote Business Partner to discuss advisory support, member services, operational help, or rollout questions.",
    canonicalPath: "/contact",
    robots: "index,follow",
  },
  "/core-services": {
    title: "Core Services | Remote Business Partner",
    description:
      "Explore Remote Business Partner Core Services including advisory pathways, decision support, risk review, and practical business problem solving.",
    canonicalPath: "/core-services",
    robots: "index,follow",
  },
  "/core-services/decision-desk": {
    title: "Decision Desk | Remote Business Partner",
    description:
      "Decision Desk helps businesses frame decisions, review options, and move forward with clearer operational direction.",
    canonicalPath: "/core-services/decision-desk",
    robots: "index,follow",
    structuredData: [
      serviceStructuredData(
        "Decision Desk",
        "Decision Desk helps businesses frame decisions, review options, and move forward with clearer operational direction.",
        "/core-services/decision-desk"
      ),
    ],
  },
  "/core-services/risk-advisor": {
    title: "Risk Advisor | Remote Business Partner",
    description:
      "Risk Advisor helps businesses review risk exposure, controls, and practical next actions.",
    canonicalPath: "/core-services/risk-advisor",
    robots: "index,follow",
    structuredData: [
      serviceStructuredData(
        "Risk Advisor",
        "Risk Advisor helps businesses review risk exposure, controls, and practical next actions.",
        "/core-services/risk-advisor"
      ),
    ],
  },
  "/core-services/the-fixer": {
    title: "The Fixer | Remote Business Partner",
    description:
      "The Fixer helps businesses move stuck operational issues into an organised support pathway.",
    canonicalPath: "/core-services/the-fixer",
    robots: "index,follow",
    structuredData: [
      serviceStructuredData(
        "The Fixer",
        "The Fixer helps businesses move stuck operational issues into an organised support pathway.",
        "/core-services/the-fixer"
      ),
    ],
  },
  "/docushare": {
    title: "DocuShare | Remote Business Partner",
    description:
      "DocuShare provides document support pathways, request handling, and structured document service options for business users.",
    canonicalPath: "/docushare",
    robots: "index,follow",
    structuredData: [
      serviceStructuredData(
        "DocuShare",
        "DocuShare provides document support pathways, request handling, and structured document service options for business users.",
        "/docushare"
      ),
    ],
  },
  "/document-nucleus/overview": {
    title: "Document Nucleus | Remote Business Partner",
    description:
      "Document Nucleus helps businesses understand document support options, overview content, and request pathways.",
    canonicalPath: "/document-nucleus/overview",
    robots: "index,follow",
  },
  "/operations/connectivity/nbn-phone": {
    title: "Business NBN & Phone | Remote Business Partner",
    description:
      "Review business NBN and phone support pathways through Remote Business Partner operations connectivity services.",
    canonicalPath: "/operations/connectivity/nbn-phone",
    robots: "index,follow",
    structuredData: [
      serviceStructuredData(
        "Business NBN and Phone",
        "Review business NBN and phone support pathways through Remote Business Partner operations connectivity services.",
        "/operations/connectivity/nbn-phone"
      ),
    ],
  },
  "/marketplace": {
    title: "Marketplace | Remote Business Partner",
    description:
      "Browse marketplace opportunities, submit listings for review, and make enquiries through Remote Business Partner.",
    canonicalPath: "/marketplace",
    robots: "index,follow",
  },
  "/membership": {
    title: "RBP Membership | Business Support Membership",
    description:
      "Access member benefits, business support pathways, service requests, resources, and offers through Remote Business Partner membership.",
    canonicalPath: "/membership",
    robots: "index,follow",
  },
  "/offers": {
    title: "Member Offers | Remote Business Partner",
    description:
      "Review member offers, available benefits, and partner value pathways through Remote Business Partner.",
    canonicalPath: "/offers",
    robots: "index,follow",
  },
  "/resources": {
    title: "Resources | Remote Business Partner",
    description:
      "Explore practical business resources, guides, and support content from Remote Business Partner.",
    canonicalPath: "/resources",
    robots: "index,follow",
  },
  "/help": {
    title: "Help | Remote Business Partner",
    description:
      "Find support guidance, help content, and assistance pathways for using Remote Business Partner.",
    canonicalPath: "/help",
    robots: "index,follow",
  },
  "/applications": {
    title: "Business Applications Coming Soon | Remote Business Partner",
    description:
      "Remote Business Partner Applications are planned for the next rollout. Register interest in ERPNext, CRM, HRMS, Helpdesk, Drive, LMS, Payments, Builder, and Insights.",
    canonicalPath: "/applications",
    robots: "index,follow",
  },
  "/legal/privacy-policy": {
    title: "Privacy Policy | Remote Business Partner",
    description:
      "Read the Remote Business Partner privacy policy for information about handling personal information and site use.",
    canonicalPath: "/legal/privacy-policy",
    robots: "index,follow",
  },
  "/legal/terms": {
    title: "Terms of Use | Remote Business Partner",
    description:
      "Read the Remote Business Partner terms of use and site access conditions.",
    canonicalPath: "/legal/terms",
    robots: "index,follow",
  },
  "/legal/terms-of-use": {
    title: "Terms of Use | Remote Business Partner",
    description:
      "Read the Remote Business Partner terms of use and site access conditions.",
    canonicalPath: "/legal/terms-of-use",
    robots: "index,follow",
  },
  "/portal/dashboard": {
    title: "Member Portal | Remote Business Partner",
    description: "Access your Remote Business Partner member dashboard.",
    canonicalPath: "/portal/dashboard",
    robots: "noindex,nofollow",
  },
  "/admin/signin": {
    title: "Admin Sign In | Remote Business Partner",
    description: "Remote Business Partner admin sign in.",
    canonicalPath: "/admin/signin",
    robots: "noindex,nofollow",
  },
};

export function getSeoForPath(pathname: string): SeoEntry {
  if (pathname.startsWith("/portal")) {
    return {
      title: "Member Portal | Remote Business Partner",
      description: "Remote Business Partner member portal.",
      canonicalPath: pathname,
      robots: "noindex,nofollow",
    };
  }

  if (pathname.startsWith("/admin")) {
    return {
      title: "Admin | Remote Business Partner",
      description: "Remote Business Partner admin area.",
      canonicalPath: pathname,
      robots: "noindex,nofollow",
    };
  }

  if (["/signin", "/signup", "/signout"].includes(pathname)) {
    return {
      title: "Account | Remote Business Partner",
      description: "Remote Business Partner account access.",
      canonicalPath: pathname,
      robots: "noindex,nofollow",
    };
  }

  if (pathname.startsWith("/about/")) {
    return {
      title: `About | ${PUBLIC_SITE_NAME}`,
      description:
        "Learn more about how Remote Business Partner works, what we do, and how to engage with our team.",
      canonicalPath: pathname,
      robots: "index,follow",
    };
  }

  if (pathname.startsWith("/membership/")) {
    return {
      title: `Membership | ${PUBLIC_SITE_NAME}`,
      description:
        "Review membership information, Stripe checkout guidance, and member benefit pathways through Remote Business Partner.",
      canonicalPath: pathname,
      robots: "index,follow",
    };
  }

  if (pathname.startsWith("/legal/")) {
    return {
      title: `Legal | ${PUBLIC_SITE_NAME}`,
      description:
        "Read Remote Business Partner legal information, policy pages, and terms.",
      canonicalPath: pathname,
      robots: "index,follow",
    };
  }

  return (
    seoRegistry[pathname] ?? {
      title: PUBLIC_SITE_NAME,
      description: defaultPublicDescription,
      canonicalPath: pathname,
      robots: "index,follow",
    }
  );
}
