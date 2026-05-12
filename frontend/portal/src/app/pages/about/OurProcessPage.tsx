import { InterimContentPage } from "../../components/public/InterimContentPage";

export function OurProcessPage() {
  return (
    <InterimContentPage
      eyebrow="About"
      title="Our Process"
      intro="Our process is designed to help business owners move from enquiry to a clear next step, whether they need a quick answer, a structured service request, or a longer-term support pathway."
      statusLabel="Content ready"
      sections={[
        {
          title: "1. Understand the need",
          body: "We start by clarifying the business context, urgency, desired outcome, and whether the request belongs in advisory, documents, marketplace, applications, managed services, or membership."
        },
        {
          title: "2. Match the pathway",
          body: "The platform routes each request toward the most suitable service flow so the user is not forced to guess which form, service, or support channel applies."
        },
        {
          title: "3. Review and respond",
          body: "Submitted requests are intended to move through admin review, assignment, workflow status updates, notifications, and portal visibility once the backend integration is connected."
        },
        {
          title: "4. Improve over time",
          body: "As services mature, the content, admin review process, member portal, and backend workflows should be refined based on actual user activity and support patterns."
        }
      ]}
      relatedLinks={[
        { label: "What We Do", href: "/about/what-we-do" },
        { label: "Discovery Call", href: "/contact?reason=discovery-call" },
        { label: "Help Center", href: "/help" }
      ]}
      primaryAction={{ label: "Book a Discovery Call", href: "/contact?reason=discovery-call" }}
      secondaryAction={{ label: "View Membership", href: "/membership" }}
    />
  );
}
