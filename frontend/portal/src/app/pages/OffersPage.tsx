import { Link, useSearchParams } from "react-router";
import {
  Tag,
  Gift,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

import { offerCategoryFilters } from "../data/offers";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CTABanner } from "../components/CTABanner";
import { PageHero } from "../components/PageHero";

const heroImage =
  "https://images.unsplash.com/photo-1758599543152-a73184816eba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGNsdXNpdmUlMjBkZWFscyUyMGhhbmRzaGFrZSUyMGJ1c2luZXNzJTIwcGFydG5lcnNoaXB8ZW58MXx8fHwxNzc2OTIzMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080";

interface OfferCard {
  id: string;
  partner: string;
  categoryId: string;
  category: string;
  categoryBg: string;
  categoryText: string;
  accentColor: string;
  offer: string;
  subOffer: string;
  saving: string;
  desc: string;
  badge: string;
  badgeColor: string;
  highlight?: boolean;
  features?: string[];
  availability: string;
}

const offers: OfferCard[] = [
  {
    id: "xero-member-offer",
    partner: "Xero",
    categoryId: "admin-finance",
    category: "Accounting & Finance",
    categoryBg: "bg-sky-100",
    categoryText: "text-sky-700",
    accentColor: "bg-sky-600",
    offer: "3 Months Free",
    subOffer: "then 25% off for Year 1",
    saving: "Save up to $216",
    desc: "Australia's #1 cloud accounting software. Manage invoicing, payroll, BAS, and GST reporting all in one place.",
    badge: "Most Viewed",
    badgeColor: "bg-amber-500",
    highlight: false,
    features: [
      "Cloud invoicing & quotes",
      "Single Touch Payroll",
      "GST & BAS reporting",
    ],
    availability: "Available benefit for active RBP clients",
  },
  {
    id: "employment-hero-member-offer",
    partner: "Employment Hero",
    categoryId: "human-resources",
    category: "HR & Payroll",
    categoryBg: "bg-violet-100",
    categoryText: "text-violet-700",
    accentColor: "bg-violet-600",
    offer: "6-Month Free Trial",
    subOffer: "Full platform access included",
    saving: "Save up to $600",
    desc: "Australia's leading HR, payroll & team management platform. Run onboarding, leave management, and payroll from one dashboard.",
    badge: "Member value",
    badgeColor: "bg-rose-500",
    highlight: true,
    features: [
      "Automated payroll & STP",
      "Employee onboarding flows",
      "Leave & rostering management",
    ],
    availability: "Available benefit for RBP members",
  },
  {
    id: "legalvision-member-offer",
    partner: "LegalVision",
    categoryId: "other",
    category: "Legal Services",
    categoryBg: "bg-emerald-100",
    categoryText: "text-emerald-700",
    accentColor: "bg-emerald-600",
    offer: "First Review Free",
    subOffer: "Up to $350 value",
    saving: "Save up to $350",
    desc: "Get your first contract or legal document reviewed at no cost by Australia's leading online business law firm.",
    badge: "High Value",
    badgeColor: "bg-blue-700",
    highlight: false,
    features: [
      "Contract review & drafting",
      "Business structure advice",
      "Compliance & IP protection",
    ],
    availability: "Available benefit for new LegalVision clients",
  },
  {
    id: "microsoft-365-member-offer",
    partner: "Microsoft 365",
    categoryId: "digital-tech",
    category: "Productivity Suite",
    categoryBg: "bg-blue-100",
    categoryText: "text-blue-700",
    accentColor: "bg-blue-600",
    offer: "3 Months Free",
    subOffer: "Business Basic plan",
    saving: "Save up to $90",
    desc: "Teams, SharePoint, Word, Excel, Outlook and more — everything your team needs to collaborate effectively from anywhere.",
    badge: "Popular",
    badgeColor: "bg-blue-700",
    highlight: false,
    features: [
      "Microsoft Teams & SharePoint",
      "1 TB OneDrive storage",
      "Business email & calendar",
    ],
    availability: "Available benefit for new subscriptions",
  },
  {
    id: "canva-pro-member-offer",
    partner: "Canva Pro",
    categoryId: "sales-marketing",
    category: "Design & Marketing",
    categoryBg: "bg-pink-100",
    categoryText: "text-pink-700",
    accentColor: "bg-pink-500",
    offer: "50% Off Annual Plan",
    subOffer: "First year only",
    saving: "Save $80/year",
    desc: "Create professional marketing materials, social posts, pitch decks, and brand assets — all from one easy-to-use platform.",
    badge: "Great Value",
    badgeColor: "bg-violet-700",
    highlight: false,
    features: [
      "Brand Kit & template library",
      "Social media scheduler",
      "200M+ stock assets",
    ],
    availability: "Available benefit for new Canva Pro accounts",
  },
  {
    id: "shopify-member-offer",
    partner: "Shopify",
    categoryId: "digital-tech",
    category: "eCommerce",
    categoryBg: "bg-emerald-100",
    categoryText: "text-emerald-700",
    accentColor: "bg-emerald-700",
    offer: "90 Days for $1/mo",
    subOffer: "Starter & Basic plans",
    saving: "Save up to $87",
    desc: "Launch or migrate your online store to Australia's top eCommerce platform for just $1 per month for your first 90 days.",
    badge: "Limited Time",
    badgeColor: "bg-emerald-600",
    highlight: false,
    features: [
      "Online store & checkout",
      "Integrated payment processing",
      "Inventory & order management",
    ],
    availability: "Available benefit for new Shopify stores",
  },
];

