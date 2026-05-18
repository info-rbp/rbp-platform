import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const sitemap = readFileSync("frontend/portal/public/sitemap.xml", "utf8");

const expectedRoutes = [
  "/",
  "/about",
  "/services",
  "/document-nucleus/overview",
  "/on-demand",
  "/managed-services",
  "/applications",
  "/operations",
  "/membership",
  "/offers",
  "/resources",
  "/marketplace",
  "/help",
  "/legal/privacy-policy",
  "/legal/terms-of-use",
];

const excludedRoutes = [
  "/portal/",
  "/admin/",
  "/signin",
  "/signup",
  "/signout",
];

test("sitemap includes expected public routes", () => {
  for (const route of expectedRoutes) {
    assert.match(sitemap, new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("sitemap excludes protected routes", () => {
  for (const route of excludedRoutes) {
    assert.equal(sitemap.includes(route), false);
  }
});
