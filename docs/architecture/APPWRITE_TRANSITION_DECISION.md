# Appwrite Transition Decision

## Decision Summary

The RBP QA release path will be implemented with:

- Appwrite Auth, Databases, Storage, Functions, Teams, and notification/email integration where applicable
- Cloudflare as the frontend deployment/runtime layer
- Stripe test mode for QA payments
- GitHub as the source of truth for runtime definitions

## Repository Implications

The repository must define:

- Appwrite schema JSON
- Appwrite function entry points
- deployment and validation scripts
- seed data for QA
- permissions and baseline checks
- deployment and QA runbooks

## Non-Goals

- re-expanding Frappe as the active backend target
- exposing server credentials to the browser
- enabling customer application provisioning in QA
- manual-only runtime setup without documented repository steps
