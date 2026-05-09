# Stitch Component Patterns

Step 8 should use these Stitch references to build reusable flow infrastructure only. Steps 9 to 16 should build the actual workflow implementations using these shared patterns, Step 6 mock data, and Step 7 mock services.

Do not build full workflows in Step 8. Do not copy raw Stitch HTML, screenshots, or generated assets into src/app.

## Flow Components

| Pattern | Purpose | Step 8 Guidance |
| --- | --- | --- |
| WizardShell | Provides a consistent frame for multi-step intake flows. | Support titles, descriptions, progress context, content slots, and footer actions. |
| Stepper | Shows current position and available steps. | Keep it data-driven and accessible for horizontal or compact rendering. |
| StepNavigation | Handles back, next, save draft, and submit affordances. | Expose mock-safe callbacks only; do not wire real submissions. |
| ReviewSubmit | Summarises entered mock data before final confirmation. | Accept section summaries and validation state from callers. |
| ConfirmationPanel | Presents successful mock completion states. | Support reference numbers, next steps, and links back to mock portal areas. |
| StatusTimeline | Shows request/order progress after submission. | Use static or mock-service status values only. |
| MockSubmissionState | Standardises idle, submitting, submitted, and failed mock states. | Keep state local or backed by Step 7 mock services; no backend persistence. |

## Form Components

| Pattern | Purpose | Step 8 Guidance |
| --- | --- | --- |
| FormSection | Groups related form fields with consistent headings and help text. | Keep layout responsive and reusable across all intake flows. |
| TextField | Captures short text inputs. | Support label, help text, error text, disabled, and required states. |
| TextAreaField | Captures longer descriptions and context. | Include sensible row sizing and character guidance where needed. |
| SelectField | Captures option-set choices. | Use typed option lists from mock data where available. |
| CheckboxField | Captures binary acknowledgements and preferences. | Keep labels readable and support optional help text. |
| RadioCardGroup | Captures mutually exclusive richer choices. | Useful for service tiers, urgency, request types, and listing choices. |
| SelectableCardGrid | Captures one or many visual choices. | Useful for plans, document packs, add-ons, and marketplace categories. |
| FileUploadMock | Represents upload intent without real file handling. | Simulate selected files locally; do not implement real uploads. |
| TermsAcceptance | Captures mock agreement acknowledgement. | Keep legal/payment acknowledgement mock-only. |

## Domain-Specific Shared Components

| Pattern | Purpose | Step 8 Guidance |
| --- | --- | --- |
| PaymentSimulationPanel | Represents payment entry, checkout, or billing confirmation without processing money. | Display mock payment state only; no real gateway calls. |
| ServiceabilityCheckPanel | Represents address or eligibility checks. | Use mock serviceability responses from Step 7 services. |
| PlanSelectionCard | Presents selectable plans or service packages. | Drive plan content from Step 6 mock data. |
| OrderSummaryCard | Summarises selected plans, fees, add-ons, and mock totals. | Keep calculations deterministic and mock-only. |
| PortalStatusCard | Shows submitted requests, orders, listings, or onboarding progress in portal contexts. | Use shared status labels and timeline data. |
| AdminReviewQueueCard | Shows requests awaiting mock admin review. | No real permissions, assignment, or backend workflow. |
| MarketplaceListingCard | Presents listing summaries for marketplace browsing or seller portals. | Use mock listing records and image placeholders already accepted by the app. |
| DocumentProductCard | Presents DocuShare / Document Nucleus package choices. | Reuse selectable card patterns and mock document product data. |
| RiskScoreSummary | Summarises risk intake results or advisory priority. | Use mock scoring only; avoid real assessment logic. |

## Implementation Boundaries

- Step 8 should build reusable infrastructure only.
- Steps 9 to 16 should build the actual flows.
- Do not build full workflows in Step 8.
- Do not add Firebase Auth, Firestore, Frappe APIs, real payments, real uploads, email, booking, checkout, or support-ticket logic.
