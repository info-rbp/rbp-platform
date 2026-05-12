import { InterimContentPage } from "../../components/public/InterimContentPage";

export function BookingConfirmationPage() {
  return (
    <InterimContentPage
      eyebrow="Confirmation"
      title="Booking Request Received"
      intro="Your booking or consultation request has been received. The next step is to confirm availability, context, and the most useful discussion format."
      statusLabel="Booking request"
      reviewNote="Calendar confirmation, email notification, and booking reference generation will be connected when backend scheduling and notification services are ready."
      sections={[
        {
          title: "What happens next",
          body: "The request should be reviewed and matched with a suitable follow-up option. If the requested time is unavailable, an alternative time should be proposed."
        },
        {
          title: "Prepare for the call",
          body: "Before the discussion, prepare a short summary of the business issue, current blockers, desired outcome, urgency, and any supporting documents."
        },
        {
          title: "No confirmed calendar event yet",
          body: "This screen confirms the frontend request pathway. A booking should only be treated as confirmed once a calendar invite or direct confirmation is issued."
        }
      ]}
      relatedLinks={[
        { label: "Contact", href: "/contact" },
        { label: "On-Demand Services", href: "/on-demand" },
        { label: "Managed Services", href: "/managed-services" }
      ]}
      primaryAction={{ label: "Explore Services", href: "/on-demand" }}
      secondaryAction={{ label: "Return Home", href: "/" }}
    />
  );
}
