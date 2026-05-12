# Milestone 4: Backend Applications Admin Model

Milestone 4 introduces an admin-managed Applications catalogue for Remote Business Partner. Applications can now be created, edited, archived, listed, and reviewed through backend services, whitelisted APIs, and Frappe Desk DocTypes.

This milestone does not launch Applications to customers. Public users and authenticated members can only see safe Application cards and register interest. Customer provisioning, launching, opening, activation, and access are intentionally disabled server-side.

## Purpose

The backend now has a durable source of truth for Application cards before later rollout work adds provisioning. This lets Admin/System Manager users prepare Application records, organize categories, review demand, and track future provisioning requests without exposing provisioning actions to customers.

## DocTypes

### RBP Application Category

Admin-managed category records used to group Applications.

Key fields:

- `category_name`
- `category_key`
- `description`
- `public_summary`
- `sort_order`
- `enabled`

`category_key` is generated from `category_name` when omitted and normalized to lowercase `a-z`, `0-9`, and `_`.

### RBP Application

The admin-managed Application catalogue record.

Key fields:

- `application_name`
- `application_key`
- `category`
- `description`
- `short_description`
- `status`
- `visibility`
- `provider`
- `installed_app_key`
- `public_summary`
- `portal_summary`
- `requires_subscription`
- `requires_manual_approval`
- `provisioning_enabled`
- `interest_enabled`
- `archived`

`application_key` is generated from `application_name` when omitted and normalized to lowercase `a-z`, `0-9`, and `_`.

`provisioning_enabled` is forced to false in this milestone unless a future server-side feature flag explicitly enables provisioning. There is no frontend-only provisioning override.

### RBP Application Interest

Stores public, portal, admin, import, or API interest submissions.

Key fields:

- `tenant`
- `user`
- `application`
- `business_name`
- `contact_name`
- `email`
- `phone`
- `interest_notes`
- `status`
- `source_channel`
- `created_on`
- `reviewed_by`
- `reviewed_on`
- `internal_notes`

Duplicate open interest records for the same Application and email are handled in the service layer by updating/returning the existing record instead of creating duplicate spam.

### RBP Application Provisioning Request

Future rollout tracking for Application provisioning. It exists for admin/backend readiness only.

Key fields:

- `tenant`
- `user`
- `application`
- `status`
- `requested_on`
- `approved_by`
- `approved_on`
- `provisioned_on`
- `provider_reference`
- `internal_notes`

No public or portal API creates provisioning requests in this milestone. Guest creation is blocked by the controller.

## Statuses

Application statuses:

- `draft`
- `internal`
- `coming_soon`
- `register_interest`
- `qa_preview`
- `available_later`
- `disabled`

Application visibility values:

- `public`
- `portal`
- `admin`
- `hidden`

Interest statuses:

- `new`
- `reviewed`
- `contacted`
- `converted`
- `closed`

Provisioning request statuses:

- `requested`
- `under_review`
- `approved`
- `provisioning`
- `provisioned`
- `failed`
- `cancelled`

## APIs

Whitelisted API methods are implemented in `rbp_app.api.applications`.

Admin methods:

- `admin_list_applications`
- `admin_get_application`
- `admin_create_application`
- `admin_update_application`
- `admin_archive_application`
- `admin_list_application_interest`
- `admin_update_application_interest`

Public/member methods:

- `list_public_applications`
- `list_portal_applications`
- `register_application_interest`

Only `list_public_applications` and `register_application_interest` allow Guest access. `list_portal_applications` requires an authenticated user. Admin methods require a System Manager or recognized RBP admin/operations role.

## Launch Behavior

Applications can be created and managed by Admin/System Manager users.

Public users can view safe Applications where:

- `archived = 0`
- `visibility = public`
- `status` is `coming_soon`, `register_interest`, or `available_later`

Authenticated members can view portal-safe Applications where:

- `archived = 0`
- `visibility` is `public` or `portal`
- `status` is `coming_soon`, `register_interest`, `qa_preview`, or `available_later`

Public users and members can register interest only when the Application is not archived, not disabled, visible to the audience, and has `interest_enabled = 1`.

Application provisioning is intentionally disabled until the next rollout phase. Customer-facing provisioning APIs are not implemented, and `provisioning_enabled` is forced false by backend validation.

## Existing Integrations

The existing installed-app discovery and entitlement services remain intact. `RBP Application.installed_app_key` can reference installed Frappe application keys, but installed app presence does not grant customer access or provisioning entitlement.

Interest registration emits audit events and internal notification records when the existing audit/notification DocTypes are available. This milestone does not implement email delivery.

## Limitations

This milestone does not add Stripe, customer provisioning, frontend React screens, entitlement automation, or email notification delivery. It creates the backend/admin model and safe public/member read and interest APIs only.
