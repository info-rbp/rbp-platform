# Page Copy Audit

Reviewed date: 2026-05-16
Reviewer: ChatGPT agent GitHub Repo Updater
Final status: QA-critical copy is aligned with the Appwrite-first launch boundary. Applications remain interest-only, Stripe remains framed as QA test mode, and Frappe is no longer described as the active admin authority.

## Scope Reviewed

This audit covers the repo-owned QA launch wording most likely to overstate runtime readiness:

- environment examples
- launch and QA scope docs
- portal applications copy
- Appwrite backend copy rules

## Terms Checked

- Open app
- Launch app
- Provision
- Available now
- Buy now
- Redeem now
- Live payment

## Findings

- no QA or production environment example advertises a Frappe provider
- application provisioning remains disabled in config and launch docs
- application interest remains the customer-facing CTA
- portal applications copy uses next-rollout and interest-first language
- Stripe remains described as QA test mode rather than live payment capture

## Required QA Wording Direction

Use:

- Coming next rollout
- Register interest
- Available in QA test mode
- Processed securely through Stripe
- Create account to continue

Avoid:

- Open app
- Launch app
- Provision now
- Buy now
- Redeem now
- Live payment

## Remaining Limitation

A final exhaustive copy sweep still requires a runnable local checkout or indexed code search across every frontend content surface. This audit records the reviewed QA-critical areas without claiming a complete repo-wide text audit beyond the available repository evidence.