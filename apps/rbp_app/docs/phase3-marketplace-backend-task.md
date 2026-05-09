# Phase 3: Marketplace Backend Sprint

Repository:
info-rbp/frappe-project

App:
rbp_app

Branch:
phase3/marketplace-backend

Scope:
Backend only. Do not implement frontend, UI/UX, launch, repo consolidation, Connectivity/NBN, Risk Advisor, or The Fixer.

Architecture:
- rbp_app.api.* = thin whitelisted API layer
- rbp_app.services.* = business logic, tenant checks, permissions, workflows, audit, notifications
- rbp_app.rbp_app.doctype.* = Frappe DocTypes, validation, persistence, workflow state

Do not modify:
- frappe/
- start/apps/*
- start/sites/*
- generated bench files
- Frappe core
- frontend repositories

Create these DocTypes:
1. RBP Marketplace Vendor
2. RBP Marketplace Listing
3. RBP Marketplace Order

RBP Marketplace Vendor fields:
- tenant
- owner_user
- vendor_name
- description
- contact_email
- contact_phone
- website
- status
- verification_status
- notes

RBP Marketplace Listing fields:
- tenant
- vendor
- owner_user
- title
- category
- description
- price
- currency
- billing_model
- status
- visibility
- notes

RBP Marketplace Order fields:
- tenant
- listing
- vendor
- buyer_user
- status
- quantity
- total_amount
- currency
- requested_on
- approved_on
- fulfilled_on
- cancelled_on
- notes

Vendor statuses:
- Draft
- Active
- Suspended
- Archived

Verification statuses:
- Unverified
- Pending
- Verified
- Rejected

Listing statuses:
- Draft
- Active
- Paused
- Archived

Visibility values:
- Private
- Tenant
- Public

Order statuses:
- Requested
- Approved
- In Progress
- Fulfilled
- Cancelled
- Rejected

Create service:
rbp_app/rbp_app/services/marketplace.py

Service methods:
- create_vendor(user, payload)
- update_vendor(user, vendor_name, payload)
- list_vendors(user, filters=None)
- get_vendor(user, vendor_name)
- create_listing(user, payload)
- update_listing(user, listing_name, payload)
- list_listings(user, filters=None)
- get_listing(user, listing_name)
- create_order(user, listing_name, payload)
- update_order_status(user, order_name, status, payload=None)
- list_my_orders(user, filters=None)
- get_order(user, order_name)

Service responsibilities:
- tenant ownership
- vendor ownership and admin checks
- listing ownership through vendor
- buyer/vendor/admin order visibility
- status transition validation
- audit logging
- notifications
- server-side permission checks

Create API:
rbp_app/rbp_app/api/marketplace.py

Whitelisted API methods:
- create_vendor
- update_vendor
- list_vendors
- get_vendor
- create_listing
- update_listing
- list_listings
- get_listing
- create_order
- update_order_status
- list_my_orders
- get_order

API rules:
- APIs must be thin.
- APIs should coerce payloads.
- APIs should require login or admin where appropriate.
- APIs should call the service layer.
- APIs should not contain business logic.

Audit events:
- marketplace_vendor_created
- marketplace_vendor_updated
- marketplace_listing_created
- marketplace_listing_updated
- marketplace_order_created
- marketplace_order_status_updated

Notification events:
- vendor created
- listing created
- order requested
- order status changed

Permission rules:
- Owner can create and update own vendor records.
- Vendor owner can create and update listings for their vendor.
- Buyer can create orders for active listings.
- Buyer can view own orders.
- Vendor owner can view orders for their listings.
- Admin/System Manager can manage all marketplace records.
- Cross-tenant access must hard-fail server-side.

Tests:
Create rbp_app/rbp_app/tests/test_marketplace.py

Tests must cover:
- DocType field definitions
- create vendor
- update vendor
- list vendors
- get vendor
- create listing
- update listing
- list listings
- get listing
- create order
- update order status
- list my orders
- get order
- owner access
- vendor access
- buyer access
- admin access
- cross-tenant denial
- audit event creation
- notification creation
- thin API payload coercion

Validation commands:
start/env/bin/python -m compileall -q rbp_app/rbp_app

start/env/bin/python -m unittest \
  rbp_app.tests.test_marketplace \
  rbp_app.tests.test_docushare \
  rbp_app.tests.test_decision_desk \
  rbp_app.tests.test_membership_onboarding \
  rbp_app.tests.test_phase3_partials \
  rbp_app.tests.test_platform_api \
  rbp_app.tests.test_tenancy \
  rbp_app.tests.test_api_integrations

Acceptance criteria:
- RBP Marketplace Vendor DocType exists.
- RBP Marketplace Listing DocType exists.
- RBP Marketplace Order DocType exists.
- Service layer exists.
- API layer exists.
- Tenant checks are enforced.
- Owner/vendor/buyer/admin permission paths work.
- Audit events are written.
- Notifications are created.
- Focused Marketplace tests pass.
- Existing Phase 3 tests still pass.
- No Frappe core changes.
- No start/apps/* changes.
- No start/sites/* changes.
