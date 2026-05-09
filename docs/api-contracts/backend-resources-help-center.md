# Backend Phase 1: Resources and Help Center

This phase implements the first Firebase-backed content collections.

## Enabled backend collections

- `resources`
- `helpArticles`

## What this adds

- Firebase client wrapper
- Firestore service layer for Resources and Help Center
- Static fallback when Firebase environment variables are missing
- Public page reads through backend-aware hook
- Admin backend workspace for Resources
- Admin backend workspace for Help Center
- Create/update/archive service functions
- Static data seeding functions
- `.env.example` Firebase configuration template

## Public page behaviour

The public Resources page now reads through `usePublicBackendContent`.

The public Help Center page now reads structured help articles through `usePublicBackendContent`.

If Firebase is not configured, both pages use static fallback content from:

- `src/app/data/resources.ts`
- `src/app/data/helpCenter.ts`

## Admin behaviour

The admin backend workspace appears on:

- `/admin/resources`
- `/admin/help-center`

The workspace can:

- load records
- seed static records into Firestore
- create records
- update records
- archive records

If Firebase is not configured, the workspace remains usable with local/static fallback data.

## Firebase collections

### resources

Used for public resource records.

Expected fields:

- `id`
- `title`
- `summary`
- `type`
- `category`
- `readTime`
- `href`
- `status`
- `slug`
- `sortOrder`
- `updatedAt`

### helpArticles

Used for structured Help Center content.

Expected fields:

- `id`
- `section`
- `category`
- `question`
- `answer`
- `status`
- `slug`
- `sortOrder`
- `updatedAt`

## Required environment variables

Use `.env.local` for real values.

Required Vite variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## What this does not add

- Firebase Auth login
- Admin role enforcement
- Firestore security rules deployment
- Firebase Storage
- Cloud Functions
- Audit log writes
- Production migration scripts
- Payment or membership backend logic

## Next step

After this phase, test Resources and Help Center with a real Firebase project using `.env.local`, then add read/write security rules for these two collections only.
