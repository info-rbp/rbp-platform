# Phase 5 Mock-to-Real API Integration Map

## Status

Draft generated from frontend mock services and Phase 3 backend API modules.

This document must be manually reviewed before the PR is merged.

## Repository

    info-rbp/rbp-platform

## Purpose

This document maps every frontend mock service export to one backend API endpoint or an explicit deferral.

It is a Phase 5 preflight artifact. It does not implement frontend/backend integration.

## Acceptance Rule

Every row in the mapping table must end with one of:

- Mapped
- Deferred

No row may remain Needs review before this step is complete.

## Canonical Backend Decisions

| Area | Decision |
|---|---|
| The Fixer API | Use rbp_app.api.the_fixer as canonical. |
| API response shape | Use Phase 3 raw dictionary / serialized DocType responses unless a later contract-change PR introduces an envelope. |
| Files | Use RBP File Reference as canonical file wrapper. |
| Payments | Use RBP Subscription and RBP Payment Event as canonical payment/subscription models. |
| Entitlements | Use entitlement-aware app discovery for launcher visibility; product APIs are not globally hard-gated unless a later hardening PR changes this. |

## Integration Mapping Table

| Mock service file | Mock export | Domain | Backend endpoint | Status | Notes / Deferral |
|---|---|---|---|---|---|
| frontend/portal/src/app/services/mock/admin.mockService.ts | getMockAdminReviewQueues | Unclear | TBD | Needs review | Manual mapping or documented deferral required. |
| frontend/portal/src/app/services/mock/admin.mockService.ts | submitMockAdminReviewAction | Unclear | TBD | Needs review | Manual mapping or documented deferral required. |
| frontend/portal/src/app/services/mock/connectivity.mockService.ts | checkMockServiceability | connectivity | TBD | Needs review | Manual mapping or documented deferral required. |
| frontend/portal/src/app/services/mock/connectivity.mockService.ts | getMockConnectivityPlans | connectivity | /api/method/rbp_app.api.connectivity.get_request | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/connectivity.mockService.ts | submitMockConnectivityOrder | connectivity | /api/method/rbp_app.api.connectivity.submit_request | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/decisionDesk.mockService.ts | getMockDecisionDeskSetup | decision_desk | /api/method/rbp_app.api.decision_desk.get_request | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/decisionDesk.mockService.ts | submitMockDecisionDeskRequest | decision_desk | /api/method/rbp_app.api.decision_desk.submit_request | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/docushare.mockService.ts | getMockDocumentProducts | docushare | /api/method/rbp_app.api.docushare.get_folder | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/docushare.mockService.ts | submitMockDocuShareBrief | docushare | TBD | Needs review | Manual mapping or documented deferral required. |
| frontend/portal/src/app/services/mock/fixer.mockService.ts | getMockFixerSetup | the_fixer | /api/method/rbp_app.api.the_fixer.get_case | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/fixer.mockService.ts | submitMockFixerRequest | the_fixer | /api/method/rbp_app.api.the_fixer.submit_case | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/marketplace.mockService.ts | getMockMarketplaceItems | marketplace | /api/method/rbp_app.api.marketplace.get_vendor | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/marketplace.mockService.ts | submitMockMarketplaceEnquiry | marketplace | TBD | Needs review | Manual mapping or documented deferral required. |
| frontend/portal/src/app/services/mock/marketplace.mockService.ts | submitMockMarketplaceListing | marketplace | /api/method/rbp_app.api.marketplace.list_vendors | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/membership.mockService.ts | getMockMembershipPlans | membership | /api/method/rbp_app.api.membership.get_my_onboarding | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/membership.mockService.ts | submitMockMembershipOnboarding | membership | /api/method/rbp_app.api.membership.submit_onboarding | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/membership.mockService.ts | submitMockMembershipSignup | membership | /api/method/rbp_app.api.membership.submit_onboarding | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/mockClient.ts | createMockReference | Unclear | TBD | Needs review | Manual mapping or documented deferral required. |
| frontend/portal/src/app/services/mock/mockClient.ts | createMockTimeline | Unclear | TBD | Needs review | Manual mapping or documented deferral required. |
| frontend/portal/src/app/services/mock/mockClient.ts | requireFields | Unclear | TBD | Needs review | Manual mapping or documented deferral required. |
| frontend/portal/src/app/services/mock/mockClient.ts | waitForMockDelay | Unclear | TBD | Needs review | Manual mapping or documented deferral required. |
| frontend/portal/src/app/services/mock/portal.mockService.ts | getMockMe | dashboard | /api/method/rbp_app.api.dashboard.get_home | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/portal.mockService.ts | getMockPortalApplications | dashboard | /api/method/rbp_app.api.dashboard.get_home | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/portal.mockService.ts | getMockPortalDashboard | dashboard | /api/method/rbp_app.api.dashboard.get_home | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/portal.mockService.ts | getMockPortalDocuments | docushare | /api/method/rbp_app.api.docushare.get_folder | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/portal.mockService.ts | getMockPortalNotifications | dashboard | /api/method/rbp_app.api.dashboard.get_home | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/portal.mockService.ts | getMockPortalOffers | dashboard | /api/method/rbp_app.api.dashboard.get_home | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/portal.mockService.ts | getMockPortalResources | dashboard | /api/method/rbp_app.api.dashboard.get_home | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/portal.mockService.ts | getMockPortalServices | dashboard | /api/method/rbp_app.api.dashboard.get_home | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/portal.mockService.ts | getMockPortalSettings | dashboard | /api/method/rbp_app.api.dashboard.get_home | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/portal.mockService.ts | getMockPortalSupport | dashboard | /api/method/rbp_app.api.dashboard.get_home | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/riskAdvisor.mockService.ts | getMockRiskAdvisorSetup | risk_advisor | /api/method/rbp_app.api.risk_advisor.get_assessment | Mapped | Auto-mapped by domain/function naming. Review before merge. |
| frontend/portal/src/app/services/mock/riskAdvisor.mockService.ts | submitMockRiskAssessment | risk_advisor | /api/method/rbp_app.api.risk_advisor.submit_assessment | Mapped | Auto-mapped by domain/function naming. Review before merge. |

## Deferred Items Register

| Mock service / Area | Deferral | Reason | Owner / Workstream | Target Phase |
|---|---|---|---|---|
|  |  |  |  |  |

## Manual Review Checklist

| Check | Status | Notes |
|---|---|---|
| Every mock export is listed | Pending | Compare against frontend/portal/src/app/services/mock. |
| Every mock export has a backend endpoint or deferral | Pending | No Needs review rows allowed before merge. |
| The Fixer mappings use rbp_app.api.the_fixer | Pending | Do not use rbp_app.api.fixer unless an alias is later created. |
| Response shape handling is documented | Pending | Client must expect raw dictionary responses. |
| File/upload mappings use RBP File Reference | Pending | Raw upload implementation may remain deferred. |
| Payment mappings use RBP Subscription / RBP Payment Event | Pending | Live provider work may remain deferred. |
| No implementation files changed | Pending | This PR is documentation/evidence only. |

## Final Decision

| Item | Status |
|---|---|
| All mock services mapped or deferred | Pending |
| Ready for first real API integration pilot | Pending |

## Evidence

Supporting evidence files:

- docs/qa/evidence/phase5-frontend-mock-service-inventory.txt
- docs/qa/evidence/phase5-backend-api-inventory.txt
- docs/qa/evidence/phase5-mock-to-real-integration-map-evidence.txt
