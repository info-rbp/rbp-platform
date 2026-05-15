# UAT Defect Log

This file is retained as a clean UAT tracking template. Historical defect claims from the superseded QA readiness PR were not carried forward unless they are revalidated against current `main`, because stale defects are how projects turn into archaeology exhibits.

Use this log during human QA only. Do not mark a defect fixed until the fix commit or PR is recorded and retested.

## Severity guide

- `P0`: Blocks QA sign-off or launch boundary, including live payment leakage, Application provisioning exposure, data loss, auth bypass, or broken core flows.
- `P1`: Important QA issue with workaround or limited blast radius.
- `P2`: Minor content, UI, or polish issue.
- `P3`: Backlog or improvement.

## Defect table

| ID | Severity | Area | Route / Record | User type | Expected result | Actual result | Status | Owner | Fix PR / commit | Retest evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UAT-001 |  |  |  |  |  |  | Open |  |  |  |

## Required launch-boundary checks

Add a defect immediately if QA finds any of the following:

- Applications can be provisioned by a customer.
- Stripe uses live mode during QA.
- Marketplace listing publishes automatically without review/gating.
- React `/admin` claims authoritative operational control that is not backed by Frappe persistence.
- Placeholder legal copy remains visible.
- Protected portal/admin route is public or indexable.
- Email notification sends to a non-allowlisted production recipient during sandbox QA.
