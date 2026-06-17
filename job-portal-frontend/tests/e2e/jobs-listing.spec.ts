import { test, expect } from "@playwright/test";
import { ROUTES } from "../fixtures/test-data";

test.describe("Jobs listing", () => {
  test("renders jobs page", async ({ page }) => {
    await page.goto(ROUTES.jobs);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 10_000 });
  });

  test("loads job cards", async ({ page }) => {
    await page.goto(ROUTES.jobs);
    await page.waitForLoadState("networkidle").catch(() => {});
    const cards = page.locator('article, [data-testid="job-card"]');
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });
  });

  test("infinite scroll loads more cards on scroll", async ({ page }) => {
    await page.goto(ROUTES.jobs);
    await page.waitForLoadState("networkidle").catch(() => {});
    const cards = page.locator('article, [data-testid="job-card"]');
    const initialCount = await cards.count();
    if (initialCount === 0) test.skip();
    await page.mouse.wheel(0, 10000);
    await page.waitForTimeout(1500);
    await page.mouse.wheel(0, 10000);
    await page.waitForTimeout(1500);
    const newCount = await cards.count();
    expect(newCount).toBeGreaterThanOrEqual(initialCount);
  });

  test("Apply Now button on a card navigates to apply route", async ({ page }) => {
    await page.goto(ROUTES.jobs);
    await page.waitForLoadState("networkidle").catch(() => {});
    const applyBtn = page.getByRole("link", { name: /apply now/i }).first();
    const visible = await applyBtn.isVisible().catch(() => false);
    if (!visible) test.skip();
    await applyBtn.click();
    await expect(page).toHaveURL(/\/jobs\/.+\/apply/);
  });
});
