import { Link, useSearchParams } from "react-router";
import { offerCategoryFilters, publicOffers } from "../data/offers";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CTABanner } from "../components/CTABanner";
import { PageHero } from "../components/PageHero";
import { Tag, Gift, ShieldCheck, Zap, ArrowRight, CheckCircle } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1758599543152-a73184816eba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGNsdXNpdmUlMjBkZWFscyUyMGhhbmRzaGFrZSUyMGJ1c2luZXNzJTIwcGFydG5lcnNoaXB8ZW58MXx8fHwxNzc2OTIzMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080";

const offers = [
  {
    partner: "Xero",
    category: "Accounting & Finance",
    categoryBg: "bg-sky-100",
    categoryText: "text-sky-700",
    accentColor: "bg-sky-600",
    offer: "3 Months Free",
    subOffer: "then 25% off for Year 1",
    saving: "Save up to $216",
    desc: "Australia's #1 cloud accounting software. Manage invoicing, payroll, BAS, and GST reporting all in one place.",
    badge: "Most Claimed",
    badgeColor: "bg-amber-500",
    highlight: false,
    features: ["Cloud invoicing & quotes", "Single Touch Payroll", "GST & BAS reporting"],
    availability: "All active RBP clients",
  },
  {
    partner: "Employment Hero",
    category: "HR & Payroll",
    categoryBg: "bg-violet-100",
    categoryText: "text-violet-700",
    accentColor: "bg-violet-600",
    offer: "6-Month Free Trial",
    subOffer: "Full platform access included",
    saving: "Save up to $600",
    desc: "Australia's leading HR, payroll & team management platform. Run onboarding, leave management, and payroll from one dashboard.",
    badge: "🔥 Hot Deal",
    badgeColor: "bg-rose-500",
    highlight: true,
    features: ["Automated payroll & STP", "Employee onboarding flows", "Leave & rostering management"],
    availability: "Limited — RBP members only",
  },
  {
    partner: "LegalVision",
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
    features: ["Contract review & drafting", "Business structure advice", "Compliance & IP protection"],
    availability: "New LegalVision clients",
  },
  {
    partner: "Microsoft 365",
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
    features: ["Microsoft Teams & SharePoint", "1 TB OneDrive storage", "Business email & calendar"],
    availability: "New subscriptions only",
  },
  {
    partner: "Canva Pro",
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
    features: ["Brand Kit & template library", "Social media scheduler", "200M+ stock assets"],
    availability: "New Canva Pro accounts",
  },
  {
    partner: "Shopify",
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
    features: ["Online store & checkout", "Integrated payment processing", "Inventory & order management"],
    availability: "New Shopify stores only",
  },
];

const partnerDeals = [
  { partner: "Accounting Software", deal: "30% off first year", category: "Finance" },
  { partner: "HR Management Tools", deal: "Free 3-month trial", category: "HR" },
  { partner: "Cloud Storage Solutions", deal: "2x storage included", category: "Tech" },
  { partner: "Legal Document Services", deal: "First contract free", category: "Legal" },
];


const offerCategoryLabels = Object.fromEntries(
  offerCategoryFilters.map((category) => [category.id, category.label])
);

