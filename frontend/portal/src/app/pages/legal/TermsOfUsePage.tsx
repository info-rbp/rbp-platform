import { InterimContentPage } from "../../components/public/InterimContentPage";

export function TermsOfUsePage() {
  return (
    <InterimContentPage
      eyebrow="Legal"
      title="Terms of Use"
      intro="These interim terms explain expected use of the Remote Business Partner website, public pages, service pathways, membership areas, and future portal features."
      statusLabel="Draft summary"
      reviewNote="These terms should be finalised before production launch and linked from sign-up, sign-in, contact, payment, and service request flows."
      sections={[
        {
          title: "Using the platform",
          body: "Users are expected to provide accurate information, use forms and resources for legitimate business purposes, and avoid submitting harmful, unlawful, misleading, or abusive content."
        },
        {
          title: "Accounts and portal access",
          body: "Future account access should be governed by authentication, role permissions, membership status, and tenant-level data ownership rules."
        },
        {
          title: "Content and resources",
          body: "Public resources, guides, templates, calculators, and platform materials should be treated as general business support unless a specific service agreement says otherwise."
        },
        {
          title: "Availability and changes",
          body: "Services, resources, offers, and platform features may change over time as the product moves through staged rollout and backend integration."
        }
      ]}
      relatedLinks={[
        { label: "Privacy Policy", href: "/legal/privacy-policy" },
        { label: "Terms of Engagement", href: "/legal/terms-of-engagement" },
        { label: "Payment Policy", href: "/legal/payment-policy" }
      ]}
      primaryAction={{ label: "Contact Support", href: "/contact?reason=terms-of-use" }}
      secondaryAction={{ label: "Back to Legal", href: "/legal" }}
    />
  );
}
