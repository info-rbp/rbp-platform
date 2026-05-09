# Phase 1 Audit Script

## Purpose

The Phase 1 audit script checks whether the frontend-only Phase 1 completion gates are structurally represented in the repository.

It is a lightweight QA helper. It does not replace manual browser smoke testing, responsive review, or design review. Apparently computers still cannot admire a broken layout properly. Tragic.

## Command

Run:

    npm run audit:phase1

This executes:

    node scripts/phase1-audit.mjs

## Checks Included

The audit checks for:

- Required route registry/config files
- Required reusable flow components
- Required form components
- Required status components
- Required mock data files
- Required mock service files
- Required feature flow files
- Required implementation documents
- Portal routes
- Admin routes
- Ignored raw Stitch/source-material folders
- Forbidden real production integration imports
- Suspicious production API, upload, and payment implementation patterns

## Required Flow Areas

The audit expects these Phase 1 flow areas to exist:

- Membership purchase and onboarding
- Decision Desk
- DocuShare / Document Nucleus
- Marketplace enquiry
- Marketplace listing
- NBN/connectivity
- Risk Advisor
- The Fixer
- Portal/dashboard
- Admin concepts

## Forbidden Production Integration Checks

The script scans source files for real production integrations such as:

- firebase/auth
- firebase/firestore
- firebase/storage
- Frappe imports
- Stripe imports
- PayPal imports
- Production API endpoints
- Live upload/storage SDK usage
- Live payment checkout patterns

Mock-only wording in docs and UI is allowed.

## Warnings

Warnings do not fail the audit.

Warnings may include:

- Optional ignored folders missing from .gitignore
- Packages present but not necessarily used
- Optional files not yet implemented

## Failure Behaviour

If required files, routes, or forbidden implementation patterns are found, the script exits with a non-zero status.

That means:

    npm run audit:phase1

will fail until the issue is corrected.

## Recommended Validation Sequence

Run:

    npm install
    npm run audit:phase1
    npm run build
    rm -rf dist
    git status

## Phase 1 Safety Rule

The audit protects the Phase 1 boundary:

- No real backend
- No real authentication
- No real payment processing
- No real uploads
- No real Frappe APIs
- No real marketplace checkout
- No real carrier serviceability
- No real ticketing/email workflow
