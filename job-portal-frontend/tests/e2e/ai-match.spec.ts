import { test, expect } from "@playwright/test";
import { ROUTES } from "../fixtures/test-data";

test("AI Match page renders", async ({ page }) => {
  await page.goto(ROUTES.aiMatch);
  await expect(page.locator("body")).toBeVisible();
});
