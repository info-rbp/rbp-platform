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
  { label: "Revenue Growth",              value: 72, color: "bg-blue-600" },
  { label: "Operational Efficiency",      value: 58, color: "bg-violet-600" },
  { label: "Strategic Milestone Progress",value: 85, color: "bg-emerald-600" },
];

// Set to false to simulate "no consultant yet assigned"
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
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <PortalAdminReference
        portalRoute="/portal/dashboard"
        controlledBy={["Admin Dashboard", "Admin Membership"]}
      />

      <PortalStatusCard
        title={membershipState?.selectedPlan ?? "Remote Business Partner Membership"}
        description={
          membershipState
            ? `${membershipState.businessName ?? "Your business"} has a mock ${membershipState.membershipStatus ?? "active"} membership. Onboarding is ${membershipState.onboardingStatus ?? "in progress"}.`
            : `${memberName} is viewing the active Phase 1 portal state for ${businessName}. Pending and guest-like membership states are documented in the shared mock scenarios.`
        }
        status={membershipState?.onboardingStatus === "complete" ? "active" : "in-progress"}
        href="/membership/confirmation"
      />

      {decisionDeskState ? (
        <PortalStatusCard
          title={`Decision Desk ${decisionDeskState.reference}`}
          description={`${decisionDeskState.businessName} submitted "${decisionDeskState.title}" as a Phase 1 mock request. No real advisor has been assigned.`}
          status={decisionDeskState.status}
          href={decisionDeskState.requestHref}
        />
      ) : null}

      {docuShareState ? (
        <PortalStatusCard
          title={`DocuShare brief ${docuShareState.reference}`}
          description={`${docuShareState.businessName} submitted "${docuShareState.documentType}" as a Phase 1 mock document brief. No files were uploaded and no real document is being produced.`}
          status={docuShareState.status}
          href={docuShareState.documentsHref}
        />
      ) : null}

      {/* ── Welcome banner ── */}
      <div className="bg-blue-700 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-44 h-44 bg-blue-600 rounded-full opacity-40 pointer-events-none" />
        <div className="absolute -bottom-10 right-20 w-32 h-32 bg-blue-800 rounded-full opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold text-blue-100 uppercase tracking-widest">
                Growth Partner Programme
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mb-1.5">Welcome back, {memberName}.</h2>
            <p className="text-sm text-blue-100 max-w-lg">
              {businessName} has{" "}
              <span className="font-bold text-white">{mockPortalDashboard.activeRequests.length} active mock requests</span>,{" "}
              <span className="font-bold text-white">{mockPortalDashboard.notifications.length} notifications</span>, and recommended next actions ready.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to="/portal/services"
              className="inline-flex items-center gap-1.5 bg-white text-blue-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-all"
            >
              Open My Services <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/portal/sessions"
              className="hidden sm:inline-flex items-center gap-1.5 bg-blue-600/50 hover:bg-blue-600/70 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </div>

      {/* ── Metric cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mockPortalDashboard.metrics.map((s) => {
          const Icon = metricIcon[s.icon];
          const tone = metricTone[s.tone];
          return (
          <Link
            key={s.id}
            to={s.href}
            className={`bg-white rounded-2xl p-4 border ${tone.border} shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${tone.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mb-0.5">{s.value}</div>
            <div className="text-xs font-semibold text-slate-700 mb-0.5">{s.label}</div>
            <div className="text-[10px] text-slate-400">{s.sub}</div>
          </Link>
        )})}
      </div>

      {/* ── Recent Activity + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">Recent Activity</h3>
            <Link to="/portal/services" className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {mockPortalDashboard.recentActivity.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    {item.type === "service"  && <Zap          className="w-4 h-4 text-slate-500" />}
                    {item.type === "document" && <FileText      className="w-4 h-4 text-slate-500" />}
                    {item.type === "offer"    && <Tag           className="w-4 h-4 text-slate-500" />}
                    {item.type === "session"  && <CalendarCheck className="w-4 h-4 text-slate-500" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">{item.title}</div>
                    <div className="text-[10px] text-slate-400">{item.date}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${activityStatusColor[item.status] ?? "bg-slate-100 text-slate-600"}`}>
                  {item.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900">Quick Actions</h3>
          </div>
          <div className="p-4 space-y-2">
            {mockPortalDashboard.quickLinks.map((action) => {
              const Icon = quickActionIcon[action.icon];
              return (
              <Link
                key={action.id}
                to={action.href}
                className={`flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${quickActionColor[action.emphasis]}`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  {action.label}
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )})}
          </div>
        </div>
      </div>

      {/* ── Notifications + Next Steps ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900">Notifications</h3>
          </div>
          {mockPortalDashboard.notifications.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {mockPortalDashboard.notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.href ?? "/portal/dashboard"}
                  className="block px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="text-xs font-bold text-slate-900">{notification.title}</p>
                    <StatusBadge status={notification.status} />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{notification.message}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No notifications</p>
              <p className="text-xs text-slate-400">Mock no-notification state is supported.</p>
            </div>
          )}
        </section>

        <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900">Recommended Next Actions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-50">
            {mockPortalDashboard.nextSteps.map((step) => (
              <Link key={step.id} to={step.href} className="p-5 hover:bg-slate-50 transition-colors">
                <StatusBadge status={step.status} />
                <h4 className="mt-3 text-xs font-extrabold text-slate-900 leading-snug">{step.title}</h4>
                <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">{step.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ── Phase 1 Flow Status ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold text-slate-900">Portal Status Cards</h3>
          <span className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-md">
            Frontend-only mock data
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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

      {/* ── Upcoming Sessions + Consultant ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Upcoming Sessions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">Upcoming Sessions</h3>
            <Link
              to="/portal/sessions"
              className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
            >
              Book new <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingSessions.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {upcomingSessions.map((s) => (
                <div key={s.title} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CalendarCheck className="w-5 h-5 text-blue-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 mb-0.5">{s.title}</div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3" /> {s.date} · {s.time}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Users className="w-3 h-3" /> {s.consultant}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-lg flex-shrink-0">
                    {s.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="px-5 py-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                <CalendarCheck className="w-6 h-6 text-slate-300" />
              </div>
              <div className="text-sm font-bold text-slate-700 mb-1">No sessions scheduled</div>
              <p className="text-xs text-slate-400 mb-4 max-w-xs">
                Book your first advisory session with the RBP team to get started.
              </p>
              <Link
                to="/portal/sessions"
                className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
              >
                Book a Session <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Your Consultant */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900">Your Consultant</h3>
          </div>

          {CONSULTANT_ASSIGNED ? (
            <div className="p-5 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center mb-3">
                <span className="text-lg font-black text-white">JR</span>
              </div>
              <div className="text-sm font-extrabold text-slate-900 mb-0.5">James Reynolds</div>
              <div className="text-xs text-blue-700 font-semibold mb-2">Senior Business Adviser</div>
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                ))}
                <span className="text-[10px] text-slate-400 ml-1">5.0</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Specialising in growth strategy, financial planning, and operational efficiency for Australian SMEs.
              </p>
              <Link
                to="/portal/sessions"
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Send a Message
              </Link>
            </div>
          ) : (
            /* Empty / unassigned state */
            <div className="p-5 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                <Users className="w-7 h-7 text-slate-300" />
              </div>
              <div className="text-sm font-bold text-slate-700 mb-1">No consultant assigned yet</div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Your consultant will appear here once assigned. This typically happens within 1 business day of joining.
              </p>
              <Link
                to="/portal/support"
                className="w-full inline-flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                Contact Support
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Business Health Snapshot ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-extrabold text-slate-900">Business Health Snapshot</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md">
              Demo data · Not live
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3" /> On Track
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mb-4">
          Illustrative snapshot — your adviser will share real metrics with you after your next session.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {healthMetrics.map((m) => (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600">{m.label}</span>
                <span className="text-xs font-extrabold text-slate-900">{m.value}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${m.color}`}
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">Updated after each advisory session</p>
          <Link
            to="/portal/services/business-health-snapshot"
            className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
          >
            View full snapshot <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
}
