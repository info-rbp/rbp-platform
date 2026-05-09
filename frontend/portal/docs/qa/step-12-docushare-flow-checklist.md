# Step 12 DocuShare Flow QA Checklist

## Build Check

- [ ] Run `npm install`.
- [ ] Run `npm run build`.
- [ ] Confirm only the known Vite large chunk warning appears.
- [ ] Remove `dist` after the build.

## Route Smoke List

- [ ] `/document-nucleus/overview`
- [ ] `/document-nucleus/brief`
- [ ] `/document-nucleus/category/templates`
- [ ] `/document-nucleus/category/documentation-suites`
- [ ] `/document-nucleus/product/template-policy-001`
- [ ] `/document-nucleus/product/suite-operations-001`
- [ ] `/portal/documents`
- [ ] `/portal/services`
- [ ] `/portal/dashboard`

## Flow State Checks

- [ ] Welcome/start state renders.
- [ ] Business details step accepts input.
- [ ] Validation errors show when required fields are missing.
- [ ] Document group selection state is visible.
- [ ] Document/product context can be selected or prefilled from product route query params.
- [ ] Purpose and audience selected states are visible.
- [ ] Group-specific questions render for the selected group.
- [ ] Style and branding preferences can be selected.
- [ ] Review state summarizes entered data.
- [ ] Submitting/loading state appears through `MockSubmissionState`.
- [ ] Successful submission shows confirmation and mock reference.
- [ ] Status timeline renders after submission.
- [ ] Portal documents/services/dashboard handoff links render.

## Mock Upload Placeholder Check

- [ ] `FileUploadMock` renders on the supporting information step.
- [ ] The user must acknowledge that no files are uploaded in Phase 1.
- [ ] Confirmation copy states that no files were uploaded.
- [ ] Portal documents copy states no real upload, storage, or permission-backed download exists.

## Mock Submit Check

- [ ] `submitMockDocuShareBrief` validates required fields.
- [ ] Required fields include business, contact, document group/type/category, business context, jurisdiction, intended use, audience, purpose, style preference, and supporting information acknowledgement.
- [ ] Successful submission returns a mock reference, submitted status, portal hrefs, timeline, and file placeholder acknowledgement.

## No Real Integration Checks

- [ ] No real backend service was added.
- [ ] No real auth guard was added.
- [ ] No Firebase Auth or Firestore persistence was added.
- [ ] No real upload/storage SDK was added.
- [ ] No real file download permissioning was added.
- [ ] No real payment or Stripe logic was added.
- [ ] No Frappe API call was added.
- [ ] No email sending or support ticket integration was added.

## Device Review Placeholders

- [ ] Mobile layout review placeholder.
- [ ] Tablet layout review placeholder.
- [ ] Desktop layout review placeholder.

## Raw Stitch Check

- [ ] Confirm `docs/stitch/_source-zips/*` remains ignored.
- [ ] Confirm `docs/stitch/_extracted/*` remains ignored.
- [ ] Confirm no raw Stitch HTML was committed.
