# Phase 2 Portal Status Map

## Purpose

This document maps Phase 1 portal status cards and dashboard sections to future backend data contracts.

## Portal Aggregate

The Phase 2 portal dashboard should likely aggregate:

- membership status
- active service requests
- recent submissions
- document activity
- marketplace activity
- connectivity order status
- risk assessment status
- The Fixer request status
- notifications
- recommended next actions
- app entitlements
- offers eligibility
- support/help state

## Recommended Portal Aggregate Response

    {
      membership: object,
      activeRequests: array,
      recentActivity: array,
      documents: array,
      marketplace: array,
      connectivity: array,
      riskAdvisor: array,
      fixer: array,
      notifications: array,
      recommendedActions: array,
      apps: array,
      offers: array,
      support: object
    }

## Portal Status Types

| Status Area | Source Backend Object |
|---|---|
| Membership status | Membership/Application |
| Decision Desk status | DecisionDeskRequest |
| DocuShare status | DocumentBrief/DocumentRequest |
| Marketplace enquiry status | MarketplaceEnquiry |
| Marketplace listing status | MarketplaceListing |
| Connectivity order status | ConnectivityOrder |
| Risk Advisor status | RiskAssessment |
| The Fixer status | FixerRequest |
| App access status | AppEntitlement/AppAccessRequest |
| Offer eligibility | OfferEligibility |
| Support status | SupportTicket or HelpRequest |

## Status Card Fields

Recommended common fields:

- id
- reference
- title
- description
- status
- statusLabel
- href
- createdAt
- updatedAt
- nextActionLabel
- nextActionHref
- ownerTeam
- priority

## Notification Fields

Recommended common fields:

- id
- title
- body
- type
- severity
- readAt
- createdAt
- href
- sourceObjectType
- sourceObjectId

## Recommended Next Action Fields

Recommended common fields:

- id
- title
- description
- priority
- href
- flowArea
- dueAt
- completedAt

## Portal Permissions

Phase 2 should define:

- user account ownership
- organisation membership
- role within organisation
- access to documents
- access to requests
- access to billing/membership
- access to apps/offers/resources

## Empty States

Portal routes should support empty states for:

- no active requests
- no documents
- no offers
- no apps
- no notifications
- no support tickets
- no marketplace activity

## Phase 2 Recommendation

Build a portal aggregate endpoint only after individual flow contracts are defined.

Avoid making the dashboard endpoint the source of truth. It should aggregate from canonical flow records, not invent its own parallel reality. One reality is already too much for most systems.
