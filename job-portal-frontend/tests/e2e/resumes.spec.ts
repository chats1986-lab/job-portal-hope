import { test, expect } from "@playwright/test";
import { ROUTES } from "../fixtures/test-data";

test("resumes page renders", async ({ page }) => {
  await page.goto(ROUTES.resumes);
  await expect(page.locator("body")).toBeVisible();
});
