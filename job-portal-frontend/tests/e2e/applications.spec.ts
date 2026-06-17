import { test, expect } from "@playwright/test";
import { ROUTES } from "../fixtures/test-data";

test("applications page renders", async ({ page }) => {
  await page.goto(ROUTES.applications);
  await expect(page.locator("body")).toBeVisible();
});
