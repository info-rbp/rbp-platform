# Frappe Deprecation Plan

## Current Position

Frappe artifacts remain in the repository as historical reference from consolidation.

## Active Deprecation Rules

- No new active QA implementation work should target `/api/method/*`.
- No new QA launch docs should describe Frappe Desk as the operational admin surface.
- No new QA launch docs should describe Frappe DocTypes as the active system of record.
- Existing Frappe material may remain until cleanup is safe and does not destroy useful history.

## What Stays for Now

- imported `apps/rbp_app/` source
- historical architecture and contract references
- any migration evidence still helpful during transition

## What Changes Immediately

- active frontend integrations move to Appwrite-oriented providers
- admin operations move to React plus Appwrite Functions
- launch and QA docs describe Appwrite and Cloudflare as the runtime path

## Validation Note

Repository searches may still find Frappe references. Those references should be treated as historical unless a document explicitly states that it is active Appwrite-transition guidance.
