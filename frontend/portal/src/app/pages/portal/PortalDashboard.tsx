import { Link } from "react-router";
import {
  AlertCircle,
  AppWindowIcon,
  ArrowRight,
  Bell,
  CreditCard,
  ExternalLink,
  RefreshCw,
  Tag,
  UserRound,
  Zap,
} from "lucide-react";

import type { IntegrationStatus, NotificationSummary, PortalDashboardPayload } from "../../api/types";
import { PortalStatusCard } from "../../components/domain";
import { StatusBadge } from "../../components/status";
import { usePortalSession } from "../../context/PortalSessionContext";
import { membershipFlowStorageKey } from "../../features/membership/MembershipPurchaseOnboardingFlow";
import type { MembershipTierCode } from "../../data/membershipTiers";

interface StoredMembershipDashboardState {
  membershipTier?: MembershipTierCode;
  membershipStatus?: string;
  onboardingStatus?: string;
  businessName?: string;
  selectedPlan?: string;
}

function readMembershipDashboardState(): StoredMembershipDashboardState | null {
  const rawValue = window.sessionStorage.getItem(membershipFlowStorageKey);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as StoredMembershipDashboardState;
  } catch {
    return null;
  }
}

function getNotifications(dashboard: PortalDashboardPayload | null): NotificationSummary[] {
  if (!dashboard?.notifications) {
    return [];
  }

  return Array.isArray(dashboard.notifications)
    ? dashboard.notifications
    : dashboard.notifications.notifications;
}

function getIntegrations(dashboard: PortalDashboardPayload | null): IntegrationStatus[] {
  if (!dashboard?.integrations) {
    return [];
  }

  return Array.isArray(dashboard.integrations)
    ? dashboard.integrations
    : Object.values(dashboard.integrations);
}

function routeFor(value?: string) {
  return value || "/portal/dashboard";
}

function deriveMembershipTier(plan?: string | null, previewTier?: MembershipTierCode): MembershipTierCode | "none" {
  if (previewTier) {
    return previewTier;
  }

  const normalized = plan?.toLowerCase() ?? "";
  if (normalized.includes("premium")) return "premium";
  if (normalized.includes("free")) return "free";
  return "none";
}

