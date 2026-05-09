# RBP App - Remote Business Partner

Custom Frappe application and platform layer for the Remote Business Partner platform.

## Overview

This app is the RBP platform layer on top of Frappe. It contains:

- **Public website shell** - Header, navigation, footer, and all public-facing page routes
- **Auth shell** - Minimal login/register/password-reset page templates
- **Portal shell** - Authenticated customer-facing portal with sidebar navigation
- **Admin scaffold** - Structural references pointing to Frappe Desk
- **Platform APIs** - Whitelisted API methods in `rbp_app.api`
- **Service layer** - Business logic and cross-app integrations in `rbp_app.services`
- **App adapters** - Capability-specific adapters in `rbp_app.services.adapters`
- **Platform DocTypes** - Tenant, entitlement, subscription, audit log, and notification models

Frappe is the only required app. Installed Frappe apps such as ERPNext, HRMS, CRM, LMS, Helpdesk, Insights, Builder, Drive, Wiki, Payments, Webshop, and other apps remain optional backend capability providers discovered dynamically at runtime. RBP does not rebuild those apps, modify Frappe core, or replace Frappe Desk. HRMS is one capability provider, not the whole architecture.

## Architecture

```
rbp_app/
├── rbp_app/
│   ├── hooks.py              # Frappe hooks (assets, routes)
│   ├── api/                   # Whitelisted platform API methods
│   ├── services/              # Business services and app integrations
│   ├── doctype/               # RBP platform DocTypes
│   ├── patches/               # RBP platform patches
│   ├── guards.py              # Website route guards
│   ├── permissions.py         # Shared role helpers
│   ├── www/                  # Website pages (filesystem-driven routes)
│   │   ├── index.html        # Home page (/)
│   │   ├── services/         # /services/*
│   │   ├── membership/       # /membership/*
│   │   ├── resources/        # /resources/*
│   │   ├── finance/          # /finance/*
│   │   ├── offers/           # /offers/*
│   │   ├── decision-desk/    # /decision-desk/*
│   │   ├── documents/        # /documents/*
│   │   ├── support/          # /support/*
│   │   ├── help/             # /help/*
│   │   ├── portal/           # /portal/* (authenticated)
│   │   ├── admin/            # /admin/* (scaffold → Desk)
│   │   ├── login.html        # Auth pages
│   │   ├── register.html
│   │   └── ...
│   ├── templates/
│   │   ├── shells/           # Base shell templates
│   │   │   ├── public_base.html
│   │   │   ├── auth_base.html
│   │   │   ├── portal_base.html
│   │   │   └── admin_base.html
│   │   ├── includes/         # Shared template fragments
│   │   │   ├── header.html
│   │   │   ├── footer.html
│   │   │   ├── mega_menu.html
│   │   │   ├── portal_sidebar.html
│   │   │   └── admin_shell_elements.html
│   │   └── pages/            # (future) full page templates
│   ├── public/
│   │   ├── css/rbp.css       # RBP stylesheet
│   │   ├── js/rbp.js         # RBP JavaScript
│   │   └── images/           # Static images
│   ├── config/
│   │   └── navigation.py     # Navigation configuration
│   └── utils/
├── tests/
├── pyproject.toml
├── ADMIN_APPROACH.md
└── README.md
```

## Shell Modes

### 1. Public Shell (`public_base.html`)
Full website layout: header with navigation, main content area, footer.

### 2. Auth Shell (`auth_base.html`)
Minimal layout: small header/logo, centered auth card, support link, small footer.

### 3. Portal Shell (`portal_base.html`)
Authenticated customer-facing layout: sidebar navigation, portal header, page content region. `/portal`, `/portal/*`, `/app`, and `/app/*` require login.

### 4. Admin Shell (`admin_base.html`)
Scaffold only. Admin/backend work is served by Frappe Desk at `/desk`. `/admin` and `/admin/*` are restricted to Administrator, System Manager, or configured RBP admin roles. See `ADMIN_APPROACH.md`.

## Platform APIs

Phase 1 platform APIs live under `rbp_app.api`:

