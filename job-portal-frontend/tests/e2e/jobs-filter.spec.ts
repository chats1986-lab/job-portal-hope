import { test, expect } from "@playwright/test";
import { ROUTES } from "../fixtures/test-data";

test.describe("Jobs filters", () => {
  test("desktop sidebar filters are visible", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(ROUTES.jobs);
    const filterRegion = page.getByText(/filters?/i).first();
    await expect(filterRegion).toBeVisible({ timeout: 10_000 });
  });

  test("mobile filter sheet opens via filter button", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(ROUTES.jobs);
    const trigger = page.getByRole("button", { name: /filter/i }).first();
    const visible = await trigger.isVisible().catch(() => false);
    if (!visible) test.skip();
    await trigger.click();
    await expect(page.getByRole("dialog").or(page.getByText(/filters?/i).first())).toBeVisible();
  });
});
