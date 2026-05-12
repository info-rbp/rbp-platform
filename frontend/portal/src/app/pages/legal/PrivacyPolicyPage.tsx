import { InterimContentPage } from "../../components/public/InterimContentPage";

export function PrivacyPolicyPage() {
  return (
    <InterimContentPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This interim privacy summary explains the types of information Remote Business Partner may collect through public forms, membership flows, service requests, and future portal activity."
      statusLabel="Draft summary"
      reviewNote="This privacy summary should be reviewed and finalised before production launch, especially before collecting live account, payment, or uploaded document data."
      sections={[
        {
          title: "Information we may collect",
          body: "The platform may collect contact details, business information, service request details, membership preferences, document references, support enquiries, and technical usage information."
        },
        {
          title: "How information is expected to be used",
          body: "Information should be used to respond to enquiries, process service requests, manage membership pathways, provide support, improve the platform, and maintain operational records."
        },
        {
          title: "Portal and service records",
          body: "Once backend integration is enabled, portal records, uploaded files, workflow statuses, and notifications should be governed by user permissions and tenant-level access rules."
        },
        {
          title: "User choices",
          body: "Users should be able to request updates to their details, ask questions about privacy handling, and manage communication preferences once account and notification features are connected."
        }
      ]}
      relatedLinks={[
        { label: "Terms of Use", href: "/legal/terms-of-use" },
        { label: "Services Policy", href: "/legal/services-policy" },
        { label: "Contact", href: "/contact?reason=privacy" }
      ]}
      primaryAction={{ label: "Contact About Privacy", href: "/contact?reason=privacy" }}
      secondaryAction={{ label: "Back to Legal", href: "/legal" }}
    />
  );
}
