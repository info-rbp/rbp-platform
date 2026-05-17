import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  FileStack,
  Layers3,
  Sparkles,
  Users,
  Wallet,
  Wifi,
} from "lucide-react";
import { Link } from "react-router";

import { PortalAdminReference } from "./PortalAdminReference";

const serviceCards = [
  {
    label: "Core Services",
    href: "/portal/services/request",
    description: "Decision support and core member service requests start here in the current MVP.",
    icon: Sparkles,
    cta: "Request service",
  },
  {
    label: "Nucleus",
    href: "/portal/documents",
    description: "Document Nucleus activity, file placeholders, and document-related member follow-up.",
    icon: FileStack,
    cta: "Open documents",
  },
  {
    label: "On-Demand",
    href: "/portal/sessions",
    description: "Advisory sessions, rapid support pathways, and near-term member help actions.",
    icon: Clock3,
    cta: "Open sessions",
  },
  {
    label: "Managed Services",
    href: "/portal/support",
    description: "Managed service delivery remains an MVP placeholder, with support used as the safe next step.",
    icon: Layers3,
    cta: "Contact support",
  },
  {
    label: "Custom Solutions",
    href: "/portal/support",
    description: "Tailored member requests are still routed through support so there are no dead calls to action.",
    icon: Users,
    cta: "Start conversation",
  },
];

const platformCards = [
  {
    label: "Applications",
    href: "/portal/apps",
    description: "Application rollout and interest capture already live in the portal.",
    icon: BriefcaseBusiness,
  },
  {
    label: "Marketplace",
    href: "/portal/marketplace/listings/new",
    description: "Marketplace flows remain available through listing and offer entry points.",
    icon: Wallet,
  },
  {
    label: "Offers",
    href: "/portal/offers",
    description: "Member offer detail and next-step access remains available here.",
    icon: Wallet,
  },
  {
    label: "Resources",
    href: "/portal/resources",
    description: "Resource and support references stay reachable through the current resource area.",
    icon: FileStack,
  },
];

const operationsCards = [
  {
    label: "Insurance",
    href: "/portal/support",
    description: "Insurance is still placeholder-level, so support is the live operational handoff.",
    icon: Sparkles,
  },
  {
    label: "Finance",
    href: "/portal/support",
    description: "Finance guidance remains placeholder-level and routes safely through support.",
    icon: Wallet,
  },
  {
    label: "NBN",
    href: "/portal/services/nbn/start",
    description: "Connectivity ordering is already wired into the authenticated portal flow.",
    icon: Wifi,
  },
  {
    label: "Coming Soon",
    href: "/portal/resources",
    description: "Future operations lanes are visible without exposing broken or dead routes.",
    icon: Clock3,
  },
  {
    label: "Membership",
    href: "/portal/membership/checkout",
    description: "Membership checkout stays reachable as the current live operational membership action.",
    icon: Users,
  },
];

function OverviewCard({
  label,
  href,
  description,
  icon: Icon,
  cta,
}: {
  label: string;
  href: string;
  description: string;
  icon: React.ElementType;
  cta?: string;
}) {
  return (
    <Link
      to={href}
      className="flex min-h-56 flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
        <Icon className="h-5 w-5 text-blue-700" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-extrabold text-slate-950">{label}</h3>
        <p className="text-sm leading-6 text-slate-500">{description}</p>
      </div>
      <div className="mt-auto text-xs font-bold text-blue-700">{cta ?? "Open section"}</div>
    </Link>
  );
}

export function PortalServices() {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <PortalAdminReference
        portalRoute="/portal/services"
        controlledBy={["Admin On-Demand Services", "Admin Managed Services"]}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-blue-700">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              Services overview
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
              The portal service area has been simplified into a safe overview
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              This page no longer depends on partially shaped portal activity data or icon lookup tables during render. Each visible card points to a live route or a clearly labelled MVP-safe fallback.
            </p>
          </div>
          <Link
            to="/portal/services/request"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
          >
            Request a Service <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 space-y-1">
          <h3 className="text-sm font-extrabold text-slate-950">Services</h3>
          <p className="text-sm leading-6 text-slate-500">
            These cards align the member experience to the approved service groupings while keeping all CTAs live in the current MVP.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {serviceCards.map((card) => (
            <OverviewCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 space-y-1">
          <h3 className="text-sm font-extrabold text-slate-950">Platform</h3>
          <p className="text-sm leading-6 text-slate-500">
            Platform routes remain reachable through the current authenticated pages and flows.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {platformCards.map((card) => (
            <OverviewCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 space-y-1">
          <h3 className="text-sm font-extrabold text-slate-950">Operations</h3>
          <p className="text-sm leading-6 text-slate-500">
            Operations areas that are not fully built yet are still routed to a valid support or resource destination instead of failing.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {operationsCards.map((card) => (
            <OverviewCard key={card.label} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}
