# Phase 2 Flow Field Inventory

## Purpose

This document inventories the frontend fields captured during Phase 1 mock flows so Phase 2 backend contracts can be planned.

Field names may differ in final backend schemas. This document captures the business concepts that need backend representation.

## Membership Purchase and Onboarding

### Account and Contact

- contactName
- contactEmail
- contactPhone
- businessName
- abn or businessIdentifier
- businessAddress
- role/title

### Plan and Payment Simulation

- selectedPlanId
- selectedPlanName
- selectedInclusions
- selectedExtras
- paymentMethodMock
- acceptedTerms
- mockPaymentStatus
- confirmationReference

### Onboarding

- businessProfile
- industry
- businessSize
- goals
- priorities
- managedServicesInterests
- teamMembers
- onboardingStatus

## Decision Desk

- businessName
- industry
- decisionTitle
- decisionCategory
- decisionSummary
- currentSituation
- optionsConsidered
- constraints
- urgency
- desiredOutcome
- supportingInformationAcknowledged
- contactName
- contactEmail
- requestStatus
- reference

## DocuShare / Document Nucleus

- businessName
- contactName
- contactEmail
- documentGroup
- documentCategory
- documentProductId
- jurisdiction
- intendedUse
- audience
- purpose
- businessContext
- groupSpecificAnswers
- stylePreference
- brandingPreference
- supportingInformationAcknowledged
- mockFilePlaceholders
- requestStatus
- reference

## Marketplace Buyer Enquiry

- itemId
- listingTitle
- buyerName
- buyerEmail
- businessName
- message
- enquiryStatus
- reference

## Marketplace Seller Listing

- listingTitle
- listingCategory
- listingType
- sellerName
- sellerEmail
- description
- price
- mockMediaPlaceholders
- acceptedTerms
- mockListingFeeStatus
- adminReviewStatus
- reference

## Connectivity / NBN Order

- serviceFamily
- provider
- serviceAddress
- serviceabilityStatus
- selectedPlanId
- selectedPlanName
- selectedHardwareId
- selectedHardwareName
- businessName
- abn
- contactName
- contactEmail
- contactPhone
- paymentMethodMock
- acceptedTerms
- contractTerm
- provisioningLeadTime
- orderStatus
- reference

## Risk Advisor

- businessName
- industry
- businessSize
- riskCategories
- currentControls
- controlMaturity
- incidentHistory
- complianceConcerns
- riskAppetite
- priorityOutcome
- mockScore
- scoreBand
- assessmentStatus
- reference

## The Fixer

- issueTitle
- issueCategory
- issueDescription
- urgency
- businessImpact
- scope
- affectedStakeholders
- whatHasBeenTried
- desiredResolution
- supportingInfoAcknowledged
- mockFilePlaceholders
- triageStatus
- reference

## Contact / Discovery Enquiry

- name
- email
- phone
- businessName
- enquiryType
- message
- preferredContactMethod
- sourceRoute
- enquiryStatus
- reference

## Application Setup / Portal Apps

- appId
- appName
- entitlementState
- accessRequestStatus
- requesterName
- requesterEmail
- businessName
- intendedUse
- adminReviewStatus
- reference

## Common Backend Fields

All major submissions should eventually include:

- id
- reference
- createdAt
- updatedAt
- createdBy
- ownerAccountId
- organisationId
- status
- workflowState
- assignedTo
- adminNotes
- auditTrail
- sourceRoute
- sourceFlow
- notificationState

## Phase 2 Recommendation

Create a shared base request model or Frappe mixin concept for:

- reference generation
- status lifecycle
- owner account
- organisation link
- submitted payload snapshot
- admin review actions
- audit trail
- notification events
