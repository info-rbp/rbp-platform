import {
  mockCurrentUser,
  mockNotifications,
  mockPortalApplications,
  mockPortalDashboard,
  mockPortalDocumentActivity,
  mockPortalOffers,
  mockPortalResources,
  mockPortalServiceRequests,
  mockPortalSettingsProfile,
  mockPortalSupportTickets,
} from "../../mock";
import type {
  PortalDashboardState,
  PortalProductActivity,
  PortalProductKey,
  PortalService,
} from "../../types/portal";
import { mockAuthService } from "./auth.mockService";
import { mockGet, mockSuccess } from "./mockClient";
import { portalApi, servicesApi } from "../api";
import { normalisePortalDashboardState } from "../api/portalDashboardState";

const PORTAL_STATE_KEY = "rbp.mockPortalState";

function createDefaultPortalActivities(): PortalProductActivity[] {
  return [
    ...mockPortalDashboard.activeRequests.map((request) => ({
      id: request.id,
      product: productKeyFromSource(request.source),
      title: request.title,
      description: request.description,
      status: request.status as PortalProductActivity["status"],
      href: request.ctaHref,
      nextAction: request.nextAction,
      updatedAt: request.lastUpdated,
    })),
    {
      id: "marketplace-listing-demo",
      product: "marketplace-listing",
      title: "Seller listing in mock review",
      description: "A demo marketplace listing is waiting on admin review.",
      status: "in-review",
      reference: "MKT-LIST-MOCK-001",
      href: "/portal/marketplace/listings/new",
      adminHref: "/admin/marketplace",
      nextAction: "Await admin review",
      updatedAt: "7 May 2026",
    },
    {
      id: "marketplace-offer-demo",
      product: "marketplace-offer",
      title: "Marketplace buyer offer submitted",
      description: "A demo offer is visible to the marketplace team.",
      status: "submitted",
      reference: "MKT-OFFER-MOCK-001",
      href: "/portal/marketplace/offers/new",
      adminHref: "/admin/marketplace",
      nextAction: "Await seller response",
      updatedAt: "7 May 2026",
    },
  ];
}

function productKeyFromSource(source: string): PortalProductKey {
  if (source === "Decision Desk") return "decision-desk";
  if (source === "DocuShare") return "docushare";
  if (source === "Connectivity") return "connectivity";
  if (source === "Risk Advisor") return "risk-advisor";
  if (source === "The Fixer") return "the-fixer";
  return "membership";
}

export function createDefaultPortalState(): PortalDashboardState {
  const customer = mockAuthService.getCurrentUser() ?? {
    id: mockCurrentUser.id,
    name: mockCurrentUser.contact.name,
    email: mockCurrentUser.contact.email,
    businessName: mockCurrentUser.contact.businessName,
  };

  return {
    membershipStatus: "active",
    membershipPlan: "RBP Premium Membership",
    customer,
    activities: createDefaultPortalActivities(),
    notifications: mockNotifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      status: notification.status as PortalProductActivity["status"],
      href: notification.href ?? "/portal/dashboard",
    })),
  };
}

export function readPortalState(): PortalDashboardState {
  const rawValue = window.sessionStorage.getItem(PORTAL_STATE_KEY);
  const fallbackState = createDefaultPortalState();

  if (!rawValue) {
    return fallbackState;
  }

  try {
    const state = normalisePortalDashboardState(JSON.parse(rawValue), fallbackState);
    writePortalState(state);
    return state;
  } catch {
    writePortalState(fallbackState);
    return fallbackState;
  }
}

function writePortalState(state: PortalDashboardState) {
  window.sessionStorage.setItem(PORTAL_STATE_KEY, JSON.stringify(state));
}

