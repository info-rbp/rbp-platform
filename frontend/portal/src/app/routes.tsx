import { createBrowserRouter, Navigate, Outlet } from "react-router";

import { ScrollToHash } from "./components/ScrollToHash";
import { EnvironmentBanner } from "./components/EnvironmentBanner";
import { RouteErrorBoundary } from "./components/RouteErrorBoundary";
import { SEO } from "./components/SEO";
import {
  RequireAccountGate,
  RequireAdminAuth,
  RequireCustomerAuth,
} from "./components/auth/AccountGate";
import { canShowPublicApplications } from "./config/runtime";
import { useRuntimeConfig } from "./hooks/useRuntimeConfig";
import {
  mockAdminAuthService,
  mockAuthService,
} from "./services/mock/auth.mockService";
import type { PortalProductKey } from "./types/portal";

import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { HelpCenterPage } from "./pages/HelpCenterPage";
import { SignInPage } from "./pages/SignInPage";
import { SignOutPage } from "./pages/SignOutPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import {
  CoreBidManagementPage,
  CoreBusinessAdvisorPage,
  CoreDecisionDeskPage,
  CoreRiskAdvisorPage,
  CoreServicesLandingPage,
  CoreTheFixerPage,
} from "./pages/core-services/CorePublicPages";
import { WhatWeDoPage } from "./pages/about/WhatWeDoPage";
import { OurProcessPage } from "./pages/about/OurProcessPage";
import { WorkWithUsPage } from "./pages/about/WorkWithUsPage";
import { WorkForUsPage } from "./pages/about/WorkForUsPage";
import { DiscoveryCallPage } from "./pages/about/DiscoveryCallPage";
import { OurPlatformPage } from "./pages/about/OurPlatformPage";
import { OnDemandPage } from "./pages/OnDemandPage";
import { ServicesPage } from "./pages/ServicesPage";
import { DocuSharePage } from "./pages/DocuSharePage";
import { DocumentOverviewPage } from "./pages/DocumentOverviewPage";
import { DocumentCategoryPage } from "./pages/DocumentCategoryPage";
import { DocumentProductPage } from "./pages/DocumentProductPage";
import { DocumentProcessPage } from "./pages/document-nucleus/DocumentProcessPage";
import { DocumentCustomisationPage } from "./pages/document-nucleus/DocumentCustomisationPage";
import { ManagedServicesPage } from "./pages/ManagedServicesPage";
import { RealEstatePage } from "./pages/managed-services/RealEstatePage";
import { HRServicesPage } from "./pages/managed-services/HRServicesPage";
import { ApplicationsPage } from "./pages/ApplicationsPage";
import { BusinessApplicationsPage } from "./pages/BusinessApplicationsPage";
import { OperationsCenterPage } from "./pages/OperationsCenterPage";
import { FinancePage } from "./pages/FinancePage";
import { FinancialPlanningPage } from "./pages/finance/FinancialPlanningPage";
import { CreditFundingPage } from "./pages/finance/CreditFundingPage";
import { NbnPhonePage } from "./pages/operations/NbnPhonePage";
import { OperationsComingSoonPage } from "./pages/operations/OperationsComingSoonPage";
import { OperationsInsurancePage } from "./pages/operations/OperationsInsurancePage";
import {
  OperationsFinancePage,
  OperationsFinanceReferralPage,
} from "./pages/operations/OperationsFinancePage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { MembershipOverviewPage } from "./pages/membership/MembershipOverviewPage";
import { RemoteBusinessPartnerMembershipPage } from "./pages/membership/RemoteBusinessPartnerMembershipPage";
import { MembershipInclusionsPage } from "./pages/membership/MembershipInclusionsPage";
import { MembershipFaqPage } from "./pages/membership/MembershipFaqPage";
import { MembershipTermsPage } from "./pages/membership/MembershipTermsPage";
import { MembershipConfirmationPage } from "./pages/confirmation/MembershipConfirmationPage";
import { OffersPage } from "./pages/OffersPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { LegalIndexPage } from "./pages/legal/LegalIndexPage";
import { PrivacyPolicyPage } from "./pages/legal/PrivacyPolicyPage";
import { TermsOfUsePage } from "./pages/legal/TermsOfUsePage";
import { TermsOfEngagementPage } from "./pages/legal/TermsOfEngagementPage";
import { PaymentPolicyPage } from "./pages/legal/PaymentPolicyPage";
import { ServicesPolicyPage } from "./pages/legal/ServicesPolicyPage";
import { ThankYouPage } from "./pages/confirmation/ThankYouPage";
import { ContactSuccessPage } from "./pages/confirmation/ContactSuccessPage";
import { BookingConfirmationPage } from "./pages/confirmation/BookingConfirmationPage";
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
import {
  PortalDecisionDeskStart,
  PortalDocuShareStart,
  PortalMarketplaceListingNew,
  PortalMarketplaceOfferNew,
  PortalMembershipCheckout,
  PortalNbnStart,
  PortalRiskAdvisorStart,
  PortalTheFixerStart,
} from "./pages/portal/PortalStartPages";
import { AdminSignInPage } from "./pages/admin/AdminSignInPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminCrudPage } from "./pages/admin/AdminCrudPage";

