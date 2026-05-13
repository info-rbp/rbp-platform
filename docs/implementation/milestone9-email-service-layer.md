# Milestone 9 Email Service Layer

## Purpose
Backend-only email delivery contract for Milestone 9 notifications, deterministic in tests and sandbox-safe by default.

## Behavior
- No frontend secrets.
- Real email is not sent by default (`rbp_email_sandbox_mode` defaults to enabled).
- Recipient normalization lowercases, trims, filters invalids, and deduplicates.
- QA allowlist enforces sandbox delivery targets.
- Subject prefix applies only in sandbox and is not double-applied.
- Fake-send mode returns `sent` delivery rows without calling provider.
- Real-send mode uses Frappe `sendmail` with rendered HTML/text fallback.

## Config keys
- `rbp_enable_email_notifications`
- `rbp_email_sandbox_mode`
- `rbp_email_subject_prefix`
- `rbp_qa_email_recipients`
- `rbp_admin_notification_recipients`
- Deprecated fallback: `rbp_email_sandbox_recipient` (used only when QA allowlist is empty)

## Delivery statuses
Valid statuses:
- sent
- failed
- blocked
- disabled
- skipped

Summary rules:
- no results => skipped
- all sent => sent
- all disabled => disabled
- all blocked => blocked
- any failed => failed
- mixed => partial

## Known limitations
- Email validation is intentionally simple (`@` check only).
- Provider message IDs are sandbox IDs in fake mode.

## Validation commands
- `python -m compileall apps/rbp_app/rbp_app`
- `python -m pytest apps/rbp_app/rbp_app/tests/test_milestone9_notifications.py`
- `python -m pytest apps/rbp_app/rbp_app/tests/test_milestone8_entitlements.py`
- `git diff --check`
- `git show --check --pretty=short HEAD`
