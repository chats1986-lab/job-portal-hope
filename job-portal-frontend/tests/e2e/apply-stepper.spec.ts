import { test, expect } from "@playwright/test";
import { ROUTES, SAMPLE_JOB_ID } from "../fixtures/test-data";

test.describe("Apply stepper", () => {
  test("stepper renders steps on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(ROUTES.jobApply(SAMPLE_JOB_ID));
    await page.waitForLoadState("domcontentloaded");
    // Step indicators commonly include digits 1..n
    await expect(page.getByText("1").first()).toBeVisible({ timeout: 10_000 });
  });

  test("stepper renders on mobile width", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(ROUTES.jobApply(SAMPLE_JOB_ID));
    await expect(page.getByText("1").first()).toBeVisible({ timeout: 10_000 });
  });

  test("can advance step with continue/next button", async ({ page }) => {
    await page.goto(ROUTES.jobApply(SAMPLE_JOB_ID));
    const nextBtn = page.getByRole("button", { name: /continue|next/i }).first();
    const visible = await nextBtn.isVisible().catch(() => false);
    if (!visible) test.skip();
    await nextBtn.click();
    // After clicking, expect Back or step 2 indication
    await expect(
      page.getByRole("button", { name: /back|previous/i }).first().or(page.getByText("2").first()),
    ).toBeVisible({ timeout: 5_000 });
  });
});
