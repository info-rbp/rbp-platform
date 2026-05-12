import { InterimContentPage } from "../../components/public/InterimContentPage";

export function ServicesPolicyPage() {
  return (
    <InterimContentPage
      eyebrow="Legal"
      title="Services Policy"
      intro="This interim services policy explains how Remote Business Partner service pathways should be requested, reviewed, assigned, delivered, and updated."
      statusLabel="Draft summary"
      reviewNote="The services policy should be finalised before live service fulfilment, admin review workflows, advisor assignment, or portal status updates are relied on."
      sections={[
        {
          title: "Service requests",
          body: "Users should submit enough context for the team to understand the issue, desired outcome, urgency, supporting materials, and preferred contact method."
        },
        {
          title: "Review and assignment",
          body: "Requests should be reviewed before work begins so they can be categorised, prioritised, assigned, priced if needed, and moved into the right workflow."
        },
        {
          title: "Service outcomes",
          body: "Outcomes may include written guidance, document support, marketplace review, operational recommendations, connectivity follow-up, or a managed service pathway."
        },
        {
          title: "Limits and dependencies",
          body: "Service delivery may depend on user-provided information, third-party providers, membership status, payment state, advisor availability, and backend workflow readiness."
        }
      ]}
      relatedLinks={[
        { label: "On-Demand Services", href: "/on-demand" },
        { label: "Managed Services", href: "/managed-services" },
        { label: "Terms of Engagement", href: "/legal/terms-of-engagement" }
      ]}
      primaryAction={{ label: "Explore Services", href: "/on-demand" }}
      secondaryAction={{ label: "Back to Legal", href: "/legal" }}
    />
  );
}
