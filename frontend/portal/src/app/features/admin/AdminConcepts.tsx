import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  ClipboardList,
  FileText,
  Gift,
  LayoutDashboard,
  ListChecks,
  Lock,
  MessageSquare,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";

import {
  mockAdminActionOptions,
  mockAdminAuditRecords,
  mockAdminAuditTrail,
  mockAdminContentRecords,
  mockAdminMetrics,
  mockAdminQueues,
  mockAdminReviewRecords,
  type MockAdminReviewRecord,
} from "../../mock";
import { getOfferCategoryLabel, publicOffers } from "../../data/offers";
import { submitMockAdminReviewAction } from "../../services/mock/admin.mockService";
import { AdminReviewQueueCard } from "../../components/domain";
import { MockSubmissionState, StatusTimeline } from "../../components/flow";
import { FormSection, SelectField, TextAreaField } from "../../components/forms";
import { ReviewStatusBadge, StatusBadge } from "../../components/status";

type AdminView =
  | "dashboard"
  | "content"
  | "offers"
  | "requests"
  | "decision-desk"
  | "docushare"
  | "connectivity"
  | "risk-advisor"
  | "fixer"
  | "marketplace"
  | "membership"
  | "audit-review"
  | "settings";

type SubmissionState = "idle" | "loading" | "success" | "error";
type OfferAdminAction = "request-review" | "publish" | "pause" | "archive";

const managedOffers = publicOffers.filter((offer) => offer.memberVisibility !== "admin-only");

const viewConfig: Record<AdminView, { title: string; description: string }> = {
  dashboard: {
    title: "Admin dashboard",
    description: "Phase 1 admin command centre for content, requests, marketplace, membership and audit concepts.",
  },
  content: {
    title: "Content review",
    description: "Review public content, legal placeholders, resources, offers and help centre mock records.",
  },
  offers: {
    title: "Offer management",
    description: "React mock CRUD management for public offer cards, gated portal detail, approval state, and tracking readiness.",
  },
  requests: {
    title: "Service requests",
    description: "Review all mock product/service submissions in one queue.",
  },
  "decision-desk": {
    title: "Decision Desk requests",
    description: "Review mock Decision Desk submissions and advisory status states.",
  },
  docushare: {
    title: "DocuShare requests",
    description: "Review mock document briefs, supporting placeholders and document status states.",
  },
  connectivity: {
    title: "Connectivity orders",
    description: "Review mock NBN/connectivity serviceability, order and provisioning states.",
  },
  "risk-advisor": {
    title: "Risk Advisor assessments",
    description: "Review mock assessment outcomes, risk scores and admin management states.",
  },
  fixer: {
    title: "The Fixer requests",
    description: "Review urgent issue mock triage, assignment and status states.",
  },
  marketplace: {
    title: "Marketplace review",
    description: "Review mock seller listings, buyer enquiries, fee states and publication concepts.",
  },
  membership: {
    title: "Membership review",
    description: "Review membership sign-ups, onboarding states and mock payment simulation records.",
  },
  "audit-review": {
    title: "Audit and review",
    description: "Review simulated admin actions, approval history and future compliance trail concepts.",
  },
  settings: {
    title: "Admin settings",
    description: "Mock admin preferences, review roles, notification settings and future permissions concepts.",
  },
};

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", view: "dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", view: "content", icon: FileText },
  { href: "/admin/offers", label: "Offers", view: "offers", icon: Gift },
  { href: "/admin/requests", label: "Requests", view: "requests", icon: ClipboardList },
  { href: "/admin/requests/decision-desk", label: "Decision Desk", view: "decision-desk", icon: MessageSquare },
  { href: "/admin/requests/docushare", label: "DocuShare", view: "docushare", icon: FileText },
  { href: "/admin/requests/connectivity", label: "Connectivity", view: "connectivity", icon: ListChecks },
  { href: "/admin/requests/risk-advisor", label: "Risk Advisor", view: "risk-advisor", icon: ShieldCheck },
  { href: "/admin/requests/fixer", label: "The Fixer", view: "fixer", icon: AlertCircle },
  { href: "/admin/marketplace", label: "Marketplace", view: "marketplace", icon: ShoppingBag },
  { href: "/admin/membership", label: "Membership", view: "membership", icon: Users },
  { href: "/admin/audit-review", label: "Audit", view: "audit-review", icon: CheckCircle },
  { href: "/admin/settings", label: "Settings", view: "settings", icon: Settings },
] as const;

const offerAdminActionOptions: Array<{ id: OfferAdminAction; title: string; description: string }> = [
  {
    id: "request-review",
    title: "Request review",
    description: "Simulate routing an offer back to review before publication.",
  },
  {
    id: "publish",
    title: "Publish",
    description: "Simulate publishing a reviewed offer for the public catalogue.",
  },
  {
    id: "pause",
    title: "Pause",
    description: "Simulate pausing a live offer while keeping the record visible to admins.",
  },
  {
    id: "archive",
    title: "Archive",
    description: "Simulate archiving a completed or retired offer record.",
  },
];

