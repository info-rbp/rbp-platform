# About Area Technical Implementation Checklist

## Files Modified

- `frontend/portal/src/app/data/publicNavigation.ts`
- `frontend/portal/src/app/routes.tsx`
- `frontend/portal/src/app/pages/AboutPage.tsx`
- `frontend/portal/src/app/pages/ContactPage.tsx`
- `frontend/portal/src/app/pages/about/WorkWithUsPage.tsx`

## Files Added

- `frontend/portal/src/app/pages/about/OurPlatformPage.tsx`
- `frontend/portal/src/app/pages/about/DiscoveryCallPage.tsx`
- `frontend/portal/src/app/pages/about/WorkForUsPage.tsx`
- `frontend/portal/src/app/components/forms/DiscoveryCallBookingEmbed.tsx`
- `frontend/portal/src/app/components/forms/PartnershipEnquiryForm.tsx`
- `frontend/portal/src/app/components/forms/ExpressionOfInterestForm.tsx`
- `frontend/portal/src/app/data/aboutPages.ts`

## Final Routes

- `/about`
- `/about/our-platform`
- `/about/discovery-call`
- `/about/work-with-us`
- `/about/work-for-us`
- `/contact`

## Compatibility Route

- `/discovery-call` redirects to `/about/discovery-call`

## CTA Rules

- Book Discovery Call -> `/about/discovery-call`
- Explore Platform -> `/about/our-platform`
- Partner With Us -> `/about/work-with-us`
- Work For Us / Register Interest -> `/about/work-for-us`
- Contact Us -> `/contact`
