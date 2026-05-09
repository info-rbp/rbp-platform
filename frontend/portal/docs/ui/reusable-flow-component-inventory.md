# Reusable Flow Component Inventory

## Flow Components

    WizardShell
    Stepper
    StepNavigation
    ReviewSubmit
    ConfirmationPanel
    StatusTimeline
    MockSubmissionState

## Form Components

    FormSection
    FormError
    TextField
    TextAreaField
    SelectField
    CheckboxField
    RadioCardGroup
    SelectableCardGrid
    FileUploadMock
    TermsAcceptance

## Status Components

    StatusBadge
    ProgressBadge
    EntitlementBadge
    ReviewStatusBadge

## Domain Pattern Components

    PaymentSimulationPanel
    ServiceabilityCheckPanel
    PlanSelectionCard
    OrderSummaryCard
    PortalStatusCard
    AdminReviewQueueCard
    MarketplaceListingCard
    DocumentProductCard
    RiskScoreSummary

## Usage Rule

Use these components in Steps 9 to 16 when converting Stitch workflows into repo-native React flows.

Do not duplicate wizard, review, confirmation, upload-placeholder, status, or card patterns inside each product flow unless a genuine product-specific exception is needed.
