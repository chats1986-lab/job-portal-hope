import { test, expect } from "@playwright/test";
import { ROUTES } from "../fixtures/test-data";

test.describe("Home page", () => {
  test("renders hero headline and AI search box", async ({ page }) => {
    await page.goto(ROUTES.home);
    await expect(page.getByRole("heading", { name: /find your next opportunity/i })).toBeVisible();
    await expect(page.getByPlaceholder(/remote senior react/i)).toBeVisible();
  });

  test("AI search submits and navigates to /jobs", async ({ page }) => {
    await page.goto(ROUTES.home);
    await page.getByPlaceholder(/remote senior react/i).fill("React");
    await page.getByRole("button", { name: /search/i }).click();
    await expect(page).toHaveURL(/\/jobs(\?.*)?$/);
  });

  test("shows job cards or empty state", async ({ page }) => {
    await page.goto(ROUTES.home);
    // Wait for either cards or empty state to settle
    await page.waitForLoadState("networkidle").catch(() => {});
    const cards = page.locator('[data-testid="job-card"], article');
    const hasCards = (await cards.count()) > 0;
    const empty = await page.getByText(/no jobs|couldn't load|check back/i).isVisible().catch(() => false);
    expect(hasCards || empty).toBeTruthy();
  });
});
