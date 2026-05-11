# RBP Admin Approach

## Decision

**Admin functionality for RBP is served by Frappe Desk.**

Frappe Desk is the built-in admin interface provided by the Frappe framework. It offers:

- List views with filters, sorting, and pagination
- Form views for record creation and editing
- Workflow management
- Role-based access control
- Workspaces for module-level navigation
- Report builder
- Dashboard capabilities

## Why Frappe Desk?

1. **Mature and tested** - Frappe Desk is a production-grade admin interface used by thousands of organisations.
2. **Zero duplication** - Building a custom admin shell would duplicate existing Desk functionality.
3. **Native integration** - DocTypes, permissions, workflows, and reports all work natively in Desk.
4. **Maintainability** - Desk is maintained by the Frappe core team; a custom admin would be an ongoing maintenance burden.

## Admin Routes Mapping

The following admin routes are mapped to Frappe Desk equivalents:

| RBP Admin Route | Frappe Desk Equivalent |
|---|---|
| `/admin/dashboard` | `/desk` (Desk home / workspace) |
| `/admin/content` | `/desk/web-page` or custom DocType list |
| `/admin/services` | Custom "RBP Service" DocType list view |
| `/admin/resources` | Custom "RBP Resource" DocType list view |
| `/admin/finance` | Custom "RBP Finance Enquiry" DocType list |
| `/admin/offers` | Custom "RBP Offer" DocType list view |
| `/admin/decision-desk` | Custom "RBP Decision Request" DocType list |
| `/admin/documents` | Custom "RBP Document" DocType list view |
| `/admin/memberships` | Custom "RBP Membership" DocType list view |
| `/admin/billing` | Custom "RBP Invoice" DocType or Frappe billing |
| `/admin/users` | `/desk/user` (built-in User DocType) |
| `/admin/navigation` | Website Settings or custom config DocType |
| `/admin/settings` | Custom "RBP Settings" single DocType |

## Implementation Plan

### Phase 1 (Current - Shell)
- Admin scaffold placeholder pages exist at `/admin/*` as structural references.
- These pages redirect to Frappe Desk and document the mapping.
- `admin_base.html` shell template exists as a design reference.

### Phase 2 (DocTypes)
- Create custom DocTypes for RBP business entities.
- Configure Desk list views, form layouts, and workflows.
- Create a custom Desk workspace for RBP modules.

### Priority 3 (Production Admin)
- `Remote Business Partner` is installed as a private Desk workspace via a narrow `Workspace` fixture.
- Desk list views use `frappe.listview_settings["DocType Name"]` in each implemented RBP DocType folder.
- List indicators use the shared state colour convention: draft/pending orange, review blue, active/complete green, rejected/failed red, archived/closed grey.
- The React `/admin` surface is a lightweight command centre only. CRUD, record filtering, reports, and operational work stay in Frappe Desk.
- State-changing admin actions go through `rbp_app.services.workflows.perform_admin_action`, which validates admin role, domain, current state, required notes/assignee fields, and record visibility before saving.
- Admin actions write `RBP Audit Log` when the DocType exists and create `RBP Notification` records for user-facing state changes when that service is installed.
- `RBP Admin` is supported by permission helpers, but sites must create the role before assigning it because this app did not previously carry role fixtures. The workspace fixture uses `Administrator` and `System Manager` to keep install clean.

### Phase 3 (Enhancements)
- Custom Desk pages for specialised admin views if needed.
- Custom reports and dashboards.
- Workspace customisation.

## Scaffold Files

The following scaffold files exist in the custom app for reference:

- `rbp_app/templates/shells/admin_base.html` - Admin shell template (reference only)
- `rbp_app/templates/includes/admin_shell_elements.html` - Admin UI element concepts
- `rbp_app/www/admin/*.html` - Admin route placeholders that point to Desk

## Assumptions

1. Frappe Desk is accessible at `/desk` (standard Frappe configuration).
2. Custom DocTypes will be created in the `rbp_app` module during the data model phase.
3. Role-based access will be configured through Frappe's permission system.
4. No custom admin frontend framework (Vue/React admin panel) is needed.
5. Optional requested DocTypes that are not implemented yet are not linked from the workspace. Current omissions: `RBP Document Brief` and `RBP Fixer Request`.
