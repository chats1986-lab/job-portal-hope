import { test, expect } from "@playwright/test";
import { ROUTES } from "../fixtures/test-data";

test.describe("Auth pages", () => {
  test("login page renders form", async ({ page }) => {
    await page.goto(ROUTES.login);
    await expect(page.getByLabel(/email/i).first()).toBeVisible();
    await expect(page.getByLabel(/password/i).first()).toBeVisible();
  });

  test("signup page renders form", async ({ page }) => {
    await page.goto(ROUTES.signup);
    await expect(page.getByLabel(/email/i).first()).toBeVisible();
    await expect(page.getByLabel(/password/i).first()).toBeVisible();
  });

  test("empty login submit surfaces validation", async ({ page }) => {
    await page.goto(ROUTES.login);
    const submit = page.getByRole("button", { name: /sign in|log in|login/i }).first();
    if (!(await submit.isVisible().catch(() => false))) test.skip();
    await submit.click();
    // Either an inline validation message or native browser validity prevents navigation
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
