# Appwrite Admin Operations

React `/admin` routes are the target QA operational surface.

## Admin Pattern

```text
React /admin -> Appwrite session -> admin role or team check -> Appwrite Function -> Appwrite server-side writes
```

- browser checks authenticated session
- Appwrite team or role boundaries determine access
- privileged writes flow through `appwrite/functions/admin-operations/`
- browser does not receive broad admin write permissions
- Appwrite Console may be used as a technical fallback for inspection or configuration only

## Foundation Scope Note

This branch establishes the admin surface, routing boundary, and function scaffolding.

It does not by itself prove that every admin workflow is fully implemented, deployed, or validated end to end. Follow-up implementation PRs must complete any remaining stub Function behavior, executable tests, and live QA validation.

## Admin Modules

- tenants
- users
- membership plans
- subscriptions
- payment events
- entitlements
- applications
- application interest
- service requests
- notifications
- audit events