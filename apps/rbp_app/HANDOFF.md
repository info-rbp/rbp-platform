# RBP Platform Layer Handoff

---

## 1. Branch

**Branch:** `main`
**Repository:** `info-rbp/frappe-project`

---

## 2. Files Created and Modified

### Framework-Core Files Modified

**None.** Zero files inside `frappe/` were created, modified, or deleted.

### Frappe Custom App — `/app/rbp_app/` (93 source files)

#### App root
| File | Purpose |
|---|---|
| `pyproject.toml` | Python package config (flit, Frappe v17 compat) |
| `license.txt` | MIT license |
| `README.md` | App overview, structure, installation, route coverage |
| `ARCHITECTURE.md` | Shell architecture doc: flow diagram, boundaries, route ownership |
| `ADMIN_APPROACH.md` | Admin strategy: Frappe Desk mapping table, phase plan |
| `HANDOFF.md` | This file |

#### App module — `rbp_app/rbp_app/`
| File | Purpose |
|---|---|
| `__init__.py` | Package init, `__version__ = "0.1.0"` |
| `hooks.py` | Required app declaration, website assets, route rules, route guards, tenant context hooks |
| `modules.txt` | Frappe module declaration |
| `api/` | Whitelisted platform API modules |
| `services/` | Business services and cross-app integration modules |
| `doctype/` | RBP platform DocType package for future models |
| `patches/` | RBP platform patch package |
| `guards.py` | Portal and admin website route protection |
| `permissions.py` | Shared admin role helpers |
| `config/__init__.py` | Package init |
| `config/navigation.py` | `get_primary_nav()`, `get_utility_nav()`, `get_footer_nav()`, `get_portal_sidebar_nav()` |
| `utils/__init__.py` | Package init (empty, for future use) |

#### Shell templates — `rbp_app/rbp_app/templates/`
| File | Purpose |
|---|---|
| `shells/public_base.html` | Extends `templates/base.html`. Header + nav + content + footer. |
| `shells/auth_base.html` | Extends `templates/base.html`. Minimal header, centered card, "Back to site" link. |
| `shells/portal_base.html` | Extends `templates/base.html`. Sidebar nav, topbar with Website/Account/Sign Out. |
| `shells/admin_base.html` | Extends `templates/base.html`. Admin bar with Website/Portal/Sign Out. |
| `includes/header.html` | Header bar: logo, 9 primary nav items, utility (Search, My Portal, Login, Get Started). |
| `includes/footer.html` | 5-column footer (Company, Services, Resources, Support, Account). |
| `includes/mega_menu.html` | Placeholder for expanded nav (hidden, for future use). |
| `includes/portal_sidebar.html` | Portal sidebar: 10 nav items + Back to Website / Sign Out. |
| `includes/admin_shell_elements.html` | Admin UI element concepts (reference only). |

#### Public assets — `rbp_app/rbp_app/public/`
| File | Purpose |
|---|---|
| `css/rbp.css` | Unlimit BaaS-inspired dark-first stylesheet (Outfit font, dark palette, green/purple accents). |
| `js/rbp.js` | Active nav highlighting. |
| `images/.gitkeep` | Placeholder for static images. |

#### WWW pages — `rbp_app/rbp_app/www/` (70 HTML + 2 Python)

**Public shell — 38 pages:** `index.html`, `index.py`, `about.html`, `contact.html`, `faq.html`, `privacy.html`, `terms.html`, `help/index.html`, `services/index.html`, `services/category.html`, `service/index.html`, `membership/index.html`, `membership/plans.html`, `membership/pro.html`, `membership/ultimate.html`, `membership/compare.html`, `resources/index.html`, `resources/search.html`, `finance/index.html`, `finance/funding.html`, `finance/insurance.html`, `finance/calculators.html`, `finance/learn.html`, `finance/resources.html`, `finance/enquiry.html`, `finance/thank-you.html`, `offers/index.html`, `decision-desk/index.html`, `decision-desk/how-it-works.html`, `decision-desk/request.html`, `decision-desk/thank-you.html`, `documents/index.html`, `templates.html`, `toolkits.html`, `documentation-suites.html`, `product/index.html`, `support/index.html`, `support/contact.html`, `support/help-articles.html`

**Auth shell — 6 pages:** `login.html`, `register.html`, `join.html`, `forgot-password.html`, `reset-password.html`, `verify-account.html`

