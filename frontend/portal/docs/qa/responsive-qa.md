# Phase 1 Responsive QA Review

## Purpose

This document records the Phase 1 responsive QA review for the Remote Business Partner UI/UX application.

The goal is to verify that public pages, portal pages, product flows, admin concepts, wizard screens, review states, confirmation pages, empty states, and long-content layouts remain usable across mobile, tablet, and desktop.

This step is a QA and lightweight-fix pass. It is not a full redesign.

## Breakpoints Reviewed

| Device Group | Widths |
|---|---|
| Mobile small | 360px |
| Mobile | 390px |
| Mobile large | 430px |
| Tablet | 768px |
| Tablet large | 834px, 1024px |
| Desktop | 1280px |
| Desktop large | 1440px |
| Wide | 1920px |

## Responsive Principles

- Mobile layouts should stack vertically.
- Tablet layouts should avoid cramped two-column grids unless content remains readable.
- Desktop layouts can use sidebars, sticky summaries, and multi-column card grids.
- Tables must allow horizontal overflow where needed.
- Wizards must keep progress, current step, form body, and navigation usable on small screens.
- CTA groups should wrap.
- Cards should not require fixed widths.
- Long route names, service names, references, and descriptions should not overflow containers.
- Empty states should remain centered and readable.
- Admin queues should remain scannable on mobile, even if table scrolling is required.

## Route Smoke Matrix

### Public Website

| Route | Mobile | Tablet | Desktop | Notes |
|---|---|---|---|---|
| / | Pending manual review | Pending manual review | Pending manual review | Check hero, cards, nav, footer. |
| /membership | Pending manual review | Pending manual review | Pending manual review | Check CTA wrapping and pricing cards. |
| /membership/overview | Pending manual review | Pending manual review | Pending manual review | Check public membership layout. |
| /membership/sign-up-now | Pending manual review | Pending manual review | Pending manual review | Check wizard layout and sticky summary. |
| /membership/confirmation | Pending manual review | Pending manual review | Pending manual review | Check confirmation panel. |
| /on-demand/decision-desk | Pending manual review | Pending manual review | Pending manual review | Check wizard steps, forms, review. |
| /on-demand/risk-advisor | Pending manual review | Pending manual review | Pending manual review | Check score summary and wizard. |
| /on-demand/the-fixer | Pending manual review | Pending manual review | Pending manual review | Check urgency/status panels. |
| /document-nucleus/overview | Pending manual review | Pending manual review | Pending manual review | Check cards and CTAs. |
| /document-nucleus/brief | Pending manual review | Pending manual review | Pending manual review | Check DocuShare wizard. |
| /marketplace | Pending manual review | Pending manual review | Pending manual review | Check sticky filters and listing grid. |
| /marketplace/product/market-001 | Pending manual review | Pending manual review | Pending manual review | Check listing detail. |
| /marketplace/enquiry/market-001 | Pending manual review | Pending manual review | Pending manual review | Check enquiry flow. |
| /marketplace/listing/new | Pending manual review | Pending manual review | Pending manual review | Check seller flow. |
| /operations/connectivity | Pending manual review | Pending manual review | Pending manual review | Check order wizard and summary. |
| /operations/connectivity/nbn-phone | Pending manual review | Pending manual review | Pending manual review | Check connectivity variant. |
| /operations/connectivity/superloop | Pending manual review | Pending manual review | Pending manual review | Check connectivity variant. |
| /offers | Pending manual review | Pending manual review | Pending manual review | Check offer cards. |
| /resources | Pending manual review | Pending manual review | Pending manual review | Check resource cards and filters. |
| /help | Pending manual review | Pending manual review | Pending manual review | Check help sections. |
| /contact | Pending manual review | Pending manual review | Pending manual review | Check contact form/CTA. |

### Portal

