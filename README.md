# Plaguie — Web Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-brown)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-4-17202C?logo=cypress&logoColor=white)

Web frontend for **Plaguie**, an AgTech platform for agricultural pest management. The application provides role-based dashboards for administrators, agronomists, and sales technicians, integrating real-time weather data, client mapping, plague alert monitoring, and inventory management.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 + TypeScript 6 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 (utility-first, no CSS modules) |
| State management | Zustand 5 (with `persist` middleware) |
| Server state | TanStack Query v5 |
| Routing | React Router v7 |
| Auth | Firebase 12 Authentication → backend JWT exchange |
| HTTP | Axios (two instances — see [HTTP Layer](#http-layer)) |
| Component explorer | Storybook 10 |
| Unit tests | Vitest 4 + React Testing Library |
| E2E tests | Cypress 4 |
| CI/CD | Google Cloud Build → Artifact Registry → Cloud Run |

---

## Prerequisites

- **Node.js** ≥ 22 (matches Cloud Build runtime)
- **npm** ≥ 10
- A Firebase project with **Email/Password** authentication enabled
- Access to the Plaguie backend API (`VITE_API_URL`)
- A Google Maps Platform API key with the **Weather API** enabled (`VITE_GOOGLE_WEATHER_API_KEY`)

---

## Local Setup

### 1. Install dependencies

```bash
npm ci
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in all values:

```env
# Backend — base URL for all API calls
VITE_API_URL=http://localhost:8080

# Firebase — get values from Firebase Console > Project Settings
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Google Maps Platform — Weather API
VITE_GOOGLE_WEATHER_API_KEY=
```

> **Important:** All `VITE_*` variables are substituted at **build time** by Vite. They have no effect at runtime. Changing a value requires a new build.

### 3. Start the dev server

```bash
npm run dev   # http://localhost:5173
```

---

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 5173 with HMR |
| `npm run build` | Type-check (`tsc -b`) then produce a production `dist/` |
| `npm run lint` | Run ESLint across the entire codebase |
| `npm run preview` | Serve the production build locally |
| `npm run test` | Run unit tests once (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:coverage` | Run unit tests with V8 coverage report |
| `npm run cy:open` | Open Cypress interactive runner (requires dev server) |
| `npm run cy:run` | Run Cypress E2E headlessly (requires dev server) |
| `npm run storybook` | Start Storybook component explorer on port 6006 |
| `npm run build-storybook` | Build Storybook as a static site |

---

## Screen Inventory & Role-Based Routing

Three user roles are identified by a numeric `roleId`. Every protected route is guarded by `ProtectedRoute` in `src/components/ProtectedRoute/ProtectedRoute.tsx`; unauthenticated users are redirected to `/login` and authenticated users with the wrong role are sent to their default route via `getDefaultRoute()`.

| Screen file | Route | Role required | Description |
|---|---|---|---|
| `Login.tsx` | `/login` | Public | Email/password authentication form |
| `StatusPage.tsx` | `/status` | Public | System health check — polls `GET /api/status` every 30 s |
| `AdminLayout.tsx` | `/app` | Admin (`roleId: 1`) | Layout shell with green sidebar + `<Outlet />` |
| `AdminOverviewPanel.tsx` | `/app/dashboard` | Admin | Overview metrics dashboard |
| `Dashboard.tsx` | `/app/usuarios` | Admin | User management — create, edit, activate/deactivate users |
| `InventarioPanel.tsx` | `/app/inventario` | Admin | Global inventory management |
| `ValidacionPanel.tsx` | `/app/validacion` | Admin | Record validation |
| `DashboardsPanel.tsx` | `/app/dashboards` | Admin | Analytics dashboards |
| `AgricultorPanel.tsx` | `/agricultor` | Agricultor (`roleId: 2`) | Crop and pest monitoring |
| `SalesTechnicianLayout.tsx` | `/sales-technician` | Sales Tech (`roleId: 3`) | Layout shell with light sidebar + `<Outlet />` |
| `SalesTechnicianPanel.tsx` | `/sales-technician/inicio` | Sales Tech | Main panel — metrics, charts, maps |
| `VentasPanel.tsx` | `/sales-technician/ventas` | Sales Tech | Sales details |
| `ClientesPanel.tsx` | `/sales-technician/clientes` | Sales Tech | Client list |
| `ProductosPanel.tsx` | `/sales-technician/productos` | Sales Tech | Product and inventory management |
| `ReportesPanel.tsx` | `/sales-technician/reportes` | Sales Tech | Reports |

Both the Admin and Sales Technician roles use a **layout + outlet** pattern: the layout component owns the sidebar, and child routes render into the `<Outlet />`. Navigating between sections uses React Router `<Link>` components baked into the sidebar.

---

## Auth Flow

```
User submits credentials
        │
        ▼
Firebase Authentication
(signInWithEmailAndPassword)
        │
        ▼
  Firebase ID token
        │
        ▼
POST /api/auth/login   ← exchanges Firebase token for a backend JWT
        │
        ▼
Zustand useAuthStore   ← persists { user, token } to localStorage
        │                  key: "auth-storage"
        ▼
Axios backendClient    ← request interceptor injects
                          Authorization: Bearer <token>
                          automatically on every request
```

- **`src/services/auth/login.ts`** — orchestrates the Firebase → backend exchange
- **`src/services/Contexts/useAuthStore.ts`** — Zustand store with `persist` middleware
- Token is never passed manually to service functions; `backendClient`'s interceptor reads `useAuthStore.getState().token`

---

## HTTP Layer

All HTTP calls go through one of two Axios instances in `src/services/http/`:

| Instance | File | Base URL | Auth |
|---|---|---|---|
| `backendClient` | `backendClient.ts` | `VITE_API_URL` (default `http://localhost:8080`) | Request interceptor injects `Authorization: Bearer <token>` |
| `googleWeatherClient` | `googleWeatherClient.ts` | `https://weather.googleapis.com/v1` | Request interceptor appends `?key=VITE_GOOGLE_WEATHER_API_KEY` |

Both instances share a **response interceptor** that normalises error messages into a plain `Error`, so all callers can rely on `error.message`.

**Rules:**
- Never use raw `fetch` — always use the appropriate Axios instance
- Never import `useAuthStore` inside a service function just to read the token — the interceptor handles it
- `src/services/api.ts` is a legacy shim re-exporting `backendClient`; new code imports from `backendClient.ts` directly

### Service modules

| Module | Description |
|---|---|
| `src/services/auth/login.ts` | Firebase sign-in + backend JWT exchange |
| `src/services/admin/users.ts` | CRUD on users |
| `src/services/clients/clientLocationsService.ts` | Client lat/lng list |
| `src/services/weather/googleWeatherService.ts` | `currentConditions:lookup` per location |
| `src/services/plagueAlerts/plagueAlertsService.ts` | Plague alert list |
| `src/services/status/statusService.ts` | `GET /api/status` — no auth required |

> **Note:** The Google Weather API response is **flat** — fields `weatherCondition`, `temperature`, `relativeHumidity`, and `wind` are at the top level with no wrapper object.

---

## Design System

### Tokens

All design tokens live in `src/tokens/` and must be used instead of hardcoded values:

| File | Contents |
|---|---|
| `src/tokens/colors.ts` | Text, border, surface, brand green, and alert variants (`critico` / `advertencia` / `informacion`) |
| `src/tokens/typography.ts` | Font family (Inter), font sizes, weights, and line heights |

### Typography

Use `font-sans` (maps to Inter via Tailwind config). Never set `fontFamily` via an inline style.

### Tailwind conventions

- Tailwind utility classes are applied directly in JSX — no CSS modules, no `styled-components`
- **No inline `style={{ }}`** for visual properties; use Tailwind classes only
- For dynamic values that cannot be expressed as static Tailwind classes, set a CSS variable in `className` and reference it with the `(--var)` syntax:

```tsx
// ✓ Dynamic width via CSS variable
<div className={`h-2 rounded-full w-(--fill) [--fill:${fillWidth}%]`} />

// ✗ Never do this
<div style={{ width: `${fillWidth}%` }} />
```

### Component conventions

- Each component lives in its own **CamelCase** folder under `src/components/` (e.g. `src/components/Button/CustomButton.tsx`)
- Icons are inline SVG React components in `src/components/Icons/` and `src/components/Sidebar/SidebarIcons.tsx`
- Every component folder may include a `.stories.tsx` file for Storybook and a `.test.tsx` file for unit tests

---

## Testing

### Unit tests — Vitest + React Testing Library

Test files live alongside the components they test (`*.test.tsx`).

```bash
npm run test            # single run
npm run test:watch      # watch mode
npm run test:coverage   # coverage report (threshold: 80%)
```

**Coverage threshold:** 80% on lines, functions, branches, and statements.

**Conventions:**
- Import from `vitest`: `import { describe, it, expect, vi } from 'vitest'`
- Mock services with `vi.mock(...)` — never hit the real network in unit tests
- Every component must have at least one assertion on a `data-testid`

### E2E tests — Cypress

Spec files live in `cypress/e2e/`. The dev server must be running on port 5173.

```bash
npm run cy:open   # interactive
npm run cy:run    # headless
```

**Covered flows:**

| Spec | Flow |
|---|---|
| `01-login.cy.ts` | Login form structure and field interaction |
| `02-sales-technician-panel.cy.ts` | Panel renders metric cards for the sales technician role |
| `03-weather-modal.cy.ts` | Weather modal opens and closes from the map card |
| `04-plague-alerts-modal.cy.ts` | Plague alerts modal opens, shows cards, closes |
| `05-role-redirects.cy.ts` | Unauthenticated users are redirected to `/login` |

Auth state for Cypress is seeded by writing to `localStorage` key `auth-storage` before `cy.visit()`.

---

## CI/CD Pipeline

The pipeline is defined in `cloudbuild.yaml` and runs on **Google Cloud Build** (`E2_HIGHCPU_8`).

```
Push a Git tag (e.g. v1.2.0)
        │
        ▼
1. install     npm ci (Cypress/Playwright binaries skipped)
        │
        ▼
2. lint        ESLint — fails the build on any error
        │
        ▼
3. build       Vite production build
               VITE_* secrets injected from Secret Manager
        │
        ▼
4. docker      Build nginx:1.27-alpine image from pre-built dist/
               Push to Artifact Registry (~50 MB image)
        │
        ▼
5. deploy      gcloud run deploy → Cloud Run (us-central1, port 8080)
```

**Key rules:**
- `VITE_*` variables are baked into the bundle at step 3 — never pass them as Cloud Run env vars
- Secrets are stored in **Secret Manager**; never commit `.env` files
- The Dockerfile copies only `dist/` into the nginx image — it does not run `npm install` or `npm run build`
- The nginx port is hardcoded to **8080** to match Cloud Run's default

### Triggering a deployment

```bash
# Production release
git tag v1.2.0 && git push origin v1.2.0

# Manual build (requires gcloud CLI)
gcloud builds submit --config=cloudbuild.yaml --project=plaguie-494022
```

For full IAM setup, Secret Manager configuration, and a secrets reference table, see [CI_CD.md](CI_CD.md).