function inferView(pathname: string): AdminView {
  if (pathname.includes("/admin/content") || pathname.includes("/admin/site-content")) return "content";
  if (pathname.includes("/admin/offers")) return "offers";
  if (pathname.includes("/admin/requests/decision-desk")) return "decision-desk";
  if (pathname.includes("/admin/requests/docushare")) return "docushare";
  if (pathname.includes("/admin/requests/connectivity")) return "connectivity";
  if (pathname.includes("/admin/requests/risk-advisor")) return "risk-advisor";
  if (pathname.includes("/admin/requests/fixer") || pathname.includes("/admin/the-fixer")) return "fixer";
  if (pathname.includes("/admin/requests")) return "requests";
  if (pathname.includes("/admin/marketplace")) return "marketplace";
  if (pathname.includes("/admin/membership") || pathname.includes("/admin/members")) return "membership";
  if (pathname.includes("/admin/audit-review")) return "audit-review";
  if (pathname.includes("/admin/settings")) return "settings";
  return "dashboard";
}

function filterRecords(view: AdminView): MockAdminReviewRecord[] {
  if (view === "dashboard" || view === "requests") return mockAdminReviewRecords;
  if (view === "decision-desk") return mockAdminReviewRecords.filter((record) => record.owner === "Decision Desk");
  if (view === "docushare") return mockAdminReviewRecords.filter((record) => record.owner === "DocuShare");
  if (view === "connectivity") return mockAdminReviewRecords.filter((record) => record.owner === "Connectivity");
  if (view === "risk-advisor") return mockAdminReviewRecords.filter((record) => record.owner === "Risk Advisor");
  if (view === "fixer") return mockAdminReviewRecords.filter((record) => record.owner === "The Fixer");
  if (view === "marketplace") return mockAdminReviewRecords.filter((record) => record.type === "marketplace");
  if (view === "membership") return mockAdminReviewRecords.filter((record) => record.type === "membership");
  return mockAdminReviewRecords;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const currentView = inferView(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
              Phase 1 admin concepts
            </p>
            <h1 className="mt-1 text-2xl font-black text-slate-950">
              {viewConfig[currentView].title}
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              {viewConfig[currentView].description}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            Mock admin only. No auth, permissions, persistence or backend actions.
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:self-start">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.view;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={[
                    "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition",
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:bg-slate-100",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

function MetricGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {mockAdminMetrics.map((metric) => (
        <article key={metric.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-600">{metric.label}</p>
            <StatusBadge status={metric.status} />
          </div>
          <p className="text-3xl font-black text-slate-950">{metric.value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{metric.description}</p>
        </article>
      ))}
    </div>
  );
}

function QueueGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {mockAdminQueues.map((queue) => (
        <Link key={queue.id} to={queue.href}>
          <AdminReviewQueueCard
            title={queue.title}
            description={queue.description}
            count={queue.count}
            status={queue.status}
          />
        </Link>
      ))}
    </div>
  );
}

