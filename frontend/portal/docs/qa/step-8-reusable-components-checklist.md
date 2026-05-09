# Step 8 Reusable Components Checklist

## Validation

- Flow components exist.
- Form components exist.
- Status components exist.
- Domain pattern components exist.
- Barrel exports exist for each component folder.
- Components are frontend-only.
- No real backend logic is introduced.
- No Firebase, Firestore, Frappe, payment, upload, auth, or real API logic is introduced.
- npm run build passes.
- dist is removed before commit.

## Build

Run:

    npm run build
    rm -rf dist
    git status
