import { InterimContentPage } from "../../components/public/InterimContentPage";

export function OperationsComingSoonPage() {
  return (
    <InterimContentPage
      eyebrow="Operations"
      title="More Operations Tools Are Coming"
      intro="The Operations area will expand into a broader set of business support tools covering finance readiness, insurance pathways, connectivity, calculators, operational planning, and practical business utilities."
      statusLabel="Roadmap content"
      reviewNote="This page is intentionally published as a roadmap notice. It should not promise live services until the relevant workflows and support arrangements are ready."
      sections={[
        {
          title: "Currently available",
          body: "The Operations area already provides pathways for business finance, insurance, connectivity, NBN and phone services, Superloop connectivity, and calculators."
        },
        {
          title: "Planned additions",
          body: "Future releases may include more operational calculators, readiness checklists, business health tools, implementation guides, and member-only support utilities."
        },
        {
          title: "Need help now?",
          body: "Users with an immediate business operations issue should use the on-demand service pathway or submit a contact request so the request can be reviewed manually."
        }
      ]}
      relatedLinks={[
        { label: "Operations Overview", href: "/operations" },
        { label: "Business Finance", href: "/operations/finance" },
        { label: "Connectivity", href: "/operations/connectivity" },
        { label: "On-Demand Services", href: "/on-demand" }
      ]}
      primaryAction={{ label: "Explore Operations", href: "/operations" }}
      secondaryAction={{ label: "Ask for Help", href: "/contact?reason=operations-support" }}
    />
  );
}
