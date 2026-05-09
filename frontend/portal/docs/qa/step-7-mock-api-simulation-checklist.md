# Step 7 Mock API Simulation Checklist

## Validation

- Mock client exists.
- Mock service files exist under src/app/services/mock.
- Mock services import central mock data from src/app/mock.
- Mock services return standard response envelopes.
- Mock services simulate validation failures.
- Mock services simulate successful submissions.
- Mock services generate mock reference numbers.
- Mock services return status values.
- No real backend logic is introduced.
- No Firebase, Firestore, Frappe, payment, upload, auth, or real API logic is introduced.
- npm run build passes.
- dist/ is removed before commit.

## Build

Run:

    npm run build
    rm -rf dist
    git status
