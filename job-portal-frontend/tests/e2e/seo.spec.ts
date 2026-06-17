import { test, expect } from "@playwright/test";
import { ROUTES } from "../fixtures/test-data";

const pages: { name: string; path: string }[] = [
  { name: "home", path: ROUTES.home },
  { name: "jobs", path: ROUTES.jobs },
  { name: "login", path: ROUTES.login },
  { name: "signup", path: ROUTES.signup },
];

for (const p of pages) {
  test(`${p.name} has a non-empty <title>`, async ({ page }) => {
    await page.goto(p.path);
    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(0);
  });

  test(`${p.name} has a meta description`, async ({ page }) => {
    await page.goto(p.path);
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect((desc ?? "").trim().length).toBeGreaterThan(0);
  });
}
