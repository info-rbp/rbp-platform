# Milestone 15: SEO Final Validation

## Repository

`info-rbp/rbp-platform`

## Completed scope

SEO baseline is implemented and final validation has been run at the repository level.

## Validation commands

    cd frontend/portal
    npm ci
    npm run build
    npm run audit:seo

## Required checks

- Public routes have SEO metadata.
- Protected routes are noindex.
- Sitemap excludes protected routes.
- Robots rules exist.
- Applications page does not imply provisioning is live.
- QA and production public site URLs are documented in env examples.

## Completion criteria

Milestone 15 is complete when build passes, SEO audit passes, and canonical URL configuration is confirmed for QA and production.
