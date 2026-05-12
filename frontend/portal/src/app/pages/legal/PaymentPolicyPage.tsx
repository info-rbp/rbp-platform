import { InterimContentPage } from "../../components/public/InterimContentPage";

export function PaymentPolicyPage() {
  return (
    <InterimContentPage
      eyebrow="Legal"
      title="Payment Policy"
      intro="This interim payment policy explains how membership, service fees, marketplace listing fees, connectivity orders, and future platform payments should be presented and recorded."
      statusLabel="Draft summary"
      reviewNote="Final payment terms should be confirmed before live payment processing, subscriptions, refunds, or provider webhooks are enabled."
      sections={[
        {
          title: "Payment states",
          body: "The platform should distinguish between pending, authorised, paid, failed, refunded, cancelled, disputed, and not-required payment states."
        },
        {
          title: "Membership and services",
          body: "Membership or service payments should clearly show pricing, billing period, inclusions, payment timing, and any conditions before a user confirms."
        },
        {
          title: "Failed or interrupted payments",
          body: "If a payment fails or cannot be confirmed, the user should receive clear next steps and the platform should avoid showing membership or service access as active."
        },
        {
          title: "Refunds and adjustments",
          body: "Refunds, credits, cancellations, or billing corrections should be recorded against the relevant account, payment event, service request, or subscription."
        }
      ]}
      relatedLinks={[
        { label: "Membership", href: "/membership" },
        { label: "Terms of Engagement", href: "/legal/terms-of-engagement" },
        { label: "Contact Billing Support", href: "/contact?reason=billing" }
      ]}
      primaryAction={{ label: "Contact Billing Support", href: "/contact?reason=billing" }}
      secondaryAction={{ label: "Back to Legal", href: "/legal" }}
    />
  );
}
