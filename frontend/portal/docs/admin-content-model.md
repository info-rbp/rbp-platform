# Admin Content Model

This document maps the current public static data files to the future admin-managed content model.

The purpose of this stage is planning only. It does not implement backend persistence, admin CRUD screens, authentication, member permissions, payments, or file uploads.

## Current frontend state

The public site now has:

- Public routes
- Public navigation
- Anchor destinations
- Query parameter handling
- Static public data files
- Public content readiness audit
- Launch-safe content pass

The next backend/admin step should use the static data model as the first draft of the future database schema.

## Core admin-managed entities

| Entity | Static data file | Future admin path | Backend required | Notes |
|---|---|---:|---:|---|
| Public Navigation | `src/app/data/publicNavigation.ts` | `/admin/site-content/navigation` | Yes | Mega menu, ordering, labels, CTAs |
| Public Sitemap | `src/app/data/publicSitemap.ts` | `/admin/site-content/sitemap` | Yes | Site content registry |
| Business Categories | `src/app/data/serviceCategories.ts` | `/admin/settings/business-categories` | Yes | Shared taxonomy |
| On-Demand Services | `src/app/data/onDemandServices.ts` | `/admin/on-demand/services` | Yes | Service catalogue |
| Managed Services | `src/app/data/managedServices.ts` | `/admin/managed-services` | Yes | Retained service catalogue |
| Applications | `src/app/data/applications.ts` | `/admin/applications` | Yes | Application catalogue |
| Operations | `src/app/data/operations.ts` | `/admin/operations` | Yes | Finance, insurance, connectivity, calculators |
| Marketplace | `src/app/data/marketplace.ts` | `/admin/marketplace` | Yes | Product and asset listings |
| Membership | `src/app/data/membership.ts` | `/admin/membership` | Yes | Plans, inclusions, usage, payment terms |
| Offers | `src/app/data/offers.ts` | `/admin/offers` | Yes | Partner offers and benefits |
| Resources | `src/app/data/resources.ts` | `/admin/resources` | Yes | Articles, guides, tools, downloads |
| Help Center | `src/app/data/helpCenter.ts` | `/admin/help-center` | Yes | FAQs and support content |
| Legal Pages | `src/app/data/legalPages.ts` | `/admin/site-content/legal` | Yes | Requires approval/version controls |

## Suggested shared fields

Most admin-managed content records should support:

- `id`
- `title`
- `slug`
- `summary`
- `body`
- `category`
- `status`
- `visibility`
- `sortOrder`
- `isFeatured`
- `createdAt`
- `updatedAt`
- `publishedAt`
- `createdBy`
- `updatedBy`

## Suggested status values

- `draft`
- `review`
- `published`
- `archived`

## Suggested visibility values

- `public`
- `members`
- `admin`
- `hidden`

## Implementation warning

Do not build one-off admin forms for each page before agreeing on the shared content fields. That is how admin portals become tragic little filing cabinets with login screens.
