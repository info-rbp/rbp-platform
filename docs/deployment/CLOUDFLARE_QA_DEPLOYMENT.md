# Cloudflare QA Deployment

## Build

- working directory: `frontend/portal`
- install: `npm ci`
- build command: `npm run build`
- output directory: `frontend/portal/dist`

## Route Controls

- SPA fallback is provided through `frontend/portal/public/_redirects`
- protected route noindex headers are provided through `frontend/portal/public/_headers`

Protected routes that must remain noindex:

- `/portal/*`
- `/admin/*`
- `/signin`
- `/signup`
- `/signout`

## Required QA Variables

- `VITE_BACKEND_PROVIDER=appwrite`
- `VITE_APPWRITE_ENDPOINT`
- `VITE_APPWRITE_PROJECT_ID`
- `VITE_APPWRITE_DATABASE_ID`
- `VITE_APPWRITE_STORAGE_BUCKET_ID`
- `VITE_QA_ENVIRONMENT=true`
- `VITE_CLOUDFLARE_ENVIRONMENT=qa`
- `VITE_ENABLE_MOCK_AUTH=false`
- `VITE_ENABLE_MOCK_FALLBACK=false`
- `VITE_ENABLE_STRIPE_CHECKOUT=true`

## Separation Rules

- QA and production must use separate environment variable sets.
- QA must not enable mock auth or mock fallback.
- QA must enable Stripe checkout.
- QA must not use a non-Appwrite backend provider.
