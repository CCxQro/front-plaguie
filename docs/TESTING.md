# Testing Guide

This document explains how the test suite is organized, how to run it, and how to write new tests.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Unit Tests](#unit-tests)
3. [E2E Tests (Cypress)](#e2e-tests-cypress)
4. [Writing New Tests](#writing-new-tests)

---

## Prerequisites

Install dependencies before running anything:

```bash
npm install
```

---

## Unit Tests

Unit tests use **Vitest** as the test runner and **React Testing Library** to render and query components. They run in a simulated browser environment (jsdom) — no real browser or server required.

### Run commands

```bash
npm test                # run all unit tests once and exit
npm run test:watch      # re-run on every file save (use during development)
npm run test:coverage   # run once and print a coverage report
```

### Where tests live

Test files are co-located with the component they cover, named `ComponentName.test.tsx`:

```
src/
  components/
    PlagueAlertCard/
      PlagueAlertCard.tsx        ← component
      PlagueAlertCard.test.tsx   ← its tests
    CategoryBadge/
      CategoryBadge.tsx
      CategoryBadge.test.tsx
    ...
```

### Coverage threshold

The project requires **80% coverage** on lines, functions, branches, and statements. The `npm run test:coverage` command will fail if any threshold is not met.

### How a test file works

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PlagueAlertCard } from './PlagueAlertCard';

describe('PlagueAlertCard', () => {
  it('renders the title', () => {
    render(<PlagueAlertCard variant="critico" titulo="Plaga detectada" ... />);
    expect(screen.getByText('Plaga detectada')).toBeInTheDocument();
  });
});
```

- `render()` mounts the component into a fake DOM.
- `screen.getByText()`, `screen.getByTestId()`, etc. query what is rendered.
- `expect(...).toBeInTheDocument()` and similar matchers come from `@testing-library/jest-dom`, which is loaded automatically via `src/test/setup.ts`.

### Mocking services

Tests never hit real APIs. Use `vi.mock()` to replace a service module with a controlled fake:

```tsx
vi.mock('../../services/plagueAlerts/plagueAlertsService', () => ({
  plagueAlertsService: {
    getAlerts: vi.fn().mockResolvedValue({
      timestamp: new Date().toISOString(),
      alerts: [{ variant: 'critico', titulo: 'Test', ... }],
    }),
  },
}));
```

---

## E2E Tests (Cypress)

Cypress tests run against the **real running application** in a real Chromium browser. They simulate what an actual user does: visit a page, click buttons, fill in fields, and verify what appears on screen.

### Step 1 — Start the dev server

Cypress needs the app to be running. Open a terminal and start it:

```bash
npm run dev
```

Wait until the terminal shows:

```
Local: http://localhost:5173/
```

Keep this terminal open while running Cypress.

### Step 2 — Run Cypress

Open a **second terminal** and choose one of the two modes:

#### Interactive mode (recommended for development)

```bash
npm run cy:open
```

This opens the Cypress app. From there:

1. Click **E2E Testing**.
2. Choose **Chromium** as the browser.
3. Click any spec file to run it.

You will see the browser execute each step live. Click any command in the left panel to inspect exactly what the DOM looked like at that moment.

#### Headless mode (for CI or a quick full run)

```bash
npm run cy:run
```

Runs all specs in the terminal with no GUI. A summary table is printed at the end, and videos of each spec are saved to `cypress/videos/`.

### Where specs live

```
cypress/
  e2e/
    01-login.cy.ts                    ← login form structure and input interaction
    02-sales-technician-panel.cy.ts   ← sales technician panel renders correctly
    03-weather-modal.cy.ts            ← weather modal opens and closes
    04-plague-alerts-modal.cy.ts      ← plague alerts modal opens, shows cards, closes
    05-role-redirects.cy.ts           ← unauthenticated users are redirected to /login
  support/
    e2e.ts       ← runs before every spec automatically
    commands.ts  ← place for shared custom cy.* commands
cypress.config.ts  ← base URL and spec pattern configuration
```

### How a spec file works

```ts
describe('Weather Modal', () => {
  beforeEach(() => {
    // Seed a fake authenticated session so ProtectedRoute lets us through
    window.localStorage.setItem('auth-storage', JSON.stringify({
      state: {
        user: { id: '1', name: 'Demo', email: 'demo@demo.com', roleId: 3 },
        token: 'mock-token',
        isAuthenticated: true,
      },
      version: 0,
    }));

    cy.visit('/sales-technician');  // navigate to the page
  });

  it('opens the modal when clicking the map card', () => {
    cy.contains('Ver mapa completo').first().click();           // interact
    cy.get('[data-testid="weather-modal"]').should('exist');    // assert
  });

  it('closes the modal when the close button is clicked', () => {
    cy.contains('Ver mapa completo').first().click();
    cy.get('[aria-label="Cerrar modal"]').first().click();
    cy.get('[data-testid="weather-modal"]').should('not.exist');
  });
});
```

### Why the auth seed is needed

The app uses `ProtectedRoute`, which redirects any unauthenticated user to `/login`. Cypress tests that need to visit a protected route write a fake auth object into `localStorage` under the key `auth-storage` (the same key Zustand's `persist` middleware uses). When the page loads, Zustand restores that state and the app behaves as if the user is logged in.

Specs that test the redirect behavior (`05-role-redirects.cy.ts`) intentionally call `cy.clearLocalStorage()` first so there is no session.

### data-testid reference

Cypress selects elements using `cy.get('[data-testid="..."]')`. The IDs used in this project are:

| Element | `data-testid` |
|---|---|
| Login form | `login-form` |
| Email input | `input-email` |
| Password input | `input-password` |
| Weather modal | `weather-modal` |
| Plague alerts modal | `plague-alerts-modal` |
| Plague alert card | `plague-alert-card` |
| Metric card | `metric-card` |
| Warning metric card | `warning-metric-card` |
| Map card | `map-card` |
| Sales chart card | `sales-chart-card` |
| Inventory table row | `inventory-table-row` |
| Category badge | `category-badge` |

---

## Writing New Tests

### New unit test

1. Create `YourComponent.test.tsx` next to `YourComponent.tsx`.
2. Import from `vitest` and `@testing-library/react`.
3. Always include a test that verifies the `data-testid` is present.
4. Mock any service calls with `vi.mock()`.

### New Cypress spec

1. Create a file in `cypress/e2e/` following the naming convention `##-description.cy.ts`.
2. If the page is protected, seed localStorage with the auth object in `beforeEach`.
3. Use `cy.get('[data-testid="..."]')` to select elements — never rely on text alone for structural assertions, as copy can change.
4. Start the dev server before running (`npm run dev`).