| Route | Mobile | Tablet | Desktop | Notes |
|---|---|---|---|---|
| /portal/dashboard | Pending manual review | Pending manual review | Pending manual review | Check dashboard cards and status sections. |
| /portal/services | Pending manual review | Pending manual review | Pending manual review | Check service status cards. |
| /portal/documents | Pending manual review | Pending manual review | Pending manual review | Check document activity and empty states. |
| /portal/offers | Pending manual review | Pending manual review | Pending manual review | Check offers layout. |
| /portal/apps | Pending manual review | Pending manual review | Pending manual review | Check app entitlement tiles. |
| /portal/resources | Pending manual review | Pending manual review | Pending manual review | Check resources grid. |
| /portal/support | Pending manual review | Pending manual review | Pending manual review | Check support/help cards. |
| /portal/settings | Pending manual review | Pending manual review | Pending manual review | Check settings form layout. |

### Admin

| Route | Mobile | Tablet | Desktop | Notes |
|---|---|---|---|---|
| /admin/dashboard | Pending manual review | Pending manual review | Pending manual review | Check side nav, metric cards, table overflow. |
| /admin/content | Pending manual review | Pending manual review | Pending manual review | Check content review cards. |
| /admin/requests | Pending manual review | Pending manual review | Pending manual review | Check admin queue table. |
| /admin/requests/decision-desk | Pending manual review | Pending manual review | Pending manual review | Check filtered queue. |
| /admin/requests/docushare | Pending manual review | Pending manual review | Pending manual review | Check filtered queue. |
| /admin/requests/connectivity | Pending manual review | Pending manual review | Pending manual review | Check filtered queue. |
| /admin/requests/risk-advisor | Pending manual review | Pending manual review | Pending manual review | Check filtered queue. |
| /admin/requests/fixer | Pending manual review | Pending manual review | Pending manual review | Check filtered queue. |
| /admin/marketplace | Pending manual review | Pending manual review | Pending manual review | Check marketplace review queue. |
| /admin/membership | Pending manual review | Pending manual review | Pending manual review | Check membership review queue. |
| /admin/audit-review | Pending manual review | Pending manual review | Pending manual review | Check audit timeline/cards. |
| /admin/settings | Pending manual review | Pending manual review | Pending manual review | Check settings cards. |

## Component Areas Reviewed

| Component Area | Expected Responsive Behaviour |
|---|---|
| Navbar | Mobile menu should be accessible, links should not overflow. |
| Mega menu | Desktop menu should not clip; mobile should collapse safely. |
| Hero sections | Headings and CTAs should wrap without overflow. |
| Cards | Cards should stack on mobile and form grids on tablet/desktop. |
| Forms | Inputs should fill available width and preserve labels/help text. |
| Wizards | Stepper should wrap or stack; side summaries should stack below content on mobile. |
| Review screens | Label/value rows should stack on small widths. |
| Confirmation panels | Actions should stack on mobile and align horizontally on larger screens. |
| Tables | Admin tables should allow horizontal scroll on small widths. |
| Status timelines | Timeline cards should stack and remain readable. |
| Empty states | Empty states should remain centered and not overflow. |
| Footer | Footer columns should stack cleanly. |

## Known Responsive Risks

- Wide admin tables may require horizontal scrolling on mobile.
- Sticky filter bars may consume vertical space on small screens.
- Long route or reference labels may wrap awkwardly.
- Wizard stepper grids may become dense if too many steps are visible at once.
- Portal dashboards with many cards may feel long on mobile.
- Admin side navigation may need future collapse behaviour.

## Lightweight Fix Guidance

Only apply low-risk fixes during Step 21, such as:

- Add `min-w-0` to grid children.
- Add `overflow-x-auto` around tables.
- Change rigid grid columns to responsive grids.
- Ensure CTA button groups use `flex-wrap`.
- Ensure long labels use wrapping or truncation.
- Ensure mobile layouts stack before tablet/desktop grids.

Avoid broad redesign or component rewrites in this step.

## Manual Review Process

1. Run the app locally.
2. Open each route in the smoke matrix.
3. Review at mobile, tablet, and desktop widths.
4. Record findings in this document or a follow-up issue.
5. Apply only low-risk layout fixes.
6. Run build before commit.

## Commands

Run:

    npm install
    npm run build
    rm -rf dist
    git status

Optional local run:

    npm run dev

Then manually test the listed routes.
