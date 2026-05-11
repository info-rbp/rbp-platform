# Priority 3 Admin Production Notes

## Implementation Plan

1. Add a Desk-first RBP workspace through fixtures, with links only to DocTypes that exist in this app and docs for optional/missing targets.
2. Improve Desk list triage with defensive `*_list.js` scripts for implemented RBP DocTypes.
3. Add a central admin workflow service and whitelisted action APIs that enforce role, state, record visibility, audit logging, and user notification.
4. Add live admin dashboard metrics and audit trail APIs that tolerate missing optional DocTypes.
5. Update the React `/admin` command centre to call live APIs by default and keep mock behavior only behind an explicit dev flag.

## Missing Optional DocTypes From Requested Workspace

- `RBP Document Brief` is not currently implemented. Existing DocuShare DocTypes are `RBP DocuShare Document`, `RBP DocuShare Folder`, and `RBP DocuShare Share`.
- `RBP Fixer Request` is not currently implemented. Existing Fixer DocType is `RBP Fixer Case`.

## Role Fixture Decision

No existing role fixture convention was present before this work. `RBP Admin` is supported in permission helpers and documented as the product admin role, but the workspace fixture only assigns built-in Desk roles (`Administrator`, `System Manager`) so install does not fail on sites where `RBP Admin` has not been created yet.
