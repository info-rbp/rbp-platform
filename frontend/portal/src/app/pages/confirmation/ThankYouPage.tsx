import { InterimContentPage } from "../../components/public/InterimContentPage";

export function ThankYouPage() {
  return (
    <InterimContentPage
      eyebrow="Confirmation"
      title="Thank You"
      intro="Your submission has been received through the frontend flow. The page now explains what should happen next instead of pretending a generic placeholder is a product feature."
      statusLabel="Submission received"
      reviewNote="Backend records, email confirmation, and workflow status updates will be connected in a later integration phase."
      sections={[
        {
          title: "What happens next",
          body: "The submitted information should be reviewed and routed to the correct support pathway once backend workflow handling is enabled."
        },
        {
          title: "Keep a copy",
          body: "If this was an important request, keep a copy of the details you submitted until confirmation emails and portal records are active."
        },
        {
          title: "Need another pathway?",
          body: "Users can continue exploring services, resources, membership, or contact support if they need a different outcome."
        }
      ]}
      relatedLinks={[
        { label: "Contact", href: "/contact" },
        { label: "Resources", href: "/resources" },
        { label: "Help Center", href: "/help" }
      ]}
      primaryAction={{ label: "Return Home", href: "/" }}
      secondaryAction={{ label: "Explore Resources", href: "/resources" }}
    />
  );
}