**Portal shell — 13 pages:** `portal/index.html`, `portal/dashboard.html`, `portal/membership.html`, `portal/library.html`, `portal/resources.html`, `portal/finance/index.html`, `portal/finance/enquiries.html`, `portal/decision-desk/index.html`, `portal/decision-desk/history.html`, `portal/billing.html`, `portal/account.html`, `portal/notifications.html`, `portal/support.html`

**Admin shell — 13 pages:** `admin/index.html`, `admin/content.html`, `admin/services.html`, `admin/resources.html`, `admin/finance.html`, `admin/offers.html`, `admin/decision-desk.html`, `admin/documents.html`, `admin/memberships.html`, `admin/billing.html`, `admin/users.html`, `admin/navigation.html`, `admin/settings.html`

### Preview Layer — `/app/frontend/` (10 source files)

Exists **only** for Emergent preview environment (React on port 3000). Not part of the Frappe app.

| File | Purpose |
|---|---|
| `package.json` | React 18 + react-router-dom 6 |
| `public/index.html` | HTML entry point |
| `.env` | `REACT_APP_BACKEND_URL` |
| `src/index.js` | React entry |
| `src/index.css` | Minimal reset |
| `src/App.js` | Route config: 70 routes across 4 shells |
| `src/App.css` | Full Unlimit-inspired dark design system |
| `src/components/PublicShell.js` | Header + footer (production-ready) |
| `src/components/AuthShell.js` | Centered auth card |
| `src/components/PortalShell.js` | Sidebar + topbar portal layout |
| `src/components/AdminShell.js` | Admin bar + content |
| `src/components/HomePage.js` | Hero, stats, cards, Why RBP, CTA banner |
| `src/components/PlaceholderPage.js` | Clean "content being prepared" empty state |

**Deleted files** (removed in production-ready pass):
- `src/components/ShellNavigator.js` — dev-only shell navigation bar
- `src/components/ArchitectureMap.js` — dev-only architecture documentation page

### Preview Layer — `/app/backend/` (2 source files)

| File | Purpose |
|---|---|
| `server.py` | `/api/health`, `/api/navigation`, `/api/architecture` |
| `requirements.txt` | fastapi, uvicorn, python-dotenv, pymongo |

---

## 3. Architecture Summary

### Custom app created?
**Yes.** `rbp_app` at `/app/rbp_app/`.

### Platform direction
`rbp_app` has evolved from a static website/auth/portal shell into the RBP platform layer. It sits on top of Frappe and connects installed Frappe apps into a unified customer-facing portal.

Frappe apps remain backend capability providers:
- ERPNext provides operational and accounting capabilities.
- HRMS provides employee and leave data.
- CRM provides customer and sales workflows.
- LMS provides learning workflows.
- Helpdesk, Insights, Builder, Drive, Wiki, Payments, Webshop and other installed apps are discovered dynamically.

RBP does not modify Frappe core, does not replace Frappe Desk, and does not rebuild HRMS, CRM, LMS, or ERPNext.

### Custom app name
`rbp_app` (hooks.py: `app_name = "rbp_app"`, `app_title = "Remote Business Partner"`)

### Where the public shell lives
- **Template:** `rbp_app/templates/shells/public_base.html` (extends `frappe/templates/base.html`)
- **Includes:** `rbp_app/templates/includes/header.html`, `footer.html`
- **Pages:** 38 HTML files in `rbp_app/www/`, each extending `public_base.html`
- **Assets:** `rbp_app/public/css/rbp.css`, `rbp_app/public/js/rbp.js`

### Where auth, portal, and admin scaffolds live
- **Auth:** `rbp_app/templates/shells/auth_base.html` → 6 pages in `rbp_app/www/`
- **Portal:** `rbp_app/templates/shells/portal_base.html` + `includes/portal_sidebar.html` → 13 pages in `rbp_app/www/portal/`. `/portal`, `/portal/*`, `/app`, `/app/*`, and `/portal/apps/<app_key>` are authenticated customer-facing routes.
- **Admin:** `rbp_app/templates/shells/admin_base.html` → 13 pages in `rbp_app/www/admin/`. Production admin/backend work uses Frappe Desk at `/desk`.

### Where platform APIs and services live
- **APIs:** `rbp_app.api` exposes whitelisted methods such as `get_current_user`, `get_available_apps`, `get_home`, integration status, and HRMS summary endpoints.
- **Services:** `rbp_app.services` contains installed-app checks, entitlement-aware app discovery, dashboard composition helpers, billing/document/notification placeholders, tenant compatibility helpers, and adapter orchestration.
- **Guards:** `rbp_app.guards` protects customer-facing and admin routes through `before_request` and `update_website_context`. API modules still enforce permissions inside each whitelisted method.

