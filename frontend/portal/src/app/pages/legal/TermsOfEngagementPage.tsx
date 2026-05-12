import { InterimContentPage } from "../../components/public/InterimContentPage";

export function TermsOfEngagementPage() {
  return (
    <InterimContentPage
      eyebrow="Legal"
      title="Terms of Engagement"
      intro="These interim engagement terms explain how service requests, advisory work, document support, managed services, and specialist assistance should be scoped and delivered."
      statusLabel="Draft summary"
      reviewNote="Final engagement terms should be approved before paid services, live advisor assignment, or formal service delivery begins."
      sections={[
        {
          title: "Scope of work",
          body: "Each engagement should define the requested outcome, assumptions, inclusions, exclusions, timeframe, responsibilities, and any required supporting information."
        },
        {
          title: "Client responsibilities",
          body: "Clients should provide accurate business details, relevant documents, timely responses, and approval for any agreed direction before work proceeds."
        },
        {
          title: "Delivery and review",
          body: "Requests should move through submission, review, assignment, work-in-progress, outcome delivery, and closure once backend workflows are active."
        },
        {
          title: "Changes to scope",
          body: "Material changes to requested work should be reviewed before delivery continues, especially where pricing, timelines, or specialist involvement may change."
        }
      ]}
      relatedLinks={[
        { label: "Services Policy", href: "/legal/services-policy" },
        { label: "Payment Policy", href: "/legal/payment-policy" },
        { label: "Contact", href: "/contact?reason=engagement-terms" }
      ]}
      primaryAction={{ label: "Ask About Engagement Terms", href: "/contact?reason=engagement-terms" }}
      secondaryAction={{ label: "Back to Legal", href: "/legal" }}
    />
  );
}
