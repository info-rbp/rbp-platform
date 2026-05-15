# Phase 5 Handoff

## Purpose

This document defines the Phase 5 implementation handoff after consolidation and the backend direction freeze.

## Phase 5 Starting Point

- Repository: `info-rbp/rbp-platform`
- Branch: `main`
- Runtime direction: Appwrite backend, Cloudflare frontend, Stripe payments
- Historical backend reference: Frappe archive only

## Inputs Available

| Area | Path | Status |
|---|---|---:|
| React/Vite frontend portal | `frontend/portal/` | Available |
| Appwrite runtime definitions | `appwrite/` | Defined in repository |
| API and workflow contracts | `contracts/` | Available |
| Supporting specs | `specs/onboarding-flows/` | Available |
| Architecture and deployment docs | `docs/` | Available |
| CI/CD workflows | `.github/workflows/` | Expand for QA |

## Phase 5 Primary Goals

1. Freeze Appwrite as the active backend target.
2. Replace active Frappe-shaped frontend API usage with Appwrite-oriented providers.
3. Define Appwrite schema, functions, permissions, and seeds in the repository.
4. Define Cloudflare QA deployment expectations and route controls.
5. Wire Stripe checkout and webhook handling through Appwrite Functions.
6. Add repeatable validation and QA deployment workflows.

## Phase 5 Guardrails

- Do not re-activate Frappe as the QA backend target.
- Do not commit secrets or local environment files.
- Do not give the browser broad admin write permissions.
- Do not present customer application provisioning as available.
- Do not rely on undocumented manual clicking in Appwrite or Cloudflare.
- Do not treat mocked behavior as production-ready unless explicitly feature-flagged.

## First Technical Checks

- inspect Appwrite baseline requirements
- inspect Cloudflare QA environment requirements
- validate frontend runtime configuration for Appwrite
- isolate legacy `/api/method/*` usage from the active QA path
- validate schema, function, permission, and seed definitions from the repository

## Handoff Status

Phase 5 proceeds as an Appwrite transition and QA hardening phase. Historical Frappe documents remain useful reference material only.
