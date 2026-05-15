import { Link, useParams } from "react-router";
import {
  ChevronRight,
  ArrowRight,
  CheckCircle,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  CircleDollarSign,
  Activity,
  FileText,
} from "lucide-react";

import { findPublicOfferById, getOfferCategoryLabel } from "../../data/offers";

function formatMemberVisibility(value: string) {
  return value.replace(/-/g, " ");
}

function formatRedemptionMethod(value: string) {
  return value.replace(/-/g, " ");
}

function formatTrackingMethod(value: string) {
  return value.replace(/-/g, " ");
}

export function PortalOfferDetail() {
  const { offerId } = useParams<{ offerId: string }>();
  const offer = offerId ? findPublicOfferById(offerId) : undefined;

  if (!offer || offer.status !== "published") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <FileText className="h-7 w-7 text-slate-300" />
        </div>
        <div className="text-sm font-bold text-slate-700">Offer not found</div>
        <p className="mt-2 max-w-md text-xs leading-6 text-slate-400">
          This offer is unavailable or no longer visible in the current portal catalogue.
        </p>
        <Link
          to="/portal/offers"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-800"
        >
          Back to Member Offers <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  const safeFeatures = Array.isArray(offer.features) ? offer.features : [];
  const supportHref = `/contact?reason=offer-enquiry&offer=${encodeURIComponent(offer.id)}`;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link to="/portal/offers" className="font-semibold transition-colors hover:text-blue-700">
          Member Offers
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-semibold text-slate-700">{offer.partner}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  {getOfferCategoryLabel(offer.category)}
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  {offer.offerType}
                </span>
                {offer.badge ? (
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                    {offer.badge}
                  </span>
                ) : null}
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  {offer.partner}
                </div>
                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                  {offer.title}
                </h1>
              </div>

              <p className="max-w-3xl text-sm leading-7 text-slate-600">{offer.summary}</p>
            </div>

            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${offer.accentClassName ?? "bg-blue-700"}`}>
              <span className="text-sm font-black text-white">{offer.logo ?? offer.partner.slice(0, 2).toUpperCase()}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Member Value</div>
              <div className="mt-2 flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Sparkles className="h-4 w-4 text-amber-500" />
                {offer.saving ?? "Member offer"}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Eligibility</div>
              <div className="mt-2 text-sm font-semibold text-slate-900">{offer.eligibility}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Visibility</div>
              <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <LockKeyhole className="h-4 w-4 text-blue-700" />
                {formatMemberVisibility(offer.memberVisibility)}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Availability</div>
              <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                {offer.availability ?? "Available to eligible members"}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 p-5">
              <h2 className="text-sm font-extrabold text-slate-900">What This Offer Includes</h2>
              {safeFeatures.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {safeFeatures.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span className="text-sm leading-6 text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Detailed feature notes will appear here as this offer evolves.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-100 p-5">
              <h2 className="text-sm font-extrabold text-slate-900">Offer Delivery Model</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <CircleDollarSign className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                  <span>Redemption method: {formatRedemptionMethod(offer.redemptionMethod)}.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Activity className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" />
                  <span>
                    Tracking requirement: {offer.trackingRequired}. Tracking method: {formatTrackingMethod(offer.trackingMethod)}.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    This launch is non-transactional. RBP captures interest and guides member access rather than completing partner redemption inside the platform.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <h2 className="text-sm font-extrabold text-slate-900">Terms</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{offer.terms}</p>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Next Step</div>
            <h2 className="mt-2 text-lg font-extrabold text-slate-950">Continue Through RBP Support</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              This offer is now unlocked for the portal view. The next step is a guided RBP access or referral path rather than instant partner checkout.
            </p>
            <div className="mt-5 space-y-3">
              <Link
                to={supportHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-800"
              >
                Continue With RBP <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/portal/support"
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
              >
                Open Support
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Offer Admin Readiness</div>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Approval status: {offer.approvalStatus}</li>
              <li>Offer status: {offer.status}</li>
              <li>Public CTA remains fixed to Get Offer.</li>
              <li>Tracking fields are structured for later Appwrite persistence.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
