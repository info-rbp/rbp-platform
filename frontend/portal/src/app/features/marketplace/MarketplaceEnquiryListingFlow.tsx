import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Search,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";

import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import {
  ConfirmationPanel,
  MockSubmissionState,
  ReviewSubmit,
  StepNavigation,
  WizardShell,
} from "../../components/flow";
import {
  CheckboxField,
  FileUploadMock,
  FormSection,
  RadioCardGroup,
  SelectField,
  SelectableCardGrid,
  TermsAcceptance,
  TextAreaField,
  TextField,
} from "../../components/forms";
import {
  MarketplaceListingCard,
  PaymentSimulationPanel,
} from "../../components/domain";
import { StatusBadge } from "../../components/status";
import {
  mockMarketplaceItems,
  mockMarketplaceListingTypes,
  mockMarketplaceMediaPlaceholders,
  mockMarketplaceTimeline,
  type MockMarketplaceItem,
} from "../../mock";
import {
  submitMockMarketplaceEnquiry,
  submitMockMarketplaceListing,
} from "../../services/mock/marketplace.mockService";

const categories = [
  "All",
  "rbp-products",
  "rbp-assets",
  "third-party-products-assets",
];

const marketplaceAnchorSections = [
  {
    id: "rbp-products",
    title: "RBP Products",
    description:
      "Packaged Remote Business Partner products, templates, application setup packages, documents, and business-in-a-box bundles.",
  },
  {
    id: "rbp-assets",
    title: "RBP Assets",
    description:
      "Remote Business Partner-owned assets and resources made available for business use, purchase, or deployment.",
  },
  {
    id: "third-party-products-assets",
    title: "Third Party Products & Assets",
    description:
      "Approved third-party listings including products, services, resources, and business assets.",
  },
  {
    id: "buying-process",
    title: "Buying Process",
    description:
      "A clear mock pathway covering enquiry, confirmation, simulated review, delivery planning, and follow-up.",
  },
  {
    id: "list-with-us",
    title: "List With Us",
    description:
      "A seller pathway for suppliers, partners, and businesses to list products, services, or assets in mock review.",
  },
];

const sellerSteps = [
  { id: "type", label: "Listing type", description: "Choose the listing category." },
  { id: "details", label: "Details", description: "Add seller and listing details." },
  { id: "media", label: "Media", description: "Add mock media placeholders." },
  { id: "fees", label: "Fees", description: "Review mock fee/payment state." },
  { id: "review", label: "Review", description: "Submit for mock admin review." },
];

const enquirySteps = [
  { id: "details", label: "Your details", description: "Tell us who is enquiring." },
  { id: "message", label: "Message", description: "Describe what you need." },
  { id: "review", label: "Review", description: "Submit the mock enquiry." },
];

type SubmissionState = "idle" | "loading" | "success" | "error";

interface SellerFormState {
  listingType: string;
  listingCategory: string;
  listingTitle: string;
  sellerName: string;
  sellerEmail: string;
  description: string;
  price: string;
  acceptedTerms: boolean;
}

interface EnquiryFormState {
  buyerName: string;
  buyerEmail: string;
  businessName: string;
  message: string;
}

function moneyLabel(item: MockMarketplaceItem) {
  return item.price.label;
}

function getListingById(id?: string) {
  return mockMarketplaceItems.find((item) => item.id === id) ?? mockMarketplaceItems[0];
}

function MarketplaceHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(251,191,36,0.12)_0%,_transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8 lg:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
            <ShoppingBag className="h-3 w-3" />
            Business Marketplace
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Browse, enquire, or list with mock marketplace flows.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Phase 1 simulates marketplace buying, seller listing, admin review, and confirmation states without real checkout, uploads, or publishing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg transition hover:bg-amber-400"
            >
              Browse listings <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/portal/marketplace/listings/new"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              List with us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">
            Mock review queue
          </p>
          <div className="mt-5 grid gap-4">
            {[
              ["Active listings", String(mockMarketplaceItems.length)],
              ["Mock enquiries", "1 submitted"],
              ["Seller listings", "1 in review"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white p-4 text-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-black">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MarketplaceLanding() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const featured = mockMarketplaceItems.filter((item) => item.featured);
  const filtered = mockMarketplaceItems.filter((item) => {
    const matchCategory = activeCategory === "All" || item.category === activeCategory;
    const query = search.trim().toLowerCase();
    const matchSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query));

    return matchCategory && matchSearch;
  });

  return (
    <>
      <MarketplaceHero />

      <section className="bg-amber-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <h2 className="text-lg font-extrabold text-slate-900">Featured listings</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featured.map((item) => (
              <MarketplaceListingCard
                key={item.id}
                title={item.title}
                description={item.description}
                priceLabel={moneyLabel(item)}
                href={`/marketplace/product/${item.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="overview" className="scroll-mt-32 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-700">
              Marketplace Structure
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Marketplace categories and actions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              These sections support public navigation, buyer enquiries, seller listings, and mock review states.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {marketplaceAnchorSections.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className="scroll-mt-32 rounded-2xl border border-slate-200 bg-slate-50 p-7"
              >
                <h3 className="mb-2 text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-slate-600">{item.description}</p>
                <Link
                  to={item.id === "list-with-us" ? "/portal/marketplace/listings/new" : "/marketplace"}
                  className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-800"
                >
                  {item.id === "list-with-us" ? "Start a mock listing" : "Explore marketplace"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sticky top-[84px] z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search listings..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-8 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
            <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    activeCategory === category
                      ? "bg-amber-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category === "All" ? "All" : category.replaceAll("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-slate-200" />
              <div className="font-semibold text-slate-500">No listings match your search.</div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <article
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-lg"
                >
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="inline-block w-fit rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                        {item.category.replaceAll("-", " ")}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <h3 className="mb-1 font-bold text-slate-900 transition group-hover:text-amber-700">
                      {item.title}
                    </h3>
                    <div className="mb-2 text-xs font-medium text-slate-400">
                      {item.supplierName} • {item.location}
                    </div>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                    <div className="mb-4 space-y-1">
                      {item.includes.slice(0, 3).map((included) => (
                        <div key={included} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                          {included}
                        </div>
                      ))}
                    </div>
                    <div className="mb-4 flex items-center justify-between text-sm">
                      <span className="font-extrabold text-slate-900">{moneyLabel(item)}</span>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="h-3 w-3" />
                        {item.timelineLabel}
                      </div>
                    </div>
                    <Link
                      to={`/marketplace/product/${item.id}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-amber-400"
                    >
                      View listing <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ShoppingBag className="mx-auto mb-5 h-12 w-12 text-amber-400" />
          <h2 className="mb-4 text-3xl font-extrabold">Want to list something?</h2>
          <p className="mb-8 text-slate-300">
            Create a seller listing through your account. No real listing is published and no real payment is processed.
          </p>
          <Link
            to="/portal/marketplace/listings/new"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-400"
          >
            Create listing through your account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function MarketplaceDetail() {
  const { id } = useParams();
  const item = getListingById(id);

  return (
    <>
      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link to="/marketplace" className="text-sm font-semibold text-amber-300">
            ← Back to marketplace
          </Link>
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-950">
                {item.category.replaceAll("-", " ")}
              </span>
              <StatusBadge status={item.status} />
            </div>
            <h1 className="text-4xl font-black">{item.title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{item.description}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 text-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Price</p>
                <p className="mt-1 text-xl font-black">{moneyLabel(item)}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 text-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Delivery</p>
                <p className="mt-1 font-bold">{item.deliveryLabel}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 text-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Timeline</p>
                <p className="mt-1 font-bold">{item.timelineLabel}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/portal/marketplace/offers/new"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400"
              >
                Enquire about listing <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/portal/marketplace/listings/new"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                List something similar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
          <div className="rounded-3xl border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-950">What is included</h2>
            <div className="mt-5 space-y-3">
              {item.includes.map((included) => (
                <div key={included} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  {included}
                </div>
              ))}
            </div>
          </div>
          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <h3 className="font-bold text-slate-950">Phase 1 mock listing</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              This detail screen supports buyer enquiry and seller listing simulation only. No checkout, escrow, payment, or publishing backend is connected.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}

function BuyerEnquiryFlow() {
  const { id } = useParams();
  const item = getListingById(id);
  const [step, setStep] = useState("details");
  const [state, setState] = useState<SubmissionState>("idle");
  const [reference, setReference] = useState("");
  const [form, setForm] = useState<EnquiryFormState>({
    buyerName: "",
    buyerEmail: "",
    businessName: "",
    message: "",
  });

  const stepIndex = enquirySteps.findIndex((item) => item.id === step);
  const canBack = stepIndex > 0;
  const canForward = stepIndex < enquirySteps.length - 1;

  async function handleSubmit() {
    setState("loading");
    const result = await submitMockMarketplaceEnquiry({
      itemId: item.id,
      buyerName: form.buyerName,
      buyerEmail: form.buyerEmail,
      businessName: form.businessName,
      message: form.message,
    });

    if (result.ok && result.data) {
      setReference(result.data.reference);
      setState("success");
    } else {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ConfirmationPanel
            title="Marketplace enquiry submitted"
            message="Your mock marketplace enquiry has been submitted. No seller has been contacted and no real backend action has occurred."
            reference={reference}
            primaryAction={
              <Link className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white" to="/marketplace">
                Back to marketplace
              </Link>
            }
            secondaryAction={
              <Link className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700" to="/portal/services">
                View mock status
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  return (
    <WizardShell
      eyebrow="Marketplace enquiry"
      title={`Enquire about ${item.title}`}
      description="Submit a frontend-only enquiry. No seller message, CRM record, or backend ticket is created."
      steps={enquirySteps}
      currentStepId={step}
      aside={
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-950">{item.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          <p className="mt-4 font-bold text-blue-700">{moneyLabel(item)}</p>
        </div>
      }
    >
      <div className="space-y-6">
        <MockSubmissionState state={state} />

        {step === "details" ? (
          <FormSection title="Your details" description="These details are used for the mock enquiry only.">
            <TextField
              label="Your name"
              value={form.buyerName}
              onChange={(event) => setForm({ ...form, buyerName: event.currentTarget.value })}
            />
            <TextField
              label="Email"
              type="email"
              value={form.buyerEmail}
              onChange={(event) => setForm({ ...form, buyerEmail: event.currentTarget.value })}
            />
            <TextField
              label="Business name"
              value={form.businessName}
              onChange={(event) => setForm({ ...form, businessName: event.currentTarget.value })}
            />
          </FormSection>
        ) : null}

        {step === "message" ? (
          <FormSection title="Message" description="Describe what you want to know about this listing.">
            <TextAreaField
              label="Enquiry message"
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.currentTarget.value })}
            />
          </FormSection>
        ) : null}

        {step === "review" ? (
          <ReviewSubmit
            sections={[
              {
                title: "Listing",
                items: [
                  { label: "Item", value: item.title },
                  { label: "Price", value: moneyLabel(item) },
                ],
              },
              {
                title: "Buyer",
                items: [
                  { label: "Name", value: form.buyerName || "Not provided" },
                  { label: "Email", value: form.buyerEmail || "Not provided" },
                  { label: "Business", value: form.businessName || "Not provided" },
                  { label: "Message", value: form.message || "Not provided" },
                ],
              },
            ]}
            submitLabel="Submit mock enquiry"
            isSubmitting={state === "loading"}
            onSubmit={handleSubmit}
          />
        ) : null}

        {step !== "review" ? (
          <StepNavigation
            canGoBack={canBack}
            canContinue={canForward}
            onBack={() => setStep(enquirySteps[Math.max(0, stepIndex - 1)].id)}
            onContinue={() => setStep(enquirySteps[Math.min(enquirySteps.length - 1, stepIndex + 1)].id)}
          />
        ) : (
          <StepNavigation
            canGoBack
            canContinue={false}
            continueLabel="Submit from review"
            onBack={() => setStep("message")}
          />
        )}
      </div>
    </WizardShell>
  );
}

function SellerListingFlow() {
  const [step, setStep] = useState("type");
  const [state, setState] = useState<SubmissionState>("idle");
  const [reference, setReference] = useState("");
  const [form, setForm] = useState<SellerFormState>({
    listingType: "service",
    listingCategory: "third-party-products-assets",
    listingTitle: "",
    sellerName: "",
    sellerEmail: "",
    description: "",
    price: "",
    acceptedTerms: false,
  });

  const stepIndex = sellerSteps.findIndex((item) => item.id === step);
  const canBack = stepIndex > 0;
  const canForward = stepIndex < sellerSteps.length - 1;

  async function handleSubmit() {
    setState("loading");
    const result = await submitMockMarketplaceListing({
      listingType: form.listingType,
      listingCategory: form.listingCategory,
      listingTitle: form.listingTitle,
      sellerName: form.sellerName,
      sellerEmail: form.sellerEmail,
      description: form.description,
      price: form.price,
      acceptedTerms: form.acceptedTerms,
    });

    if (result.ok && result.data) {
      setReference(result.data.reference);
      setState("success");
    } else {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ConfirmationPanel
            title="Listing submitted for mock review"
            message="Your seller listing has entered the simulated admin review queue. No real listing was published and no real payment was processed."
            reference={reference}
            statusLabel="Mock admin review started"
            primaryAction={
              <Link className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white" to="/marketplace">
                Back to marketplace
              </Link>
            }
            secondaryAction={
              <Link className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700" to="/admin/marketplace">
                View admin concept
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  return (
    <WizardShell
      eyebrow="Seller listing"
      title="Create a mock marketplace listing"
      description="This frontend-only flow simulates seller intake, media placeholders, fee acknowledgement, review, and admin status."
      steps={sellerSteps}
      currentStepId={step}
      aside={
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-950">Mock listing status</h3>
            <p className="mt-2 text-sm text-slate-600">
              New listings are submitted to a simulated review queue only.
            </p>
            <div className="mt-4 space-y-2">
              {mockMarketplaceTimeline.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-600">{item.label}</span>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <MockSubmissionState state={state} />

        {step === "type" ? (
          <FormSection title="Listing type" description="Choose how this mock listing should be categorised.">
            <RadioCardGroup
              name="listingType"
              label="Listing type"
              value={form.listingType}
              onChange={(value) => setForm({ ...form, listingType: value })}
              options={mockMarketplaceListingTypes.map((item) => ({
                value: item.id,
                label: item.title,
                description: item.description,
              }))}
            />
            <SelectField
              label="Marketplace category"
              value={form.listingCategory}
              onChange={(event) => setForm({ ...form, listingCategory: event.currentTarget.value })}
              options={[
                { label: "RBP Products", value: "rbp-products" },
                { label: "RBP Assets", value: "rbp-assets" },
                { label: "Third Party Products & Assets", value: "third-party-products-assets" },
              ]}
            />
          </FormSection>
        ) : null}

        {step === "details" ? (
          <FormSection title="Listing details" description="Add mock seller and listing details.">
            <TextField
              label="Listing title"
              value={form.listingTitle}
              onChange={(event) => setForm({ ...form, listingTitle: event.currentTarget.value })}
            />
            <TextField
              label="Seller name"
              value={form.sellerName}
              onChange={(event) => setForm({ ...form, sellerName: event.currentTarget.value })}
            />
            <TextField
              label="Seller email"
              type="email"
              value={form.sellerEmail}
              onChange={(event) => setForm({ ...form, sellerEmail: event.currentTarget.value })}
            />
            <TextField
              label="Price"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.currentTarget.value })}
              helpText="Use mock price text such as $750 + GST or enquiry required."
            />
            <TextAreaField
              label="Description"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.currentTarget.value })}
            />
          </FormSection>
        ) : null}

        {step === "media" ? (
          <FormSection title="Mock media and documents" description="These are placeholders only. No files are uploaded.">
            <SelectableCardGrid
              options={mockMarketplaceMediaPlaceholders.map((item) => ({
                id: item.id,
                title: item.label,
                description: item.description,
              }))}
            />
            <FileUploadMock title="Mock marketplace media upload" />
          </FormSection>
        ) : null}

        {step === "fees" ? (
          <FormSection title="Fees and terms" description="Acknowledge simulated listing fee/payment states.">
            <PaymentSimulationPanel
              title="Mock listing fee simulation"
              amountLabel="No real listing fee, success fee, checkout, escrow, or payment is processed in Phase 1."
            />
            <TermsAcceptance
              checked={form.acceptedTerms}
              onChange={(checked) => setForm({ ...form, acceptedTerms: checked })}
            />
            <CheckboxField
              checked
              readOnly
              label="I understand this is not a published listing"
              description="The listing remains a frontend mock record only."
            />
          </FormSection>
        ) : null}

        {step === "review" ? (
          <ReviewSubmit
            sections={[
              {
                title: "Listing",
                items: [
                  { label: "Title", value: form.listingTitle || "Not provided" },
                  { label: "Type", value: form.listingType },
                  { label: "Category", value: form.listingCategory },
                  { label: "Price", value: form.price || "Not provided" },
                  { label: "Description", value: form.description || "Not provided" },
                ],
              },
              {
                title: "Seller",
                items: [
                  { label: "Name", value: form.sellerName || "Not provided" },
                  { label: "Email", value: form.sellerEmail || "Not provided" },
                  { label: "Terms accepted", value: form.acceptedTerms ? "Yes" : "No" },
                ],
              },
            ]}
            submitLabel="Submit mock listing"
            isSubmitting={state === "loading"}
            onSubmit={handleSubmit}
          />
        ) : null}

        {step !== "review" ? (
          <StepNavigation
            canGoBack={canBack}
            canContinue={canForward}
            onBack={() => setStep(sellerSteps[Math.max(0, stepIndex - 1)].id)}
            onContinue={() => setStep(sellerSteps[Math.min(sellerSteps.length - 1, stepIndex + 1)].id)}
          />
        ) : (
          <StepNavigation
            canGoBack
            canContinue={false}
            continueLabel="Submit from review"
            onBack={() => setStep("fees")}
          />
        )}
      </div>
    </WizardShell>
  );
}

export function MarketplaceEnquiryListingFlow({
  embedded = false,
  forcedView,
}: {
  embedded?: boolean;
  forcedView?: "landing" | "detail" | "enquiry" | "seller";
}) {
  const location = useLocation();

  const view = useMemo(() => {
    if (forcedView) return forcedView;
    if (location.pathname.includes("/marketplace/listing/new")) return "seller";
    if (location.pathname.includes("/marketplace/listings/new")) return "seller";
    if (location.pathname.includes("/marketplace/offers/new")) return "enquiry";
    if (location.pathname.includes("/marketplace/enquiry/")) return "enquiry";
    if (location.pathname.includes("/marketplace/product/")) return "detail";
    return "landing";
  }, [forcedView, location.pathname]);

  return (
    <div className="min-h-screen bg-white">
      {!embedded ? <Navbar /> : null}
      {view === "seller" ? <SellerListingFlow /> : null}
      {view === "enquiry" ? <BuyerEnquiryFlow /> : null}
      {view === "detail" ? <MarketplaceDetail /> : null}
      {view === "landing" ? <MarketplaceLanding /> : null}
      {!embedded ? <Footer /> : null}
    </div>
  );
}
