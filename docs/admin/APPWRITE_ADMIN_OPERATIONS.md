# Appwrite Admin Operations

React `/admin` routes are the intended QA operational surface.

## Admin Pattern

- browser checks authenticated session
- Appwrite team or role boundaries determine access
- privileged writes flow through `appwrite/functions/admin-operations/`
- browser does not receive broad admin write permissions

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
