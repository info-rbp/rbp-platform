export type ApplicationRolloutStatus = "Coming soon" | "Register interest";

export type ApplicationRolloutItem = {
  key: string;
  name: string;
  category: string;
  status: ApplicationRolloutStatus;
  shortDescription: string;
  publicDescription: string;
  portalDescription: string;
  highlights: string[];
};

export const applicationRolloutCatalog: ApplicationRolloutItem[] = [
  {
    key: "erpnext",
    name: "ERPNext",
    category: "Operations",
    status: "Register interest",
    shortDescription: "Operations, finance, and workflow management planned for the next rollout.",
    publicDescription:
      "ERPNext is planned as part of the next rollout for businesses that want a connected way to manage finance, operations, projects, and day-to-day workflows.",
    portalDescription:
      "ERPNext is part of the next rollout. Register interest now so we can prioritise operations and finance access for members who need it most.",
    highlights: ["Operations", "Finance", "Projects"],
  },
  {
    key: "crm",
    name: "CRM",
    category: "Sales",
    status: "Register interest",
    shortDescription: "Lead and customer management planned for member rollout.",
    publicDescription:
      "CRM is planned for the next rollout to help members manage leads, sales activity, and customer relationships in one place.",
    portalDescription:
      "CRM is planned for the next rollout. Register interest if customer pipeline visibility is a priority for your business.",
    highlights: ["Leads", "Deals", "Contacts"],
  },
  {
    key: "hrms",
    name: "HRMS",
    category: "People",
    status: "Register interest",
    shortDescription: "People, leave, and workforce workflows planned for a future member release.",
    publicDescription:
      "HRMS is planned for the next rollout to support employee records, leave processes, and people administration.",
    portalDescription:
      "HRMS is part of the next rollout. Register interest if staff onboarding and people workflows matter to your team.",
    highlights: ["Employees", "Leave", "People admin"],
  },
  {
    key: "helpdesk",
    name: "Helpdesk",
    category: "Support",
    status: "Register interest",
    shortDescription: "Support ticketing and service workflows are queued for rollout planning.",
    publicDescription:
      "Helpdesk is planned for the next rollout so businesses can track support requests and service responses in a structured way.",
    portalDescription:
      "Helpdesk is part of the next rollout. Register interest if your business needs a clearer way to manage service and support requests.",
    highlights: ["Tickets", "SLAs", "Knowledge base"],
  },
  {
    key: "drive",
    name: "Drive",
    category: "Productivity",
    status: "Coming soon",
    shortDescription: "Document storage and sharing is planned for a later rollout stage.",
    publicDescription:
      "Drive is planned for a later rollout to support document storage, structured sharing, and controlled file access.",
    portalDescription:
      "Drive is queued for the next rollout sequence. Register interest if secure document access is important to your business.",
    highlights: ["Files", "Folders", "Sharing"],
  },
  {
    key: "lms",
    name: "LMS",
    category: "Learning",
    status: "Coming soon",
    shortDescription: "Learning and training workflows are planned after the first application rollout.",
    publicDescription:
      "LMS is planned for a later rollout to support structured training, onboarding, and learning pathways.",
    portalDescription:
      "LMS is in the rollout queue. Register interest if training and onboarding content would help your business.",
    highlights: ["Training", "Courses", "Progress"],
  },
  {
    key: "payments",
    name: "Payments",
    category: "Finance",
    status: "Register interest",
    shortDescription: "Payments workflows are planned, while membership checkout already uses Stripe test mode in QA.",
    publicDescription:
      "Payments is planned for the next rollout to support future business payment workflows beyond membership checkout.",
    portalDescription:
      "Payments is part of the next rollout. Register interest if billing and payment workflows are a priority for your business.",
    highlights: ["Billing", "Collections", "Payment workflows"],
  },
  {
    key: "builder",
    name: "Builder",
    category: "Content",
    status: "Coming soon",
    shortDescription: "Content and page-building capabilities are planned for a later release.",
    publicDescription:
      "Builder is planned for a later rollout to support content creation, page-building, and structured publishing workflows.",
    portalDescription:
      "Builder is planned for a later rollout stage. Register interest if your team needs content and publishing workflows.",
    highlights: ["Pages", "Content", "Publishing"],
  },
  {
    key: "insights",
    name: "Insights",
    category: "Analytics",
    status: "Register interest",
    shortDescription: "Reporting and analytics access is planned as part of the next rollout.",
    publicDescription:
      "Insights is planned for the next rollout to help businesses review dashboards, reporting, and analytics in one place.",
    portalDescription:
      "Insights is part of the next rollout. Register interest if reporting and analytics are important to your business decisions.",
    highlights: ["Dashboards", "Reports", "Analytics"],
  },
];

export const rolloutApplicationOrder = applicationRolloutCatalog.map(
  (application) => application.key
);
