# Phase 2 Contracts

This directory contains the migrated Phase 2 contract baseline for the Remote Business Partner Platform.

These contracts were consolidated into `info-rbp/rbp-platform` during Phase 4 and are the authoritative contract reference for Phase 5 integration.

## Source

Source repository:

```text
info-rbp/Uiuxdesignassistance
```

Source branch:

```text
main
```

Source commit:

```text
6165346d4fc29fba6b78ec84e32285159a182c82
```

Original source package:

```text
RBP_Phase_2_Backend_Contracts/
```

Migration target:

```text
contracts/
```

## Purpose

The contracts in this directory define the backend/API expectations derived from the completed UI/UX and Phase 2 contract work.

They are intended to support Phase 5 integration by giving the frontend and backend a shared reference for:

- API response envelopes
- route-to-endpoint mapping
- mock-to-real API replacement
- DocType expectations
- workflow states
- permission rules
- validation rules
- notification triggers
- admin actions

## Directory Structure

```text
contracts/
├── api/
├── doctypes/
├── workflows/
├── permissions/
├── phase-2-pack-index.md
├── phase-2-source-index.md
├── naming-conventions.md
├── contract-templates.md
└── phase-2-acceptance-gate.md
```

## Contract Areas

### API Contracts

Location:

```text
contracts/api/
```

Includes:

- `01-api-response-envelope-standard.md`
- `07-error-catalogue.md`
- `09-upload-file-rules.md`
- `11-route-to-endpoint-map.md`
- `16-mock-to-real-api-map.md`

These files define response format expectations, error handling, upload/file rules, route mapping, and the transition from mocked frontend APIs to real backend APIs.

### DocType Contracts

Location:

```text
contracts/doctypes/
```

Includes:

- `05-core-doctype-model.md`
- `12-form-field-specifications.md`
- `13-validation-rules.md`

These files define backend data model expectations, form field requirements, and validation behavior.

### Workflow Contracts

Location:

```text
contracts/workflows/
```

Includes:

- `06-workflow-state-standards.md`
- `08-payment-state-model.md`
- `14-notification-triggers.md`

These files define workflow states, payment state handling, and notification trigger expectations.

### Permission Contracts

Location:

```text
contracts/permissions/
```

Includes:

- `03-role-matrix.md`
- `04-permission-model-draft.md`
- `15-admin-actions.md`

These files define roles, permission expectations, and admin action boundaries.

## Root Contract Files

The root of `contracts/` contains cross-cutting contract material:

- `phase-2-pack-index.md`
- `phase-2-source-index.md`
- `naming-conventions.md`
- `contract-templates.md`
- `phase-2-acceptance-gate.md`

## Migration Scope

This directory contains Phase 2 contract documentation only.

It does not include:

- frontend source code
- backend source code
- `rbp_app` source
- Frappe framework core
- generated files
- runtime files
- local environment files
- secrets

## Phase 5 Usage

During Phase 5, these contracts should be used to validate:

- frontend route-to-backend endpoint mapping
- replacement of frontend mock services with real backend APIs
- backend DocType coverage
- permission and role enforcement
- workflow state handling
- validation behavior
- API smoke test coverage

Contract changes after Phase 4 should be explicit, reviewed, and documented.

## Status

Phase 2 contracts have been migrated into the consolidated `rbp-platform` repository.

This directory is ready for Phase 5 integration validation.
