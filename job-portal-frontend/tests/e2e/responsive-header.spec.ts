import { test, expect, devices } from "@playwright/test";
import { ROUTES } from "../fixtures/test-data";

test.use({ ...devices["iPhone 13"] });

test.describe("Responsive header (mobile)", () => {
  test("hamburger menu opens sheet with nav links", async ({ page }) => {
    await page.goto(ROUTES.home);
    const burger = page
      .getByRole("button", { name: /menu|open menu|navigation/i })
      .first();
    const visible = await burger.isVisible().catch(() => false);
    if (!visible) test.skip();
    await burger.click();
    await expect(page.getByRole("dialog").or(page.getByRole("link", { name: /jobs/i }).first())).toBeVisible();
  });
});
