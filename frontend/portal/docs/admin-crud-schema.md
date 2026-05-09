# Admin CRUD Schema

This document defines the first planning version of the admin CRUD schema.

It maps future admin screens to public content entities and identifies the fields each admin-managed record should support.

## Purpose

The goal is to define the fields before building forms.

This prevents the admin portal from turning into a pile of disconnected editors, which would be impressive only in the same way a junk drawer is impressive.

## Initial CRUD entities

| Entity | Admin path | Collection | Public routes |
|---|---|---|---|
| Business Categories | `/admin/settings/business-categories` | `businessCategories` | `/resources`, `/offers`, `/on-demand/services` |
| Resources | `/admin/resources` | `resources` | `/resources` |
| Help Center | `/admin/help-center` | `helpArticles` | `/help` |
| Offers | `/admin/offers` | `offers` | `/offers` |
| Applications | `/admin/applications` | `applications` | `/applications` |
| Services | `/admin/services` | `services` | `/on-demand`, `/managed-services` |
| Marketplace | `/admin/marketplace` | `marketplaceListings` | `/marketplace` |
| Membership | `/admin/membership` | `membershipContent` | `/membership` |
| Legal Pages | `/admin/site-content/legal` | `legalPages` | `/legal` |

## Shared fields

Most records should support:

- Title
- Slug
- Summary
- Body
- Status
- Visibility
- Sort order
- Featured flag
- Created at
- Updated at
- Published at
- Created by
- Updated by

## Status workflow

Recommended workflow:

1. Draft
2. Review
3. Published
4. Archived

## Visibility workflow

Recommended visibility values:

- Public
- Members
- Admin
- Hidden

## Approval-sensitive records

These entities should require approval workflows:

- Offers
- Marketplace listings
- Membership
- Legal pages

## Backend note

This schema is frontend planning only. It does not yet create database collections, Firebase rules, server actions, admin forms, or authentication.
