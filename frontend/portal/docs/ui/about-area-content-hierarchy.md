# About Us Area Content Hierarchy and Messaging

## Purpose

The About Us area should explain Remote Business Partner in a clear sequence:

1. Who we are
2. What we have built
3. How to start
4. How to partner
5. How to register interest in future roles
6. How to contact us

This prevents the About section from becoming a polite website junk drawer.

---

## Final About Area Structure

| Page | Route | Primary Job |
|---|---|---|
| About Us | `/about` | Explain who RBP is, why it exists, what has been built, and why users should trust it. |
| Our Platform | `/about/our-platform` | Explain the RBP ecosystem: services, documents, membership, marketplace, applications, resources, and support pathways. |
| Discovery Call | `/about/discovery-call` | Give users a dedicated conversion path to start a focused business conversation. |
| Work With Us | `/about/work-with-us` | Invite organisations, advisors, suppliers, service providers, marketplace partners, and collaborators to explore partnerships. |
| Work For Us | `/about/work-for-us` | Let individuals register interest in future employment, contractor, advisory, internship, or specialist opportunities. |
| Contact Us | `/contact` | Handle general enquiries and route users to the right place. |

---

## Core Positioning

Remote Business Partner is a remote-first business support platform built to help small businesses access practical advisory, services, documents, applications, marketplace opportunities, membership support, and business resources from one connected ecosystem.

RBP is not just a consultancy. It is a platform model designed around the operating needs of small businesses.

---

## Page-Level Messaging

### About Us - `/about`

Primary message:

> Remote Business Partner gives small businesses a smarter way to access advice, services, tools, documents, marketplace opportunities, membership support, and practical business resources.

This page should answer:

- Who is RBP?
- Why does RBP exist?
- What problem does it solve?
- What has been built?
- Why should a small business trust the model?
- What should the visitor do next?

Primary CTAs:

- Book Discovery Call -> `/about/discovery-call`
- Explore Our Platform -> `/about/our-platform`

Secondary CTAs:

- Contact Us -> `/contact`
- Work With Us -> `/about/work-with-us`

---

### Our Platform - `/about/our-platform`

Primary message:

> RBP brings advisory, services, documents, applications, marketplace access, membership, and business support pathways into one connected platform.

This page should explain the platform ecosystem:

- Core Services
- Document Nucleus / DocuShare
- On-Demand Services
- Managed Services
- Applications
- Marketplace
- Membership
- Help Center and Resources

Primary CTAs:

- Explore Services -> `/core-services`
- View Membership -> `/membership`

Secondary CTAs:

- Book Discovery Call -> `/about/discovery-call`
- Contact Us -> `/contact`

---

### Discovery Call - `/about/discovery-call`

Primary message:

> Book a discovery call to explain where your business is now, what you are trying to solve, and which RBP pathway may fit best.

This page should explain:

- What the call is for
- Who should book
- What users should prepare
- What happens next
- How the booking request works

Primary CTA:

- Request Discovery Call

Secondary CTAs:

- Explore Our Platform -> `/about/our-platform`
- Contact Us -> `/contact`

---

### Work With Us - `/about/work-with-us`

Primary message:

> Partner with Remote Business Partner to support small businesses through advisory, services, applications, marketplace offers, resources, and specialist delivery pathways.

This page is for organisations and partners, not job seekers.

Target audiences:

- Advisory partners
- Service delivery partners
- Technology and application partners
- Marketplace partners
- Referral partners
- Content and resource partners
- Specialist providers
- Integration partners

Primary CTA:

- Submit Partnership Enquiry

Secondary CTAs:

- Book Discovery Call -> `/about/discovery-call`
- Work For Us -> `/about/work-for-us`

---

### Work For Us - `/about/work-for-us`

Primary message:

> Register interest in future opportunities with Remote Business Partner.

This page is for individuals, not suppliers or partner organisations.

Target audiences:

- Future employees
- Contractors
- Advisors
- Specialists
- Interns or graduates
- Product, support, advisory, operations, and digital contributors

Primary CTA:

- Register Interest

Secondary CTAs:

- Work With Us -> `/about/work-with-us`
- Explore Our Platform -> `/about/our-platform`

---

### Contact Us - `/contact`

Primary message:

> Tell us what you need and we will route your enquiry to the right RBP pathway or contact point.

This page should handle general enquiries only after more specific routes have been offered.

It should direct:

- Discovery call users to `/about/discovery-call`
- Partnership users to `/about/work-with-us`
- Employment interest users to `/about/work-for-us`

Primary CTA:

- Send Enquiry

Secondary quick links:

- Book Discovery Call -> `/about/discovery-call`
- Partner With Us -> `/about/work-with-us`
- Future Opportunities -> `/about/work-for-us`

---

## CTA Routing Rules

| CTA Label | Destination |
|---|---|
| Book Discovery Call | `/about/discovery-call` |
| Explore Our Platform | `/about/our-platform` |
| Explore Services | `/core-services` |
| View Membership | `/membership` |
| Partner With Us | `/about/work-with-us` |
| Work With Us | `/about/work-with-us` |
| Work For Us | `/about/work-for-us` |
| Register Interest | `/about/work-for-us` |
| Contact Us | `/contact` |
| Send Enquiry | `/contact` |

---

## Messaging Rules

1. Do not send Discovery Call traffic to Contact Us.
2. Do not mix partnerships and employment.
3. Do not describe RBP as only a consultancy.
4. Do not expose mock, Phase 1, shell, or backend implementation notes to public users.
5. Each About page must have one clear purpose.
6. Each page should include one primary CTA and no more than two secondary CTA paths.
7. The Contact page should route users, not absorb every intent.
8. The About area should tell a story, not merely list pages.

---

## Final User Journey

The intended user journey is:

```text
/about
Who RBP is and why it exists.

↓
/about/our-platform
What RBP has built and how the ecosystem works.

↓
/about/discovery-call
How to start a focused conversation.

↓
/about/work-with-us
How organisations can partner with RBP.

↓
/about/work-for-us
How individuals can register interest in future roles.

↓
/contact
How to send general enquiries.

