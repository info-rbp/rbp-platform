# Deployment Notes

## Purpose

This document records the Phase 4 deployment and bench configuration baseline for the consolidated Remote Business Partner Platform repository.

Phase 4 does not perform production deployment. It creates safe deployment scaffolding so Phase 5 can validate runtime behavior without guessing where configuration belongs, which is apparently too much to ask from the universe.

## Current Repository Deployment Status

```text
Phase 4 status: deployment skeleton present
Phase 5 status: runtime validation required
```

The consolidated repository contains:

```text
apps/rbp_app/
frontend/portal/
contracts/
specs/
infra/
docs/
sites/common_site_config.template.json
infra/bench/Procfile.template
```

## Deployment Scope Boundary

Phase 4 includes:

- deployment documentation
- bench configuration templates
- safe environment examples
- infrastructure directory skeleton
- explicit warnings about secrets and runtime files

Phase 4 does not include:

- production deployment
- production QA
- live infrastructure provisioning
- domain/DNS setup
- SSL certificate setup
- production database provisioning
- production Redis provisioning
- frontend/backend integration completion
- Frappe bench install proof

## Configuration Templates

### Common Site Config Template

Template path:

```text
sites/common_site_config.template.json
```

Purpose:

- documents expected Frappe common site configuration keys
- provides safe placeholder values
- gives Phase 5 a starting point for local bench validation
- avoids committing real `common_site_config.json` runtime state

Usage:

```text
cp sites/common_site_config.template.json sites/common_site_config.json
```

Only do this in a local bench/runtime environment. Do not commit the copied runtime file.

The template contains placeholder values such as:

```text
CHANGE_ME_IN_SECRET_STORE
```

Those values must be replaced through local configuration, CI secrets, deployment secrets, or infrastructure secret managers.

### Bench Procfile Template

Template path:

```text
infra/bench/Procfile.template
```

Purpose:

- documents expected bench process roles
- gives Phase 5 a starting point for local process orchestration
- avoids committing environment-specific process files

Usage:

```text
cp infra/bench/Procfile.template Procfile
```

Only copy it into the correct local/deployment context after paths and ports have been reviewed.

## Environment Examples

Committed environment examples:

```text
.env.example
.env.local.example
.env.production.example
frontend/portal/.env.example
```

Local files that must not be committed:

```text
.env
.env.local
.env.production
sites/common_site_config.json
```

## Secret Safety

Never commit:

- database passwords
- Redis passwords
- API keys
- private keys
- OAuth secrets
- production hostnames if sensitive
- real `common_site_config.json` runtime files
- generated bench runtime files

Use one of the following instead:

- local ignored environment files
- GitHub Actions secrets
- deployment secret managers
- infrastructure-level secret injection

## Frappe Bench Validation Path

Phase 5 should validate the backend app in a bench environment.

Recommended local validation flow:

```text
bench init rbp-bench
cd rbp-bench
bench get-app rbp_app /path/to/rbp-platform/apps/rbp_app
bench new-site rbp.localhost
bench --site rbp.localhost install-app rbp_app
bench --site rbp.localhost migrate
bench --site rbp.localhost list-apps
```

Exact commands may vary by Frappe version, database configuration, Redis configuration, and local environment.

## Frontend Deployment Validation Path

Phase 5 should validate the frontend from:

```text
frontend/portal/
```

Recommended local validation flow:

```text
cd frontend/portal
npm ci
npm run build
```

Generated output such as `dist/` must not be committed.

## Deployment Strategy Decision Required in Phase 5

Phase 5 must decide whether the frontend is:

1. deployed separately as a React/Vite app
2. served through Frappe assets
3. embedded alongside Frappe portal routes
4. partially retained as a reference implementation

That decision should be documented before production deployment work starts.

## Infrastructure Directory Roles

```text
infra/bench/
```
Bench-specific templates, process definitions, and install notes.

```text
infra/docker/
```
Docker and container packaging materials. Currently skeleton only.

```text
infra/deployment/
```
Deployment scripts, environment notes, release process, and production handoff materials. Currently skeleton only.

## Phase 5 Deployment Readiness Checklist

Before production deployment work begins, Phase 5 should confirm:

- `rbp_app` installs successfully in bench
- `bench migrate` succeeds
- required DocTypes load correctly
- frontend build succeeds
- frontend API base URL strategy is defined
- Redis/database requirements are documented
- environment variables are documented
- secrets are externalized
- rollback strategy is drafted
- deployment owner and environment targets are identified

## Related Documents

```text
docs/architecture/ARCHITECTURE.md
docs/architecture/PHASE_5_HANDOFF.md
docs/architecture/PHASE_5_CI_PLAN.md
docs/architecture/CONSOLIDATED_REPO_VALIDATION.md
docs/architecture/PHASE_4_FINAL_VERIFICATION_CHECKLIST.md
```

## Status

Deployment and bench configuration templates are present for Phase 5 validation.

Production deployment remains out of scope for Phase 4.
