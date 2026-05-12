# Milestone 1: QA Deployment Branch Strategy

## Repository role

This repository, `rbp-platform`, will hold the QA deployment coordination work for the launch.

The QA deployment branch will contain work for:

- QA deployment workflow
- Environment configuration references
- Build and validation workflow updates
- SEO validation workflow
- Route/access smoke checks
- Deployment documentation
- QA release checklist
- Rollback documentation

## Branch

QA deployment work will be isolated in:

`launch/qa-deployment`

## Rules

- Do not commit QA deployment work directly to `main`.
- Keep deployment, CI/CD, validation, and QA environment work on this branch.
- Deployment work must not expose secrets.
- Deployment work must support a repeatable QA release process.
- Merge only after validation workflows and deployment checks pass.

## Acceptance criteria

- Deployment work is isolated.
- The QA deployment branch exists locally and remotely.
- The branch is ready for QA deployment workflow, CI/CD, validation, and release documentation.
