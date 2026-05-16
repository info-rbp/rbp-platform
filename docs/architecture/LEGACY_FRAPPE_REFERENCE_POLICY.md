# Legacy Frappe Reference Policy

## Purpose

This repository retains historical Frappe material for reference, migration comparison, and audit history only.

## Allowed Uses

Frappe references may remain only when they are clearly historical, archival, or comparative:

- imported source under `apps/rbp_app/`
- deprecation and transition notes
- migration comparison documents
- historical contract references

## Not Allowed In The Active QA Path

The active Appwrite QA runtime must not rely on Frappe for:

- backend provider selection
- QA or production environment defaults
- admin source-of-truth claims
- frontend runtime fallbacks
- live `/api/method/*` dependencies for QA or production traffic
- launch or go/no-go criteria

## Contributor Rules

- Do not reintroduce `frappe` as an active backend provider.
- Do not present Frappe Desk as the operational QA admin backend.
- If legacy Frappe adapters remain in code, mark them as reference-only and keep them unreachable from active provider selection.
- If a document mentions Frappe in active guidance, rewrite it or move the reference into a clearly historical section.

## Review Rule

Any new PR that touches Frappe-related code or docs must explain whether the reference is historical or active. If it is active, it must not be merged into the Appwrite QA path without explicit approval.