function nowLabel() {
  return new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getCurrentMockPortalState() {
  return readPortalState();
}

export function resetMockPortalState() {
  const state = createDefaultPortalState();
  writePortalState(state);
  return state;
}

export async function recordMockPortalActivity(
  payload: Omit<PortalProductActivity, "id" | "updatedAt"> & {
    id?: string;
    updatedAt?: string;
  }
) {
  const apiResponse = await servicesApi.createAndSubmitRequest(payload.product, payload as unknown as Record<string, unknown>);
  const state = readPortalState();
  const activity: PortalProductActivity = apiResponse.ok && apiResponse.data
    ? {
        ...apiResponse.data,
        href: apiResponse.data.href || payload.href,
        adminHref: payload.adminHref,
      }
    : {
        ...payload,
        id: payload.id ?? `${payload.product}-${Date.now()}`,
        updatedAt: payload.updatedAt ?? nowLabel(),
      };
  const nextActivities = [
    activity,
    ...state.activities.filter((item) => item.id !== activity.id),
  ];
  const nextState: PortalDashboardState = {
    ...state,
    activities: nextActivities,
    notifications: [
      {
        id: `notification-${activity.id}`,
        title: activity.title,
        message: activity.nextAction,
        status: activity.status,
        href: activity.href,
      },
      ...state.notifications.filter((item) => item.id !== `notification-${activity.id}`),
    ],
  };

  writePortalState(nextState);
  return mockSuccess("/mock/portal/activity", activity, "Mock portal activity recorded.");
}

export function listMockPortalActivity(product?: PortalProductKey) {
  const activities = readPortalState().activities;
  const filtered = product ? activities.filter((item) => item.product === product) : activities;

  return mockSuccess("/mock/portal/activity", filtered, "Mock portal activity returned.");
}

export function getMockMe() {
  return mockGet("/mock/me", mockCurrentUser, "Mock current user returned.");
}

export function getMockPortalDashboard() {
  const portalState = readPortalState();

  return mockGet(
    "/mock/portal/dashboard",
    {
      ...mockPortalDashboard,
      portalState,
    },
    "Mock portal dashboard returned."
  );
}

export const mockPortalService: PortalService = {
  async getDashboard() {
    const fallbackState = createDefaultPortalState();
    const response = await portalApi.getDashboardState();

    if (response.ok && response.data) {
      const normalised = normalisePortalDashboardState(response.data, fallbackState);
      writePortalState(normalised);
      return {
        ...response,
        data: normalised,
      };
    }

    const stored = normalisePortalDashboardState(readPortalState(), fallbackState);
    writePortalState(stored);

    return mockGet(
      "/mock/portal/state",
      stored,
      "Mock shared portal state returned after backend fallback."
    );
  },

  recordActivity(payload) {
    return recordMockPortalActivity(payload);
  },

  listMyActivity() {
    return Promise.resolve(listMockPortalActivity());
  },
};

export function getMockPortalNotifications() {
  return mockGet(
    "/mock/portal/notifications",
    mockNotifications,
    "Mock portal notifications returned."
  );
}

export function getMockPortalServices() {
  return mockGet(
    "/mock/portal/services",
    mockPortalServiceRequests,
    "Mock portal service requests returned."
  );
}

export function getMockPortalDocuments() {
  return mockGet(
    "/mock/portal/documents",
    mockPortalDocumentActivity,
    "Mock portal document activity returned."
  );
}

export function getMockPortalOffers() {
  return mockGet(
    "/mock/portal/offers",
    mockPortalOffers,
    "Mock portal offers returned."
  );
}

export function getMockPortalApplications() {
  return mockGet(
    "/mock/portal/apps",
    mockPortalApplications,
    "Mock portal applications returned."
  );
}

export function getMockPortalResources() {
  return mockGet(
    "/mock/portal/resources",
    mockPortalResources,
    "Mock portal resources returned."
  );
}

export function getMockPortalSupport() {
  return mockGet(
    "/mock/portal/support",
    mockPortalSupportTickets,
    "Mock portal support tickets returned."
  );
}

export function getMockPortalSettings() {
  return mockGet(
    "/mock/portal/settings",
    mockPortalSettingsProfile,
    "Mock portal settings profile returned."
  );
}
