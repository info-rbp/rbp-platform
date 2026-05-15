import { Link, useSearchParams } from "react-router";
import {
  Tag,
  Gift,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import {
  getOfferCategoryLabel,
  offerCategoryFilters,
  offerFeaturedFilters,
  publicOffers,
  type OfferCategory,
  type OfferFeaturedFilter,
  type PublicOffer,
} from "../data/offers";
import { mockAuthService } from "../services/mock/auth.mockService";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CTABanner } from "../components/CTABanner";
import { PageHero } from "../components/PageHero";

const heroImage =
  "https://images.unsplash.com/photo-1758599543152-a73184816eba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGNsdXNpdmUlMjBkZWFscyUyMGhhbmRzaGFrZSUyMGJ1c2luZXNzJTIwcGFydG5lcnNoaXB8ZW58MXx8fHwxNzc2OTIzMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080";

const offerCategoryLabels = Object.fromEntries(
  offerCategoryFilters.map((category) => [category.id, category.label])
) as Record<OfferCategory, string>;

const featuredFilterById = Object.fromEntries(
  offerFeaturedFilters.map((filter) => [filter.id, filter])
) as Record<OfferFeaturedFilter, (typeof offerFeaturedFilters)[number]>;

const categoryToneMap: Record<OfferCategory, { bg: string; text: string }> = {
  "operations-advisory": { bg: "bg-slate-100", text: "text-slate-700" },
  "human-resource-advisory": { bg: "bg-violet-100", text: "text-violet-700" },
  "accounting-finance": { bg: "bg-sky-100", text: "text-sky-700" },
  "sales-marketing": { bg: "bg-pink-100", text: "text-pink-700" },
  "management-consulting": { bg: "bg-indigo-100", text: "text-indigo-700" },
  "change-management": { bg: "bg-amber-100", text: "text-amber-700" },
  "ai-advisory": { bg: "bg-cyan-100", text: "text-cyan-700" },
  "research-development": { bg: "bg-teal-100", text: "text-teal-700" },
  "information-technology": { bg: "bg-blue-100", text: "text-blue-700" },
  "public-relations": { bg: "bg-rose-100", text: "text-rose-700" },
  "rbp-category": { bg: "bg-slate-200", text: "text-slate-800" },
  other: { bg: "bg-emerald-100", text: "text-emerald-700" },
};

function createOffersHref(category: string, featured: string) {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  if (featured) {
    params.set("featured", featured);
  }

  const query = params.toString();
  return query ? `/offers?${query}` : "/offers";
}

function getBadgeClass(offer: PublicOffer) {
  if (offer.offerType === "exclusive") {
    return "bg-violet-600";
  }

  if (offer.offerType === "top") {
    return "bg-amber-500";
  }

  return "bg-slate-700";
}

