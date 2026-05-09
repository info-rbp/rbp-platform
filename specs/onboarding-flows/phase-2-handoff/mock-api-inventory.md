# Phase 2 Mock API Inventory

## Purpose

This document maps Phase 1 mock services to future backend endpoints or Frappe methods.

Phase 1 mock services are contract prototypes only. They are not production APIs.

## Mock Services

| Mock Service | Phase 1 Purpose | Phase 2 Backend Contract |
|---|---|---|
| src/app/services/mock/membership.mockService.ts | Membership signup and onboarding simulation | Membership application, plan, billing and onboarding endpoints |
| src/app/services/mock/decisionDesk.mockService.ts | Decision Desk request simulation | Decision Desk request DocType/API |
| src/app/services/mock/docushare.mockService.ts | DocuShare brief submission simulation | Document brief/request DocType/API |
| src/app/services/mock/marketplace.mockService.ts | Marketplace enquiry and seller listing simulation | Marketplace listing/enquiry APIs |
| src/app/services/mock/connectivity.mockService.ts | Connectivity order and serviceability simulation | Connectivity order/serviceability/provisioning APIs |
| src/app/services/mock/riskAdvisor.mockService.ts | Risk assessment and scoring simulation | Risk assessment/scoring APIs |
| src/app/services/mock/fixer.mockService.ts | The Fixer urgent request simulation | Urgent request/ticket workflow API |
| src/app/services/mock/admin.mockService.ts | Admin review action simulation | Admin review/action/audit APIs |
| src/app/services/mock/portal.mockService.ts | Portal dashboard/status simulation | Portal aggregate/status APIs |

## Common Mock Service Behaviours

Mock services commonly simulate:

- Standard response envelope
- Validation failure
- Loading/submitting state
- Reference generation
- Status response
- Timeline response
- Portal/admin hrefs
- Mock-only confirmation messages

## Future Standard Response Shape

Recommended Phase 2 API response shape:

    {
      ok: boolean,
      data?: object,
      errors?: Array<{
        field: string,
        code: string,
        message: string
      }>,
      message: string,
      reference?: string,
      status?: string
    }

## Future Submission Endpoint Pattern

Recommended REST-style planning pattern:

| Flow | Create Endpoint | Detail Endpoint | Admin Endpoint |
|---|---|---|---|
| Membership | POST /api/membership/applications | GET /api/membership/applications/:id | PATCH /api/admin/membership/:id |
| Decision Desk | POST /api/decision-desk/requests | GET /api/decision-desk/requests/:id | PATCH /api/admin/decision-desk/:id |
| DocuShare | POST /api/docushare/briefs | GET /api/docushare/briefs/:id | PATCH /api/admin/docushare/:id |
| Marketplace Enquiry | POST /api/marketplace/enquiries | GET /api/marketplace/enquiries/:id | PATCH /api/admin/marketplace/enquiries/:id |
| Marketplace Listing | POST /api/marketplace/listings | GET /api/marketplace/listings/:id | PATCH /api/admin/marketplace/listings/:id |
| Connectivity | POST /api/connectivity/orders | GET /api/connectivity/orders/:id | PATCH /api/admin/connectivity/:id |
| Risk Advisor | POST /api/risk-advisor/assessments | GET /api/risk-advisor/assessments/:id | PATCH /api/admin/risk-advisor/:id |
| The Fixer | POST /api/fixer/requests | GET /api/fixer/requests/:id | PATCH /api/admin/fixer/:id |
| Contact | POST /api/contact/enquiries | GET /api/contact/enquiries/:id | PATCH /api/admin/contact/:id |

## Future Frappe Method Pattern

If Frappe is used, each flow may map to:

- DocType create
- DocType get
- DocType list
- workflow action
- admin note append
- audit log creation
- notification event trigger

## Mock to Real Transition Rules

When replacing mocks:

1. Preserve UI response expectations.
2. Preserve validation message shape where practical.
3. Preserve reference/status/timeline fields.
4. Add auth only after user journeys are backend-ready.
5. Add uploads only after storage and permission contracts are defined.
6. Add payments only after payment state machine and legal wording are approved.
7. Add Frappe DocTypes only after fields and workflows are signed off.
