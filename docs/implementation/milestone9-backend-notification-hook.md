# Milestone 9 backend notification hook

PR #40 added trigger catalog + basic emit hook. This follow-up adds backend email abstraction, template registry/stubs, admin APIs, delivery summaries/logging, and stronger tests.

## Config keys
- rbp_enable_email_notifications
- rbp_email_sandbox_mode
- rbp_email_subject_prefix
- rbp_qa_email_recipients
- rbp_admin_notification_recipients

## Notes
- Sandbox default on, QA allowlist enforced.
- Appwrite is unchanged and tracked under issue #39.

## Validation
- python -m compileall apps/rbp_app/rbp_app
- python -m pytest apps/rbp_app/rbp_app/tests/test_milestone9_notifications.py
- python -m pytest apps/rbp_app/rbp_app/tests/test_milestone8_entitlements.py