export function OffersPage() {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? "";
  const selectedFeatured = searchParams.get("featured") ?? "";
  const selectedCategoryLabel = offerCategoryLabels[selectedCategory as OfferCategory] ?? "";
  const selectedFeaturedLabel =
    selectedFeatured && selectedFeatured in featuredFilterById
      ? featuredFilterById[selectedFeatured as OfferFeaturedFilter].label
      : "";
  const isAuthenticated = mockAuthService.isAuthenticated();
  const safeOffers = Array.isArray(publicOffers)
    ? publicOffers.filter((offer) => offer.status === "published" && offer.memberVisibility !== "admin-only")
    : [];

  const filteredOffers = safeOffers.filter((offer) => {
    const featuredOption = selectedFeatured
      ? featuredFilterById[selectedFeatured as OfferFeaturedFilter]
      : undefined;
    const matchesCategory = !selectedCategory || offer.category === selectedCategory;
    const matchesFeatured = !featuredOption || offer.offerType === featuredOption.offerType;

    return matchesCategory && matchesFeatured;
  });

  const topOfferCount = safeOffers.filter((offer) => offer.offerType === "top").length;
  const exclusiveOfferCount = safeOffers.filter((offer) => offer.offerType === "exclusive").length;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        title="Member Offers"
        titleAccent="& Benefits"
        subtitle="Browse public offer cards, then unlock the member-gated detail through sign-in and the portal. This MVP captures interest and guided access rather than completing redemption inside RBP."
        badge="Offers"
        breadcrumb="Offers"
        image={heroImage}
        bullets={[
          "Rich public offer cards",
          "Member-gated portal access",
          "Non-transactional launch flow",
        ]}
        ctaPrimary={{ label: "View member offers", href: "#exclusive" }}
        ctaSecondary={{ label: "Talk to Us", href: "/contact?reason=offers-partnership" }}
        stat={{ value: `${safeOffers.length}`, label: "Visible offers", sublabel: "Public browse, portal-gated access" }}
      />

      <section id="overview" className="scroll-mt-32 py-20 lg:py-28">
        <div id="exclusive" className="scroll-mt-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
                <Gift className="h-3.5 w-3.5" />
                Member Offers
              </span>
              <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Public Cards With Member-Gated Access
              </h2>
              <p className="mx-auto max-w-2xl text-slate-600">
                Public users can browse the offer catalogue. Selecting <strong>Get Offer</strong> sends them into the sign-in or sign-up flow with a return path to the portal detail for the specific offer.
              </p>

              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    <Sparkles className="h-3 w-3" /> Featured Filters
                  </span>
                  <Link
                    to={createOffersHref(selectedCategory, "")}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                      !selectedFeatured
                        ? "bg-blue-700 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    All Featured States
                  </Link>
                  {offerFeaturedFilters.map((filter) => (
                    <Link
                      key={filter.id}
                      to={createOffersHref(selectedCategory, filter.id)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                        selectedFeatured === filter.id
                          ? "bg-blue-700 text-white"
                          : "bg-white text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {filter.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    <Tag className="h-3 w-3" /> Category Filters
                  </span>
                  <Link
                    to={createOffersHref("", selectedFeatured)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                      !selectedCategory
                        ? "bg-blue-700 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    All Categories
                  </Link>
                  {offerCategoryFilters.map((category) => (
                    <Link
                      key={category.id}
                      to={createOffersHref(category.id, selectedFeatured)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                        selectedCategory === category.id
                          ? "bg-blue-700 text-white"
                          : "bg-white text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              </div>

              {selectedCategory || selectedFeatured ? (
                <div className="mx-auto mt-5 max-w-3xl rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-sm text-slate-700">
                    Showing
                    {selectedFeaturedLabel ? (
                      <strong>{` ${selectedFeaturedLabel}`}</strong>
                    ) : null}
                    {selectedCategoryLabel ? (
                      <strong>{` ${selectedFeaturedLabel ? "in" : "offers for"} ${selectedCategoryLabel}`}</strong>
                    ) : null}
                    .
                    {filteredOffers.length === 0
                      ? " No current offers match this combination yet."
                      : " These remain member-gated access paths rather than in-platform redemption flows."}
                  </p>
                </div>
              ) : null}
            </div>

            {filteredOffers.length === 0 ? (
              <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-slate-50 px-6 py-12 text-center shadow-sm">
                <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Matching offers are being prepared.
                </h3>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                  Check back soon for more member offers, partner benefits, and category coverage.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/membership"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
                  >
                    View membership options
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    Return home
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredOffers.map((offer) => {
                  const tone = categoryToneMap[offer.category] ?? categoryToneMap.other;
                  const safeFeatures = Array.isArray(offer.features) ? offer.features : [];
                  const ctaDestination = isAuthenticated
                    ? offer.portalOfferDestination
                    : offer.publicCtaDestination;

                  return (
                    <div
                      key={offer.id}
                      className={`flex flex-col overflow-hidden rounded-2xl ${
                        offer.highlight
                          ? "bg-blue-700 text-white shadow-2xl shadow-blue-200 ring-2 ring-blue-400"
                          : "border border-slate-200 bg-white text-slate-900 shadow-sm transition-shadow hover:shadow-md"
                      }`}
                    >
                      <div className={`h-1.5 w-full ${offer.accentClassName ?? "bg-blue-700"}`} />

                      <div className="flex grow flex-col p-6">
                        <div className="mb-4 flex items-start justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${
                              offer.highlight ? "bg-white/20 text-white" : `${tone.bg} ${tone.text}`
                            }`}
                          >
                            <Tag className="h-3 w-3" />
                            {getOfferCategoryLabel(offer.category)}
                          </span>
                          {offer.badge ? (
                            <span
                              className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-bold text-white ${getBadgeClass(offer)}`}
                            >
                              {offer.badge}
                            </span>
                          ) : null}
                        </div>

                        <div className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                          {offer.partner}
                        </div>
                        <h3
                          className={`mb-3 text-lg font-extrabold ${
                            offer.highlight ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {offer.title}
                        </h3>

                        {offer.saving ? (
                          <div className="mb-3">
                            <span
                              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${
                                offer.highlight
                                  ? "bg-emerald-400/20 text-emerald-200"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              <Zap className="h-3 w-3" />
                              {offer.saving}
                            </span>
                          </div>
                        ) : null}

                        <p
                          className={`mb-4 text-sm leading-relaxed ${
                            offer.highlight ? "text-blue-100" : "text-slate-600"
                          }`}
                        >
                          {offer.summary}
                        </p>

                        <div className="mb-5 grow space-y-2">
                          {safeFeatures.map((feature) => (
                            <div key={feature} className="flex items-center gap-2">
                              <CheckCircle
                                className={`h-3.5 w-3.5 shrink-0 ${
                                  offer.highlight ? "text-blue-200" : "text-emerald-500"
                                }`}
                              />
                              <span
                                className={`text-xs ${
                                  offer.highlight ? "text-blue-100" : "text-slate-600"
                                }`}
                              >
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div
                          className={`mb-4 space-y-2 text-xs ${
                            offer.highlight ? "text-blue-200" : "text-slate-500"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                            {offer.availability ?? offer.eligibility}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <LockKeyhole className="h-3.5 w-3.5 shrink-0" />
                            Member-gated portal detail after sign-in or sign-up
                          </div>
                        </div>

                        <Link
                          to={ctaDestination}
                          className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                            offer.highlight
                              ? "bg-white text-blue-700 hover:bg-blue-50"
                              : "bg-blue-700 text-white hover:bg-blue-800"
                          }`}
                        >
                          {offer.publicCtaLabel} <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="mt-10 text-center text-sm text-slate-500">
              All partner offers are subject to partner terms and RBP review pathways. This MVP tracks interest and gated access only.
              <Link
                to="/contact?reason=offer-enquiry"
                className="ml-1 font-semibold text-blue-700 hover:underline"
              >
                Contact us for help with a specific offer.
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section id="top" className="scroll-mt-32 bg-slate-50 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Top Offers</div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{topOfferCount}</div>
            <p className="mt-2 text-sm text-slate-600">Featured high-interest offers kept separate from category filters.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Exclusive Offers</div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{exclusiveOfferCount}</div>
            <p className="mt-2 text-sm text-slate-600">Member-only offers that route through the gated portal experience.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Tracking Model</div>
            <div className="mt-3 text-xl font-extrabold text-slate-900">Appwrite first</div>
            <p className="mt-2 text-sm text-slate-600">Tracking fields are ready for internal click and interest capture before any external adapter.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Launch Mode</div>
            <div className="mt-3 text-xl font-extrabold text-slate-900">Non-transactional MVP</div>
            <p className="mt-2 text-sm text-slate-600">RBP provides guided access to offers without completing partner redemption inside the platform.</p>
          </div>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </div>
  );
}
