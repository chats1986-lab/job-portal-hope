import { test, expect } from "@playwright/test";
import { ROUTES, SAMPLE_JOB_ID } from "../fixtures/test-data";

test.describe("Job detail", () => {
  test("renders for a known job id", async ({ page }) => {
    await page.goto(ROUTES.jobDetail(SAMPLE_JOB_ID));
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("heading").first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows an apply CTA", async ({ page }) => {
    await page.goto(ROUTES.jobDetail(SAMPLE_JOB_ID));
    const cta = page.getByRole("link", { name: /apply/i }).or(page.getByRole("button", { name: /apply/i }));
    await expect(cta.first()).toBeVisible({ timeout: 10_000 });
  });
});
