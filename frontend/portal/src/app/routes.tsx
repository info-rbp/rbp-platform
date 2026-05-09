import { createBrowserRouter, Navigate, Outlet } from "react-router";

import { ScrollToHash } from "./components/ScrollToHash";

// ── Core public pages ─────────────────────────────────────────────────────────

import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { HelpCenterPage } from "./pages/HelpCenterPage";
import { SignInPage } from "./pages/SignInPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// ── About pages ───────────────────────────────────────────────────────────────

import { WhatWeDoPage } from "./pages/about/WhatWeDoPage";
import { OurProcessPage } from "./pages/about/OurProcessPage";
import { WorkWithUsPage } from "./pages/about/WorkWithUsPage";

// ── On-Demand pages ───────────────────────────────────────────────────────────

import { OnDemandPage } from "./pages/OnDemandPage";
import { BusinessAdvisorPage } from "./pages/BusinessAdvisorPage";
import { ServicesPage } from "./pages/ServicesPage";
import { DocuSharePage } from "./pages/DocuSharePage";
import { DecisionDeskPage } from "./pages/on-demand/DecisionDeskPage";
import { TheFixerPage } from "./pages/on-demand/TheFixerPage";
import { RiskAdvisorPage } from "./pages/on-demand/RiskAdvisorPage";

// ── Document Nucleus pages ────────────────────────────────────────────────────

import { DocumentOverviewPage } from "./pages/DocumentOverviewPage";
import { DocumentCategoryPage } from "./pages/DocumentCategoryPage";
import { DocumentProductPage } from "./pages/DocumentProductPage";
import { DocuShareOnboardingPage } from "./pages/DocuShareOnboardingPage";

// ── Managed Services pages ────────────────────────────────────────────────────

import { ManagedServicesPage } from "./pages/ManagedServicesPage";
import { BidManagementPage } from "./pages/managed-services/BidManagementPage";
import { RealEstatePage } from "./pages/managed-services/RealEstatePage";
import { HRServicesPage } from "./pages/managed-services/HRServicesPage";

// ── Applications pages ────────────────────────────────────────────────────────

import { ApplicationsPage } from "./pages/ApplicationsPage";
import { BusinessApplicationsPage } from "./pages/BusinessApplicationsPage";

// ── Operations pages ──────────────────────────────────────────────────────────

import { OperationsCenterPage } from "./pages/OperationsCenterPage";
import { FinancePage } from "./pages/FinancePage";
import { BusinessLendingPage } from "./pages/finance/BusinessLendingPage";
import { BusinessInsurancePage } from "./pages/finance/BusinessInsurancePage";
import { FinancialPlanningPage } from "./pages/finance/FinancialPlanningPage";
import { CreditFundingPage } from "./pages/finance/CreditFundingPage";
import { FinanceCalculatorsPage } from "./pages/operations/FinanceCalculatorsPage";
import { ConnectivityPage } from "./pages/operations/ConnectivityPage";
import { NbnPhonePage } from "./pages/operations/NbnPhonePage";
import { SuperloopPage } from "./pages/operations/SuperloopPage";
import { OperationsComingSoonPage } from "./pages/operations/OperationsComingSoonPage";

// ── Marketplace pages ─────────────────────────────────────────────────────────

import { MarketplacePage } from "./pages/MarketplacePage";

// ── Membership pages ──────────────────────────────────────────────────────────

import { MembershipOverviewPage } from "./pages/membership/MembershipOverviewPage";
import { RemoteBusinessPartnerMembershipPage } from "./pages/membership/RemoteBusinessPartnerMembershipPage";
import { MembershipInclusionsPage } from "./pages/membership/MembershipInclusionsPage";
import { MembershipPricingPage } from "./pages/membership/MembershipPricingPage";
import { MembershipUsagePage } from "./pages/membership/MembershipUsagePage";
import { MembershipPaymentTermsPage } from "./pages/membership/MembershipPaymentTermsPage";
import { MembershipSignUpPage } from "./pages/membership/MembershipSignUpPage";
import { MembershipFaqPage } from "./pages/membership/MembershipFaqPage";
import { MembershipConfirmationPage } from "./pages/confirmation/MembershipConfirmationPage";

