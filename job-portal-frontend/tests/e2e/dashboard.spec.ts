import { test, expect } from "@playwright/test";
import { ROUTES } from "../fixtures/test-data";

test.describe("Dashboard", () => {
  test("renders without crashing", async ({ page }) => {
    await page.goto(ROUTES.dashboard);
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).toBeVisible();
  });
});
