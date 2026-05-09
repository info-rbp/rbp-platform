# Phase 4B Frontend Portal Migration

## Purpose

This document records the Phase 4B migration of the React/Vite frontend from `info-rbp/Uiuxdesignassistance` into `info-rbp/rbp-platform`.

The frontend is staged as a separate portal application under:

```text
frontend/portal/
```

This migration was performed as structured consolidation only. It did not perform Phase 5 frontend/backend integration.

## Source Repository

Repository:

```text
info-rbp/Uiuxdesignassistance
```

Branch:

```text
main
```

Source commit:

```text
6165346d4fc29fba6b78ec84e32285159a182c82
```

## Target Location

The frontend source was migrated into:

```text
frontend/portal/
```

## Migrated Content

The migrated frontend content includes:

- React/Vite application source
- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `index.html`
- `src/`
- route configuration
- navigation configuration
- page and component source
- mock data and mock service layer
- frontend scripts
- frontend UI documentation and implementation notes where applicable

Key expected frontend files include:

```text
frontend/portal/package.json
frontend/portal/package-lock.json
frontend/portal/vite.config.ts
frontend/portal/index.html
frontend/portal/src/main.tsx
frontend/portal/src/app/App.tsx
frontend/portal/src/app/routes.tsx
frontend/portal/src/app/config/navigation.ts
frontend/portal/src/app/config/routes.registry.ts
frontend/portal/src/app/services/mock/
```

## Explicitly Not Migrated

The frontend migration did not include:

- `node_modules/`
- generated frontend build output
- `dist/`
- `build/`
- `.vite/`
- local `.env` files
- backend source code
- `rbp_app/`
- Frappe framework core
- `frappe/`
- `apps/frappe/`
- duplicate Phase 2 contract package files
- duplicate Phase 2 handoff package files

## Contract and Spec Separation

Phase 2 contract and handoff material was migrated separately into the consolidated repository structure:

```text
contracts/
specs/onboarding-flows/
docs/api-contracts/
docs/product-flows/
```

The frontend source should not carry duplicate copies of the Phase 2 contract package.

## Validation Performed During Migration

The frontend migration was validated during Phase 4B by confirming expected source files existed after copy.

The migration also validated that excluded/generated files were not committed.

Validation included:

- frontend source files copied into `frontend/portal/`
- `package.json` present
- `package-lock.json` present
- `vite.config.ts` present
- `index.html` present
- `src/main.tsx` present
- app route configuration present
- navigation configuration present
- mock service layer present
- `npm install` completed during migration validation
- `npm run build` completed during migration validation
- `node_modules/` removed before commit
- generated build output removed before commit
- duplicate Phase 2 contract package removed from frontend copy
- duplicate Phase 2 handoff docs removed from frontend copy

## Phase 5 Usage

Phase 5 should use this frontend source as the integration starting point for:

- mapping frontend routes to backend endpoints
- replacing or isolating frontend mock services
- validating API contract alignment
- configuring environment-specific API base URLs
- deciding the final frontend serving model

The frontend may eventually be:

1. deployed as a separate React/Vite app
2. served through Frappe assets
3. embedded alongside Frappe portal surfaces
4. retained partly as a reference implementation if Frappe-rendered pages supersede it

That decision belongs to Phase 5 integration, not Phase 4 consolidation.

## Known Follow-Up Items

- Normalize frontend package metadata if needed.
- Add frontend build validation to CI.
- Confirm final API base URL strategy.
- Map `contracts/api/11-route-to-endpoint-map.md` against frontend routes.
- Map `contracts/api/16-mock-to-real-api-map.md` against frontend mock services.

## Status

Frontend portal source has been migrated into the consolidated `rbp-platform` repository.

This document is the Phase 4B migration record for the frontend portal import.
