import { Link } from "react-router";
import { PortalAdminReference } from "./PortalAdminReference";
import { PortalStatusCard } from "../../components/domain";
import { StatusBadge } from "../../components/status";
import {
  decisionDeskFlowStorageKey,
  type DecisionDeskStoredState,
} from "../../features/decision-desk";
import {
  docuShareFlowStorageKey,
  type DocuShareStoredState,
} from "../../features/docushare";
import { membershipFlowStorageKey } from "../../features/membership/MembershipPurchaseOnboardingFlow";
import { mockPortalDashboard } from "../../mock";
import {
  Zap, CalendarCheck, FileText, CheckCircle, Tag,
  Star, ArrowRight, ChevronRight, TrendingUp, Clock,
  Users, MessageSquare, AlertCircle, HeadphonesIcon,
  AppWindowIcon, Plus,
} from "lucide-react";

interface StoredMembershipDashboardState {
  signupReference?: string;
  onboardingReference?: string;
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

function readDecisionDeskDashboardState(): DecisionDeskStoredState | null {
  const rawValue = window.sessionStorage.getItem(decisionDeskFlowStorageKey);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as DecisionDeskStoredState;
  } catch {
    return null;
  }
}

function readDocuShareDashboardState(): DocuShareStoredState | null {
  const rawValue = window.sessionStorage.getItem(docuShareFlowStorageKey);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as DocuShareStoredState;
  } catch {
    return null;
  }
}

const metricIcon = {
  zap: Zap,
  alert: AlertCircle,
  file: FileText,
  check: CheckCircle,
};

const metricTone = {
  blue: { color: "bg-blue-50 text-blue-700", border: "border-blue-100" },
  amber: { color: "bg-amber-50 text-amber-700", border: "border-amber-100" },
  emerald: { color: "bg-emerald-50 text-emerald-700", border: "border-emerald-100" },
  violet: { color: "bg-violet-50 text-violet-700", border: "border-violet-100" },
};

const activityStatusColor: Record<string, string> = {
  "In review": "bg-amber-50 text-amber-700",
  "Outcome ready": "bg-emerald-50 text-emerald-700",
  Ready: "bg-emerald-50 text-emerald-700",
  Included: "bg-blue-50 text-blue-700",
};

const quickActionIcon = {
  plus: Plus,
  calendar: CalendarCheck,
  file: FileText,
  tag: Tag,
  app: AppWindowIcon,
  support: HeadphonesIcon,
};

const quickActionColor = {
  primary: "bg-blue-700 text-white hover:bg-blue-800",
  dark: "bg-slate-900 text-white hover:bg-slate-800",
  secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
};

const upcomingSessions = [
  {
    title: "Monthly Strategy Session",
    date: "Tue 12 May 2026",
    time: "10:00 AM",
    consultant: "James R.",
    type: "Advisory",
  },
  {
    title: "Financial Planning Review",
    date: "Wed 20 May 2026",
    time: "2:00 PM",
    consultant: "Amanda K.",
    type: "Finance",
  },
];

const healthMetrics = [
  { label: "Revenue Growth", value: 72, color: "bg-blue-600" },
  { label: "Operational Efficiency", value: 58, color: "bg-violet-600" },
  { label: "Strategic Milestone Progress", value: 85, color: "bg-emerald-600" },
];

const CONSULTANT_ASSIGNED = true;

