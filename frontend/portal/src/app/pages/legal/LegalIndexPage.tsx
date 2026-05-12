import { InterimContentPage } from "../../components/public/InterimContentPage";

export function LegalIndexPage() {
  return (
    <InterimContentPage
      eyebrow="Legal"
      title="Policies and Terms"
      intro="This section brings together the core public policies and terms for using the Remote Business Partner platform, requesting services, engaging support, and understanding payment expectations."
      statusLabel="Policy hub"
      reviewNote="These pages contain interim public summaries and should be reviewed before production launch."
      sections={[
        {
          title: "Available policy areas",
          body: "Users can review the current privacy, terms of use, engagement, payment, and services policy summaries from this page."
        },
        {
          title: "Production readiness",
          body: "Before launch, each policy should be finalised, approved, versioned, and connected to the relevant forms, checkout steps, and service request confirmations."
        }
      ]}
      relatedLinks={[
        { label: "Privacy Policy", href: "/legal/privacy-policy" },
        { label: "Terms of Use", href: "/legal/terms-of-use" },
        { label: "Terms of Engagement", href: "/legal/terms-of-engagement" },
        { label: "Payment Policy", href: "/legal/payment-policy" },
        { label: "Services Policy", href: "/legal/services-policy" }
      ]}
      primaryAction={{ label: "Contact Support", href: "/contact?reason=legal-policy" }}
      secondaryAction={{ label: "Return Home", href: "/" }}
    />
  );
}
