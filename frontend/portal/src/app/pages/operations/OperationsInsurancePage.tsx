import { Link, Navigate, useParams } from "react-router";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";

import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import {
  AffiliateQuoteButton,
  ComplianceDisclaimer,
  FaqAccordion,
  HowItWorksSteps,
  InfoList,
  MembershipBenefitCallout,
  OperationsHero,
  OperationsProductCard,
  OperationsProductGrid,
  ProductDetailHero,
  RelatedProductsGrid,
  SectionHeader,
  SourceAlignedNotice,
} from "../../components/operations/OperationsComponents";
import {
  getInsuranceProduct,
  getInsuranceQuoteUrl,
  giftCardDisclaimer,
  insuranceDisclaimer,
  insuranceFaqs,
  insuranceGiftCardCopy,
  insuranceProductGroups,
  insuranceProducts,
} from "../../data/operationsInsurance";

const quoteSteps = [
  "Select your occupation and business activities in the BizCover quote flow.",
  "Choose the cover types you want to compare.",
  "Enter business details such as revenue, staff, locations, and claims history.",
  "Review available quotes, documents, pricing, terms, and exclusions.",
  "Buy online if the policy is suitable for your business.",
];

export function OperationsInsurancePage() {
  const { slug } = useParams();

  if (!slug) {
    return <InsuranceLanding />;
  }

  if (slug === "get-a-quote") {
    return <InsuranceQuoteExplainer />;
  }

  if (slug === "faqs") {
    return <InsuranceFaqPage />;
  }

  const product = getInsuranceProduct(slug);

  if (!product) {
    return <Navigate to="/operations/insurance" replace />;
  }

  const related = insuranceProducts.filter((item) => product.related.includes(item.slug));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProductDetailHero
        eyebrow="Business Insurance"
        title={product.title}
        subtitle={product.shortDescription}
        primaryCta={{ label: product.ctaLabel, href: getInsuranceQuoteUrl(product.slug), external: true }}
        secondaryCta={{ label: "Back to Insurance", href: "/operations/insurance" }}
      />

      <main>
        <section className="py-14 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_0.55fr] lg:px-8">
            <div className="space-y-10">
              <section>
                <SectionHeader eyebrow="What It Is" title={`What ${product.title} is designed for`} />
                <p className="text-base leading-8 text-slate-600">{product.longDescription}</p>
              </section>

              <section className="grid gap-8 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-xl font-black tracking-tight text-slate-950">Who commonly considers this</h2>
                  <InfoList items={product.whoFor} />
                </div>
                <div>
                  <h2 className="mb-4 text-xl font-black tracking-tight text-slate-950">What it may help cover</h2>
                  <InfoList items={product.coverPoints} />
                </div>
              </section>

              <section>
                <SectionHeader eyebrow="Scenarios" title="Example business scenarios" />
                <OperationsProductGrid>
                  {product.scenarios.map((scenario) => (
                    <div key={scenario} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <CheckCircle className="mb-4 h-5 w-5 text-emerald-600" />
                      <p className="text-sm leading-7 text-slate-700">{scenario}</p>
                    </div>
                  ))}
                </OperationsProductGrid>
              </section>

              <section>
                <SectionHeader eyebrow="Before Quoting" title="What to prepare" />
                <InfoList items={product.prepare} />
              </section>

              <section>
                <SectionHeader eyebrow="Related Products" title="Explore related insurance products" />
                <RelatedProductsGrid items={related} basePath="/operations/insurance" />
              </section>

              <section>
                <SectionHeader eyebrow="FAQs" title={`${product.title} FAQs`} />
                <FaqAccordion items={product.faqItems} />
              </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <Shield className="h-7 w-7 text-blue-700" />
                <h2 className="mt-4 text-xl font-black tracking-tight text-slate-950">Ready to compare options?</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Continue to BizCover to enter your occupation, review available products, and decide whether a policy suits your business.
                </p>
                <div className="mt-5">
                  <AffiliateQuoteButton href={getInsuranceQuoteUrl(product.slug)} label="Get Quote Now" />
                </div>
              </div>
              <MembershipBenefitCallout>{insuranceGiftCardCopy}</MembershipBenefitCallout>
              <ComplianceDisclaimer>
                <strong>Insurance disclaimer:</strong> {insuranceDisclaimer}
                <br />
                <strong>Gift card disclaimer:</strong> {giftCardDisclaimer}
              </ComplianceDisclaimer>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function InsuranceLanding() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <OperationsHero
        eyebrow="Operations · Business Insurance"
        title="Business Insurance Options for Australian Businesses"
        subtitle="Explore common business insurance products, understand what each cover is designed for, and get a quote through our BizCover referral pathway."
        primaryCta={{ label: "Get Quote Now", href: getInsuranceQuoteUrl(), external: true }}
        secondaryCta={{ label: "Explore Insurance Products", href: "#insurance-products" }}
        bullets={[
          "Choose from liability, property, pack, equipment, and operational cover pages",
          "Open product-specific BizCover quote links with RBP referral tracking",
          "Understand RBP's introducer role before you quote",
        ]}
      />

      <main>
        <section id="insurance-products" className="py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Insurance Products"
              title="Choose the cover type you want to understand"
              description="The full product list lives here so the navigation stays useful without becoming crowded."
            />

            <div className="space-y-12">
              {insuranceProductGroups.map((group) => {
                const groupProducts = insuranceProducts.filter((product) => group.products.includes(product.slug));
                return (
                  <section key={group.title}>
                    <h3 className="mb-5 text-xl font-black tracking-tight text-slate-950">{group.title}</h3>
                    <OperationsProductGrid>
                      {groupProducts.map((product) => (
                        <OperationsProductCard
                          key={product.slug}
                          title={product.title}
                          description={product.shortDescription}
                          href={`/operations/insurance/${product.slug}`}
                          cta="View product details"
                        />
                      ))}
                    </OperationsProductGrid>
                  </section>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-14 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <SectionHeader
                eyebrow="Quote Pathway"
                title="How getting a quote works"
                description="RBP provides information and a referral pathway. The quote flow, product selection, documents, payment, and claims sit with the insurance provider or platform."
              />
              <AffiliateQuoteButton href={getInsuranceQuoteUrl()} />
            </div>
            <HowItWorksSteps steps={quoteSteps} />
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="space-y-5">
              <SourceAlignedNotice>
                Insurance content is aligned to common BizCover product language and quote behaviour. RBP does not imply it is the insurer, broker, underwriter, or claims handler.
              </SourceAlignedNotice>
              <MembershipBenefitCallout>{insuranceGiftCardCopy}</MembershipBenefitCallout>
            </div>
            <div>
              <SectionHeader eyebrow="FAQ Preview" title="Common questions before quoting" />
              <FaqAccordion items={insuranceFaqs.slice(0, 3)} />
              <Link to="/operations/insurance/faqs" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800">
                View all insurance FAQs <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <ComplianceDisclaimer>
              <strong>Insurance disclaimer:</strong> {insuranceDisclaimer}
              <br />
              <strong>Gift card disclaimer:</strong> {giftCardDisclaimer}
            </ComplianceDisclaimer>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function InsuranceQuoteExplainer() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProductDetailHero
        eyebrow="Business Insurance"
        title="Get A Quote"
        subtitle="Review how the RBP referral pathway works before continuing to the BizCover occupation selection flow."
        primaryCta={{ label: "Start Your BizCover Quote", href: getInsuranceQuoteUrl(), external: true }}
        secondaryCta={{ label: "Explore Products", href: "/operations/insurance" }}
      />
      <main className="py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Quote Flow" title="What happens next" />
          <HowItWorksSteps steps={quoteSteps} />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <MembershipBenefitCallout>{insuranceGiftCardCopy}</MembershipBenefitCallout>
            <ComplianceDisclaimer>
              <strong>Insurance disclaimer:</strong> {insuranceDisclaimer}
              <br />
              <strong>Gift card disclaimer:</strong> {giftCardDisclaimer}
            </ComplianceDisclaimer>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function InsuranceFaqPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProductDetailHero
        eyebrow="Business Insurance"
        title="Insurance FAQs"
        subtitle="Common questions about RBP's role, BizCover redirection, quote ownership, product concepts, and Premium Membership gift card eligibility."
        primaryCta={{ label: "Get Quote Now", href: getInsuranceQuoteUrl(), external: true }}
        secondaryCta={{ label: "Back to Insurance", href: "/operations/insurance" }}
      />
      <main className="py-14 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FaqAccordion items={insuranceFaqs} />
          <div className="mt-8">
            <ComplianceDisclaimer>
              <strong>Insurance disclaimer:</strong> {insuranceDisclaimer}
              <br />
              <strong>Gift card disclaimer:</strong> {giftCardDisclaimer}
            </ComplianceDisclaimer>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
