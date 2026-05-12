import { InterimContentPage } from "../../components/public/InterimContentPage";

export function WhatWeDoPage() {
  return (
    <InterimContentPage
      eyebrow="About"
      title="What We Do"
      intro="Remote Business Partner brings practical advisory support, operating tools, managed services, documents, applications, and business resources into one connected platform for small business owners."
      statusLabel="Content ready"
      sections={[
        {
          title: "Practical business support",
          body: "We help business owners work through operational, commercial, documentation, technology, and decision-making needs without forcing them into a one-size-fits-all service model.",
          items: [
            "On-demand advisory for specific business questions.",
            "Managed services for ongoing operational support.",
            "Document, marketplace, application, and resource pathways."
          ]
        },
        {
          title: "Platform-led delivery",
          body: "The platform is designed to connect public website journeys, member portal activity, admin review, and future Frappe-backed workflows so each request can move from enquiry to outcome more cleanly."
        },
        {
          title: "Built for staged rollout",
          body: "Current frontend pages support discovery, navigation, and mock service journeys while backend contracts, permissions, workflows, and integrations are completed."
        }
      ]}
      relatedLinks={[
        { label: "Our Process", href: "/about/our-process" },
        { label: "On-Demand Services", href: "/on-demand" },
        { label: "Membership", href: "/membership" }
      ]}
      primaryAction={{ label: "Explore Services", href: "/on-demand" }}
      secondaryAction={{ label: "Contact Our Team", href: "/contact" }}
    />
  );
}
