import { test, expect } from "@playwright/test";
import { ROUTES } from "../fixtures/test-data";

test("AI Tools page renders", async ({ page }) => {
  await page.goto(ROUTES.aiTools);
  await expect(page.locator("body")).toBeVisible();
});
