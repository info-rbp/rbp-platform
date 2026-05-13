# Milestone 10: Service Request Persistence – Implementation Note

## Inventory

### Existing API modules found
- `apps/rbp_app/rbp_app/api/decision_desk.py`
- `apps/rbp_app/rbp_app/api/docushare.py`
- `apps/rbp_app/rbp_app/api/connectivity.py`
- `apps/rbp_app/rbp_app/api/risk_advisor.py`
- `apps/rbp_app/rbp_app/api/the_fixer.py` (module equivalent to requested `fixer.py`)
- `apps/rbp_app/rbp_app/api/marketplace.py`

### Existing service modules found
- `apps/rbp_app/rbp_app/services/decision_desk.py`
- `apps/rbp_app/rbp_app/services/docushare.py`
- `apps/rbp_app/rbp_app/services/connectivity.py`
- `apps/rbp_app/rbp_app/services/risk_advisor.py`
- `apps/rbp_app/rbp_app/services/the_fixer.py` (module equivalent to requested `fixer.py`)
- `apps/rbp_app/rbp_app/services/marketplace.py`

### Existing DocTypes found
- `RBP Decision Desk Request`
- `RBP Decision Desk Option`
- `RBP DocuShare Document` (used as the persisted brief-equivalent)
- `RBP Connectivity Request` (order-equivalent)
- `RBP Risk Advisor Assessment`
- `RBP Fixer Case` (request-equivalent)
- `RBP Marketplace Listing`
- `RBP Marketplace Order` (enquiry/offer-equivalent)
- `RBP Notification`
- `RBP Audit Log`
- `RBP Tenant`

### Missing DocTypes added
- None in this pass.

### Existing patterns reused
- API-layer `@frappe.whitelist` wrappers delegating to service layer.
- `require_login` / `require_system_manager` guards.
- tenant resolution through tenancy service.
- service-level notification + audit helper usage patterns.

### Endpoint names preserved for compatibility
- Preserved existing names (e.g. `create_request`, `create_case`, `create_order`) and added compatibility aliases:
  - `docushare.create_brief`
  - `connectivity.create_order`
  - `the_fixer.create_request`
  - `marketplace.create_enquiry`
  - plus list/get aliases requested by portal contracts.

## Implemented in this milestone pass
- Added portal activity API aggregation endpoint:
  - `rbp_app.api.portal.get_my_service_activity`
  - `rbp_app.services.portal.get_my_service_activity`
- Added reference ID helper scaffold:
  - `rbp_app.services.reference_ids.generate_reference_id(prefix)`

## Deferred follow-ups
- Full DocType schema normalization (`reference_id`, `submitted_on`, `source_channel`) across all service DocTypes.
- Full create/submit status normalization for every service flow.
- Admin status alias endpoints for all modules where naming differs.
- Backfill patch for legacy missing reference IDs.
- Expanded automated test matrix specific to milestone 10 acceptance criteria.
