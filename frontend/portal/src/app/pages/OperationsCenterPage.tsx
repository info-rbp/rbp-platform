import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import {
  ComplianceDisclaimer,
  OperationsHero,
  OperationsProductCard,
  OperationsProductGrid,
  SectionHeader,
} from "../components/operations/OperationsComponents";
import { financeDisclaimer, financeGiftCardCopy } from "../data/operationsFinance";
import { giftCardDisclaimer, insuranceDisclaimer, insuranceGiftCardCopy } from "../data/operationsInsurance";
import { nbnDisclaimer } from "../data/operationsNbn";

const sections = [
  {
    title: "Business Insurance",
    description: "Explore common insurance products, understand what each cover is designed for, and continue to BizCover through the RBP referral pathway.",
    href: "/operations/insurance",
    cta: "Explore insurance",
  },
  {
    title: "Business Finance",
    description: "Review finance pathways for growth, vehicles, equipment, cash flow, debtor finance, construction, and other lending needs.",
    href: "/operations/finance",
    cta: "Explore finance",
  },
  {
    title: "Business NBN",
    description: "Check coverage first, compare plan tiers, review getting connected, choose modem options, and submit a connection request.",
    href: "/operations/connectivity/nbn-phone",
    cta: "Check coverage",
  },
  {
    title: "Coming Soon",
    description: "See how RBP is expanding operational resources, referral pathways, business support resources, and partner services.",
    href: "/operations/coming-soon",
    cta: "View updates",
  },
];

export function OperationsCenterPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <OperationsHero
        eyebrow="Operations"
        title="Commercial Operations Support for Australian Businesses"
        subtitle="Explore Business Insurance, Business Finance, Business NBN, and upcoming operational resources from one clean Operations hub."
        primaryCta={{ label: "Business Insurance", href: "/operations/insurance" }}
        secondaryCta={{ label: "Business NBN", href: "/operations/connectivity/nbn-phone/check-coverage" }}
        bullets={[
          "Insurance product pages with BizCover quote referral tracking",
          "Finance product pages, calculators, and an internal referral form",
          "Coverage-first Business NBN pages for address, plans, modem, phone, and connection needs",
        ]}
      />

      <main>
        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Operations Areas"
              title="Choose the operational pathway you need"
              description="The Operations area is now focused on commercial product journeys, not a resource query page."
            />
            <OperationsProductGrid columns="lg:grid-cols-4">
              {sections.map((section) => (
                <OperationsProductCard key={section.href} {...section} />
              ))}
            </OperationsProductGrid>
          </div>
        </section>

        <section className="bg-slate-50 py-14 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <div className="rounded-xl border border-white bg-white p-6 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">Insurance benefit</p>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-700">{insuranceGiftCardCopy}</p>
            </div>
            <div className="rounded-xl border border-white bg-white p-6 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">Finance benefit</p>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-700">{financeGiftCardCopy}</p>
            </div>
            <div className="rounded-xl border border-white bg-white p-6 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">NBN sequence</p>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-700">Check Coverage → Our NBN Plans → Getting Connected → WiFi Modems → Connect Now → FAQs.</p>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-5">
            <ComplianceDisclaimer>
              <strong>Insurance disclaimer:</strong> {insuranceDisclaimer}
              <br />
              <strong>Finance disclaimer:</strong> {financeDisclaimer}
              <br />
              <strong>NBN disclaimer:</strong> {nbnDisclaimer}
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
