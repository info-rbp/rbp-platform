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
import { mockGet } from "./mockClient";

export function getMockMe() {
  return mockGet("/mock/me", mockCurrentUser, "Mock current user returned.");
}

export function getMockPortalDashboard() {
  return mockGet(
    "/mock/portal/dashboard",
    mockPortalDashboard,
    "Mock portal dashboard returned."
  );
}

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
