# E2E Tests (Playwright)

End-to-end tests for the Vivasva / HireMe app, covering all major user journeys.

## Setup

Install the Playwright browsers once:

```bash
bunx playwright install
```

## Run

```bash
# Run all tests (auto-starts dev server)
bun run test:e2e

# Open interactive UI
bun run test:e2e:ui

# View last HTML report
bun run test:e2e:report

# Run against a deployed URL instead of the local dev server
PLAYWRIGHT_BASE_URL=https://your-preview-url.lovable.app bun run test:e2e
```

## Structure

```
tests/
├── fixtures/        # shared mock data
├── utils/           # navigation + assertion helpers
└── e2e/             # spec files, one per feature area
```

## Conventions

- Prefer semantic queries (`getByRole`, `getByText`) over CSS selectors.
- Each spec is independent — no shared state between tests.
- Tests run against the placeholder data already shipped with the app; no backend required.
- Skip a test rather than make it flaky if the underlying feature is not yet wired up.
