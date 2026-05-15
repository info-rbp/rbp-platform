# Cloudflare QA Deployment

## Build

- working directory: `frontend/portal`
- install: `npm ci`
- build: `npm run build`
- output: `dist`

## Required QA Variables

- VITE_BACKEND_PROVIDER=appwrite
- VITE_APPWRITE_ENDPOINT
- VITE_APPWRITE_PROJECT_ID
- VITE_APPWRITE_DATABASE_ID
- VITE_APPWRITE_STORAGE_BUCKET_ID
- VITE_QA_ENVIRONMENT=true
- VITE_ENABLE_MOCK_AUTH=false
