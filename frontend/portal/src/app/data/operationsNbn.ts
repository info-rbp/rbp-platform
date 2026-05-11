import type { FaqItem } from "./operationsInsurance";

export const nbnDisclaimer =
  "Business NBN availability, speeds, connection requirements, phone services, modem suitability, installation timing, and pricing depend on the service address, NBN technology type, provider terms, and network conditions. Speeds may vary and Wi-Fi performance may be lower than Ethernet performance.";

export const nbnFlow = [
  { title: "Check Coverage", href: "/operations/connectivity/nbn-phone/check-coverage" },
  { title: "Our NBN Plans", href: "/operations/connectivity/nbn-phone/our-nbn-plans" },
  { title: "Getting Connected", href: "/operations/connectivity/nbn-phone/getting-connected" },
  { title: "WiFi Modems", href: "/operations/connectivity/nbn-phone/wifi-modems" },
  { title: "Connect Now", href: "/operations/connectivity/nbn-phone/connect-now" },
  { title: "FAQs", href: "/operations/connectivity/nbn-phone/faqs" },
];

export const nbnPlans = [
  {
    name: "Essential Business",
    slug: "essential-business",
    summary: "For small teams using cloud tools, EFTPOS, email, browsing, and light VoIP.",
    bestFor: ["Small offices", "Basic cloud apps", "Email and EFTPOS", "Light phone usage"],
  },
  {
    name: "Performance Business",
    slug: "performance-business",
    summary: "For growing teams using video calls, heavier uploads, and more connected devices.",
    bestFor: ["Video meetings", "Growing teams", "More devices", "Shared cloud workloads"],
  },
  {
    name: "High-Speed Business",
    slug: "high-speed-business",
    summary: "For data-heavy teams, larger files, backups, and higher performance needs where eligible.",
    bestFor: ["Large files", "Backups", "Multi-user cloud apps", "Higher speed eligibility"],
  },
  {
    name: "Enterprise Review",
    slug: "enterprise-review",
    summary: "For complex sites, high availability, failover, multi-site, network, or security requirements.",
    bestFor: ["Multi-site needs", "Failover planning", "Complex networks", "Security review"],
  },
];

export const nbnConnectionSteps = [
  "Submit address and business details",
  "Confirm eligibility, technology type, and plan options",
  "Confirm phone number porting or new number requirements",
  "Confirm modem/router setup and Wi-Fi coverage needs",
  "Book installation if required",
  "Activate service and confirm support next steps",
];

export const modemOptions = [
  {
    title: "BYO Router Review",
    description:
      "Some businesses can use their own router if it is compatible with the NBN technology, speed tier, and phone setup.",
  },
  {
    title: "Supplied Router Option",
    description:
      "A supplied modem/router may be suitable where compatibility, support, or VoIP readiness needs to be simplified.",
  },
  {
    title: "Wi-Fi Coverage Review",
    description:
      "Larger sites, thick walls, warehouses, and multi-room offices may need mesh, access points, or a stronger business router.",
  },
  {
    title: "High-Speed and VoIP Ready",
    description:
      "Higher speed plans and phone services can require more capable hardware. Wi-Fi 7 options should be checked against plan eligibility and offer terms.",
  },
];

export const nbnFaqs: FaqItem[] = [
  {
    question: "Is Business NBN available everywhere?",
    answer:
      "No. Availability depends on the service address, NBN technology type, provider terms, and network conditions.",
  },
  {
    question: "What does a coverage check confirm?",
    answer:
      "It helps confirm whether business NBN is available at the address, what technology type may apply, and which plan or installation requirements need review.",
  },
  {
    question: "What speed should my business choose?",
    answer:
      "That depends on users, cloud systems, uploads, video calls, phone requirements, and technology eligibility at the address.",
  },
  {
    question: "Can I port my current phone number?",
    answer:
      "Phone and VoIP requirements, including number porting, need to be checked before connection so downtime and compatibility risks can be managed.",
  },
  {
    question: "Can I use my own router?",
    answer:
      "Possibly. Router suitability depends on the NBN technology, speed tier, VoIP needs, Wi-Fi coverage requirements, and provider settings.",
  },
  {
    question: "Are speeds guaranteed?",
    answer:
      "No. Speeds may vary due to address, technology type, plan eligibility, provider terms, network conditions, and in-premises Wi-Fi performance.",
  },
  {
    question: "What happens after I submit Connect Now?",
    answer:
      "The RBP team reviews coverage, plan suitability, modem requirements, phone setup, and preferred timing before confirming next steps.",
  },
];
