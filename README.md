## Overview

This repo contains Playwright tests to validate some basic functionality Chess.com, along with some non-functional A11y tests. My intention illustrate some testing strategies and organization that are effective for managing a test suite. In here I will also describe some high level stratetgies that include testing at different layers of the application not included in this repo such as unit, component, and integration tests.

## Test definitions

- **Unit Test**: tests a single function; uses mocks freely. Lives with source code (not in this repo).
- **Component Test**: tests a small feature/module in isolation with minimal internal mocking. Lives with source code (not in this repo).
- **Integration Test**: backend-focused, spans multiple services via public APIs; external services may be mocked. Lives outside this repo.
- **UI Test**: frontend equivalent of integration; uses Playwright to drive the browser while mocking backend responses. Primary focus of this repo.
- **End to End (E2E) Test**: drives the real frontend against real backend connections, minimal mocks. Used for the most important user flows only.

## Coverage strategy

- **Pyramid balance**: many unit/component tests; fewer UI tests; very few E2E tests.
- **Repo focus**: primarily UI tests (mocked) and a small set of E2E tests (live).

## Responsibilities

- **Developers**: write unit/component tests in app repos; contribute UI tests here for new or changed features.
- **Test Engineers**: design and maintain critical E2E/UI flows; help stabilize flake; curate mocks and fixtures.
- **Cadence**: create UI tests judiciously for main features (every PR); run E2E less frequently (scheduled or pre-release).

## Repository structure

```text
tests/
  ui/                mocked UI tests by feature area
  e2e/               critical end-to-end tests
src/
  pages/             Page Objects (one class per page/component)
  helpers/           reusable domain helpers (e.g., startGame, loginViaApi)
  fixtures/          Playwright test.extend fixtures (auth, mocks, pages)
  mocks/             static JSON, factories, and route handlers
  shared/            types, constants, test data builders
playwright.config.ts projects, baseURL, timeouts, retries, reporter config
.cursor/rules        house rules for contributors
.github/workflows/   CI pipelines (optional if using GitHub Actions)
```

## Test organization

- **UI (mocked) tests**: live under `tests/ui` and should be tagged with "[ui]" in titles. These tests mock network calls and validate user-visible behavior.
- **End-to-End (E2E) tests**: live under `tests/e2e` and should be tagged with "[e2e]". These run against live services and cover only critical flows.
- **Shared assets for both**:
  - `src/pages`: Page Objects encapsulating selectors and user actions
  - `src/helpers`: reusable domain helpers for common flows
  - `src/fixtures`: Playwright fixtures (e.g., auth, pages, mocks)
  - `src/mocks`: static JSON, factories, and route handlers for mocked responses
- **Projects**: `playwright.config.ts` defines `ui-mocked` and `e2e-live` projects, each with appropriate baseURL, retries, and storage state.

## Best practices

- **Use mocked UI tests by default**:
  - Intercept network via `page.route`/`context.route` and fulfill with realistic payloads from `src/mocks`.
  - Seed state via `APIRequestContext` or `storageState` fixtures for login.
- **Page Object Pattern**:
  - Locators and actions are defined in classes under `src/pages`; tests call methods, not raw selectors.
  - Keep assertions in tests; actions in page objects. Provide expectation helpers only if widely reused.
- **Selectors**:
  - Prefer accessible queries (`getByRole`, `getByLabel`, `getByText`). Fall back to `data-testid` when needed.
  - Avoid xPath and brittle CSS chains.
- **Flake mitigation**:
  - Rely on auto-wait; explicitly expect visibility before actions.
  - Avoid `waitForTimeout`; prefer expectation-based waits.
  - Reduce motion where possible; set sensible timeouts and retries in E2E only.
- **DRY**:
  - Reuse helpers and fixtures for login, navigation, and common flows.
  - Centralize mock payloads and route logic; avoid inline mocks in tests.

## Mocking strategy

- Place canonical mock payloads in `src/mocks`; expose factory functions to vary data deterministically.
- Default project (`ui-mocked`) registers global route handlers in a fixture so tests don’t duplicate route setup.
- Use `route.once` for ephemeral calls; `route.abort`/`fulfill` with justification when blocking calls.
- Keep mock contracts aligned with backend schemas; update mocks promptly on API changes.

## E2E strategy

- Reserve for critical flows (examples):
  - Sign-in and launch a new game
  - Make moves and verify game state persists
  - Profile update and confirmation
- Avoid cross-service complexity where possible; document prerequisites and test data.
- E2E runs in a separate project (`e2e-live`) and CI pipeline with retries and artifact collection.

## CI integration

- **Platform**: CI is run with GitHub Actions under `.github/workflows/`.
- **PR checks (fast feedback)**:
  - Run mocked UI tests: `npx playwright test --project ui-mocked`.
  - Run accessibility (A11Y) scans and visual regression verification against mocked responses for determinism.
  - Rationale: mocked tests are quick and stable due to static, controlled responses; they reduce flakiness and isolate frontend behavior.
- **Later-stage verification (higher fidelity)**:
  - Run E2E tests in a separate workflow (on `main`, scheduled, or pre-release) to validate critical functionality and external dependencies.
  - Keep these runs short and focused; enable retries and collect artifacts.

## Running tests

- **Install**:

```bash
npm install
```

- **Run mocked UI tests (default)**:

```bash
npx playwright test --project ui-mocked
```

- **Run E2E tests (critical flows)**:

```bash
npx playwright test --project e2e-live
```

- **Filter by title marker**:

```bash
npx playwright test -g "[ui]"  # or -g "[e2e]"
```

- **Open report**:

```bash
npx playwright show-report
```

## Configuration notes

- `playwright.config.ts` defines:
  - `baseURL` per project
  - `storageState` for authenticated tests (via auth fixture)
  - `retries`: 0 for `ui-mocked`, small number for `e2e-live`
  - `reporter`: html and junit as needed
- **Environment variables**:
  - `CHESS_BASE_URL`, `CHESS_API_URL`
  - Auth credentials or tokens only via secure secrets (never hardcode in tests)

## Contributing

- Add or update page objects and helpers rather than duplicating steps in tests.
- Adhere to `.cursor/rules` for selectors, mocks, assertions, and structure.
- Include realistic mock data changes when backend contracts change.
- Keep test titles descriptive and include markers “[ui]” or “[e2e]”.
- Update README and fixtures when introducing new flows.

## Coverage guidance

A feature can be considered covered when:

- It is fully exercised by an E2E test; or
- Critical paths are E2E, and variations are covered by mocked UI tests; or
- The feature is contained to a single frontend component and covered by component/unit tests (in the app repo).

## Appendix: Choosing between test types

- **Unit tests**: small logic, public functions, heavy mocking acceptable.
- **Component tests**: multiple units composed; minimize internal mocking.
- **UI tests**: cross-components user behavior with mocked backend; primary focus here.
- **E2E tests**: full user flows with live backend; few, critical, slower, run less often.

With these artifacts in place, contributors will have clear guidance for writing Playwright tests that are DRY, stable, and aligned with the Team Hyraxes testing strategy.