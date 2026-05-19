 CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
npm run dev            # Start dev server (Vite, port 5173)
npm run build          # Type-check + build for production
npm run lint           # Run ESLint
npm run test           # Run unit tests once (Vitest)
npm run test:watch     # Run unit tests in watch mode
npm run test:coverage  # Run unit tests with coverage report
npm run cy:open        # Open Cypress interactive runner (requires dev server)
npm run cy:run         # Run Cypress E2E headlessly (requires dev server)
npm run storybook      # Start Storybook on port 6006
npm run build-storybook  # Build Storybook static output
```

### CI/CD

The pipeline is defined in `cloudbuild.yaml` and runs on Google Cloud Build. See [docs/CI_CD.md](docs/CI_CD.md) for full setup instructions.

```bash
# Trigger a production deployment by pushing a Git tag
git tag v1.2.0 && git push origin v1.2.0

# Trigger a manual build (requires gcloud CLI)
gcloud builds submit --config=cloudbuild.yaml --project=plaguie-494022
```

---

## Architecture

**Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Zustand + React Router v7 + Firebase + TanStack Query v5 + Axios

### Screens Inventory

All screens live under `src/screens/`. Names are CamelCase English.

| Screen file | Route | Auth required | Description |
|---|---|---|---|
| `Login.tsx` | `/login` | No | Authentication form |
| `StatusPage.tsx` | `/status` | No | System health check — polls `GET /api/status` every 30 s |
| `Dashboard.tsx` | `/app` | Admin (1) | Admin metrics, user management |
| `AgricultorPanel.tsx` | `/agricultor` | Agricultor (2) | Crop and pest monitoring |
| `SalesTechnicianLayout.tsx` | `/sales-technician` | Sales Tech (3) | Layout wrapper with nested outlet |
| `SalesTechnicianPanel.tsx` | `/sales-technician/inicio` | Sales Tech (3) | Main panel — metrics, charts, maps |
| `VentasPanel.tsx` | `/sales-technician/ventas` | Sales Tech (3) | Sales details |
| `ClientesPanel.tsx` | `/sales-technician/clientes` | Sales Tech (3) | Client list |
| `ProductosPanel.tsx` | `/sales-technician/productos` | Sales Tech (3) | Product/inventory management |
| `ReportesPanel.tsx` | `/sales-technician/reportes` | Sales Tech (3) | Reports |

### Routing & Role-Based Access

Routes are defined in `src/main.tsx`. Three user roles exist with numeric IDs:
- `1` → Admin → `/app` (`Dashboard.tsx`)
- `2` → Agricultor → `/agricultor` (`AgricultorPanel.tsx`)
- `3` → Sales Technician → `/sales-technician` (nested under `SalesTechnicianLayout.tsx`)

`ProtectedRoute` in `src/components/ProtectedRoute/ProtectedRoute.tsx` guards each route by `allowedRoles`. Unauthenticated users go to `/login`; authenticated users with the wrong role are redirected to their default route via `getDefaultRoute()`.

The Sales Technician role uses a layout+outlet pattern (`SalesTechnicianLayout` wraps `SalesTechnicianPanel`, `VentasPanel`, `ClientesPanel`, `ProductosPanel`, `ReportesPanel`).

### Auth Flow

Login authenticates through Firebase first (`src/services/firebase/firebaseLogin.ts` → `signInWithEmailAndPassword`), then exchanges the Firebase token for a backend JWT via `POST /api/auth/login`. Both the `User` object and Firebase token are persisted with Zustand's `persist` middleware (localStorage key: `auth-storage`) — see `src/services/Contexts/useAuthStore.ts`.

---

## HTTP Layer — Axios Instances

All HTTP calls go through one of two Axios instances in `src/services/http/`:

| Instance | File | Target | Auth |
|---|---|---|---|
| `backendClient` | `backendClient.ts` | `VITE_API_URL` (default `http://localhost:8080`) | Request interceptor reads `useAuthStore.getState().token` and injects `Authorization: Bearer` automatically |
| `googleWeatherClient` | `googleWeatherClient.ts` | `https://weather.googleapis.com/v1` | Request interceptor appends `?key=VITE_GOOGLE_WEATHER_API_KEY` to every request |

