# Phase 1 Design System Rules

## Purpose

This document defines the Phase 1 UI/UX design rules for the Remote Business Partner application.

The goal is consistency across public pages, portal screens, product flows, admin concepts, review states, confirmation screens, empty states, and mock service experiences.

## Source Files

Design constants live in:

    src/app/design/tokens.ts
    src/app/design/status.ts
    src/app/design/variants.ts
    src/app/design/index.ts

These files provide shared design rules and class variants for future cleanup and Phase 2 implementation planning.

## Core Principles

- Use a clean, professional business interface.
- Prefer white or slate backgrounds.
- Use blue as the primary action colour.
- Use rounded cards and panels.
- Use subtle borders over heavy shadows.
- Keep flows readable on mobile, tablet, and desktop.
- Make mock-only behaviour explicit.
- Avoid inventing one-off visual patterns inside individual flows.

## Colour Rules

### Primary

Use blue for:

- Primary buttons
- Primary links
- Active wizard steps
- Key dashboard highlights
- Informational status states

### Neutral

Use slate for:

- Body text
- Page backgrounds
- Borders
- Secondary actions
- Empty states
- Admin tables

### Success

Use emerald for:

- Confirmation panels
- Completed states
- Successful mock submissions
- Approved statuses

### Warning

Use amber for:

- Pending states
- In-review states
- Needs-info states
- Important mock-only notices

### Danger

Use red for:

- Error states
- Rejected states
- Validation failures
- High-risk warnings

## Typography Rules

### Page Titles

Use large, bold, tight tracking text for page titles.

Recommended class pattern:

    text-3xl font-bold tracking-tight md:text-4xl

### Section Titles

Use:

    text-2xl font-bold tracking-tight

### Card Titles

Use:

    text-lg font-semibold

### Body Text

Use:

    text-base leading-7

### Small Body Text

Use:

    text-sm leading-6

### Captions

Use:

    text-xs font-medium

## Layout Rules

### Page Containers

Use:

    max-w-7xl
    px-4 sm:px-6 lg:px-8

### Primary Section Spacing

Use:

    py-12 md:py-16

### Dashboard Grids

Use responsive grids:

    grid gap-4 md:grid-cols-2 xl:grid-cols-4

### Card Grids

Use:

    grid gap-4 md:grid-cols-2 lg:grid-cols-3

### Wizard Layouts

Use:

    grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]

The right-side summary panel should become sticky on desktop only.

## Button Rules

### Primary Button

Use primary buttons for main flow progression and submission.

Pattern:

    rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white

### Secondary Button

Use secondary buttons for back, cancel, or alternative actions.

Pattern:

    rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700

### Danger Button

Use danger buttons only for destructive mock admin states.

### Disabled Buttons

Disabled buttons must use:

    disabled:cursor-not-allowed disabled:opacity-50

## Card Rules

### Standard Card

Use:

    rounded-2xl border border-slate-200 bg-white p-5 shadow-sm

### Panel Card

Use:

    rounded-3xl border border-slate-200 bg-white p-6 shadow-sm

### Selected Card

Use:

    border-blue-600 bg-blue-50

### Warning Card

Use:

    border-amber-200 bg-amber-50

### Success Card

Use:

    border-emerald-200 bg-emerald-50

## Form Rules

All forms should use shared form components where possible:

- FormSection
- TextField
- TextAreaField
- SelectField
- CheckboxField
- RadioCardGroup
- SelectableCardGrid
- FileUploadMock
- TermsAcceptance

Inputs should use:

    rounded-xl border border-slate-300 px-4 py-3

Focus states should use blue:

    focus:border-blue-600 focus:ring-blue-100

Validation errors should use red.

Mock upload components must clearly state that no real files are uploaded.

## Badge Rules

Use shared status badge logic where possible.

Common status tones:

- neutral
- info
- success
- warning
- danger
- premium
- locked

Statuses should be readable, short, and sentence-case or title-case in UI.

## Wizard Rules

Every major Phase 1 flow should include:

- Clear page title
- Progress stepper
- Back/continue navigation
- Review step
- Submit state
- Loading/submitting state
- Confirmation state
- Status or portal handoff state

Wizard steps should be short, clear, and consistent.

## Review and Submit Rules

Review screens should show grouped summaries using:

- ReviewSubmit
- Section titles
- Label/value rows
- Final mock submission button

Review screens should avoid hiding critical mock-only disclaimers.

## Confirmation Rules

Confirmation screens should include:

- Confirmation title
- Mock-only message
- Mock reference number
- Primary next action
- Secondary next action
- Status timeline where relevant

Use emerald success styling for completed mock submissions.

## Status Timeline Rules

Timelines should show:

- Short label
- Description
- Timestamp
- Status state

Timelines must represent simulated states only in Phase 1.

## Empty State Rules

Empty states should include:

- Icon or simple visual marker
- Plain title
- Short explanatory text
- CTA where useful

Avoid blank screens. Blank screens are not minimalism, they are a cry for help.

## Table Rules

Admin tables should use:

- Rounded outer panel
- Slate table header
- Compact row spacing
- Status badges
- Clear review actions
- Horizontal overflow for mobile

## Responsive Rules

Review these breakpoints:

- 360px mobile small
- 390px mobile
- 430px mobile large
- 768px tablet
- 1024px tablet large
- 1280px desktop
- 1440px desktop large
- 1920px wide

Mobile layouts should stack. Desktop layouts may use side panels, sticky summaries, and multi-column card grids.

## Phase 1 Mock Rules

All Phase 1 UI must clearly avoid real production behaviour.

Do not implement:

- Real payment processing
- Real authentication
- Real uploads
- Real backend writes
- Real Frappe APIs
- Real marketplace checkout
- Real support tickets
- Real email sending
- Real carrier serviceability
- Real advisor assignment

Mock experiences should say what is simulated.

## Future Cleanup

Future design-system work may refactor existing components to consume these variants directly.

Step 18 does not perform a broad refactor. It documents and centralises rules so later cleanup has a stable target.
