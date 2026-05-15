import { Link, useSearchParams } from "react-router";
import {
  Tag,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  LockKeyhole,
  Activity,
  CircleDollarSign,
} from "lucide-react";

import { PortalAdminReference } from "./PortalAdminReference";
import {
  findPublicOfferById,
  getOfferCategoryLabel,
  publicOffers,
} from "../../data/offers";

const offers = publicOffers.filter(
  (offer) => offer.status === "published" && offer.memberVisibility !== "admin-only"
);

function formatValue(value: string) {
  return value.replace(/-/g, " ");
}

export function PortalOffers() {
  const [searchParams] = useSearchParams();
  const selectedOfferId = searchParams.get("offer") ?? "";
  const selectedOffer = selectedOfferId ? findPublicOfferById(selectedOfferId) : undefined;
  const safeFeatures = Array.isArray(selectedOffer?.features) ? selectedOffer.features : [];
  const supportHref = selectedOffer
    ? `/contact?reason=offer-enquiry&offer=${encodeURIComponent(selectedOffer.id)}`
    : "/contact?reason=offer-enquiry";

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <PortalAdminReference portalRoute="/portal/offers" controlledBy={["Admin Offers"]} />

      {selectedOffer ? (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="mb-1 text-xl font-extrabold text-slate-900">Member Offer Detail</h2>
              <p className="text-sm text-slate-500">
                Member-gated detail for the selected offer. This page captures intent and guides the next step rather than completing redemption inside RBP.
              </p>
            </div>
            <Link
              to="/portal/offers"
              className="hidden shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50 sm:inline-flex"
            >
              Back to All Offers
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_0.9fr]">
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                      {getOfferCategoryLabel(selectedOffer.category)}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                      {selectedOffer.offerType}
                    </span>
                    {selectedOffer.badge ? (
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                        {selectedOffer.badge}
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      {selectedOffer.partner}
                    </div>
                    <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                      {selectedOffer.title}
                    </h3>
                  </div>

                  <p className="max-w-3xl text-sm leading-7 text-slate-600">{selectedOffer.summary}</p>
                </div>

                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${selectedOffer.accentClassName ?? "bg-blue-700"}`}>
                  <span className="text-sm font-black text-white">
                    {selectedOffer.logo ?? selectedOffer.partner.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Member Value</div>
                  <div className="mt-2 flex items-center gap-2 text-sm font-extrabold text-slate-900">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    {selectedOffer.saving ?? "Member offer"}
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Eligibility</div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">{selectedOffer.eligibility}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Visibility</div>
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <LockKeyhole className="h-4 w-4 text-blue-700" />
                    {formatValue(selectedOffer.memberVisibility)}
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Availability</div>
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    {selectedOffer.availability ?? "Available to eligible members"}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 p-5">
                  <h3 className="text-sm font-extrabold text-slate-900">What This Offer Includes</h3>
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
                  <h3 className="text-sm font-extrabold text-slate-900">Offer Delivery Model</h3>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div className="flex items-start gap-2">
                      <CircleDollarSign className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                      <span>Redemption method: {formatValue(selectedOffer.redemptionMethod)}.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Activity className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" />
                      <span>
                        Tracking requirement: {selectedOffer.trackingRequired}. Tracking method: {formatValue(selectedOffer.trackingMethod)}.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>
                        This launch is non-transactional. RBP captures interest and guides access instead of completing partner redemption inside the platform.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <h3 className="text-sm font-extrabold text-slate-900">Terms</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{selectedOffer.terms}</p>
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Next Step</div>
                <h3 className="mt-2 text-lg font-extrabold text-slate-950">Continue Through RBP</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  The offer is now visible inside the portal. The next step is a guided access or referral pathway managed through RBP support.
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
                  <li>Approval status: {selectedOffer.approvalStatus}</li>
                  <li>Offer status: {selectedOffer.status}</li>
                  <li>Public CTA remains fixed to Get Offer.</li>
                  <li>Tracking fields are structured for later Appwrite persistence.</li>
                </ul>
              </div>
            </aside>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="mb-1 text-xl font-extrabold text-slate-900">Member Offers</h2>
              <p className="text-sm text-slate-500">
                Member-gated offer detail, eligibility, and next-step access for the current MVP.
              </p>
            </div>
            <Link
              to="/offers"
              className="hidden shrink-0 items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-800 sm:inline-flex"
            >
              Browse Public Offers <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <div className="text-xs font-extrabold text-emerald-800">
                {offers.length} member-gated offer{offers.length === 1 ? " is" : "s are"} currently visible
              </div>
              <div className="text-[10px] text-emerald-600">
                The portal shows offer detail and tracks intent, but partner redemption still happens outside RBP in this MVP.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${offer.accentClassName ?? "bg-blue-700"}`}
                    >
                      <span className="text-xs font-black text-white">{offer.logo ?? offer.partner.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                        {offer.partner}
                      </div>
                      <div className="text-[11px] font-bold text-slate-900">{offer.title}</div>
                    </div>
                  </div>
                  {offer.badge ? (
                    <span className="rounded-md bg-slate-900 px-2 py-1 text-[10px] font-bold text-white">
                      {offer.badge}
                    </span>
                  ) : null}
                </div>

                <div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    <Tag className="h-3 w-3" />
                    {getOfferCategoryLabel(offer.category)}
                  </span>
                  <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{offer.summary}</p>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    {offer.saving ?? "Member offer available"}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    {offer.availability ?? offer.eligibility}
                  </div>
                </div>

                <Link
                  to={offer.portalOfferDestination}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-3 py-2 text-[10px] font-bold text-white transition-colors hover:bg-blue-800"
                >
                  Open Offer <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
