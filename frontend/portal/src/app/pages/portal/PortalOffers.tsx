import { Link } from "react-router";
import { PortalAdminReference } from "./PortalAdminReference";
import { EntitlementBadge } from "../../components/status";
import { mockPortalOffers } from "../../mock";
import { Tag, ExternalLink, CheckCircle, Star, ArrowRight } from "lucide-react";

const offers = mockPortalOffers;
const logoColors = ["bg-blue-500", "bg-violet-600", "bg-slate-700", "bg-sky-600", "bg-emerald-600"];

export function PortalOffers() {
  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <PortalAdminReference
        portalRoute="/portal/offers"
        controlledBy={["Admin Offers"]}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">Partner Offers</h2>
          <p className="text-sm text-slate-500">Exclusive mock discounts, eligibility states, and member value cards.</p>
        </div>
        <Link
          to="/offers"
          className="hidden sm:inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex-shrink-0"
        >
          Browse All Offers <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Activated banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <div>
          <div className="text-xs font-extrabold text-emerald-800">1 included offer currently active</div>
          <div className="text-[10px] text-emerald-600">Offer redemption is not wired; cards link back to the public offers experience.</div>
        </div>
      </div>

      {/* Offer grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {offers.map((offer, index) => (
          <div key={offer.partner} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${logoColors[index % logoColors.length]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xs font-black text-white">{offer.logo}</span>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">{offer.partner}</div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-2.5 h-2.5 ${i < offer.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <EntitlementBadge state={offer.accessState} />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-800 mb-1">{offer.title}</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{offer.description}</p>
              <span className="mt-3 inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-50 text-slate-600">
                {offer.category}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Member saving</div>
                <div className="text-sm font-extrabold text-blue-700">{offer.saving}</div>
              </div>
              {offer.accessState === "included" ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <CheckCircle className="w-3.5 h-3.5" /> Active
                </span>
              ) : (
                <Link
                  to="/offers"
                  className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-[10px] px-3 py-2 rounded-lg transition-colors"
                >
                  View Offer <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
