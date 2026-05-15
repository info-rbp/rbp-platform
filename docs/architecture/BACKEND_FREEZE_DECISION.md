# Backend Freeze Decision

## Decision

RBP V.4 freezes the active backend direction on Appwrite.

## Effective Rules

- Appwrite is the backend runtime for the QA release path.
- Cloudflare deploys and serves the frontend.
- GitHub is the source of truth for schema, functions, permissions, seeds, docs, and deployment workflows.
- Stripe is the payment runtime.
- Frappe code remains reference and archive material only.
- No new active QA implementation work should extend Frappe routes, DocTypes, or Desk workspaces.
- Mock services may exist only behind explicit feature flags and must be disabled by default in QA.

## Why

The repository contained competing assumptions across Frappe, mock services, Firebase remnants, and Appwrite. That drift increases delivery risk and makes validation untrustworthy.

## Validation Note

Historical Frappe materials remain in the repository for reference. Their presence does not imply that Frappe remains the target runtime for QA.