function Root() {
  return (
    <>
      <SEO />
      <EnvironmentBanner />
      <ScrollToHash />
      <Outlet />
    </>
  );
}

function Layout() {
  return <Outlet />;
}

function SignupPage() {
  return <SignInPage initialTab="signup" />;
}

function FeatureUnavailablePage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Feature unavailable</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      </div>
    </div>
  );
}

function PublicApplicationsGate() {
  const { config } = useRuntimeConfig();

  if (!canShowPublicApplications(config)) {
    return (
      <FeatureUnavailablePage
        title="Applications are not available"
        description="Applications visibility is disabled in this environment."
      />
    );
  }

  return <BusinessApplicationsPage />;
}

function AdminApplicationsGate() {
  const { config } = useRuntimeConfig();

  if (!config.features.admin_applications) {
    return (
      <FeatureUnavailablePage
        title="Admin Applications are disabled"
        description="The admin application management area is disabled by the current runtime flags."
      />
    );
  }

  return <AdminCrudPage />;
}

function AccountGateFor({
  returnTo,
  label,
  product,
  authPath,
}: {
  returnTo: string;
  label: string;
  product?: PortalProductKey;
  authPath?: "/signin" | "/signup";
}) {
  return (
    <RequireAccountGate returnTo={returnTo} label={label} product={product} authPath={authPath}>
      <Navigate to={returnTo} replace />
    </RequireAccountGate>
  );
}

export type AdminEntryState = {
  isAdminAuthenticated: boolean;
  isCustomerAuthenticated: boolean;
};

export function resolveAdminEntry(state: AdminEntryState) {
  if (state.isAdminAuthenticated) {
    return { kind: "redirect" as const, to: "/admin/dashboard" };
  }

  if (state.isCustomerAuthenticated) {
    return { kind: "denied" as const };
  }

  return { kind: "redirect" as const, to: "/admin/signin" };
}