export function PortalDashboard() {
  const membershipState = readMembershipDashboardState();
  const decisionDeskState = readDecisionDeskDashboardState();
  const docuShareState = readDocuShareDashboardState();
  const memberName = mockPortalDashboard.user.contact.name;
  const businessName =
    membershipState?.businessName ??
    mockPortalDashboard.user.contact.businessName ??
    "Your business";

  return (
    <div className="px-4 py-6 space-y-6 sm:px-6">
      <PortalAdminReference
        portalRoute="/portal/dashboard"
        controlledBy={["Admin Dashboard", "Admin Membership"]}
      />

      <PortalStatusCard
        title={membershipState?.selectedPlan ?? "RBP Premium Membership"}
        description={
          membershipState
            ? `${membershipState.businessName ?? "Your business"} has an active premium membership preview. Onboarding is ${membershipState.onboardingStatus ?? "in progress"}.`
            : `${memberName} is viewing the membership portal preview for ${businessName}. Pending and guest-style membership states are documented in the shared preview scenarios.`
        }
        status={membershipState?.onboardingStatus === "complete" ? "active" : "in-progress"}
        href="/membership/confirmation"
      />

      {decisionDeskState ? (
        <PortalStatusCard
          title={`Decision Desk ${decisionDeskState.reference}`}
          description={`${decisionDeskState.businessName} submitted "${decisionDeskState.title}" as a preview request. No real advisor has been assigned.`}
          status={decisionDeskState.status}
          href={decisionDeskState.requestHref}
        />
      ) : null}

      {docuShareState ? (
        <PortalStatusCard
          title={`DocuShare brief ${docuShareState.reference}`}
          description={`${docuShareState.businessName} submitted "${docuShareState.documentType}" as a preview document brief. No files were uploaded and no real document is being produced.`}
          status={docuShareState.status}
          href={docuShareState.documentsHref}
        />
      ) : null}

      <div className="relative overflow-hidden rounded-2xl bg-blue-700 px-6 py-5">
        <div className="pointer-events-none absolute -top-8 -right-8 h-44 w-44 rounded-full bg-blue-600 opacity-40" />
        <div className="pointer-events-none absolute right-20 -bottom-10 h-32 w-32 rounded-full bg-blue-800 opacity-40" />

        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-100">
                Growth Partner Programme
              </span>
            </div>
            <h2 className="mb-1.5 text-xl font-extrabold text-white">Welcome back, {memberName}.</h2>
            <p className="max-w-lg text-sm text-blue-100">
              {businessName} has <span className="font-bold text-white">{mockPortalDashboard.activeRequests.length} active requests</span>,{" "}
              <span className="font-bold text-white">{mockPortalDashboard.notifications.length} notifications</span>, and recommended next actions ready.
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <Link
              to="/portal/services"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 transition-all hover:bg-blue-50"
            >
              Open My Services <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/portal/sessions"
              className="hidden items-center gap-1.5 rounded-xl bg-blue-600/50 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-600/70 sm:inline-flex"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {mockPortalDashboard.metrics.map((s) => {
          const Icon = metricIcon[s.icon];
          const tone = metricTone[s.tone];
          return (
            <Link
              key={s.id}
              to={s.href}
              className={`rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${tone.border}`}
            >
              <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-xl ${tone.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="mb-0.5 text-2xl font-extrabold text-slate-900">{s.value}</div>
              <div className="mb-0.5 text-xs font-semibold text-slate-700">{s.label}</div>
              <div className="text-[10px] text-slate-400">{s.sub}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-extrabold text-slate-900">Recent Activity</h3>
            <Link to="/portal/services" className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {mockPortalDashboard.recentActivity.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
                    {item.type === "service" && <Zap className="h-4 w-4 text-slate-500" />}
                    {item.type === "document" && <FileText className="h-4 w-4 text-slate-500" />}
                    {item.type === "offer" && <Tag className="h-4 w-4 text-slate-500" />}
                    {item.type === "session" && <CalendarCheck className="h-4 w-4 text-slate-500" />}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-bold text-slate-800">{item.title}</div>
                    <div className="text-[10px] text-slate-400">{item.date}</div>
                  </div>
                </div>
                <span className={`flex-shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${activityStatusColor[item.status] ?? "bg-slate-100 text-slate-600"}`}>
                  {item.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-extrabold text-slate-900">Quick Actions</h3>
          </div>
          <div className="space-y-2 p-4">
            {mockPortalDashboard.quickLinks.map((action) => {
              const Icon = quickActionIcon[action.icon];
              return (
                <Link
                  key={action.id}
                  to={action.href}
                  className={`flex items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${quickActionColor[action.emphasis]}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5" />
                    {action.label}
                  </div>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-extrabold text-slate-900">Notifications</h3>
          </div>
          {mockPortalDashboard.notifications.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {mockPortalDashboard.notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.href ?? "/portal/dashboard"}
                  className="block px-5 py-4 transition-colors hover:bg-slate-50"
                >
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="text-xs font-bold text-slate-900">{notification.title}</p>
                    <StatusBadge status={notification.status} />
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500">{notification.message}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-center">
              <CheckCircle className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
              <p className="text-sm font-bold text-slate-700">No notifications</p>
              <p className="text-xs text-slate-400">No notifications are currently available in this preview.</p>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-extrabold text-slate-900">Recommended Next Actions</h3>
          </div>
          <div className="grid grid-cols-1 divide-slate-50 md:grid-cols-3 md:divide-x md:divide-y-0">
            {mockPortalDashboard.nextSteps.map((step) => (
              <Link key={step.id} to={step.href} className="p-5 transition-colors hover:bg-slate-50">
                <StatusBadge status={step.status} />
                <h4 className="mt-3 text-xs font-extrabold leading-snug text-slate-900">{step.title}</h4>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{step.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Membership Preview Status</h3>
          <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-400">
            Preview data
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mockPortalDashboard.flowStatuses.map((flow) => (
            <PortalStatusCard
              key={flow.id}
              title={flow.title}
              description={flow.description}
              status={flow.status}
              href={flow.href}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-extrabold text-slate-900">Upcoming Sessions</h3>
            <Link
              to="/portal/sessions"
              className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
            >
              Book new <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {upcomingSessions.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {upcomingSessions.map((s) => (
                <div key={s.title} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <CalendarCheck className="h-5 w-5 text-blue-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 text-xs font-bold text-slate-900">{s.title}</div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock className="h-3 w-3" /> {s.date} · {s.time}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Users className="h-3 w-3" /> {s.consultant}
                      </span>
                    </div>
                  </div>
                  <span className="flex-shrink-0 rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                    {s.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center px-5 py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                <CalendarCheck className="h-6 w-6 text-slate-300" />
              </div>
              <div className="mb-1 text-sm font-bold text-slate-700">No sessions scheduled</div>
              <p className="mb-4 max-w-xs text-xs text-slate-400">
                Book your first advisory session with the RBP team to get started.
              </p>
              <Link
                to="/portal/sessions"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-800"
              >
                Book a Session <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-extrabold text-slate-900">Your Consultant</h3>
          </div>

          {CONSULTANT_ASSIGNED ? (
            <div className="flex flex-col items-center p-5 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700">
                <span className="text-lg font-black text-white">JR</span>
              </div>
              <div className="mb-0.5 text-sm font-extrabold text-slate-900">James Reynolds</div>
              <div className="mb-2 text-xs font-semibold text-blue-700">Senior Business Adviser</div>
              <div className="mb-3 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 text-[10px] text-slate-400">5.0</span>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-slate-500">
                Specialising in growth strategy, financial planning, and operational efficiency for Australian SMEs.
              </p>
              <Link
                to="/portal/sessions"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-800"
              >
                <MessageSquare className="h-3.5 w-3.5" /> Send a Message
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center p-5 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <Users className="h-7 w-7 text-slate-300" />
              </div>
              <div className="mb-1 text-sm font-bold text-slate-700">No consultant assigned yet</div>
              <p className="mb-4 text-xs leading-relaxed text-slate-400">
                Your consultant will appear here once assigned. This typically happens within 1 business day of joining.
              </p>
              <Link
                to="/portal/support"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50"
              >
                Contact Support
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white px-5 py-5 shadow-sm">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Business Health Snapshot</h3>
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-400">
              Demo data · Not live
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
              <TrendingUp className="h-3 w-3" /> On Track
            </span>
          </div>
        </div>
        <p className="mb-4 text-[11px] text-slate-400">
          Illustrative snapshot — your adviser will share real metrics with you after your next session.
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {healthMetrics.map((m) => (
            <div key={m.label}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">{m.label}</span>
                <span className="text-xs font-extrabold text-slate-900">{m.value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${m.color}`}
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
          <p className="text-[11px] text-slate-400">Updated after each advisory session</p>
          <Link
            to="/portal/services/business-health-snapshot"
            className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
          >
            View full snapshot <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
