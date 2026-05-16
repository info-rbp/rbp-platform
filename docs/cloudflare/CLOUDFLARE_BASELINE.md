# Cloudflare Baseline

## Required Build Facts

- build command: `cd frontend/portal && npm ci && npm run build`
- build output directory: `frontend/portal/dist`
- SPA fallback through `frontend/portal/public/_redirects`
- noindex headers for protected routes through `frontend/portal/public/_headers`

## Required Variables

- CLOUDFLARE_ACCOUNT_ID
- CLOUDFLARE_PROJECT_NAME
- VITE_BACKEND_PROVIDER
- VITE_APPWRITE_ENDPOINT
- VITE_APPWRITE_PROJECT_ID
- VITE_APPWRITE_DATABASE_ID
- VITE_APPWRITE_STORAGE_BUCKET_ID
- VITE_QA_ENVIRONMENT
- VITE_CLOUDFLARE_ENVIRONMENT

## Validation Command

- `npm run cloudflare:env:validate`

## Current Recorded Status

Repository-defined Cloudflare baseline: present.

Live validation status: blocked in this session.

Blocked inputs:

- CLOUDFLARE_ACCOUNT_ID
- CLOUDFLARE_PROJECT_NAME
- reachable frontend build environment

Protected route rules and SPA fallback are defined in the repository, but live Cloudflare QA validation remains outstanding until those values and a runnable checkout are available.