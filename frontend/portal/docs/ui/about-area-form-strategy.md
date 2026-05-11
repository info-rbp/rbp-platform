# About Area Form Strategy

## Purpose

This document defines the short-term and future strategy for forms in the About Us area.

| Form | Route | Current Behaviour | Future Backend Target |
|---|---|---|---|
| Contact enquiry | `/contact` | Frontend validation and local success state | `rbp_app.api.contact.create_contact_enquiry` |
| Discovery call | `/about/discovery-call` | Frontend validation and local success state | `rbp_app.api.booking.create_discovery_call_request` |
| Partnership enquiry | `/about/work-with-us` | Frontend validation and local success state | `rbp_app.api.partnership.create_partner_enquiry` |
| Expression of interest | `/about/work-for-us` | Frontend validation and local success state | `rbp_app.api.recruitment.create_expression_of_interest` |

## Short-Term Strategy

Forms should validate required fields locally, use professional success states, avoid public implementation caveats, and keep a stable service boundary for future backend integration.

## Future Backend Mapping

- Contact enquiry: `RBP Contact Enquiry`
- Discovery call: `RBP Discovery Call Request`
- Partnership enquiry: `RBP Partner Enquiry`
- Candidate expression of interest: `RBP Candidate Expression of Interest`

## Current Frontend Files

- `frontend/portal/src/app/types/aboutForms.ts`
- `frontend/portal/src/app/data/aboutFormStrategy.ts`
- `frontend/portal/src/app/services/aboutFormService.ts`
