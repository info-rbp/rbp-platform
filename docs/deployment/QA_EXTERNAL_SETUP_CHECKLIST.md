# QA External Setup Checklist

Do not promote or deploy QA until these external items are complete.

## 1. GitHub Actions Secrets Required

- `QA_HOST`
- `QA_USER`
- `QA_SSH_KEY`
- `QA_FRONTEND_PATH` optional

## 2. Stripe Test Mode Setup

- Create product: `RBP Premium Membership`
- Create recurring AUD test price.
- Save Stripe price ID into `RBP Membership Plan`.
- Create webhook endpoint:

```text
https://qa-api.remotebusinesspartner.com.au/api/method/rbp_app.api.stripe_webhooks.handle_stripe_webhook
```

- Subscribe to events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `charge.refunded`
  - `charge.dispute.created`
- Save webhook secret into QA backend config.

## 3. QA Bench Config

```bash
bench --site qa.remotebusinesspartner.com.au set-config rbp_environment qa
bench --site qa.remotebusinesspartner.com.au set-config rbp_enable_stripe true
bench --site qa.remotebusinesspartner.com.au set-config rbp_stripe_mode test
bench --site qa.remotebusinesspartner.com.au set-config rbp_enable_email_notifications true
bench --site qa.remotebusinesspartner.com.au set-config rbp_email_sandbox_mode true
bench --site qa.remotebusinesspartner.com.au set-config rbp_enable_application_provisioning false
bench --site qa.remotebusinesspartner.com.au set-config rbp_enable_application_interest true
bench --site qa.remotebusinesspartner.com.au set-config rbp_enable_admin_applications true
```

## 4. QA Email Setup

- Configure outgoing Email Account in Frappe Desk.
- Set QA sender.
- Set SMTP host/port/user/password.
- Enable default outgoing account.
- Configure QA allowlist.
- Confirm subject prefix `[RBP QA]`.
- Confirm failed sends are logged.

## 5. Backend Deploy Reminder

If frontend deploy workflow only deploys static frontend, backend still requires:

- Pull latest `rbp_app`.
- Run `bench migrate`.
- Run `bench clear-cache`.
- Run `bench run-tests --app rbp_app`.
- Run `bench restart`.

## 6. Final Live QA Trigger

Only after external setup is complete:

- Merge remediation PR into `main`.
- Promote `main` to `qa`.
- Push `qa` to trigger frontend deploy.
- Deploy backend and migrate.
- Run live QA gates.
