# About Area UX and Conversion Recommendations

## Purpose

This document defines the UX and conversion rules for the Remote Business Partner About Us area.

The About Us area should guide users into the right pathway:

- Learn who RBP is
- Understand the platform
- Book a discovery call
- Explore partnership opportunities
- Register interest in future roles
- Send a general enquiry

The goal is to reduce confusion, dead links, vague CTAs, and the classic website problem where every button leads to Contact Us because apparently information architecture was busy that day.

---

## Final About Area Pages

| Page | Route | UX Purpose |
|---|---|---|
| About Us | `/about` | Establish trust, explain who RBP is, explain what has been built, and guide users to the next step. |
| Our Platform | `/about/our-platform` | Explain the platform ecosystem and how the major product areas fit together. |
| Discovery Call | `/about/discovery-call` | Convert interested visitors into structured discovery call requests. |
| Work With Us | `/about/work-with-us` | Capture partnership interest from organisations, advisors, suppliers, and service providers. |
| Work For Us | `/about/work-for-us` | Capture future employment and contractor interest from individuals. |
| Contact Us | `/contact` | Handle general enquiries and route users to the correct pathway. |

---

## CTA Routing Rules

| CTA Label | Destination |
|---|---|
| Book Discovery Call | `/about/discovery-call` |
| Request Discovery Call | `/about/discovery-call` |
| Explore Our Platform | `/about/our-platform` |
| Our Platform | `/about/our-platform` |
| Explore Services | `/core-services` |
| View Services | `/core-services` |
| View Membership | `/membership` |
| Join Membership | `/membership/sign-up-now` |
| Partner With Us | `/about/work-with-us` |
| Work With Us | `/about/work-with-us` |
| Submit Partnership Enquiry | `/about/work-with-us` |
| Work For Us | `/about/work-for-us` |
| Register Interest | `/about/work-for-us` |
| Future Opportunities | `/about/work-for-us` |
| Contact Us | `/contact` |
| Send Enquiry | `/contact` |

---

## Do Not Use

These patterns should be avoided:

| Bad Pattern | Reason |
|---|---|
| `/contact?reason=discovery-call` | Discovery Call now has a dedicated page. |
| `Our Platform -> /` | The platform explainer should not send users to the homepage. |
| Partnership CTA -> `/contact` | Partnership has a dedicated page. |
| Employment CTA -> `/contact` | Work For Us has a dedicated page. |
| Public copy mentioning mock forms | Public users do not need implementation caveats. |
| Public copy mentioning Phase 1 shell | This breaks trust and makes the product feel unfinished. |

---

## Page-Level CTA Recommendations

### `/about`

Primary CTA:

- Book Discovery Call -> `/about/discovery-call`

Secondary CTA:

- Explore Our Platform -> `/about/our-platform`

Optional tertiary links:

- Work With Us -> `/about/work-with-us`
- Contact Us -> `/contact`

---

### `/about/our-platform`

Primary CTA:

- Explore Services -> `/core-services`

Secondary CTA:

- View Membership -> `/membership`

Optional tertiary links:

- Book Discovery Call -> `/about/discovery-call`
- Contact Us -> `/contact`

---

### `/about/discovery-call`

Primary CTA:

- Request Discovery Call

Secondary CTA:

- Explore Our Platform -> `/about/our-platform`

Optional tertiary link:

- Contact Us -> `/contact`

---

### `/about/work-with-us`

Primary CTA:

- Submit Partnership Enquiry

Secondary CTA:

- Book Discovery Call -> `/about/discovery-call`

Optional tertiary link:

- Work For Us -> `/about/work-for-us`

---

### `/about/work-for-us`

Primary CTA:

- Register Interest

Secondary CTA:

- Work With Us -> `/about/work-with-us`

Optional tertiary link:

- Explore Our Platform -> `/about/our-platform`

---

### `/contact`

Primary CTA:

- Send Enquiry

Quick-action links:

- Book Discovery Call -> `/about/discovery-call`
- Partner With Us -> `/about/work-with-us`
- Future Opportunities -> `/about/work-for-us`

---

## UX Rules

1. Every page must have one clear primary action.
2. Discovery Call must not route through Contact Us.
3. Work With Us must be partnership-focused.
4. Work For Us must be employment/future-opportunity-focused.
5. Contact Us should route general enquiries, not absorb every user intent.
6. The About Us menu must expose all About-area pages.
7. Public copy must not mention mock forms, Phase 1, frontend-only behaviour, or missing backend integration.
8. Mobile navigation must expose the same About-area options as desktop navigation.
9. Footer navigation should include the main About-area pathways.
10. Success states should reassure users and suggest a useful next step.

---

## Recommended Footer Group

If footer structure supports it, add or update a Company/About group:

```text
COMPANY
About Us
Our Platform
Discovery Call
Work With Us
Work For Us
Contact Us
Analytics Events To Add Later

When analytics is introduced, track:

about_cta_book_discovery_call
about_cta_explore_platform
about_cta_partner_with_us
about_cta_work_for_us
contact_quick_action_discovery_call
contact_quick_action_partner
contact_quick_action_future_roles
discovery_call_form_submit
partnership_enquiry_form_submit
work_for_us_eoi_submit
contact_enquiry_submit
Conversion Goals
Goal	Primary Page
Understand RBP	/about
Understand platform	/about/our-platform
Start conversation	/about/discovery-call
Partnership enquiry	/about/work-with-us
Future role interest	/about/work-for-us
General enquiry	/contact

