import { expect, type Page } from "@playwright/test";

export async function gotoAndWait(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("domcontentloaded");
}

export async function expectNoConsoleErrors(page: Page, fn: () => Promise<void>) {
  const errors: string[] = [];
  const onErr = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() === "error") errors.push(msg.text());
  };
  page.on("console", onErr);
  try {
    await fn();
  } finally {
    page.off("console", onErr);
  }
  // Filter known noisy errors (favicon, dev-only warnings)
  const real = errors.filter(
    (e) => !/favicon|Download the React DevTools|Manifest/i.test(e),
  );
  expect(real, `Console errors: ${real.join("\n")}`).toHaveLength(0);
}

export async function expectHasTitle(page: Page) {
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
}
