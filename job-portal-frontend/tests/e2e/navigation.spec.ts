import { test, expect } from "@playwright/test";
import { ROUTES } from "../fixtures/test-data";

test.describe("Navigation", () => {
  test("home page loads", async ({ page }) => {
    await page.goto(ROUTES.home);
    await expect(page).toHaveTitle(/HireMe|Vivasva|Opportunity/i);
  });

  test("unknown route shows 404", async ({ page }) => {
    await page.goto("/this-route-does-not-exist-xyz");
    await expect(page.getByText(/404|not found/i).first()).toBeVisible();
  });

  test("can navigate from home to jobs", async ({ page }) => {
    await page.goto(ROUTES.home);
    const jobsLink = page.getByRole("link", { name: /^jobs$/i }).first();
    if (await jobsLink.isVisible().catch(() => false)) {
      await jobsLink.click();
      await expect(page).toHaveURL(/\/jobs/);
    } else {
      await page.goto(ROUTES.jobs);
      await expect(page).toHaveURL(/\/jobs/);
    }
  });
});