const partnerDeals = [
  { partner: "Accounting Software", deal: "30% off first year", category: "Finance" },
  { partner: "HR Management Tools", deal: "Free 3-month trial", category: "HR" },
  { partner: "Cloud Storage Solutions", deal: "2x storage included", category: "Tech" },
  { partner: "Legal Document Services", deal: "First contract free", category: "Legal" },
];

const safeOfferCategoryFilters = Array.isArray(offerCategoryFilters) ? offerCategoryFilters : [];
const offerCategoryLabels = Object.fromEntries(
  safeOfferCategoryFilters.map((category) => [category.id, category.label])
);

export function OffersPage() {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? "";
  const selectedCategoryLabel = offerCategoryLabels[selectedCategory] ?? "";
  const safeOffers = Array.isArray(offers) ? offers : [];

  const filteredOffers = selectedCategory
    ? safeOffers.filter((offer) => offer.categoryId === selectedCategory)
    : safeOffers;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        title="Member Offers"
        titleAccent="& Benefits"
        subtitle="Review partner value, member offers, and available benefits designed to support small businesses. Access and redemption handling still follows review and account pathways."
        badge="Offers"
        breadcrumb="Offers"
        image={heroImage}
        bullets={[
          "Partner-supported value pathways",
          "Member offer visibility",
          "Request access through RBP",
        ]}
        ctaPrimary={{ label: "View member offers", href: "#exclusive" }}
        ctaSecondary={{ label: "Talk to Us", href: "/contact?reason=offers-partnership" }}
        stat={{ value: "30%", label: "Average member value", sublabel: "Across selected offers" }}
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
                Partner Offers & Available Benefits
              </h2>
              <p className="mx-auto max-w-xl text-slate-600">
                These offers describe available member value and partner-supported benefits. Access and fulfilment still depend on account status and the relevant review pathway.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Link
                  to="/offers"
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                    !selectedCategory
                      ? "bg-blue-700 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All Offers
                </Link>
                {safeOfferCategoryFilters.map((category) => (
                  <Link
                    key={category.id}
                    to={`/offers?category=${category.id}`}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                      selectedCategory === category.id
                        ? "bg-blue-700 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {category.label}
                  </Link>
                ))}
              </div>

              {selectedCategory ? (
                <div className="mx-auto mt-5 max-w-2xl rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-sm text-slate-700">
                    Showing offers for <strong>{selectedCategoryLabel || selectedCategory}</strong>.
                    {filteredOffers.length === 0
                      ? " No current offers are listed in this category yet."
                      : " These remain review-based benefits rather than instant redemption flows."}
                  </p>
                </div>
              ) : null}
            </div>

            {filteredOffers.length === 0 ? (
              <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-slate-50 px-6 py-12 text-center shadow-sm">
                <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Member offers are being prepared.
                </h3>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                  Check back soon for partner offers, member benefits, and limited-time opportunities.
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
                  const safeFeatures = Array.isArray(offer.features) ? offer.features : [];

                  return (
                    <div
                      key={offer.id}
                      className={`flex flex-col overflow-hidden rounded-2xl ${
                        offer.highlight
                          ? "bg-blue-700 text-white shadow-2xl shadow-blue-200 ring-2 ring-blue-400"
                          : "border border-slate-200 bg-white text-slate-900 shadow-sm transition-shadow hover:shadow-md"
                      }`}
                    >
                      <div className={`h-1.5 w-full ${offer.accentColor}`} />

                      <div className="flex grow flex-col p-6">
                        <div className="mb-4 flex items-start justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${
                              offer.highlight
                                ? "bg-white/20 text-white"
                                : `${offer.categoryBg} ${offer.categoryText}`
                            }`}
                          >
                            <Tag className="h-3 w-3" />
                            {offerCategoryLabels[offer.categoryId] || offer.category}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-bold text-white ${offer.badgeColor}`}
                          >
                            {offer.badge}
                          </span>
                        </div>

                        <h3
                          className={`mb-3 text-lg font-extrabold ${
                            offer.highlight ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {offer.partner}
                        </h3>

                        <div
                          className={`mb-4 rounded-xl p-3 ${
                            offer.highlight
                              ? "bg-white/10"
                              : "border border-slate-100 bg-slate-50"
                          }`}
                        >
                          <div
                            className={`text-2xl font-extrabold ${
                              offer.highlight ? "text-white" : "text-blue-700"
                            }`}
                          >
                            {offer.offer}
                          </div>
                          <div
                            className={`mt-0.5 text-xs ${
                              offer.highlight ? "text-blue-100" : "text-slate-500"
                            }`}
                          >
                            {offer.subOffer}
                          </div>
                        </div>

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

                        <p
                          className={`mb-4 text-sm leading-relaxed ${
                            offer.highlight ? "text-blue-100" : "text-slate-600"
                          }`}
                        >
                          {offer.desc}
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
                          className={`mb-4 flex items-center gap-1.5 text-xs ${
                            offer.highlight ? "text-blue-200" : "text-slate-400"
                          }`}
                        >
                          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                          {offer.availability}
                        </div>

                        <Link
                          to="/contact?reason=offer-enquiry"
                          className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                            offer.highlight
                              ? "bg-white text-blue-700 hover:bg-blue-50"
                              : "bg-blue-700 text-white hover:bg-blue-800"
                          }`}
                        >
                          Request access <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="mt-10 text-center text-sm text-slate-500">
              All partner offers are subject to individual partner terms and conditions.
              <Link
                to="/contact?reason=offer-enquiry"
                className="ml-1 font-semibold text-blue-700 hover:underline"
              >
                Contact us to request access or more detail.
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section id="top" className="scroll-mt-32 bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-orange-700">
              Partner Benefits
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Available Partner Benefits
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {partnerDeals.map((deal) => (
              <div
                key={deal.partner}
                className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                  <Tag className="h-5 w-5 text-orange-700" />
                </div>
                <div className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {deal.category}
                </div>
                <h4 className="mb-2 text-sm font-bold text-slate-900">{deal.partner}</h4>
                <div className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  <Zap className="h-3 w-3" />
                  {deal.deal}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Partner benefits are listed for active RBP clients and members, subject to the relevant review pathway.
            <Link
              to="/contact?reason=offer-enquiry"
              className="ml-1 font-semibold text-blue-700 hover:underline"
            >
              Contact us to learn more.
            </Link>
          </p>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </div>
  );
}
