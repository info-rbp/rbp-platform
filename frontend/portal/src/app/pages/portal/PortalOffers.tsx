import { Link } from "react-router";
import { Tag, ExternalLink, CheckCircle, Star, ArrowRight } from "lucide-react";

import { PortalAdminReference } from "./PortalAdminReference";
import { EntitlementBadge } from "../../components/status";
import { mockPortalOffers } from "../../mock";

const offers = mockPortalOffers;
const logoColors = [
  "bg-blue-500",
  "bg-violet-600",
  "bg-slate-700",
  "bg-sky-600",
  "bg-emerald-600",
];

export function PortalOffers() {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <PortalAdminReference
        portalRoute="/portal/offers"
        controlledBy={["Admin Offers"]}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="mb-1 text-xl font-extrabold text-slate-900">Member Offers</h2>
          <p className="text-sm text-slate-500">
            Available benefits, partner offer visibility, and member eligibility states.
          </p>
        </div>
        <Link
          to="/offers"
          className="hidden shrink-0 items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-800 sm:inline-flex"
        >
          Browse All Offers <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
        <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <div className="text-xs font-extrabold text-emerald-800">
            1 available benefit is currently visible
          </div>
          <div className="text-[10px] text-emerald-600">
            Redemption is not wired yet; cards point back to public benefit information instead.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {offers.map((offer, index) => (
          <div
            key={offer.partner}
            className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${logoColors[index % logoColors.length]}`}
                >
                  <span className="text-xs font-black text-white">{offer.logo}</span>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">{offer.partner}</div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-2.5 w-2.5 ${
                          i < offer.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <EntitlementBadge state={offer.accessState} />
            </div>

            <div>
              <div className="mb-1 text-xs font-bold text-slate-800">{offer.title}</div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                {offer.description}
              </p>
              <span className="mt-3 inline-flex rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                {offer.category}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-2">
              <div>
                <div className="text-[10px] font-medium text-slate-400">
                  Member benefit
                </div>
                <div className="text-sm font-extrabold text-blue-700">{offer.saving}</div>
              </div>
              {offer.accessState === "included" ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <CheckCircle className="h-3.5 w-3.5" /> Available
                </span>
              ) : (
                <Link
                  to="/offers"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-2 text-[10px] font-bold text-white transition-colors hover:bg-blue-800"
                >
                  View benefit <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
