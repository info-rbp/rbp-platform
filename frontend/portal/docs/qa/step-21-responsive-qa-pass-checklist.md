# Step 21 Responsive QA Pass Checklist

## Files

- docs/qa/responsive-qa.md exists.
- docs/qa/step-21-responsive-qa-pass-checklist.md exists.
- docs/implementation/step-21-responsive-qa-pass.codex.md exists.
- scripts/responsive-qa-routes.mjs exists.

## Breakpoints

- 360px mobile small listed.
- 390px mobile listed.
- 430px mobile large listed.
- 768px tablet listed.
- 834px tablet listed.
- 1024px tablet large listed.
- 1280px desktop listed.
- 1440px desktop large listed.
- 1920px wide listed.

## Public Route QA

- Public navigation reviewed.
- Public CTA paths reviewed.
- Membership pages reviewed.
- Decision Desk reviewed.
- DocuShare reviewed.
- Marketplace reviewed.
- Connectivity reviewed.
- Risk Advisor reviewed.
- The Fixer reviewed.
- Legal/help/contact pages reviewed.

## Portal Route QA

- Portal dashboard reviewed.
- Portal services reviewed.
- Portal documents reviewed.
- Portal offers reviewed.
- Portal apps reviewed.
- Portal resources reviewed.
- Portal support reviewed.
- Portal settings reviewed.

## Admin Route QA

- Admin dashboard reviewed.
- Admin content reviewed.
- Admin requests reviewed.
- Admin product request queues reviewed.
- Admin marketplace reviewed.
- Admin membership reviewed.
- Admin audit/review reviewed.
- Admin settings reviewed.

## Component QA

- Navbar responsive behaviour reviewed.
- Mega menu responsive behaviour reviewed.
- Mobile menu reviewed.
- Forms reviewed.
- Wizards reviewed.
- Cards reviewed.
- Tables reviewed.
- Dashboards reviewed.
- Admin queues reviewed.
- Marketplace cards reviewed.
- Pricing cards reviewed.
- Confirmation pages reviewed.
- Empty states reviewed.
- Long content reviewed.
- Footer reviewed.

## Safety Checks

- No real backend logic added.
- No real auth logic added.
- No real payment logic added.
- No real upload/storage logic added.
- No Frappe APIs added.
- No broad redesign performed.

## Validation Commands

Run:

    node scripts/responsive-qa-routes.mjs
    npm run build
    rm -rf dist
    git status
