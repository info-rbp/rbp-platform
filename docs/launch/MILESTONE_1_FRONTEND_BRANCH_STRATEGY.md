# Milestone 1: Frontend QA Integration Branch Strategy

## Repository role

This repository, `rbp-platform`, is the consolidated frontend and launch integration repository.

The frontend QA integration branch will contain work for:

- Public website to customer portal connectivity
- Customer account-gated flows
- Membership portal integration
- Stripe checkout frontend integration
- Email notification UI states
- Applications delayed/register-interest frontend state
- SEO metadata, robots, and sitemap
- QA environment banner
- Route/access smoke testing
- Copy completion for QA

## Branch

Frontend launch work will be isolated in:

`launch/frontend-qa-integration`

## Rules

- Do not commit frontend launch work directly to `main`.
- Keep customer-facing and portal-facing QA integration work on this branch.
- Applications remain disabled/delayed for customer provisioning.
- Stripe checkout can be enabled for QA test mode only.
- Merge only after build, route, copy, and QA checks pass.

## Acceptance criteria

- Frontend work is isolated.
- The frontend QA integration branch exists locally and remotely.
- The branch is ready for portal, membership, Stripe, email, SEO, copy, and Applications-delay implementation.
