import {
  Sparkles,
  FileStack,
  Clock3,
  Layers3,
  Users,
  BriefcaseBusiness,
  Wallet,
  Wifi,
  LucideIcon
} from "lucide-react";

export type ServiceStatus = "Active" | "In Progress" | "Requested" | "Completed" | "Available";

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ServiceStatus;
  lastUpdated: string;
  icon: LucideIcon;
}

export const SERVICES: Service[] = [
  {
    id: "decision-desk",
    title: "Decision Desk",
    description: "Expert guidance for your most critical business decisions.",
    category: "Core Services",
    status: "In Progress",
    lastUpdated: "4 May 2026",
    icon: Sparkles,
  },
  {
    id: "hr-services",
    title: "HR Services",
    description: "Professional human resources support and advisory.",
    category: "Core Services",
    status: "Requested",
    lastUpdated: "30 Apr 2026",
    icon: Users,
  },
  {
    id: "business-health-snapshot",
    title: "Business Health Snapshot",
    description: "A comprehensive overview of your business's current performance.",
    category: "Core Services",
    status: "Active",
    lastUpdated: "1 May 2026",
    icon: Clock3,
  },
  {
    id: "finance-calculator-pack",
    title: "Finance Calculator Pack",
    description: "Essential tools for managing your business finances.",
    category: "Operations",
    status: "Available",
    lastUpdated: "—",
    icon: Wallet,
  },
  {
    id: "xero-partner-offer",
    title: "Xero Partner Offer",
    description: "Special member pricing and support for Xero accounting software.",
    category: "Platform",
    status: "Completed",
    lastUpdated: "20 Apr 2026",
    icon: BriefcaseBusiness,
  },
  {
    id: "connectivity",
    title: "Connectivity (NBN)",
    description: "High-speed business internet and connectivity solutions.",
    category: "Operations",
    status: "Available",
    lastUpdated: "—",
    icon: Wifi,
  }
];