export function OffersPage() {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? "";
  const selectedCategoryLabel = offerCategoryLabels[selectedCategory] ?? "";

  const filteredOffers = selectedCategory
    ? publicOffers.filter((offer) => offer.category === selectedCategory)
    : publicOffers;

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <PageHero
        title="Exclusive Offers"
        titleAccent="& Packages"
        subtitle="Purpose-built advisory packages and exclusive partner deals designed to provide maximum value for small businesses."
        badge="Offers"
        breadcrumb="Offers"
        image={heroImage}
        bullets={["Vendor-negotiated discounts", "Member-only packages", "Regularly updated deals"]}
        ctaPrimary={{ label: "View Offers", href: "#exclusive" }}
        ctaSecondary={{ label: "Talk to Us", href: "/contact?reason=offers-partnership" }}
        stat={{ value: "30%", label: "Avg. Cost Savings", sublabel: "For our members" }}
      />

      {/* Featured Partner Offers */}
      <section id="overview" className="py-20 lg:py-28 scroll-mt-32">
        <div id="exclusive" className="scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
              <Gift className="w-3.5 h-3.5" />
              Featured Offers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Partner Offers & Discounts
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Exclusive deals negotiated with our trusted partners — available to all active RBP clients and members.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link
                to="/offers"
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                  !selectedCategory ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Offers
              </Link>
              {offerCategoryFilters.map((category) => (
                <Link
                  key={category.id}
                  to={`/offers?category=${category.id}`}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                    selectedCategory === category.id ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category.label}
                </Link>
              ))}
            </div>

            {selectedCategory && (
              <div className="mt-5 bg-blue-50 border border-blue-100 rounded-2xl p-4 max-w-2xl mx-auto">
                <p className="text-sm text-slate-700">
                  Showing offers for <strong>{selectedCategoryLabel || selectedCategory}</strong>.
                  {filteredOffers.length === 0 && " No current offers are listed in this category yet."}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className={`rounded-2xl flex flex-col overflow-hidden ${
                  offer.highlight
                    ? "bg-blue-700 text-white shadow-2xl shadow-blue-200 ring-2 ring-blue-400"
                    : "bg-white border border-slate-200 text-slate-900 shadow-sm hover:shadow-md transition-shadow"
                }`}
              >
                {/* Coloured accent bar */}
                <div className={`h-1.5 w-full ${offer.accentColor}`} />

                <div className="p-6 flex flex-col flex-grow">
                  {/* Category + badge row */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${
                      offer.highlight ? "bg-white/20 text-white" : `${offer.categoryBg} ${offer.categoryText}`
                    }`}>
                      <Tag className="w-3 h-3" />
                      {offerCategoryLabels[offer.category] || offer.category}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold text-white px-2 py-1 rounded-md whitespace-nowrap ${offer.badgeColor}`}>
                      {offer.badge}
                    </span>
                  </div>

                  {/* Partner name */}
                  <h3 className={`text-lg font-extrabold mb-3 ${offer.highlight ? "text-white" : "text-slate-900"}`}>
                    {offer.partner}
                  </h3>

                  {/* Offer headline box */}
                  <div className={`rounded-xl p-3 mb-4 ${offer.highlight ? "bg-white/10" : "bg-slate-50 border border-slate-100"}`}>
                    <div className={`text-2xl font-extrabold ${offer.highlight ? "text-white" : "text-blue-700"}`}>
                      {offer.offer}
                    </div>
                    <div className={`text-xs mt-0.5 ${offer.highlight ? "text-blue-100" : "text-slate-500"}`}>
                      {offer.subOffer}
                    </div>
                  </div>

                  {/* Savings badge */}
                  <div className="mb-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg ${
                      offer.highlight ? "bg-emerald-400/20 text-emerald-200" : "bg-emerald-50 text-emerald-700"
                    }`}>
                      <Zap className="w-3 h-3" />
                      {offer.saving}
                    </span>
                  </div>

                  {/* Description */}
                  <p className={`text-sm leading-relaxed mb-4 ${offer.highlight ? "text-blue-100" : "text-slate-600"}`}>
                    {offer.desc}
                  </p>

                  {/* Feature bullets */}
                  <div className="space-y-2 mb-5 flex-grow">
                    {offer.features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${offer.highlight ? "text-blue-200" : "text-emerald-500"}`} />
                        <span className={`text-xs ${offer.highlight ? "text-blue-100" : "text-slate-600"}`}>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Availability */}
                  <div className={`flex items-center gap-1.5 text-xs mb-4 ${offer.highlight ? "text-blue-200" : "text-slate-400"}`}>
                    <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                    {offer.availability}
                  </div>

                  {/* CTA */}
                  <Link
                    to="/contact?reason=offer-enquiry"
                    className={`inline-flex items-center justify-center gap-2 font-bold py-2.5 px-5 rounded-xl transition-all text-sm ${
                      offer.highlight
                        ? "bg-white text-blue-700 hover:bg-blue-50"
                        : "bg-blue-700 text-white hover:bg-blue-800"
                    }`}
                  >
                    Claim This Offer <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-500 text-sm mt-10">
            All partner offers are subject to individual partner terms and conditions.{" "}
            <Link to="/contact?reason=offer-enquiry" className="text-blue-700 font-semibold hover:underline">
              Contact us for details.
            </Link>
          </p>
        </div>
        </div>
      </section>

      {/* Partner Deals */}
      <section id="top" className="py-16 bg-slate-50 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-orange-700 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full mb-4">
              Partner Deals
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Exclusive Partner Discounts
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {partnerDeals.map((deal) => (
              <div key={deal.partner} className="bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Tag className="w-5 h-5 text-orange-700" />
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{deal.category}</div>
                <h4 className="font-bold text-slate-900 mb-2 text-sm">{deal.partner}</h4>
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                  <Zap className="w-3 h-3" />
                  {deal.deal}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-sm mt-8">
            Partner deals are available to all active RBP clients.{" "}
            <Link to="/contact?reason=offer-enquiry" className="text-blue-700 font-semibold hover:underline">
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