### Framework-core files changed
**None.** Zero files in `frappe/` were modified.

---

## 4. Route Map

### Public Shell (38 routes) — `public_base.html`

| Route | File |
|---|---|
| `/` | `www/index.html` + `index.py` |
| `/about` | `www/about.html` |
| `/contact` | `www/contact.html` |
| `/faq` | `www/faq.html` |
| `/privacy` | `www/privacy.html` |
| `/terms` | `www/terms.html` |
| `/help` | `www/help/index.html` |
| `/services` | `www/services/index.html` |
| `/services/<category>` | `www/services/category.html` |
| `/service/<slug>` | `www/service/index.html` |
| `/membership` | `www/membership/index.html` |
| `/membership/plans` | `www/membership/plans.html` |
| `/membership/pro` | `www/membership/pro.html` |
| `/membership/ultimate` | `www/membership/ultimate.html` |
| `/membership/compare` | `www/membership/compare.html` |
| `/resources` | `www/resources/index.html` |
| `/resources/search` | `www/resources/search.html` |
| `/finance` | `www/finance/index.html` |
| `/finance/funding` | `www/finance/funding.html` |
| `/finance/insurance` | `www/finance/insurance.html` |
| `/finance/calculators` | `www/finance/calculators.html` |
| `/finance/learn` | `www/finance/learn.html` |
| `/finance/resources` | `www/finance/resources.html` |
| `/finance/enquiry` | `www/finance/enquiry.html` |
| `/finance/thank-you` | `www/finance/thank-you.html` |
| `/offers` | `www/offers/index.html` |
| `/decision-desk` | `www/decision-desk/index.html` |
| `/decision-desk/how-it-works` | `www/decision-desk/how-it-works.html` |
| `/decision-desk/request` | `www/decision-desk/request.html` |
| `/decision-desk/thank-you` | `www/decision-desk/thank-you.html` |
| `/documents` | `www/documents/index.html` |
| `/templates` | `www/templates.html` |
| `/toolkits` | `www/toolkits.html` |
| `/documentation-suites` | `www/documentation-suites.html` |
| `/product/<slug>` | `www/product/index.html` |
| `/support` | `www/support/index.html` |
| `/support/contact` | `www/support/contact.html` |
| `/support/help-articles` | `www/support/help-articles.html` |

### Auth Shell (6 routes) — `auth_base.html`

| Route | File |
|---|---|
| `/login` | `www/login.html` |
| `/register` | `www/register.html` |
| `/join` | `www/join.html` |
| `/forgot-password` | `www/forgot-password.html` |
| `/reset-password` | `www/reset-password.html` |
| `/verify-account` | `www/verify-account.html` |

### Portal Shell (13 routes) — `portal_base.html`

| Route | File |
|---|---|
| `/portal` | `www/portal/index.html` |
| `/portal/dashboard` | `www/portal/dashboard.html` |
| `/portal/membership` | `www/portal/membership.html` |
| `/portal/library` | `www/portal/library.html` |
| `/portal/resources` | `www/portal/resources.html` |
| `/portal/finance` | `www/portal/finance/index.html` |
| `/portal/finance/enquiries` | `www/portal/finance/enquiries.html` |
| `/portal/decision-desk` | `www/portal/decision-desk/index.html` |
| `/portal/decision-desk/history` | `www/portal/decision-desk/history.html` |
| `/portal/billing` | `www/portal/billing.html` |
| `/portal/account` | `www/portal/account.html` |
| `/portal/notifications` | `www/portal/notifications.html` |
| `/portal/support` | `www/portal/support.html` |

Additional customer-facing platform routes:

| Route | Behavior |
|---|---|
| `/app` | Authenticated alias that redirects to `/portal` |
| `/app/*` | Authenticated alias to `/portal/apps/<app_key>` |
| `/portal/apps` | Authenticated app launcher fallback via `portal/dashboard` |
| `/portal/apps/<app_key>` | Authenticated app detail fallback via `portal/dashboard` until dedicated app pages exist |

### Admin Shell (13 routes) — `admin_base.html`

| Route | File |
|---|---|
| `/admin` | `www/admin/index.html` |
| `/admin/content` | `www/admin/content.html` |
| `/admin/services` | `www/admin/services.html` |
| `/admin/resources` | `www/admin/resources.html` |
| `/admin/finance` | `www/admin/finance.html` |
| `/admin/offers` | `www/admin/offers.html` |
| `/admin/decision-desk` | `www/admin/decision-desk.html` |
| `/admin/documents` | `www/admin/documents.html` |
| `/admin/memberships` | `www/admin/memberships.html` |
| `/admin/billing` | `www/admin/billing.html` |
| `/admin/users` | `www/admin/users.html` |
| `/admin/navigation` | `www/admin/navigation.html` |
| `/admin/settings` | `www/admin/settings.html` |

