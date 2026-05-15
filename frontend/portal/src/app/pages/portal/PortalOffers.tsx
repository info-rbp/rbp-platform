import { Link } from "react-router";
import { Tag, CheckCircle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

import { PortalAdminReference } from "./PortalAdminReference";
import { publicOffers, getOfferCategoryLabel } from "../../data/offers";

const offers = publicOffers.filter(
  (offer) => offer.status === "published" && offer.memberVisibility !== "admin-only"
);

export function PortalOffers() {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <PortalAdminReference portalRoute="/portal/offers" controlledBy={["Admin Offers"]} />

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
            The portal shows the offer detail and tracks intent, but partner redemption still happens outside RBP in this MVP.
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
    </div>
  );
}
