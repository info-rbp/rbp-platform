# Free/Premium Membership Business Rules

## Plans and Billing

Free is an active AUD 0 membership plan. It is not a trial, and Free signup must not send the customer through Stripe subscription checkout. The account and tenant are created first, the tenant is assigned Free by default, and Free users can use Stripe only for pay-per-use purchases.

Premium is AUD 25 + GST per week. Premium upgrade uses Stripe subscription checkout after the user account and Free tenant already exist. The tenant remains Free until a successful Stripe checkout/webhook updates the subscription and entitlements. Abandoned checkout leaves the tenant on Free.

QA seed data uses Stripe test price `price_1TXKGnS9Az4EAUomNJeSfDA1` for Premium. Live Stripe product and price IDs must be supplied through production environment/config or production Appwrite records during release setup. Do not hardcode live Stripe IDs into QA seed data.

All prices in the membership business-rule seeds are GST exclusive unless explicitly marked otherwise.

## Repository Config Artefacts

`pricing_rules.json`, `document_nucleus_rules.json`, and `support_rules.json` are repository config artefacts only until runtime enforcement is implemented. They document the approved commercial rules and are validated by QA seed checks, but they are not yet enforced as live Appwrite collections or customer-facing runtime policy engines.

## Entitlement Matrix

| Entitlement key | Free | Premium | Notes |
| --- | --- | --- | --- |
| `portal_access` | Yes | Yes | Portal access. |
| `profile_management` | Yes | Yes | Customer profile and business profile management. |
| `application_interest` | Yes | Yes | Application interest registration. |
| `application_setup_request` | Yes | Yes | Customer may request setup. |
| `customer_application_provisioning` | No | No | Customer self-provisioning remains disabled. |
| `service_requests_advertised_price` | Yes | Yes | Advertised service pricing remains the baseline. |
| `service_requests_discounted_price` | No | Yes | Premium discounted service pricing. |
| `on_demand_services_advertised_price` | Yes | Yes | Advertised on-demand pricing baseline. |
| `on_demand_services_discounted_price` | No | Yes | Premium receives 25% off. |
| `managed_services_advertised_price` | Yes | Yes | Advertised managed-services pricing baseline. |
| `managed_services_discounted_price` | No | Yes | Premium receives 25% off. |
| `document_nucleus_pay_per_use` | Yes | No | Free pays advertised price. |
| `document_nucleus_unlimited` | No | Yes | Premium unlimited current-document access, subject to fair use. |
| `marketplace_listing_standard_fee` | Yes | Yes | Standard listing fee baseline. |
| `marketplace_listing_discounted_fee` | No | Yes | Premium listing fee discount. |
| `basic_notifications` | Yes | Yes | Standard notification handling. |
| `premium_notifications` | No | Yes | Premium notification handling. |
| `email_support_48h` | Yes | No | Free email support SLA. |
| `premium_support` | No | Yes | Portal/email priority support and escalation. |
| `billing_management` | No | Yes | Premium billing and subscription management. |
| `stripe_subscription_checkout` | No | Yes | Premium upgrade only. |
| `pay_per_use_checkout` | Yes | Yes | Pay-per-use purchases. |

## Pricing Rules

On-Demand Services: Free pays the advertised price. Premium receives 25% off the advertised price.

Managed Services: Free pays the advertised price. Premium receives 25% off the advertised price.

Marketplace listing request: Free pays $100 + GST. Premium pays $50 + GST. Marketplace add-ons remain TBC/draft placeholders until separate commercial approval.

## Document Nucleus

Free customers pay the advertised price for Document Nucleus documents.

Premium customers have unlimited access to all current Document Nucleus documents for now. Customers do not directly download documents. The customer completes the process, and the document/output is delivered by email based on the applicable timeframe. Editing and generation are supported.

Custom documents are not included in Premium unlimited access and are quoted separately.

Fair-use policy: Premium unlimited access is for ordinary business use. It excludes resale, bulk extraction, automation, abuse, and other non-ordinary use. Excessive use may be queued, reviewed, or throttled. Custom or bespoke work is quoted separately.

## Support

Free support is email support with a target initial response of 48 business hours.

Premium support includes portal support and email support, priority handling, a target initial response of 1 business day, and escalation to the premium/admin support workflow.

Emergency support is not included unless separately agreed. Advisory, project, and custom work may be handled as a service request or quoted separately.

## Known TBC Items

Marketplace listing add-ons remain TBC/draft placeholders.

Custom/bespoke Document Nucleus work is quoted separately and is not part of Premium unlimited access.
