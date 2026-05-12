import { Link } from "react-router";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

import { DecisionDeskFlow } from "../../features/decision-desk";
import { DocuShareOnboardingFlow } from "../../features/docushare";
import { ConnectivityOrderFlow } from "../../features/connectivity";
import { MarketplaceEnquiryListingFlow } from "../../features/marketplace";
import { MembershipPurchaseOnboardingFlow } from "../../features/membership/MembershipPurchaseOnboardingFlow";
import { RiskAdvisorFlow } from "../../features/risk-advisor";
import { TheFixerFlow } from "../../features/the-fixer";

function PortalFlowFrame({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6">
        <Link to="/portal/dashboard" className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-800">
          <ArrowLeft className="h-3.5 w-3.5" />
          Portal dashboard
        </Link>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">{eyebrow}</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
      </div>
      {children}
    </div>
  );
}

export function PortalDecisionDeskStart() {
  return (
    <PortalFlowFrame
      eyebrow="Decision Desk"
      title="Start a Decision Desk request"
      description="Business details, decision context, current situation, constraints, supporting information, review, and confirmation."
    >
      <DecisionDeskFlow />
    </PortalFlowFrame>
  );
}

export function PortalDocuShareStart() {
  return (
    <PortalFlowFrame
      eyebrow="DocuShare"
      title="Start a DocuShare brief"
      description="Welcome, business details, document group, purpose and audience, tailored requirements, branding, uploads, review, and confirmation."
    >
      <DocuShareOnboardingFlow />
    </PortalFlowFrame>
  );
}

export function PortalNbnStart() {
  return (
    <PortalFlowFrame
      eyebrow="Connectivity"
      title="Order business NBN through your account"
      description="Address availability, plan selection, modem and hardware, business details, review, mock billing, and confirmation."
    >
      <ConnectivityOrderFlow embedded />
    </PortalFlowFrame>
  );
}

export function PortalRiskAdvisorStart() {
  return (
    <PortalFlowFrame
      eyebrow="Risk Advisor"
      title="Start a Risk Advisor assessment"
      description="Member portal intake, service status, risk scoring, recommendations, and admin management status."
    >
      <RiskAdvisorFlow embedded />
    </PortalFlowFrame>
  );
}

export function PortalTheFixerStart() {
  return (
    <PortalFlowFrame
      eyebrow="The Fixer"
      title="Start a Fixer request"
      description="Authenticated issue intake, impact, urgency, supporting information, desired resolution, member status, and admin request handling."
    >
      <TheFixerFlow embedded />
    </PortalFlowFrame>
  );
}

export function PortalMarketplaceListingNew() {
  return (
    <PortalFlowFrame
      eyebrow="Marketplace"
      title="Create a marketplace listing"
      description="Listing type, asset or business questionnaire, media/document upload, preview, fees and terms, mock payment, seller dashboard, admin review, and publication state."
    >
      <MarketplaceEnquiryListingFlow embedded forcedView="seller" />
    </PortalFlowFrame>
  );
}

export function PortalMarketplaceOfferNew() {
  return (
    <PortalFlowFrame
      eyebrow="Marketplace"
      title="Make a marketplace offer"
      description="Buyer enquiry and offer flow with review, confirmation, seller response status, and marketplace team visibility."
    >
      <MarketplaceEnquiryListingFlow embedded forcedView="enquiry" />
    </PortalFlowFrame>
  );
}

export function PortalMembershipCheckout() {
  return (
    <PortalFlowFrame
      eyebrow="Membership"
      title="Membership checkout"
      description="Plan selection, account details, inclusions, extras, mock payment, review, success, onboarding, and portal handoff."
    >
      <MembershipPurchaseOnboardingFlow />
    </PortalFlowFrame>
  );
}