// ── Offers and Resources pages ────────────────────────────────────────────────

import { OffersPage } from "./pages/OffersPage";
import { ResourcesPage } from "./pages/ResourcesPage";

// ── Legal pages ───────────────────────────────────────────────────────────────

import { LegalIndexPage } from "./pages/legal/LegalIndexPage";
import { PrivacyPolicyPage } from "./pages/legal/PrivacyPolicyPage";
import { TermsOfUsePage } from "./pages/legal/TermsOfUsePage";
import { TermsOfEngagementPage } from "./pages/legal/TermsOfEngagementPage";
import { PaymentPolicyPage } from "./pages/legal/PaymentPolicyPage";
import { ServicesPolicyPage } from "./pages/legal/ServicesPolicyPage";

// ── Confirmation pages ────────────────────────────────────────────────────────

import { ThankYouPage } from "./pages/confirmation/ThankYouPage";
import { ContactSuccessPage } from "./pages/confirmation/ContactSuccessPage";
import { BookingConfirmationPage } from "./pages/confirmation/BookingConfirmationPage";

// ── Member Portal ─────────────────────────────────────────────────────────────

import { PortalLayout } from "./pages/portal/PortalLayout";
import { PortalDashboard } from "./pages/portal/PortalDashboard";
import { PortalServices } from "./pages/portal/PortalServices";
import { PortalServiceRequest } from "./pages/portal/PortalServiceRequest";
import { PortalServiceDetail } from "./pages/portal/PortalServiceDetail";
import { PortalSessions } from "./pages/portal/PortalSessions";
import { PortalDocuments } from "./pages/portal/PortalDocuments";
import { PortalOffers } from "./pages/portal/PortalOffers";
import { PortalApps } from "./pages/portal/PortalApps";
import { PortalResources } from "./pages/portal/PortalResources";
import { PortalSupport } from "./pages/portal/PortalSupport";
import { PortalSettings } from "./pages/portal/PortalSettings";

// ── Admin Portal ──────────────────────────────────────────────────────────────

import { AdminSignInPage } from "./pages/admin/AdminSignInPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminCrudPage } from "./pages/admin/AdminCrudPage";

function Root() {
  return (
    <>
      <ScrollToHash />
      <Outlet />
    </>
  );
}