Both instances have a **response interceptor** that normalises error messages into a plain `Error` so all callers can rely on `error.message`.

**Rules:**
- Never use raw `fetch` — always use the appropriate Axios instance.
- Never pass `token` manually to service functions — `backendClient`'s interceptor handles it.
- `src/services/api.ts` is a legacy shim that re-exports `backendClient`; new code imports from `src/services/http/backendClient.ts` directly.

**Service modules by domain:**
- `src/services/auth/login.ts` — Firebase sign-in → backend JWT exchange
- `src/services/admin/users.ts` — CRUD on users (uses `backendClient`)
- `src/services/clients/clientLocationsService.ts` — client lat/lng list (mocked; TODO: swap to real `backendClient.get('/api/clients/locations')` when endpoint is deployed)
- `src/services/weather/googleWeatherService.ts` — `currentConditions:lookup` per location via `googleWeatherClient`; response is **flat** (no wrapper object)
- `src/services/plagueAlerts/plagueAlertsService.ts` — mocked; TODO: replace with `backendClient`
- `src/services/status/statusService.ts` — `GET /api/status`; returns `{ status, database, service, timestamp }`; used by the public `/status` page; no auth token needed

---

## TanStack Query

`QueryClient` is created in `src/main.tsx` (default `staleTime: 5 min`, `retry: 2`) and provided via `<QueryClientProvider>`. `<ReactQueryDevtools>` is mounted in development.

**Conventions:**
- All server state (API fetches) must go through TanStack Query — no raw `useEffect` + `useState` for data fetching.
- Custom hooks live in `src/hooks/`. Name them `use<Resource>` (e.g. `useClientLocations`, `useWeatherData`).
- Query keys follow `[resource, ...params]` e.g. `['weather', lat, lng]`, `['client-locations']`.
- Use `useQuery` for single resources, `useQueries` for parallel fetches over a list.
- Refresh UI data by calling `queryClient.invalidateQueries({ queryKey: [...] })` — never manually re-fetch.
- `staleTime` should reflect how often the data changes: 10 min for weather/locations, 1 min or less for user-action-driven data.

---

## Design Tokens

All tokens live in `src/tokens/`. Import and use them in new components — never hardcode raw values if a token exists.

| File | Contents |
|---|---|
| `src/tokens/colors.ts` | Text, border, surface, brand green, and alert variants (`critico`/`advertencia`/`informacion`) |
| `src/tokens/typography.ts` | Font family (Inter), font sizes, weights, and line heights |

---

## Component Conventions

- Each component lives in its own **CamelCase** folder under `src/components/` (e.g. `src/components/Button/CustomButton.tsx`)
- Many folders include a `.stories.tsx` file for Storybook/testing
- Some folders export via `index.ts` barrel files
- Sidebar has two theme variants: `Sidebar.tsx` (green, admin) and `SidebarClaro.tsx` (light, sales tech)
- Icons are inline SVG React components in `src/components/Icons/`
- **Tailwind classes are used directly in JSX — no CSS modules and no inline `style={{}}` for visual properties**

### No Inline Styles Rule

Never use `style={{ property: value }}` to set visual properties. Use Tailwind classes only.

For **dynamic values** that cannot be expressed as static Tailwind classes (runtime percentages, arbitrary colors, pixel heights):

```tsx
// ✅ Correct — set CSS variable in className, reference it with (--var) syntax
<div className={`h-2 rounded-full w-(--fill) [--fill:${fillWidth}%]`} />

// ✅ Correct for rgba computed values — CSS var setter via style is acceptable only when the value needs JS computation (e.g. hexToRgba)
<span className="text-(--badge-color) bg-(--badge-bg) [--badge-color:${color}] [--badge-bg:${bg}]" />

// ❌ Never do this
<div style={{ width: `${fillWidth}%` }} />
```

Tailwind v4 canonical syntax for CSS variable references: `text-(--var)` not `text-[var(--var)]`.

---

## Testing

### Unit Tests (Vitest + React Testing Library)

- Test files: `src/**/*.test.{ts,tsx}` — co-located with the component they test
- Run: `npm test`
- Coverage threshold: **80%** on lines, functions, branches, and statements
- Setup file: `src/test/setup.ts` (imports `@testing-library/jest-dom`)
- Vitest is used instead of Jest because the project uses Vite + ESM (`"type": "module"`). The API is identical — `describe`, `it`, `expect`, `vi` (instead of `jest`).

