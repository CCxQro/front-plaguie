# Authentication & Zustand State Management

This document describes the complete authentication flow, the Zustand store that backs it, and every place in the codebase that reads or writes auth state.

---

## Table of Contents

1. [Architecture overview](#1-architecture-overview)
2. [The Zustand auth store](#2-the-zustand-auth-store)
3. [Login flow](#3-login-flow)
4. [Token injection (Axios interceptor)](#4-token-injection-axios-interceptor)
5. [Route protection](#5-route-protection)
6. [Mid-session deactivation (403 handling)](#6-mid-session-deactivation-403-handling)
7. [Login screen error handling](#7-login-screen-error-handling)
8. [Logout](#8-logout)
9. [Data flow diagram](#9-data-flow-diagram)
10. [File reference](#10-file-reference)

---

## 1. Architecture overview

Authentication in Plaguie uses a **two-token handshake**:

1. Firebase authenticates the user's credentials and issues a **Firebase ID token** (JWT).
2. The frontend sends that token to the backend, which validates it and returns a **backend `User` object** with application-level data (name, email, `roleId`).

The Firebase token is what the backend expects on every subsequent request. The backend `User` object (not Firebase's user) is what the frontend stores and reads for role-based decisions.

Both pieces — the `User` object and the Firebase token — are stored together in a single **Zustand store** with `localStorage` persistence.

---

## 2. The Zustand auth store

**File:** [`src/services/Contexts/useAuthStore.ts`](src/services/Contexts/useAuthStore.ts)

```ts
interface AuthState {
  user: User | null;       // Backend User object { name, email, roleId }
  token: string | null;    // Firebase ID token (sent as Bearer on every request)
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}
```

### Persistence

The store uses Zustand's `persist` middleware. The entire state is serialised to `localStorage` under the key **`auth-storage`**.

```ts
persist(/* store definition */, { name: 'auth-storage' })
```

This means a page refresh does **not** log the user out — the store rehydrates from `localStorage` automatically on app load.

### Actions

| Action | What it does |
|---|---|
| `login(user, token)` | Sets `user`, `token`, and `isAuthenticated: true` |
| `logout()` | Clears all three fields back to their null/false defaults |

### Reading state outside React

Because this is a Zustand store, state can be read **without a hook** using:

```ts
useAuthStore.getState().token
useAuthStore.getState().logout()
```

This is intentionally used in two places that live outside the React tree: the Axios request interceptor and the Axios response interceptor (see §4 and §6).

---

## 3. Login flow

**Files involved:**
- [`src/screens/Login.tsx`](src/screens/Login.tsx) — form and error display
- [`src/services/auth/login.ts`](src/services/auth/login.ts) — orchestrates the two-step handshake
- [`src/services/firebase/firebaseLogin.ts`](src/services/firebase/firebaseLogin.ts) — Firebase step
- [`src/services/firebase/firebaseAuth.ts`](src/services/firebase/firebaseAuth.ts) — Firebase app/auth instance

### Step-by-step

```
User submits form
      │
      ▼
firebaseLogin(email, password)
  └─ signInWithEmailAndPassword(auth, email, password)
  └─ user.getIdToken()          → firebaseToken (JWT string)
      │
      ▼
backendClient.post('/api/auth/login', { firebaseToken })
  └─ Backend validates Firebase token with Firebase Admin SDK
  └─ Returns { name, email, roleId } as the backend User object
      │
      ▼
authLogin(user, token)          ← writes to Zustand store
      │
      ▼
navigate(getDefaultRoute(user.roleId))
```

### Role-based redirect after login

`getDefaultRoute` (in [`src/components/ProtectedRoute/routes.ts`](src/components/ProtectedRoute/routes.ts)) maps `roleId` to the entry route:

| roleId | Route |
|---|---|
| 1 (Admin) | `/app` |
| 2 (Agricultor) | `/agricultor` |
| 3 (Sales Technician) | `/sales-technician` |
| unknown | `/login` |

### Login error handling

Errors thrown during login are caught in `handleSubmit` in `Login.tsx`. Two cases are distinguished:

| Backend error message | Displayed message |
|---|---|
| `"La cuenta de usuario está desactivada"` | "Tu cuenta ha sido desactivada. Contacta a un administrador." |
| Any other error | "Correo o contraseña incorrectos. Inténtalo de nuevo." |

The error banner renders inside the form with `role="alert"` and `data-testid="login-error"`.

---

## 4. Token injection (Axios interceptor)

**File:** [`src/services/http/backendClient.ts`](src/services/http/backendClient.ts)

Every request made through `backendClient` automatically carries the Firebase token:

```ts
backendClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Key rules enforced by `CLAUDE.md`:
- **Never pass `token` as a function argument** to service functions — the interceptor handles it.
- **Never use raw `fetch`** — always go through `backendClient` so the interceptor runs.

---

## 5. Route protection

**File:** [`src/components/ProtectedRoute/ProtectedRoute.tsx`](src/components/ProtectedRoute/ProtectedRoute.tsx)

`ProtectedRoute` wraps every authenticated route in `main.tsx`. It reads `user` and `isAuthenticated` from the Zustand store and applies two guards:

```
isAuthenticated === false  →  redirect to /login
user.roleId not in allowedRoles  →  redirect to getDefaultRoute(user.roleId)
```

Usage in `main.tsx`:

```tsx
<Route path="/app" element={
  <ProtectedRoute allowedRoles={[1]}>
    <AdminLayout />
  </ProtectedRoute>
}>

<Route path="/agricultor" element={
  <ProtectedRoute allowedRoles={[2]}>
    <AgricultorPanel />
  </ProtectedRoute>
} />

<Route path="/sales-technician" element={
  <ProtectedRoute allowedRoles={[3]}>
    <SalesTechnicianLayout />
  </ProtectedRoute>
}>
```

### Unknown routes

[`src/components/DefaultRedirect/DefaultRedirect.tsx`](src/components/DefaultRedirect/DefaultRedirect.tsx) handles the `path="*"` catch-all:

- Authenticated user → `getDefaultRoute(user.roleId)`
- Unauthenticated user → `/login`

---

## 6. Mid-session deactivation (403 handling)

**File:** [`src/services/http/backendClient.ts`](src/services/http/backendClient.ts)

If an admin deactivates a user's account while they are logged in, all subsequent API calls return **HTTP 403**. The response interceptor catches this globally:

```ts
if (error.response?.status === 403) {
  useAuthStore.getState().logout();          // clears Zustand + localStorage
  sessionStorage.setItem(
    'login-flash',
    'Tu sesión ha finalizado. Tu cuenta puede haber sido desactivada.',
  );
  window.location.replace('/login');         // hard redirect
  return new Promise(() => {});              // swallow the error; caller never resolves
}
```

The flash message is stored in `sessionStorage` (survives the redirect but not subsequent navigations). The Login screen reads and clears it on first render via a lazy `useState` initializer:

```ts
const [errorMessage, setErrorMessage] = useState(() => {
  const flash = sessionStorage.getItem('login-flash');
  if (flash) {
    sessionStorage.removeItem('login-flash');
    return flash;
  }
  return '';
});
```

---

## 7. Login screen error handling

**File:** [`src/screens/Login.tsx`](src/screens/Login.tsx)

```
Component mounts
  └─ lazy useState reads sessionStorage('login-flash')
       └─ if present: display it, remove from sessionStorage

User submits form
  └─ setErrorMessage('')     (clears any prior error)
  └─ login(email, password)
       └─ success → authLogin(user, token) → navigate(defaultRoute)
       └─ error →
            msg === DEACTIVATED_ACCOUNT_ERROR
              → "Tu cuenta ha sido desactivada. Contacta a un administrador."
            else
              → "Correo o contraseña incorrectos. Inténtalo de nuevo."
```

The error banner: `data-testid="login-error"`, `role="alert"`, only rendered when `errorMessage` is non-empty.

---

## 8. Logout

There is no dedicated logout screen or button currently in the UI. The `logout` action is called in two situations:

| Trigger | Called by |
|---|---|
| HTTP 403 on any API call | `backendClient` response interceptor |
| (Future) explicit logout button | Would call `useAuthStore.getState().logout()` or `const logout = useAuthStore(s => s.logout)` in a component |

`logout()` sets `user: null`, `token: null`, `isAuthenticated: false`. Because the store is persisted, Zustand's `persist` middleware also clears the `auth-storage` key in `localStorage`.

---

## 9. Data flow diagram

```
┌──────────────┐    email+password     ┌─────────────────────┐
│  Login.tsx   │──────────────────────▶│  firebaseLogin.ts   │
└──────────────┘                       │  (Firebase SDK)     │
       │                               └──────────┬──────────┘
       │                                          │ firebaseToken (JWT)
       │                               ┌──────────▼──────────┐
       │                               │  login.ts           │
       │                               │  POST /api/auth/login│
       │                               └──────────┬──────────┘
       │                                          │ { user, token }
       │◀─────────────────────────────────────────┘
       │
       │  authLogin(user, token)
       ▼
┌─────────────────────────────────────────────────┐
│              useAuthStore (Zustand)              │
│  user | token | isAuthenticated                  │
│  persisted → localStorage['auth-storage']        │
└────┬───────────────────────┬────────────────────┘
     │                       │
     │ getState().token       │ useAuthStore() hook
     ▼                       ▼
┌──────────────┐    ┌─────────────────────┐
│backendClient │    │  ProtectedRoute     │
│request       │    │  DefaultRedirect    │
│interceptor   │    │  any component      │
│(auto Bearer) │    └─────────────────────┘
└──────┬───────┘
       │ 403 response
       ▼
  logout() + sessionStorage flash + window.location.replace('/login')
```

---

## 10. File reference

| File | Role |
|---|---|
| [`src/services/Contexts/useAuthStore.ts`](src/services/Contexts/useAuthStore.ts) | Zustand store definition and persistence |
| [`src/types/User.ts`](src/types/User.ts) | `User` interface (`name`, `email`, `roleId`) |
| [`src/services/auth/login.ts`](src/services/auth/login.ts) | Two-step login orchestration |
| [`src/services/firebase/firebaseLogin.ts`](src/services/firebase/firebaseLogin.ts) | Firebase `signInWithEmailAndPassword` + `getIdToken` |
| [`src/services/firebase/firebaseAuth.ts`](src/services/firebase/firebaseAuth.ts) | Firebase app/auth singleton |
| [`src/services/http/backendClient.ts`](src/services/http/backendClient.ts) | Axios instance — token injection + 403 handler |
| [`src/screens/Login.tsx`](src/screens/Login.tsx) | Login form, error display, flash message consumer |
| [`src/components/ProtectedRoute/ProtectedRoute.tsx`](src/components/ProtectedRoute/ProtectedRoute.tsx) | Route guard (isAuthenticated + roleId check) |
| [`src/components/ProtectedRoute/routes.ts`](src/components/ProtectedRoute/routes.ts) | `getDefaultRoute(roleId)` mapping |
| [`src/components/DefaultRedirect/DefaultRedirect.tsx`](src/components/DefaultRedirect/DefaultRedirect.tsx) | Catch-all route handler |
| [`src/main.tsx`](src/main.tsx) | Route tree — where `ProtectedRoute` is applied |