function Layout() {
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      // ── Public core ─────────────────────────────────────────────────────────

      { index: true, Component: HomePage },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },
      { path: "contact/success", Component: ContactSuccessPage },
      { path: "help", Component: HelpCenterPage },
      { path: "sign-in", Component: SignInPage },
      { path: "dashboard", Component: DashboardPage },

      // ── About ───────────────────────────────────────────────────────────────

      { path: "about/what-we-do", Component: WhatWeDoPage },
      { path: "about/our-process", Component: OurProcessPage },
      { path: "about/process", Component: OurProcessPage },
      { path: "about/work-with-us", Component: WorkWithUsPage },

      // ── Legacy / direct public routes ──────────────────────────────────────

      { path: "services", Component: ServicesPage },
      { path: "business-advisor", Component: BusinessAdvisorPage },
      { path: "docushare", Component: DocuSharePage },
      { path: "applications-legacy", Component: ApplicationsPage },

      // ── Document Nucleus ───────────────────────────────────────────────────

      { path: "document-nucleus/overview", Component: DocumentOverviewPage },
      { path: "document-nucleus/brief", Component: DocuShareOnboardingPage },
      { path: "document-nucleus/category/:id", Component: DocumentCategoryPage },
      { path: "document-nucleus/product/:id", Component: DocumentProductPage },

      // ── On-Demand Services ─────────────────────────────────────────────────

      {
        path: "on-demand",
        Component: Layout,
        children: [
          { index: true, Component: OnDemandPage },
          { path: "business-advisor", Component: BusinessAdvisorPage },
          { path: "services", Component: ServicesPage },
          { path: "documents", Component: DocuSharePage },
          { path: "decision-desk", Component: DecisionDeskPage },
          { path: "the-fixer", Component: TheFixerPage },
          { path: "risk-advisor", Component: RiskAdvisorPage },
        ],
      },

      // ── Managed Services ───────────────────────────────────────────────────

      {
        path: "managed-services",
        Component: Layout,
        children: [
          { index: true, Component: ManagedServicesPage },
          { path: "bid-management", Component: BidManagementPage },
          { path: "real-estate", Component: RealEstatePage },
          { path: "hr-services", Component: HRServicesPage },
        ],
      },

      // ── Applications ───────────────────────────────────────────────────────

      { path: "applications", Component: BusinessApplicationsPage },

      // ── Operations ─────────────────────────────────────────────────────────

      {
        path: "operations",
        Component: Layout,
        children: [
          { index: true, Component: OperationsCenterPage },

          {
            path: "finance",
            Component: Layout,
            children: [
              { index: true, Component: FinancePage },
              { path: "business-lending", Component: BusinessLendingPage },
              { path: "business-insurance", Component: BusinessInsurancePage },
              { path: "financial-planning", Component: FinancialPlanningPage },
              { path: "credit-and-funding", Component: CreditFundingPage },
            ],
          },

          { path: "insurance", Component: BusinessInsurancePage },
          { path: "calculators", Component: FinanceCalculatorsPage },

          // Compatibility route retained for existing links.
          { path: "superloop", Component: SuperloopPage },

          // Preferred connectivity routes.
          { path: "connectivity", Component: ConnectivityPage },
          { path: "connectivity/superloop", Component: SuperloopPage },
          { path: "connectivity/nbn-phone", Component: NbnPhonePage },

          { path: "coming-soon", Component: OperationsComingSoonPage },
        ],
      },

      // ── Legacy finance routes ──────────────────────────────────────────────

      {
        path: "finance",
        Component: Layout,
        children: [
          { index: true, Component: FinancePage },
          { path: "business-lending", Component: BusinessLendingPage },
          { path: "business-insurance", Component: BusinessInsurancePage },
          { path: "financial-planning", Component: FinancialPlanningPage },
          { path: "credit-and-funding", Component: CreditFundingPage },
        ],
      },

      // ── Marketplace ────────────────────────────────────────────────────────

      {
        path: "marketplace",
        Component: Layout,
        children: [
          { index: true, Component: MarketplacePage },
          { path: "product/:id", Component: MarketplacePage },
          { path: "enquiry/:id", Component: MarketplacePage },
          { path: "listing/new", Component: MarketplacePage },
        ],
      },

      // ── Membership ─────────────────────────────────────────────────────────

      {
        path: "membership",
        Component: Layout,
        children: [
          { index: true, Component: MembershipOverviewPage },
          { path: "overview", Component: MembershipOverviewPage },
          {
            path: "remote-business-partner-membership",
            Component: RemoteBusinessPartnerMembershipPage,
          },
          { path: "inclusions", Component: MembershipInclusionsPage },
          { path: "pricing", Component: MembershipPricingPage },
          { path: "usage", Component: MembershipUsagePage },
          { path: "payment-terms", Component: MembershipPaymentTermsPage },
          { path: "sign-up-now", Component: MembershipSignUpPage },
          { path: "frequently-asked-questions", Component: MembershipFaqPage },
          { path: "confirmation", Component: MembershipConfirmationPage },
        ],
      },

      // ── Offers and Resources ───────────────────────────────────────────────

      { path: "offers", Component: OffersPage },
      { path: "resources", Component: ResourcesPage },

      // ── Legal ──────────────────────────────────────────────────────────────

      {
        path: "legal",
        Component: Layout,
        children: [
          { index: true, Component: LegalIndexPage },
          { path: "privacy-policy", Component: PrivacyPolicyPage },
          { path: "terms-of-use", Component: TermsOfUsePage },
          { path: "terms-of-engagement", Component: TermsOfEngagementPage },
          { path: "payment-policy", Component: PaymentPolicyPage },
          { path: "services-policy", Component: ServicesPolicyPage },
        ],
      },

      // ── Confirmation / success pages ───────────────────────────────────────

      { path: "thank-you", Component: ThankYouPage },
      { path: "booking-confirmation", Component: BookingConfirmationPage },

      // Optional compatibility confirmation routes.
      { path: "confirmation/thank-you", Component: ThankYouPage },
      { path: "confirmation/contact-success", Component: ContactSuccessPage },
      { path: "confirmation/booking-confirmation", Component: BookingConfirmationPage },
      {
        path: "confirmation/membership-confirmation",
        Component: MembershipConfirmationPage,
      },

      // ── Member Portal ──────────────────────────────────────────────────────

      {
        path: "portal",
        Component: PortalLayout,
        children: [
          { index: true, element: <Navigate to="/portal/dashboard" replace /> },
          { path: "dashboard", Component: PortalDashboard },
          {
            path: "services",
            Component: Layout,
            children: [
              { index: true, Component: PortalServices },
              { path: "request", Component: PortalServiceRequest },
              { path: ":id", Component: PortalServiceDetail },
            ],
          },
          { path: "sessions", Component: PortalSessions },
          { path: "documents", Component: PortalDocuments },
          { path: "offers", Component: PortalOffers },
          { path: "apps", Component: PortalApps },
          { path: "resources", Component: PortalResources },
          { path: "support", Component: PortalSupport },
          { path: "settings", Component: PortalSettings },
        ],
      },

      // ── Admin Portal ───────────────────────────────────────────────────────

      {
        path: "admin",
        children: [
          { path: "signin", Component: AdminSignInPage },
          {
            Component: AdminLayout,
            children: [
              { path: "dashboard", Component: AdminDashboard },

              // Admin dashboard utility routes.
              { path: "content", Component: AdminCrudPage },
              { path: "requests", Component: AdminCrudPage },
              { path: "requests/decision-desk", Component: AdminCrudPage },
              { path: "requests/docushare", Component: AdminCrudPage },
              { path: "requests/connectivity", Component: AdminCrudPage },
              { path: "requests/risk-advisor", Component: AdminCrudPage },
              { path: "requests/fixer", Component: AdminCrudPage },
              { path: "audit-review", Component: AdminCrudPage },
              { path: "tasks", Component: AdminCrudPage },
              { path: "discovery-calls", Component: AdminCrudPage },
              { path: "other", Component: AdminCrudPage },

              // Top-level legacy/admin shortcuts.
              { path: "members", Component: AdminCrudPage },
              { path: "services", Component: AdminCrudPage },
              { path: "sessions", Component: AdminCrudPage },
              { path: "documents", Component: AdminCrudPage },
              { path: "the-fixer", Component: AdminCrudPage },

              // Admin CRUD scaffold sections.
              { path: "on-demand", Component: AdminCrudPage },
              { path: "on-demand/*", Component: AdminCrudPage },
              { path: "managed-services", Component: AdminCrudPage },
              { path: "managed-services/*", Component: AdminCrudPage },
              { path: "applications", Component: AdminCrudPage },
              { path: "applications/*", Component: AdminCrudPage },
              { path: "operations", Component: AdminCrudPage },
              { path: "operations/*", Component: AdminCrudPage },
              { path: "marketplace", Component: AdminCrudPage },
              { path: "marketplace/*", Component: AdminCrudPage },
              { path: "membership", Component: AdminCrudPage },
              { path: "membership/*", Component: AdminCrudPage },
              { path: "offers", Component: AdminCrudPage },
              { path: "offers/*", Component: AdminCrudPage },
              { path: "resources", Component: AdminCrudPage },
              { path: "resources/*", Component: AdminCrudPage },
              { path: "help-center", Component: AdminCrudPage },
              { path: "help-center/*", Component: AdminCrudPage },
              { path: "site-content", Component: AdminCrudPage },
              { path: "site-content/*", Component: AdminCrudPage },
              { path: "settings", Component: AdminCrudPage },
              { path: "settings/*", Component: AdminCrudPage },

              // Admin fallback.
              { path: "*", Component: AdminCrudPage },
            ],
          },
        ],
      },

      // ── Public fallback ────────────────────────────────────────────────────

      { path: "*", Component: NotFoundPage },
    ],
  },
]);
