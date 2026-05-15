# Appwrite QA Scope

## Appwrite Must Support For QA

- customer auth
- tenant, business profile, and user profile records
- membership plans and plan-entitlement mapping
- subscriptions, payment events, and audit events
- applications catalogue and application-interest capture
- service requests and related operational records
- notifications and delivery logs
- admin operations through Functions

## Appwrite Must Not Expose Directly To The Browser

- broad admin write capabilities
- privileged Stripe operations
- unrestricted tenant-crossing reads
- direct provisioning actions for customer applications
