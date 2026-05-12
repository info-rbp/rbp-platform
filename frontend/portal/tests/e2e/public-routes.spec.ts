import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/help",
  "/on-demand",
  "/managed-services",
  "/applications",
  "/operations",
  "/marketplace",
  "/membership",
  "/offers",
  "/resources",
  "/legal"
];

for (const route of publicRoutes) {
  test(`public route renders: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("body")).not.toContainText("404");
  });
}