function RecordTable({ records }: { records: MockAdminReviewRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <ClipboardList className="mx-auto mb-4 h-10 w-10 text-slate-300" />
        <h3 className="text-lg font-bold text-slate-950">No mock records in this queue</h3>
        <p className="mt-2 text-sm text-slate-600">
          This empty state exists for Phase 1 admin review testing.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {["Reference", "Title", "Owner", "Submitted by", "Priority", "State", "Action"].map((header) => (
                <th key={header} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {records.map((record) => (
              <tr key={record.id} className="align-top">
                <td className="px-5 py-4 text-sm font-bold text-slate-950">{record.reference}</td>
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-slate-950">{record.title}</p>
                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">{record.summary}</p>
                </td>
                <td className="px-5 py-4 text-sm text-slate-700">{record.owner}</td>
                <td className="px-5 py-4 text-sm text-slate-700">{record.submittedBy}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={record.priority} />
                </td>
                <td className="px-5 py-4">
                  <ReviewStatusBadge state={record.state} />
                </td>
                <td className="px-5 py-4">
                  <Link to={record.routeHint} className="inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                    Review <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContentReviewPanel() {
  return (
    <div className="grid gap-4">
      {mockAdminContentRecords.map((record) => (
        <article key={record.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{record.section}</p>
              <h3 className="mt-1 text-lg font-bold text-slate-950">{record.title}</h3>
              <p className="mt-2 text-sm text-slate-600">
                Owner: {record.owner} • Last updated: {record.lastUpdated}
              </p>
            </div>
            <ReviewStatusBadge state={record.status} />
          </div>
        </article>
      ))}
    </div>
  );
}

function OfferManagementPanel() {
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [selectedOfferId, setSelectedOfferId] = useState(managedOffers[0]?.id ?? "");
  const [action, setAction] = useState<OfferAdminAction>("request-review");
  const [notes, setNotes] = useState("");
  const selectedOffer = managedOffers.find((offer) => offer.id === selectedOfferId) ?? managedOffers[0];

  const publishedOffers = managedOffers.filter((offer) => offer.status === "published").length;
  const membersOnlyOffers = managedOffers.filter((offer) => offer.memberVisibility === "members-only").length;
  const appwriteReadyOffers = managedOffers.filter((offer) => offer.trackingMethod === "appwrite-only").length;
  const impactPreparedOffers = managedOffers.filter(
    (offer) => offer.trackingMethod === "manual-plus-impact" || offer.trackingMethod === "impact-api"
  ).length;

  function submitOfferAction() {
    if (!selectedOfferId || notes.trim().length === 0) {
      setSubmissionState("error");
      return;
    }

    setSubmissionState("success");
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-600">Offers in mock admin</p>
          <p className="mt-3 text-3xl font-black text-slate-950">{managedOffers.length}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Public cards and portal detail share the same hardcoded offer catalogue.</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-600">Published offers</p>
          <p className="mt-3 text-3xl font-black text-slate-950">{publishedOffers}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Only published offers should render on the public catalogue in this MVP.</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-600">Members-only offers</p>
          <p className="mt-3 text-3xl font-black text-slate-950">{membersOnlyOffers}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Get Offer drives guests into sign-in and returns members to the selected portal offer.</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-600">Tracking readiness</p>
          <p className="mt-3 text-3xl font-black text-slate-950">{appwriteReadyOffers}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Offers already structured for Appwrite-first tracking before any external adapter is required.</p>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-base font-extrabold text-slate-950">Offer catalogue records</h3>
            <p className="mt-1 text-sm text-slate-600">
              React mock CRUD view for the public offer catalogue, portal detail routing, approval state, and tracking structure.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {["Offer", "Category", "Visibility", "Approval", "Tracking", "Preview"].map((header) => (
                    <th key={header} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {managedOffers.map((offer) => (
                  <tr key={offer.id} className="align-top">
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-950">{offer.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{offer.partner} • {offer.publicCtaLabel}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">{getOfferCategoryLabel(offer.category)}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{offer.memberVisibility}</td>
                    <td className="px-5 py-4">
                      <div className="space-y-2">
                        <StatusBadge status={offer.status} />
                        <div className="text-xs text-slate-500">{offer.approvalStatus}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-slate-700">{offer.trackingMethod}</div>
                      <div className="mt-1 text-xs text-slate-500">Required: {offer.trackingRequired}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-2 text-sm font-bold">
                        <Link to="/offers" className="inline-flex items-center gap-2 text-blue-700">
                          Public page <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <Link to={offer.portalOfferDestination} className="inline-flex items-center gap-2 text-slate-700">
                          Portal detail <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <FormSection
            title="Mock offer action"
            description="Simulate offer review and status updates without persistence. This keeps admin offer management in React while the data model stays ready for later Appwrite storage."
          >
            <MockSubmissionState
              state={submissionState}
              idleMessage="Ready for a mock offer action."
              loadingMessage="Saving mock offer action..."
              successMessage="Mock offer action recorded."
              errorMessage="Select an offer and add review notes before saving."
            />
            <SelectField
              label="Offer"
              value={selectedOfferId}
              onChange={(event) => {
                setSelectedOfferId(event.currentTarget.value);
                setSubmissionState("idle");
              }}
              options={managedOffers.map((offer) => ({
                label: `${offer.partner} - ${offer.title}`,
                value: offer.id,
              }))}
            />
            <SelectField
              label="Action"
              value={action}
              onChange={(event) => {
                setAction(event.currentTarget.value as OfferAdminAction);
                setSubmissionState("idle");
              }}
              options={offerAdminActionOptions.map((option) => ({
                label: option.title,
                value: option.id,
              }))}
            />
            <TextAreaField
              label="Admin notes"
              value={notes}
              onChange={(event) => {
                setNotes(event.currentTarget.value);
                setSubmissionState("idle");
              }}
              helpText="Frontend-only notes for the mock CRUD workflow."
            />
            <button
              type="button"
              onClick={submitOfferAction}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Save mock change
            </button>
          </FormSection>

          {selectedOffer ? (
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Selected offer</div>
              <h3 className="mt-2 text-lg font-extrabold text-slate-950">{selectedOffer.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{selectedOffer.summary}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div>Partner: {selectedOffer.partner}</div>
                <div>Status: {selectedOffer.status}</div>
                <div>Approval: {selectedOffer.approvalStatus}</div>
                <div>Tracking: {selectedOffer.trackingMethod}</div>
                <div>Portal route: {selectedOffer.portalOfferDestination}</div>
              </div>
            </article>
          ) : null}

          <article className="rounded-3xl border border-violet-200 bg-violet-50 p-6 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">Future adapter</div>
            <h3 className="mt-2 text-lg font-extrabold text-slate-950">Impact.com stays optional</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {impactPreparedOffers} offers already carry structural placeholders for a later Impact.com adapter, but the launch path remains Appwrite-first tracking until internal click and interest capture is stable.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}

function AuditReviewPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        {mockAdminAuditRecords.map((record) => (
          <article key={record.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-950">{record.action}</p>
            <p className="mt-1 text-sm text-slate-600">{record.notes}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              <span>Actor: {record.actor}</span>
              <span>Target: {record.target}</span>
              <span>{record.timestamp}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-bold text-slate-950">Mock audit timeline</h3>
        <StatusTimeline items={mockAdminAuditTrail} />
      </div>
    </div>
  );
}

function SettingsConceptPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[
        {
          title: "Review roles",
          description: "Future role mapping for content, requests, marketplace, membership and audit review.",
          icon: Users,
        },
        {
          title: "Notification preferences",
          description: "Future admin notifications for submitted requests and required actions.",
          icon: MessageSquare,
        },
        {
          title: "Permissions",
          description: "Future permission model. No real auth or permission enforcement in Phase 1.",
          icon: Lock,
        },
        {
          title: "Audit retention",
          description: "Future backend policy for review and decision audit records.",
          icon: Settings,
        },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-950">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
          </article>
        );
      })}
    </div>
  );
}

function MockActionPanel({ records }: { records: MockAdminReviewRecord[] }) {
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [selectedRecordId, setSelectedRecordId] = useState(records[0]?.id ?? "");
  const [action, setAction] = useState("request-more-info");
  const [notes, setNotes] = useState("");

  async function submitAction() {
    setSubmissionState("loading");

    const result = await submitMockAdminReviewAction({
      recordId: selectedRecordId,
      action: action as "approve" | "reject" | "request-more-info",
      notes,
    });

    setSubmissionState(result.ok ? "success" : "error");
  }

  return (
    <FormSection
      title="Mock admin action"
      description="Simulate approve, reject or request-more-info actions. No backend update, email, notification or permission check occurs."
    >
      <MockSubmissionState
        state={submissionState}
        idleMessage="Ready for mock admin action."
        loadingMessage="Submitting mock admin action..."
        successMessage="Mock admin action recorded."
        errorMessage="Mock admin action validation failed."
      />
      <SelectField
        label="Record"
        value={selectedRecordId}
        onChange={(event) => setSelectedRecordId(event.currentTarget.value)}
        options={records.map((record) => ({
          label: `${record.reference} - ${record.title}`,
          value: record.id,
        }))}
      />
      <SelectField
        label="Action"
        value={action}
        onChange={(event) => setAction(event.currentTarget.value)}
        options={mockAdminActionOptions.map((option) => ({
          label: option.title,
          value: option.id,
        }))}
      />
      <TextAreaField
        label="Review notes"
        value={notes}
        onChange={(event) => setNotes(event.currentTarget.value)}
        helpText="Notes remain frontend-only in Phase 1."
      />
      <button
        type="button"
        onClick={submitAction}
        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
      >
        Submit mock action
      </button>
    </FormSection>
  );
}

export function AdminConcepts() {
  const location = useLocation();
  const view = useMemo(() => inferView(location.pathname), [location.pathname]);
  const records = filterRecords(view);

  return (
    <AdminShell>
      <div className="space-y-6">
        {view === "dashboard" ? (
          <>
            <MetricGrid />
            <QueueGrid />
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
              <RecordTable records={mockAdminReviewRecords.slice(0, 5)} />
              <MockActionPanel records={mockAdminReviewRecords} />
            </div>
          </>
        ) : null}

        {view === "content" ? (
          <>
            <MetricGrid />
            <ContentReviewPanel />
          </>
        ) : null}

        {view === "offers" ? <OfferManagementPanel /> : null}

        {[
          "requests",
          "decision-desk",
          "docushare",
          "connectivity",
          "risk-advisor",
          "fixer",
          "marketplace",
          "membership",
        ].includes(view) ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
            <RecordTable records={records} />
            <MockActionPanel records={records.length ? records : mockAdminReviewRecords} />
          </div>
        ) : null}

        {view === "audit-review" ? <AuditReviewPanel /> : null}

        {view === "settings" ? <SettingsConceptPanel /> : null}
      </div>
    </AdminShell>
  );
}
