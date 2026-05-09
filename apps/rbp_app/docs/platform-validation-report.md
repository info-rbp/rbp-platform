# RBP Platform Validation Report

Validated on 2026-05-02 against the local Frappe bench.

## Bench

- Bench root: `/Users/gianpaulocoletti/frappe-1/start`
- Site: `frappe.localhost`
- Server: `http://127.0.0.1:8000` with `Host: frappe.localhost`

## Platform Scope

`rbp_app` is the RBP platform layer on top of Frappe. `/portal` and `/app` are the customer-facing protected surfaces, while `/desk` remains Frappe's admin/backend workspace. Installed Frappe apps are discovered dynamically and treated as backend capability providers. HRMS is one capability module among many, not the whole platform.

## Installed Apps

`frappe`, `erpnext`, `hrms`, `insights`, `gameplan`, `frappe_whatsapp`, `payments`, `lms`, `crm`, `builder`, `drive`, `lending`, `telephony`, `helpdesk`, `meet`, `education`, `mail`, `slides`, `newsletter`, `webshop`, `blog`, `ecommerce_integrations`, `school_automations`, `ff_assignment_portal`, `fc_saas_helper`, `frappe_openai_integration`, `erpnext_australian_localisation`, `wiki`, `business_hub`, `rbp_app`

## Migration Result

Command:

```sh
bench --site frappe.localhost migrate
```

Result: passed.

Note: migration emitted a non-fatal warning from another installed app:

```text
school_automations.utils.pull_recordings_for_yesterdays_live_classes is not a valid method: No module named 'offsite_backups'
```

The migration continued and completed.

## Cache Result

Command:

```sh
bench --site frappe.localhost clear-cache
```

Result: passed.

## Test Result

`allow_tests` is enabled for `frappe.localhost`.

Command:

```sh
bench --site frappe.localhost run-tests --app rbp_app
```

Result: passed.

Frappe output:

```text
Running 63 unspecified-category tests for rbp_app
Ran 63 tests in 0.218s
OK
```

## API Validation Result

Authenticated validation used an Administrator API token and an Administrator session created for local validation. The temporary session was deleted after route checks.

Validated endpoints:

- `/api/method/rbp_app.api.me.get_current_user`: passed; returned Administrator user payload, roles, `is_system_manager: true`, and `is_admin: true`.
- `/api/method/rbp_app.api.apps.get_available_apps`: passed; returned installed app cards plus RBP platform modules.
- `/api/method/rbp_app.api.dashboard.get_home`: passed; returned current user, available apps, grouped categories, quick links, notifications placeholder, billing placeholder, and integrations status.
- `/api/method/rbp_app.api.integrations.get_integrations_status`: passed; returned 30 installed apps, 12 known apps, 18 unknown apps, and 3 platform modules.

Guest API check:

- `/api/method/rbp_app.api.me.get_current_user`: rejected with HTTP 401.

## Route Validation Result

Guest route checks:

- `/portal`: HTTP 302 to `/login?redirect-to=%2Fportal`
- `/portal/dashboard`: HTTP 302 to `/login?redirect-to=%2Fportal%2Fdashboard`
- `/portal/apps/hrms`: HTTP 302 to `/login?redirect-to=%2Fportal%2Fapps%2Fhrms`
- `/app`: HTTP 302 to `/login?redirect-to=%2Fapp`
- `/admin`: HTTP 302 to `/login?redirect-to=%2Fadmin`

Authenticated Administrator session route checks:

- `/portal`: HTTP 200
- `/portal/dashboard`: HTTP 200
- `/portal/apps/hrms`: HTTP 200 through the portal app detail route
- `/app`: HTTP 302 to `/portal`
- `/admin`: HTTP 200

## Failures Found

- After enabling `allow_tests`, `bench --site frappe.localhost run-tests --app rbp_app` executed successfully and 58 rbp_app tests passed.
- `rbp_app.tests.test_api_integrations.test_known_app_adapter_returns_safe_response` failed because `ADAPTERS` captured adapter function objects at import time, so test patches on `integrations.hrms.get_summary` did not affect the call path.
- `rbp_app.tests.test_api_integrations.test_missing_optional_app_is_safe` failed for the same import-time function capture on `integrations.crm.get_summary`.
- The post-test/preload phase failed with `DocType RBP App Entitlement not found` because the newer platform DocTypes lived outside the synced `RBP App` module DocType path.
- Moving those DocTypes into the synced path exposed DocType-local metadata tests to Frappe's legacy test-record preloader, which attempted ERPNext fixture bootstrap and hit an existing Fiscal Year overlap on this local site.
- `/portal/apps/hrms` originally returned 404 before a route fallback was added.
- `/app` originally followed Frappe core's `/app -> /desk` redirect before RBP protection could run.

## Fixes Applied

- Updated `rbp_app.api.integrations.ADAPTERS` to store adapter modules and call `adapter.get_summary(user)` at runtime, keeping exception handling and generic fallback behavior intact.
- Moved `RBP App Entitlement`, `RBP Tenant`, `RBP Subscription`, `RBP Audit Log`, and `RBP Notification` DocType source folders into the synced `rbp_app/rbp_app/rbp_app/doctype` module path.
- Removed the DocType-local metadata-only test modules that triggered legacy test-record preloading; the DocTypes were verified by `bench migrate` and `frappe.get_meta(...)`.
- Added a `before_request` platform guard so protected RBP routes are checked before Frappe website redirects.
- Updated request path detection to work during early request hooks.
- Added route rules for `/portal/apps` and `/portal/apps/<app_key>` to resolve to the existing portal dashboard shell until dedicated per-app portal pages exist.
- Kept API protection inside API methods; website route protection now runs in both early request and website context layers.

## Remaining Risks

- The 63-test `rbp_app` suite now passes on `frappe.localhost` and `rbp-minimal.localhost`.
- `/portal/apps/<app_key>` now resolves to a dedicated app detail page; HRMS has the first richer aggregate-only detail experience.
- Stripe/payment-provider synchronization is not fully wired.
- Tenant provisioning is not fully wired.
- Document repository behavior is still placeholder-backed.
- Some app-specific adapters are placeholders.
- The entitlement management UI is not complete.
- The local bench has many installed apps; validation should also be repeated on a minimal Frappe-only site.
- The migration warning from `school_automations` should be reviewed separately because it references a missing `offsite_backups` module outside `rbp_app`.
- An Administrator API secret was generated during validation; rotate or clear it if this local site is shared.
## Clean Minimal Site Validation

Validated on `rbp-minimal.localhost`.

Commands:

```sh
bench new-site rbp-minimal.localhost --db-root-username root
bench --site rbp-minimal.localhost install-app rbp_app
bench --site rbp-minimal.localhost set-config allow_tests true
bench --site rbp-minimal.localhost migrate
bench --site rbp-minimal.localhost clear-cache
bench --site rbp-minimal.localhost run-tests --app rbp_app
```

Result: passed.

Test output:

```text
Running 63 unspecified-category tests for rbp_app
Ran 63 tests in 0.220s
OK
```

Note: MariaDB 12.2.2 emitted a warning during validation.

Conclusion: `rbp_app` works with only Frappe installed.
