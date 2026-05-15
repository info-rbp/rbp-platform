# Cloudflare Baseline

## Required Build Facts

- build command: `npm ci && npm run build` in `frontend/portal`
- build output directory: `frontend/portal/dist`
- SPA fallback through `frontend/portal/public/_redirects`
- noindex headers for protected routes through `frontend/portal/public/_headers`

## Required Variables

- VITE_BACKEND_PROVIDER
- VITE_APPWRITE_ENDPOINT
- VITE_APPWRITE_PROJECT_ID
- VITE_APPWRITE_DATABASE_ID
- VITE_APPWRITE_STORAGE_BUCKET_ID
- VITE_QA_ENVIRONMENT
- VITE_CLOUDFLARE_ENVIRONMENT

## Validation Command

- `npm run cloudflare:env:validate`
