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
