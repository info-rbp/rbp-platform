import {
  AppWindow,
  BookOpen,
  BriefcaseBusiness,
  Clock3,
  FileStack,
  LayoutDashboard,
  Layers3,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export type PortalNavigationChild = {
  id: string;
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export type PortalNavigationSection = {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: PortalNavigationChild[];
};

export const portalNavigationSections: PortalNavigationSection[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/portal/dashboard",
  },
  {
    id: "services",
    label: "Services",
    icon: BriefcaseBusiness,
    children: [
      {
        id: "services-overview",
        label: "Core Services",
        href: "/portal/services",
        description: "Services overview and request entry points",
        icon: Sparkles,
      },
      {
        id: "services-nucleus",
        label: "Nucleus",
        href: "/portal/documents",
        description: "Document nucleus and member document activity",
        icon: FileStack,
      },
      {
        id: "services-on-demand",
        label: "On-Demand",
        href: "/portal/sessions",
        description: "Advisory sessions and rapid support",
        icon: Clock3,
      },
      {
        id: "services-managed",
        label: "Managed Services",
        href: "/portal/services/request",
        description: "Managed service intake placeholder",
        icon: Layers3,
      },
      {
        id: "services-custom",
        label: "Custom Solutions",
        href: "/portal/support",
        description: "Support path for tailored solutions",
        icon: Users,
      },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    icon: AppWindow,
    children: [
      {
        id: "platform-applications",
        label: "Applications",
        href: "/portal/apps",
        description: "Applications rollout and interest capture",
        icon: AppWindow,
      },
      {
        id: "platform-marketplace",
        label: "Marketplace",
        href: "/portal/marketplace/listings/new",
        description: "Marketplace listing and offer flows",
        icon: Layers3,
      },
      {
        id: "platform-offers",
        label: "Offers",
        href: "/portal/offers",
        description: "Member offers and partner access",
        icon: Wallet,
      },
      {
        id: "platform-resources",
        label: "Resources",
        href: "/portal/resources",
        description: "Resource library and support references",
        icon: BookOpen,
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: ShieldCheck,
    children: [
      {
        id: "operations-insurance",
        label: "Insurance",
        href: "/portal/support",
        description: "Insurance guidance placeholder via support",
        icon: ShieldCheck,
      },
      {
        id: "operations-finance",
        label: "Finance",
        href: "/portal/support",
        description: "Finance guidance placeholder via support",
        icon: Wallet,
      },
      {
        id: "operations-nbn",
        label: "NBN",
        href: "/portal/services/nbn/start",
        description: "Connectivity ordering flow",
        icon: Wifi,
      },
      {
        id: "operations-coming-soon",
        label: "Coming Soon",
        href: "/portal/resources",
        description: "Future operations areas",
        icon: Clock3,
      },
      {
        id: "operations-membership",
        label: "Membership",
        href: "/portal/membership/checkout",
        description: "Membership checkout and account operations",
        icon: Users,
      },
    ],
  },
];

export function isPortalPathActive(pathname: string, href?: string) {
  if (!href) {
    return false;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getPortalPageTitle(pathname: string) {
  for (const section of portalNavigationSections) {
    if (section.href && isPortalPathActive(pathname, section.href)) {
      return section.label;
    }

    const child = section.children?.find((entry) => isPortalPathActive(pathname, entry.href));
    if (child) {
      if (pathname === "/portal/services") {
        return "Services";
      }

      return child.label;
    }
  }

  if (pathname === "/portal/services") {
    return "Services";
  }

  if (isPortalPathActive(pathname, "/portal/settings")) {
    return "Settings";
  }

  return "Portal";
}