---

## 5. Known Gaps

### By design
- Frappe Desk remains the backend/admin workspace at `/desk`.
- HRMS, CRM, LMS, ERPNext, Payments, and other installed apps remain backend capability providers.
- RBP platform logic belongs in `rbp_app.api` and `rbp_app.services`.
- RBP platform data models live in `rbp_app.doctype`.

### Tenant model
- `RBP Tenant` is the canonical forward-looking tenant model for the RBP platform layer.
- The legacy `Tenant` DocType and `RBP Account` remain for backward compatibility with existing signup, billing-account, and user-permission flows.
- Portal context loading now goes through `rbp_app.services.tenancy.load_portal_tenant`, which prefers `RBP Tenant` and falls back to legacy `Tenant`.
- The compatibility helper `rbp_app.services.tenancy.get_current_tenant(user=None)` is the preferred tenant lookup entrypoint for new platform code.
- No data-destructive migration has been added; old `Tenant` records are not deleted or renamed.

### Structural gaps
1. **Some content routes remain shell placeholders.** Routes like `/services/<category>`, `/service/<slug>`, `/product/<slug>`, and `/portal/apps/<app_key>` resolve to safe shell/fallback pages until content-backed detail views are built.
2. **No `.py` context files** for most www pages. Only `www/index.py` exists. Others needed when business data is introduced.
3. **`/login` override fixed.** Native Frappe owns `/login`. The old RBP login page has been moved to `rbp_app/rbp_app/www/auth-disabled/login_legacy.html` for reference. Route guards continue to redirect guests to `/login?redirect-to=<path>`, while Frappe handles session creation, CSRF, login throttling, redirects and authentication errors.
4. **Portal content is still mostly placeholder UI.** The dashboard has a dynamic ecosystem launcher, but most detail pages still need live platform data.
5. **Validation covered one local bench.** `rbp_app` was installed on `frappe.localhost`; repeat validation on a minimal Frappe-only bench before claiming minimal-install coverage.
6. **Preview layer is separate.** `/app/frontend/` and `/app/backend/` exist only for Emergent preview. Not part of the Frappe deployment.
7. **Mega menu is a hidden placeholder.**
8. **Platform tests are focused unit tests.** More integration tests should be added when tenant provisioning and live cross-app data are introduced. The local bench test command executed successfully.
9. **Stripe is not wired yet.** `RBP Subscription` is available, but payment-provider synchronization is still future work.
10. **Tenant provisioning is not wired yet.** `RBP Tenant` exists, but automated site/workspace provisioning remains future work.
11. **Document repository is still placeholder-backed.** `RBP Notification` has service integration; document storage and retrieval still need a full repository implementation.
12. **Most app-specific adapters are placeholders.** HRMS has the first safe summary adapter; ERPNext, CRM and LMS currently return availability placeholders.
13. **Entitlement UI is not built yet.** `RBP App Entitlement` can drive service behavior, but there is no dedicated management UI beyond Frappe Desk forms.

### Phase 1 acceptance notes
- `/portal` and `/portal/*` redirect guests to `/login`.
- `/app`, `/app/*`, and `/portal/apps/<app_key>` redirect guests to `/login`.
- `/admin` and `/admin/*` require Administrator, System Manager, or configured RBP admin roles.
- `/api/method/rbp_app.api.me.get_current_user` returns the current user payload.
- `/api/method/rbp_app.api.apps.get_available_apps` returns app cards based on installed apps and roles.
- `/api/method/rbp_app.api.dashboard.get_home` returns dashboard composition data.
- HRMS endpoints return safe empty payloads when HRMS is absent.

### Validation

```bash
bench --site <site> install-app rbp_app
bench --site <site> migrate
bench --site <site> clear-cache
bench --site <site> run-tests --app rbp_app
```

Local validation note: `bench --site frappe.localhost migrate` and `bench --site frappe.localhost clear-cache` passed. Authenticated API and route checks passed. `bench --site frappe.localhost run-tests --app rbp_app` executed successfully. See `docs/platform-validation-report.md`.

### UI notes
- Design: Unlimit BaaS-inspired dark-first (navy #060714, green #c8ff00, Outfit font)
- All dev-facing UI removed: no shell navigator, no architecture map, no scaffold labels, no route badges
- Most pages show clean placeholder states and are ready for content replacement without structural changes.
