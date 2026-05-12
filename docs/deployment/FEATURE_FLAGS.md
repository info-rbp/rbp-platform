# Runtime Environment and Feature Flags

Milestone 3 centralises Remote Business Partner environment and rollout flags for the Frappe backend and React/Vite frontend.

## Backend Flags

Backend flags can be supplied as process environment variables or site config values. Environment variables take precedence.

```env
RBP_ENVIRONMENT=qa
RBP_ENABLE_STRIPE=true
RBP_STRIPE_MODE=test
RBP_ENABLE_EMAIL_NOTIFICATIONS=true
RBP_EMAIL_SANDBOX_MODE=true
RBP_ENABLE_APPLICATION_PROVISIONING=false
RBP_ENABLE_APPLICATION_INTEREST=true
RBP_ENABLE_ADMIN_APPLICATIONS=true
```

The backend exposes only sanitized runtime state through:

```text
rbp_app.api.runtime.get_public_runtime_config
```

No Stripe secret keys, email credentials, tokens, or raw site configuration values are returned to the frontend.

## Frontend Fallbacks

Vite local development can use matching `VITE_RBP_*` values from `frontend/portal/.env`. These are fallbacks only; the frontend runtime provider prefers the backend public runtime endpoint when it is available.

## Flag Meaning

| Flag | Purpose |
| --- | --- |
| `RBP_ENVIRONMENT` | Controls QA/staging/production display state. |
| `RBP_ENABLE_STRIPE` | Enables billing/payment runtime surfaces without implying live mode. |
| `RBP_STRIPE_MODE` | Allows `test` or `live`; live is only honored when Stripe is enabled. |
| `RBP_ENABLE_EMAIL_NOTIFICATIONS` | Enables notification delivery capability. |
| `RBP_EMAIL_SANDBOX_MODE` | Keeps email-capable environments in sandbox mode. |
| `RBP_ENABLE_APPLICATION_PROVISIONING` | Controls customer-facing application provisioning/access actions. |
| `RBP_ENABLE_APPLICATION_INTEREST` | Allows public/member interest capture while provisioning is disabled. |
| `RBP_ENABLE_ADMIN_APPLICATIONS` | Controls the admin Applications management surface. |

## Current Behaviour

When application provisioning is disabled, customer-facing application request actions are replaced by interest messaging where interest capture is enabled. Admin Applications can remain visible independently.

When Stripe is enabled in `test` mode, UI/runtime state reports test mode only. This milestone does not add Stripe checkout or live payment processing.

When email sandbox mode is enabled, runtime state reports sandbox delivery. This milestone does not add real outbound email delivery.
