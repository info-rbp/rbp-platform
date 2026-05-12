import { InterimContentPage } from "../../components/public/InterimContentPage";

export function WorkWithUsPage() {
  return (
    <InterimContentPage
      eyebrow="About"
      title="Work With Us"
      intro="Remote Business Partner is designed to support a broader network of advisors, implementation partners, service providers, and business specialists as the platform grows."
      statusLabel="Interim content"
      reviewNote="This page provides public-facing interim content while partner onboarding, eligibility criteria, and contributor workflows are finalised."
      sections={[
        {
          title: "Who this is for",
          body: "This pathway is intended for consultants, advisors, service providers, implementation specialists, and business operators who may support RBP customers through defined service offerings.",
          items: [
            "Business advisors and consultants.",
            "Document, HR, operations, finance, and technology specialists.",
            "Implementation and managed-service delivery partners."
          ]
        },
        {
          title: "How collaboration should work",
          body: "Future partner workflows should define scope, service standards, onboarding requirements, review steps, compliance expectations, and customer handoff rules before live work is assigned."
        },
        {
          title: "Next step",
          body: "Interested providers can use the contact pathway for now. A more structured application and review workflow should be added when backend partner management is available."
        }
      ]}
      relatedLinks={[
        { label: "Contact", href: "/contact?reason=work-with-us" },
        { label: "Managed Services", href: "/managed-services" },
        { label: "Marketplace", href: "/marketplace" }
      ]}
      primaryAction={{ label: "Register Interest", href: "/contact?reason=work-with-us" }}
      secondaryAction={{ label: "Explore Platform", href: "/" }}
    />
  );
}