export function PortalDashboard() {
  const session = usePortalSession();
  const previewMembership = readMembershipDashboardState();
  const dashboard = session.dashboard;
  const notifications = getNotifications(dashboard);
  const integrations = getIntegrations(dashboard);
  const billing = dashboard?.billing;
  const membershipTier = deriveMembershipTier(
    billing?.membership_plan ?? billing?.plan ?? billing?.plan_name ?? null,
    previewMembership?.membershipTier
  );
  const membershipName =
    previewMembership?.selectedPlan ??
    billing?.membership_plan ??
    billing?.plan_name ??
    billing?.plan ??
    (membershipTier === "free"
      ? "RBP Free Membership"
      : membershipTier === "premium"
        ? "RBP Premium Membership"
        : "No active membership tier");

  if (session.error) {
    return (
      <div className="px-4 py-6 sm:px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-700" />
            <div>
              <h2 className="text-sm font-extrabold text-red-950">Dashboard could not be loaded</h2>
              <p className="mt-2 text-sm leading-6 text-red-800">{session.error}</p>
              <button
                type="button"
                onClick={() => void session.refresh()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-800"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <section className="rounded-2xl bg-blue-700 px-6 py-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-100">Member portal</p>
            <h2 className="mt-2 text-xl font-extrabold text-white">Welcome back, {session.fullName}.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
              Your portal is connected to RBP dashboard data for apps, notifications, billing, integrations, and quick links.
            </p>
          </div>
          <Link
            to="/portal/services"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 transition-all hover:bg-blue-50"
          >
            Open My Services <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PortalStatusCard
          title={membershipName}
          description={
            membershipTier === "free"
              ? "Free Membership supports online purchasing access and basic member profile management."
              : membershipTier === "premium"
                ? "Premium Membership benefits and billing status are available in your account."
                : "Create a free membership to purchase online and activate member access."
          }
          status={previewMembership?.onboardingStatus === "complete" || billing?.status === "Active" ? "active" : "in-progress"}
          href="/membership/confirmation"
        />
        <PortalStatusCard
          title={`${dashboard.available_apps.length} available apps`}
          description="Applications are provided by the RBP platform entitlement layer."
          status="active"
          href="/portal/apps"
        />
        <PortalStatusCard
          title={`${notifications.length} notifications`}
          description={`${session.notificationCount} unread notification${session.notificationCount === 1 ? "" : "s"} in your portal account.`}
          status={session.notificationCount > 0 ? "in-progress" : "active"}
          href="/portal/dashboard"
        />
        <PortalStatusCard
          title={billing?.status ?? "Billing status"}
          description={billing?.message ?? "Billing and subscription status are loaded from RBP."}
          status={billing?.billing_enabled ? "active" : "placeholder"}
          href="/portal/settings"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-extrabold text-slate-900">Available Applications</h3>
            <Link to="/portal/apps" className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            {dashboard.available_apps.length > 0 ? (
              dashboard.available_apps.map((app) => (
                <Link
                  key={app.id ?? app.name ?? app.label ?? app.route}
                  to={routeFor(app.route ?? app.href)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50"
                >
                  <AppWindowIcon className="h-5 w-5 text-blue-700" />
                  <h4 className="mt-3 text-sm font-extrabold text-slate-950">{app.title ?? app.label ?? app.name}</h4>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{app.description ?? app.category ?? "RBP platform application"}</p>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600 sm:col-span-2">
                No applications are currently available for this account.
              </div>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-extrabold text-slate-900">Quick Links</h3>
          </div>
          <div className="space-y-2 p-4">
            {dashboard.quick_links.map((link) => (
              <Link
                key={`${link.label}-${link.route}`}
                to={routeFor(link.route ?? link.href)}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50"
              >
                <span>{link.label}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
            <Bell className="h-4 w-4 text-blue-700" />
            <h3 className="text-sm font-extrabold text-slate-900">Notifications</h3>
          </div>
          {notifications.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {notifications.slice(0, 5).map((notification) => (
                <Link
                  key={notification.name ?? notification.id ?? notification.title}
                  to={routeFor(notification.route ?? notification.related_route)}
                  className="block px-5 py-4 transition-colors hover:bg-slate-50"
                >
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="text-xs font-bold text-slate-900">{notification.title}</p>
                    <StatusBadge status={notification.status ?? "Unread"} />
                  </div>
                  {notification.message ? (
                    <p className="text-[11px] leading-relaxed text-slate-500">{notification.message}</p>
                  ) : null}
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-center">
              <p className="text-sm font-bold text-slate-700">No notifications</p>
              <p className="mt-1 text-xs text-slate-400">Nothing needs your attention right now.</p>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
            <CreditCard className="h-4 w-4 text-blue-700" />
            <h3 className="text-sm font-extrabold text-slate-900">Billing</h3>
          </div>
          <dl className="space-y-3 p-5 text-sm">
            {[
              ["Status", billing?.status ?? "Not configured"],
              ["Plan", membershipName],
              ["Payment", billing?.payment_status as string | undefined ?? "Not available"],
              ["Period End", billing?.current_period_end ?? "Not available"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-3 last:border-0">
                <dt className="font-semibold text-slate-500">{label}</dt>
                <dd className="text-right font-bold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
            <Zap className="h-4 w-4 text-blue-700" />
            <h3 className="text-sm font-extrabold text-slate-900">Integrations</h3>
          </div>
          <div className="space-y-2 p-4">
            {integrations.length > 0 ? (
              integrations.map((integration) => (
                <div key={integration.name ?? integration.label} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{integration.label ?? integration.name}</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">{integration.status ?? (integration.connected ? "Connected" : "Not connected")}</p>
                  </div>
                  <StatusBadge status={integration.connected ? "active" : integration.status ?? "placeholder"} />
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
                No integration status is currently available.
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-blue-700" />
          <h3 className="text-sm font-extrabold text-slate-900">Account Summary</h3>
        </div>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">Email</p>
            <p className="mt-1 break-all font-bold text-slate-900">{session.email}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">User type</p>
            <p className="mt-1 font-bold text-slate-900">{session.userType ?? "Website User"}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">Roles</p>
            <p className="mt-1 font-bold text-slate-900">{session.roles.length ? session.roles.join(", ") : "No roles returned"}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <Tag className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-700" />
          <div>
            <h3 className="text-sm font-extrabold text-slate-950">Online purchasing access</h3>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              Free and Premium members can purchase products and services online. Guests need to create a Free Membership first.
            </p>
            {membershipTier === "none" ? (
              <Link
                to="/membership/sign-up-now?tier=free&returnTo=/portal/dashboard"
                className="mt-3 inline-flex items-center rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800"
              >
                Create Free Membership
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