function AdminEntryRoute() {
  const resolution = resolveAdminEntry({
    isAdminAuthenticated: mockAdminAuthService.isAuthenticated(),
    isCustomerAuthenticated: mockAuthService.isAuthenticated(),
  });

  if (resolution.kind === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
        <div className="max-w-md rounded-2xl border border-red-900/60 bg-slate-900 p-7">
          <h1 className="text-2xl font-extrabold">Access denied</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Customer portal access does not grant administrator permissions. Sign out of the customer account or use an administrator account.
          </p>
          <Navigate to="/admin/signin" replace />
        </div>
      </div>
    );
  }

  return <Navigate to={resolution.to} replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, Component: HomePage },
      { path: "about", Component: AboutPage },
      { path: "about-us", element: <Navigate to="/about" replace /> },
      { path: "contact", Component: ContactPage },
      { path: "contact-us", element: <Navigate to="/contact" replace /> },
      { path: "discovery-call", element: <Navigate to="/about/discovery-call" replace /> },
      { path: "our-platform", element: <Navigate to="/about/our-platform" replace /> },
      { path: "work-for-us", element: <Navigate to="/about/work-for-us" replace /> },
      { path: "work-with-us", element: <Navigate to="/about/work-with-us" replace /> },
      { path: "contact/success", Component: ContactSuccessPage },
      { path: "help", Component: HelpCenterPage },
      { path: "sign-in", element: <Navigate to="/signin" replace /> },
      { path: "signin", Component: SignInPage },
      { path: "signup", Component: SignupPage },
      { path: "signout", Component: SignOutPage },
      { path: "dashboard", Component: DashboardPage },
      { path: "nbn-phone", element: <Navigate to="/operations/connectivity/nbn-phone" replace /> },
      {
        path: "nbn-phone/connect-now",
        element: (
          <AccountGateFor
            returnTo="/portal/services/nbn/start"
            label="Order NBN through your account"
            product="connectivity"
          />
        ),
      },
      {
        path: "core-services",
        Component: Layout,
        children: [
          { index: true, Component: CoreServicesLandingPage },
          { path: "business-advisor", Component: CoreBusinessAdvisorPage },
          { path: "decision-desk", Component: CoreDecisionDeskPage },
          { path: "the-fixer", Component: CoreTheFixerPage },
          { path: "risk-advisor", Component: CoreRiskAdvisorPage },
          { path: "bid-management", Component: CoreBidManagementPage },
        ],
      },
      { path: "about/what-we-do", Component: WhatWeDoPage },
      { path: "about/our-process", Component: OurProcessPage },
      { path: "about/process", Component: OurProcessPage },
      { path: "about/our-platform", Component: OurPlatformPage },
      { path: "about/discovery-call", Component: DiscoveryCallPage },
      { path: "about/work-for-us", Component: WorkForUsPage },
      { path: "about/work-with-us", Component: WorkWithUsPage },
      { path: "services", Component: ServicesPage },
      { path: "business-advisor", element: <Navigate to="/core-services/business-advisor" replace /> },
      { path: "docushare", Component: DocuSharePage },
      { path: "applications-legacy", Component: ApplicationsPage },
      { path: "document-nucleus/overview", Component: DocumentOverviewPage },
      {
        path: "document-nucleus/brief",
        element: (
          <AccountGateFor
            returnTo="/portal/services/docushare/start"
            label="Submit a DocuShare brief through your account"
            product="docushare"
          />
        ),
      },
      { path: "document-nucleus/process", Component: DocumentProcessPage },
      { path: "document-nucleus/customisation", Component: DocumentCustomisationPage },
      { path: "document-nucleus/category/process", element: <Navigate to="/document-nucleus/process" replace /> },
      { path: "document-nucleus/category/customisation", element: <Navigate to="/document-nucleus/customisation" replace /> },
      { path: "document-nucleus/category/:id", Component: DocumentCategoryPage },
      { path: "document-nucleus/product/:id", Component: DocumentProductPage },
      {
        path: "on-demand",
        Component: Layout,
        children: [
          { index: true, Component: OnDemandPage },
          { path: "business-advisor", element: <Navigate to="/core-services/business-advisor" replace /> },
          { path: "services", Component: ServicesPage },
          { path: "documents", Component: DocuSharePage },
          { path: "decision-desk", element: <Navigate to="/core-services/decision-desk" replace /> },
          { path: "the-fixer", element: <Navigate to="/core-services/the-fixer" replace /> },
          { path: "risk-advisor", element: <Navigate to="/core-services/risk-advisor" replace /> },
        ],
      },
      {
        path: "managed-services",
        Component: Layout,
        children: [
          { index: true, Component: ManagedServicesPage },
          { path: "bid-management", element: <Navigate to="/core-services/bid-management" replace /> },
          { path: "real-estate", Component: RealEstatePage },
          { path: "hr-services", Component: HRServicesPage },
        ],
      },
      { path: "applications", Component: PublicApplicationsGate },
      {
        path: "operations",
        Component: Layout,
        children: [
          { index: true, Component: OperationsCenterPage },
          {
            path: "finance",
            Component: Layout,
            children: [
              { index: true, Component: OperationsFinancePage },
              { path: "get-funded", Component: OperationsFinanceReferralPage },
              { path: "business-insurance", element: <Navigate to="/operations/insurance" replace /> },
              { path: "business-lending", element: <Navigate to="/operations/finance/commercial-finance" replace /> },
              { path: "credit-and-funding", element: <Navigate to="/operations/finance/commercial-finance" replace /> },
              { path: "financial-planning", element: <Navigate to="/operations/finance/other-lending" replace /> },
              { path: ":slug", Component: OperationsFinancePage },
            ],
          },
          {
            path: "insurance",
            Component: Layout,
            children: [
              { index: true, Component: OperationsInsurancePage },
              { path: ":slug", Component: OperationsInsurancePage },
            ],
          },
          { path: "calculators", element: <Navigate to="/operations/finance/commercial-loan-calculator" replace /> },
          { path: "superloop", element: <Navigate to="/operations/connectivity/nbn-phone" replace /> },
          { path: "connectivity", element: <Navigate to="/operations/connectivity/nbn-phone" replace /> },
          { path: "connectivity/superloop", element: <Navigate to="/operations/connectivity/nbn-phone" replace /> },
          { path: "connectivity/nbn-phone", Component: NbnPhonePage },
          { path: "connectivity/nbn-phone/check-coverage", Component: NbnPhonePage },
          { path: "connectivity/nbn-phone/our-nbn-plans", Component: NbnPhonePage },
          { path: "connectivity/nbn-phone/getting-connected", Component: NbnPhonePage },
          { path: "connectivity/nbn-phone/wifi-modems", Component: NbnPhonePage },
          {
            path: "connectivity/nbn-phone/connect-now",
            element: (
              <AccountGateFor
                returnTo="/portal/services/nbn/start"
                label="Order NBN through your account"
                product="connectivity"
              />
            ),
          },
          { path: "connectivity/nbn-phone/faqs", Component: NbnPhonePage },
          { path: "coming-soon", Component: OperationsComingSoonPage },
        ],
      },
      {
        path: "finance",
        Component: Layout,
        children: [
          { index: true, Component: FinancePage },
          { path: "business-lending", element: <Navigate to="/operations/finance/commercial-finance" replace /> },
          { path: "business-insurance", element: <Navigate to="/operations/insurance" replace /> },
          { path: "financial-planning", Component: FinancialPlanningPage },
          { path: "credit-and-funding", Component: CreditFundingPage },
        ],
      },
      {
        path: "marketplace",
        Component: Layout,
        children: [
          { index: true, Component: MarketplacePage },
          { path: "product/:id", Component: MarketplacePage },
          {
            path: "enquiry/:id",
            element: (
              <AccountGateFor
                returnTo="/portal/marketplace/offers/new"
                label="Make a marketplace offer through your account"
                product="marketplace-offer"
              />
            ),
          },
          {
            path: "listing/new",
            element: (
              <AccountGateFor
                returnTo="/portal/marketplace/listings/new"
                label="Create a marketplace listing through your account"
                product="marketplace-listing"
              />
            ),
          },
        ],
      },
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
          { path: "pricing", element: <Navigate to="/membership/overview" replace /> },
          { path: "usage", element: <Navigate to="/membership/terms" replace /> },
          { path: "payment-terms", element: <Navigate to="/membership/terms" replace /> },
          {
            path: "sign-up-now",
            element: (
              <AccountGateFor
                returnTo="/portal/membership/checkout"
                label="Complete membership checkout through your account"
                product="membership"
                authPath="/signup"
              />
            ),
          },
          { path: "faq", Component: MembershipFaqPage },
          {
            path: "frequently-asked-questions",
            element: <Navigate to="/membership/faq" replace />,
          },
          { path: "terms", Component: MembershipTermsPage },
          { path: "confirmation", Component: MembershipConfirmationPage },
        ],
      },
      { path: "membership/sign-up", element: <Navigate to="/membership/sign-up-now" replace /> },
      { path: "offers", Component: OffersPage },
      { path: "resources", Component: ResourcesPage },
      { path: "privacy-policy", element: <Navigate to="/legal/privacy-policy" replace /> },
      { path: "terms-of-use", element: <Navigate to="/legal/terms-of-use" replace /> },
      { path: "terms-of-engagement", element: <Navigate to="/legal/terms-of-engagement" replace /> },
      { path: "payment-policy", element: <Navigate to="/legal/payment-policy" replace /> },
      { path: "services-policy", element: <Navigate to="/legal/services-policy" replace /> },
      { path: "legal/terms", element: <Navigate to="/legal/terms-of-use" replace /> },
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
      { path: "thank-you", Component: ThankYouPage },
      { path: "booking-confirmation", Component: BookingConfirmationPage },
      { path: "confirmation/thank-you", Component: ThankYouPage },
      { path: "confirmation/contact-success", Component: ContactSuccessPage },
      { path: "confirmation/booking-confirmation", Component: BookingConfirmationPage },
      {
        path: "confirmation/membership-confirmation",
        Component: MembershipConfirmationPage,
      },
      {
        path: "portal",
        element: (
          <RequireCustomerAuth>
            <PortalLayout />
          </RequireCustomerAuth>
        ),
        children: [
          { index: true, element: <Navigate to="/portal/dashboard" replace /> },
          { path: "dashboard", Component: PortalDashboard },
          {
            path: "services",
            Component: Layout,
            children: [
              { index: true, Component: PortalServices },
              { path: "request", Component: PortalServiceRequest },
              { path: "decision-desk/start", Component: PortalDecisionDeskStart },
              { path: "docushare/start", Component: PortalDocuShareStart },
              { path: "nbn/start", Component: PortalNbnStart },
              { path: "risk-advisor/start", Component: PortalRiskAdvisorStart },
              { path: "the-fixer/start", Component: PortalTheFixerStart },
              { path: ":id", Component: PortalServiceDetail },
            ],
          },
          { path: "marketplace/listings/new", Component: PortalMarketplaceListingNew },
          { path: "marketplace/offers/new", Component: PortalMarketplaceOfferNew },
          { path: "membership/checkout", Component: PortalMembershipCheckout },
          { path: "sessions", Component: PortalSessions },
          { path: "documents", Component: PortalDocuments },
          { path: "offers", Component: PortalOffers },
          { path: "apps", Component: PortalApps },
          { path: "resources", Component: PortalResources },
          { path: "support", Component: PortalSupport },
          { path: "settings", Component: PortalSettings },
        ],
      },
      {
        path: "admin",
        children: [
          { index: true, Component: AdminEntryRoute },
          { path: "signin", Component: AdminSignInPage },
          {
            element: (
              <RequireAdminAuth>
                <AdminLayout />
              </RequireAdminAuth>
            ),
            children: [
              { index: true, element: <Navigate to="/admin/dashboard" replace /> },
              { path: "dashboard", Component: AdminDashboard },
              { path: "content", Component: AdminCrudPage },
              { path: "requests", Component: AdminCrudPage },
              { path: "requests/decision-desk", Component: AdminCrudPage },
              { path: "requests/docushare", Component: AdminCrudPage },
              { path: "requests/connectivity", Component: AdminCrudPage },
              { path: "requests/risk-advisor", Component: AdminCrudPage },
              { path: "requests/fixer", Component: AdminCrudPage },
              { path: "decision-desk", Component: AdminCrudPage },
              { path: "docushare", Component: AdminCrudPage },
              { path: "connectivity", Component: AdminCrudPage },
              { path: "risk-advisor", Component: AdminCrudPage },
              { path: "users", Component: AdminCrudPage },
              { path: "audit-review", Component: AdminCrudPage },
              { path: "tasks", Component: AdminCrudPage },
              { path: "discovery-calls", Component: AdminCrudPage },
              { path: "other", Component: AdminCrudPage },
              { path: "members", Component: AdminCrudPage },
              { path: "services", Component: AdminCrudPage },
              { path: "sessions", Component: AdminCrudPage },
              { path: "documents", Component: AdminCrudPage },
              { path: "the-fixer", Component: AdminCrudPage },
              { path: "on-demand", Component: AdminCrudPage },
              { path: "on-demand/*", Component: AdminCrudPage },
              { path: "managed-services", Component: AdminCrudPage },
              { path: "managed-services/*", Component: AdminCrudPage },
              { path: "applications", Component: AdminApplicationsGate },
              { path: "applications/*", Component: AdminApplicationsGate },
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
              { path: "*", Component: AdminCrudPage },
            ],
          },
        ],
      },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
