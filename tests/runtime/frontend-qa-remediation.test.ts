import assert from "node:assert/strict";
import { test } from "node:test";

import { resolveNavbarAccountCtas } from "../../frontend/portal/src/app/components/Navbar";
import {
  buildApplicationInterestErrorMessage,
  buildApplicationInterestSuccessMessage,
} from "../../frontend/portal/src/app/pages/BusinessApplicationsPage";
import {
  buildPortalIdentity,
  getUnreadNotificationCount,
  normalisePortalNotifications,
} from "../../frontend/portal/src/app/pages/portal/PortalLayout";
import { publicNavigation } from "../../frontend/portal/src/app/data/publicNavigation";

test("navbar resolves guest CTAs", () => {
  const result = resolveNavbarAccountCtas({ loading: false, user: null });
  assert.equal(result.kind, "guest");
  assert.equal(result.primaryHref, "/sign-in");
  assert.equal(result.secondaryHref, "/membership/sign-up-now");
});

test("navbar resolves authenticated portal CTA", () => {
  const result = resolveNavbarAccountCtas({
    loading: false,
    user: { id: "user-1", name: "QA User", email: "qa@example.com" },
  });
  assert.equal(result.kind, "authenticated");
  assert.equal(result.primaryHref, "/portal/dashboard");
  assert.equal(result.primaryLabel, "Go to Account");
});

test("application interest messages stay user-facing", () => {
  assert.equal(
    buildApplicationInterestSuccessMessage("ERPNext"),
    "ERPNext interest registered. We will use this to prioritise rollout planning.",
  );
  assert.equal(
    buildApplicationInterestSuccessMessage("ERPNext", true),
    "ERPNext is already on your interest list. We will use this to prioritise rollout planning.",
  );
  assert.equal(
    buildApplicationInterestErrorMessage("Unable to register interest.", "req-123"),
    "Unable to register interest. Reference: req-123.",
  );
});

test("operations menu uses public account-gated connectivity route", () => {
  const operations = publicNavigation.find((entry) => entry.key === "operations");
  const nbnLinks = operations?.groups?.find((group) => group.heading === "Business NBN")?.links ?? [];
  const orderLink = nbnLinks.find((link) => link.label === "Order through account");

  assert.equal(orderLink?.href, "/operations/connectivity/nbn-phone/connect-now");
  assert.equal(nbnLinks.some((link) => link.href.startsWith("/portal/")), false);
});

test("portal notification helpers normalise unread state", () => {
  const notifications = normalisePortalNotifications([
    {
      $id: "notif-1",
      title: "Welcome",
      message: "Welcome to RBP",
      status: "sent",
    },
    {
      $id: "notif-2",
      title: "Service update",
      message: "Your request has been updated",
      status: "read",
      read_at: "2026-05-17T11:00:00.000Z",
    },
  ]);

  assert.equal(notifications.length, 2);
  assert.equal(getUnreadNotificationCount(notifications), 1);
  assert.equal(notifications[0].read, false);
  assert.equal(notifications[1].read, true);
});

test("portal identity falls back cleanly", () => {
  const identity = buildPortalIdentity({
    id: "user-1",
    name: "QA Member",
    email: "qa@example.com",
    businessName: "QA Business",
  });

  assert.equal(identity.name, "QA Member");
  assert.equal(identity.plan, "QA Business");
  assert.equal(identity.initials, "QM");
});
