# CI/CD Pipeline

This document explains the continuous integration and delivery setup for the Plaguie frontend. The pipeline runs on **Google Cloud Build** and deploys to **Google Cloud Run**.

---

## Table of Contents

1. [Overview](#overview)
2. [Pipeline Steps](#pipeline-steps)
3. [Required Secrets in Secret Manager](#required-secrets-in-secret-manager)
4. [Cloud Build Substitutions](#cloud-build-substitutions)
5. [Files in This Repo](#files-in-this-repo)
6. [How to Set Up From Scratch](#how-to-set-up-from-scratch)
7. [How to Trigger a Deployment](#how-to-trigger-a-deployment)
8. [Why VITE_* Variables Are Baked Into the Build](#why-vite_-variables-are-baked-into-the-build)
9. [Docker Image Details](#docker-image-details)

---

## Overview

```
GitHub push / tag
       │
       ▼
 Cloud Build trigger
       │
       ├─ 1. npm ci          (install, skip browser binaries)
       ├─ 2. npm run lint     (ESLint — fails on error)
       ├─ 3. npm run build    (Vite — VITE_* secrets injected from Secret Manager)
       ├─ 4. docker build     (nginx:alpine + dist/ → ~50 MB image)
       │     docker push      (Artifact Registry — :<version> and :latest)
       └─ 5. gcloud run deploy (Cloud Run — versioned image, port 8080)
```

There is **no Node.js at runtime**. The Vite build produces a static `dist/` folder that is served by `nginx:alpine` inside Cloud Run.

---

## Pipeline Steps

| Step | Tool | What it does |
|---|---|---|
| `install` | `node:22-alpine` | `npm ci` — reproducible install, skips Cypress/Playwright browser downloads |
| `lint` | `node:22-alpine` | `npm run lint` — ESLint check, fails the pipeline on any error |
| `build` | `node:22-alpine` | `npm run build` — Vite production build with `VITE_*` secrets injected |
| `build-and-push` | `gcr.io/cloud-builders/docker` | Builds `nginx:alpine` image from pre-built `dist/`, pushes two tags to Artifact Registry |
| `deploy` | `cloud-sdk` | Deploys the versioned image to the Cloud Run service |

---

## Required Secrets in Secret Manager

These secrets must exist in **Google Cloud Secret Manager** under the project `plaguie-494022` before the pipeline can run. Create each one via the Cloud Console or `gcloud`.

> **Important:** `VITE_*` variables are embedded into the JavaScript bundle at build time. If a value changes, the pipeline must be re-run to produce a new bundle. See [Why VITE_* Variables Are Baked Into the Build](#why-vite_-variables-are-baked-into-the-build).

### Create a secret

```bash
echo -n "YOUR_VALUE" | gcloud secrets create SECRET_NAME \
  --data-file=- \
  --project=plaguie-494022
```

### Update an existing secret (add a new version)

```bash
echo -n "YOUR_NEW_VALUE" | gcloud secrets versions add SECRET_NAME \
  --data-file=- \
  --project=plaguie-494022
```

### Secret names and what they map to

| Secret Manager name | `.env` variable | Where to get it |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | `VITE_FIREBASE_API_KEY` | Firebase Console → Project Settings → General → Your apps → Web app |
| `VITE_FIREBASE_AUTH_DOMAIN` | `VITE_FIREBASE_AUTH_DOMAIN` | Same as above |
| `VITE_FIREBASE_PROJECT_ID` | `VITE_FIREBASE_PROJECT_ID` | Same as above |
| `VITE_FIREBASE_STORAGE_BUCKET` | `VITE_FIREBASE_STORAGE_BUCKET` | Same as above |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Same as above |
| `VITE_FIREBASE_APP_ID` | `VITE_FIREBASE_APP_ID` | Same as above |
| `VITE_GOOGLE_WEATHER_API_KEY` | `VITE_GOOGLE_WEATHER_API_KEY` | Google Cloud Console → APIs & Services → Credentials |

### Grant Cloud Build access to secrets

Cloud Build's service account must have the `Secret Manager Secret Accessor` role:

```bash
gcloud projects add-iam-policy-binding plaguie-494022 \
  --member="serviceAccount:$(gcloud projects describe plaguie-494022 --format='value(projectNumber)')@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## Cloud Build Substitutions

These are set in `cloudbuild.yaml` under `substitutions`. You can override any of them per-trigger in the Cloud Build console without changing the file.

| Substitution | Default value | Description |
|---|---|---|
| `_REGION` | `us-central1` | GCP region for Artifact Registry and Cloud Run |
| `_REPOSITORY` | `front-plaguie` | Artifact Registry repository name |
| `_IMAGE` | `front-plaguie-web` | Docker image name within the repository |
| `_SERVICE` | `front-plaguie-web` | Cloud Run service name |
| `_PROJECT_ID` | `plaguie-494022` | GCP project ID |
| `_API_URL` | `https://back-plaguie-api-...` | Backend Cloud Run URL, baked into the bundle at build time |

---

## Configuring the Backend URL (`_API_URL`)

`_API_URL` is the only substitution you **must** update before the pipeline can point at the correct backend. It is passed to `npm run build` as `VITE_API_URL` and baked into the JavaScript bundle — the running container does not read it at runtime.

### Step 1 — Find your backend URL

If the backend is already deployed on Cloud Run, retrieve its URL:

```bash
gcloud run services describe back-plaguie-api \
  --region=us-central1 \
  --project=plaguie-494022 \
  --format='value(status.url)'
```

The output looks like:
```
https://back-plaguie-api-abc123xy-uc.a.run.app
```

Copy that value.

### Step 2 — Set it in the Cloud Build trigger

**Option A — Cloud Console (recommended for first setup):**

1. Go to **Cloud Build → Triggers** in the [Cloud Console](https://console.cloud.google.com/cloud-build/triggers).
2. Click your trigger (`front-plaguie-deploy`) → **Edit**.
3. Scroll to **Substitution variables**.
4. Find `_API_URL` and replace the placeholder value with your backend URL.
5. Click **Save**.

**Option B — CLI:**

```bash
gcloud builds triggers update front-plaguie-deploy \
  --substitutions="_API_URL=https://back-plaguie-api-abc123xy-uc.a.run.app" \
  --project=plaguie-494022
```

### Step 3 — Verify it is set correctly

After the next pipeline run, open the **build logs** for step `build` and look for the line:

```
VITE_API_URL=https://back-plaguie-api-abc123xy-uc.a.run.app
```

Vite prints all resolved env vars at the start of the build. If `VITE_API_URL` is missing or shows the placeholder, the substitution was not saved.

### Local development

For local development, set the URL in your `.env` file (never committed):

```bash
# .env
VITE_API_URL=https://back-plaguie-api-abc123xy-uc.a.run.app
```

If `VITE_API_URL` is not set locally, the app falls back to `http://localhost:8080`, which is correct when running the backend on your machine.

| Environment | Where to set the backend URL |
|---|---|
| Local dev — local backend | Leave unset, falls back to `http://localhost:8080` |
| Local dev — deployed backend | `.env` file |
| Production build | `_API_URL` substitution in the Cloud Build trigger |

> **If the backend URL changes** (e.g. you redeploy the backend to a new Cloud Run revision with a different URL), you must update `_API_URL` in the trigger and run the frontend pipeline again. The old bundle still points to the old URL.

---

## Files in This Repo

| File | Purpose |
|---|---|
| `cloudbuild.yaml` | Full pipeline definition |
| `Dockerfile` | Runtime image — `nginx:1.27-alpine` + `dist/` + `nginx.conf` |
| `nginx.conf` | SPA routing (`try_files`), port 8080, asset caching, security headers, gzip |
| `.dockerignore` | Excludes `node_modules/`, `src/`, config files from the Docker build context |

---

## How to Set Up From Scratch

### 1. Enable required APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  --project=plaguie-494022
```

### 2. Create the Artifact Registry repository

```bash
gcloud artifacts repositories create front-plaguie \
  --repository-format=docker \
  --location=us-central1 \
  --project=plaguie-494022
```

### 3. Create all secrets in Secret Manager

See the [Required Secrets](#required-secrets-in-secret-manager) section above.

### 4. Grant Cloud Build permissions

```bash
PROJECT_NUMBER=$(gcloud projects describe plaguie-494022 --format='value(projectNumber)')
CB_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# Push and pull Docker images from Artifact Registry
gcloud projects add-iam-policy-binding plaguie-494022 \
  --member="serviceAccount:${CB_SA}" \
  --role="roles/artifactregistry.writer"

# Deploy to Cloud Run
gcloud projects add-iam-policy-binding plaguie-494022 \
  --member="serviceAccount:${CB_SA}" \
  --role="roles/run.admin"

# Read secrets from Secret Manager
gcloud projects add-iam-policy-binding plaguie-494022 \
  --member="serviceAccount:${CB_SA}" \
  --role="roles/secretmanager.secretAccessor"

# Allow Cloud Build to act as the Cloud Run service account
gcloud iam service-accounts add-iam-policy-binding \
  "${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --member="serviceAccount:${CB_SA}" \
  --role="roles/iam.serviceAccountUser"
```

### 5. Connect your GitHub repository to Cloud Build

In the [Cloud Build console](https://console.cloud.google.com/cloud-build/triggers), connect the GitHub repo and create a trigger pointing to `cloudbuild.yaml`.

Recommended trigger configuration:
- **Event:** Push to a tag (e.g. `v*`) for production deployments
- **Event:** Push to `main` for automatic staging deployments (set `_API_URL` to the staging backend)

---

## How to Trigger a Deployment

### Tag-based (production)

```bash
git tag v1.2.0
git push origin v1.2.0
```

Cloud Build detects the tag, sets `TAG_NAME=v1.2.0`, and pushes the image as both `:v1.2.0` and `:latest`.

### Commit SHA (staging / preview)

Any push to `main` (if configured as a trigger) uses `SHORT_SHA` as the version. The image is pushed as `:<short-sha>` and `:latest`.

### Manual trigger from CLI

```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions="_API_URL=https://your-backend-url" \
  --project=plaguie-494022
```

---

## Why VITE_* Variables Are Baked Into the Build

Vite replaces every `import.meta.env.VITE_*` reference **at build time** with the actual value. The resulting `dist/` folder contains no references to environment variable names — the values are embedded directly in the minified JavaScript.

**Consequence:** changing a `VITE_*` value (e.g. the Firebase API key) requires re-running the pipeline. The new secrets take effect in the next build, not by updating a Cloud Run environment variable.

This is different from a Node.js server, which reads `process.env` at **runtime**.

**What this means for you:**
- Cloud Run does **not** need any environment variables set — the container is purely nginx serving static files.
- Secrets live only in Secret Manager and are consumed during step 3 (`npm run build`). They are never written to a Docker layer.
- To roll back a secret to an old value, you must also re-deploy the corresponding image version (`gcloud run deploy --image ...:<old-tag>`).

---

## Docker Image Details

| Property | Value |
|---|---|
| Base image | `nginx:1.27-alpine` |
| Approximate size | ~50 MB |
| Exposed port | `8080` (Cloud Run default) |
| Node.js at runtime | No |
| SPA routing | `try_files $uri $uri/ /index.html` |
| Asset cache | 1 year, immutable (Vite content-hashes filenames) |
| `index.html` cache | `no-cache` (ensures new deploys are picked up immediately) |
| Gzip | Enabled for JS, CSS, JSON, SVG |
