# Step 6 Mock Data Checklist

## Validation

- Mock data files exist under src/app/mock.
- Shared mock types exist.
- index.ts exports mock data modules.
- Mock data covers all major Phase 1 product areas.
- No real backend logic is introduced.
- No Firebase, Firestore, Frappe, payment, upload, auth, or API logic is introduced.
- npm run build passes.
- dist/ is removed before commit.

## Build

Run:

    npm run build
    rm -rf dist
    git status
