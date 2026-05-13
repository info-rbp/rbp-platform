# Milestone 11 — Admin Operations (Launch)

## Authoritative admin backend
- **Frappe Desk (`/desk`) is the authoritative launch admin backend** for QA and launch operations.
- React `/admin` is **not authoritative** unless a view is explicitly backed by Frappe APIs.
- Any admin CRUD used for launch must persist to Frappe DocTypes.

## Launch admin scope in Desk
Admin operations are performed against Frappe records, including:
- RBP Tenant / Tenant
- RBP Business Profile
- RBP Membership Plan
- RBP Subscription
- RBP Payment Event (Stripe/payment inspection)
- RBP App Entitlement
- RBP Application Interest
- Service request DocTypes (Decision Desk, Connectivity, DocuShare, Risk Advisor, The Fixer)
- Marketplace listing/order/vendor records
- RBP Notification and RBP Notification Delivery
- RBP Audit Log

## React `/admin` relationship
- React `/admin` must link users to Desk workspaces for operational record management.
- Any non-backed/admin preview page must clearly state: **Preview only. Operational records are managed in Frappe Desk.**

## Applications launch behavior
- Applications are admin-manageable in backend records for QA.
- Customer-facing application provisioning remains disabled for this milestone.
- Application Interest inspection is available via `RBP Application Interest`.

## Billing/Stripe launch behavior
- Stripe/payment events are inspected through `RBP Payment Event` records in Desk.
- Summary/admin APIs never return Stripe secrets or raw sensitive payloads.

## Notifications and service requests
- Notification records and delivery logs are inspected through Frappe records (`RBP Notification`, `RBP Notification Delivery`).
- Service request statuses are updated in Frappe records and audited where existing audit patterns apply.

## Known limitations
- React admin legacy/mock flows are not authoritative and must not be treated as production admin CRUD.
- Customer-facing application provisioning remains deferred to a later milestone.