| API | Purpose |
|---|---|
| `rbp_app.api.me.get_current_user` | Current user, full name, roles, user type, guest state |
| `rbp_app.api.apps.get_available_apps` | Role-aware app cards based on installed apps and entitlement placeholders |
| `rbp_app.api.dashboard.get_home` | Portal dashboard payload |
| `rbp_app.api.hr.get_employee_summary` | HRMS-backed employee summary, safe empty response if HRMS is absent |
| `rbp_app.api.hr.get_leave_summary` | HRMS-backed leave summary, safe empty response if HRMS is absent |
| `rbp_app.api.integrations.get_integrations_status` | Installed app and platform module status |
| `rbp_app.api.integrations.get_app_summary` | Adapter-backed app summary with generic fallback |

Services live in `rbp_app.services` and own business logic. App adapters live in `rbp_app.services.adapters`. API modules should stay thin wrappers around those services.

## Portal App Launcher

The customer portal dashboard renders a dynamic ecosystem app launcher. App cards come from `rbp_app.services.apps` and are also exposed through `rbp_app.api.apps.get_available_apps`.

- Installed Frappe apps are discovered with `frappe.get_installed_apps()`.
- Known apps receive first-class labels, categories, descriptions, and `/portal/apps/<app_key>` routes.
- Unknown installed apps receive safe generic cards.
- ERPNext, Payments, HRMS and other ecosystem apps appear when installed; they are not required to install `rbp_app`.
- RBP platform modules such as Documents and Notifications are included alongside installed apps.
- Billing appears only for Administrator/System Manager users.
- HRMS is one capability module, not the centre of the portal.
- Static portal links remain as a fallback if dynamic app loading is unavailable.

## Platform DocTypes

RBP platform DocTypes support ecosystem-wide SaaS behavior:

- `RBP Tenant` for tenant/workspace identity.
- `RBP App Entitlement` for installed apps, RBP modules, and external integration availability.
- `RBP Subscription` for subscription state placeholders before billing provider wiring.
- `RBP Audit Log` for platform events.
- `RBP Notification` for portal notifications.

## Installation

```bash
# From bench directory
bench get-app /path/to/rbp_app
bench install-app rbp_app
```

## Validation

```bash
bench --site <site> install-app rbp_app
bench --site <site> migrate
bench --site <site> clear-cache
bench --site <site> run-tests --app rbp_app
```

The latest local validation report is in `docs/platform-validation-report.md`. In that bench, migrate and clear-cache passed, authenticated API and route checks passed, and `bench --site frappe.localhost run-tests --app rbp_app` executed successfully. The report records 58 rbp_app tests passed.

## Remaining Gaps

- Stripe/payment-provider synchronization is not fully wired yet.
- Tenant provisioning is not fully wired yet; `RBP Tenant` is the canonical platform model, with legacy tenant compatibility retained.
- Document repository behavior is still placeholder-backed until storage/retrieval models are completed.
- App adapters beyond the first HRMS-safe summaries are mostly availability placeholders.
- Entitlement records can influence app cards, but a dedicated entitlement management UI is not complete.
- `/portal/apps/<app_key>` currently resolves to `/portal/apps/app` until dedicated per-app portal pages are built.

## Key Decisions

1. **All RBP business pages live in this custom app**, not in `frappe/` core.
2. **Shell templates extend `frappe/templates/base.html`** to inherit framework features.
3. **Admin/backend operations remain in Frappe Desk** at `/desk`; `/admin` is an RBP scaffold guarded for admin users.
4. **Customer-facing routes** are `/portal`, `/portal/*`, `/app`, `/app/*`, and `/portal/apps/<app_key>`.
5. **Platform logic belongs in `rbp_app.api` and `rbp_app.services`**, not in Frappe core.
6. **Frappe apps remain backend capability providers** for HRMS, CRM, LMS, ERPNext, billing, and related workflows.

## Route Coverage

| Section | Routes | Shell |
|---|---|---|
| Public (home, about, etc.) | 7 | Public |
| Services | 3 | Public |
| Membership | 5 | Public |
| Resources | 2+ | Public |
| Finance | 8 | Public |
| Offers | 1+ | Public |
| Decision Desk | 4 | Public |
| Documents | 5 | Public |
| Support | 3 | Public |
| Help | 1 | Public |
| Auth | 6 | Auth |
| Portal | 13 plus `/app` aliases and `/portal/apps/<app_key>` fallback | Portal |
| Admin | 13 | Admin (scaffold) |

## Framework-Core Changes

**None.** This app operates entirely within the custom app layer. Zero modifications to `frappe/` core files.