**Conventions:**
- Import from `vitest`: `import { describe, it, expect, vi } from 'vitest'`
- Import RTL: `import { render, screen } from '@testing-library/react'`
- Every component must have at least one test asserting `data-testid` is present
- Mock services with `vi.mock(...)` — never hit the real network in unit tests

### E2E Tests (Cypress)

- Spec files: `cypress/e2e/**/*.cy.ts`
- Run interactively: `npm run cy:open` (requires `npm run dev` running on port 5173)
- Run headlessly: `npm run cy:run`
- Config: `cypress.config.ts` — baseUrl is `http://localhost:5173`

**5 covered flows:**
1. `01-login.cy.ts` — Login form structure and field interaction
2. `02-sales-technician-panel.cy.ts` — Panel renders cards for sales technician role
3. `03-weather-modal.cy.ts` — Weather modal opens and closes from map card
4. `04-plague-alerts-modal.cy.ts` — Plague alerts modal opens, shows cards, closes
5. `05-role-redirects.cy.ts` — Unauthenticated users are redirected to `/login`

**Seed auth state for Cypress tests** by writing to `localStorage` key `auth-storage` before `cy.visit()` (see specs 02–04 for pattern).

### data-testid Rules

Every interactive or meaningful rendered element must have a `data-testid`. Standard IDs used in this project:

| Component | `data-testid` |
|---|---|
| `PlagueAlertCard` | `plague-alert-card` |
| `PlagueAlertsModal` | `plague-alerts-modal` |
| `WeatherModal` | `weather-modal` |
| `MetricCard` (all variants) | `metric-card` |
| `WarningMetricCard` | `warning-metric-card` |
| `MapCard` | `map-card` |
| `SalesChartCard` | `sales-chart-card` |
| `InventoryTableRow` | `inventory-table-row` |
| `CategoryBadge` | `category-badge` |
| `InputField` | `input-{type}` (e.g. `input-email`) |
| Login form | `login-form` |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values. All variables must be prefixed `VITE_` to be accessible in the browser.

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend base URL (defaults to `http://localhost:8080`) |
| `VITE_FIREBASE_*` | Firebase project config |
| `VITE_GOOGLE_WEATHER_API_KEY` | Google Maps Platform — Weather API |

> **Important:** `VITE_*` variables are replaced by their literal values at `npm run build` time (Vite build-time substitution). They are **not** read at runtime. Changing a value requires a new build and a new deployment. In Cloud Build, these values come from Secret Manager — see [CI_CD.md](CI_CD.md).

---

## CI/CD

| File | Purpose |
|---|---|
| `cloudbuild.yaml` | Google Cloud Build pipeline: install → lint → build → docker → deploy |
| `Dockerfile` | Runtime image — `nginx:1.27-alpine` serving the pre-built `dist/` (~50 MB) |
| `nginx.conf` | SPA routing (`try_files`), port 8080, asset caching, security headers, gzip |
| `.dockerignore` | Keeps the Docker build context small — excludes `node_modules/`, `src/`, config |

**Key rules for agents working on this repo:**
- Never add `VITE_*` variables to Cloud Run env var flags — they are build-time only and have no effect at runtime.
- Never commit `.env` files — secrets live in Secret Manager.
- The Docker image is built from the pre-built `dist/` (same pattern as the backend). The Dockerfile does not run `npm install` or `npm run build`.
- The nginx port is hardcoded to **8080** to match Cloud Run's default. Do not change it without also updating `--port` in the deploy step.
- Full setup instructions, IAM grants, and a secrets reference table are in [CI_CD.md](CI_CD.md).

---

## Additional Notes

- **Google Weather API response is flat** — fields `weatherCondition`, `temperature`, `relativeHumidity`, `wind` are at the top level of the response (no `currentConditions` wrapper).
- **Zustand outside React** — `useAuthStore.getState()` works in Axios interceptors; never pass `token` as a function argument.
- **Fast Refresh** — each file must export only one React component or move non-component exports to separate files (ESLint enforces this).
- **Typography** — use `font-sans` (maps to Inter via Tailwind config); never set `fontFamily` via inline style.
