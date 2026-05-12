import { InterimContentPage } from "../../components/public/InterimContentPage";

export function ContactSuccessPage() {
  return (
    <InterimContentPage
      eyebrow="Confirmation"
      title="Contact Request Received"
      intro="Thanks, your enquiry has been received. The next step is to review your request and direct it to the most suitable pathway."
      statusLabel="Request received"
      reviewNote="Email confirmations and backend notification records will be enabled once the Frappe integration and notification workflow are connected."
      sections={[
        {
          title: "What happens next",
          body: "The request should be reviewed for topic, urgency, and required follow-up. If your enquiry relates to a discovery call, available times should be confirmed before anything is booked."
        },
        {
          title: "If your request is urgent",
          body: "Use the contact pathway again with the urgency clearly stated, or include the relevant business impact so the request can be prioritised during review."
        },
        {
          title: "Reference",
          body: "A formal reference number will be generated once backend enquiry records and notification events are enabled."
        }
      ]}
      relatedLinks={[
        { label: "Help Center", href: "/help" },
        { label: "On-Demand Services", href: "/on-demand" },
        { label: "Membership", href: "/membership" }
      ]}
      primaryAction={{ label: "Explore Services", href: "/on-demand" }}
      secondaryAction={{ label: "Return Home", href: "/" }}
    />
  );
}
