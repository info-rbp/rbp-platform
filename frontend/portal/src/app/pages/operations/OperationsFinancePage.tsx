import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { ArrowRight, Calculator, CheckCircle, DollarSign } from "lucide-react";

import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import {
  ComplianceDisclaimer,
  FaqAccordion,
  FinanceReferralButton,
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
  financeCalculatorPages,
  financeDisclaimer,
  financeFaqs,
  financeGiftCardCopy,
  financeProducts,
  financeReferralPath,
  getFinanceProduct,
} from "../../data/operationsFinance";

const referralSteps = [
  "Choose the finance product that best matches the purpose of funds.",
  "Submit the internal RBP referral form with business and funding details.",
  "The RBP team reviews the enquiry and confirms the best next step.",
  "If suitable, the enquiry can be routed to an appropriate finance pathway once available.",
];

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export function OperationsFinancePage() {
  const { slug } = useParams();

  if (!slug) {
    return <FinanceLanding />;
  }

  if (slug === "faqs") {
    return <FinanceFaqPage />;
  }

  if (financeCalculatorPages.some((calculatorPage) => calculatorPage.slug === slug)) {
    return <FinanceCalculatorPage slug={slug} />;
  }

  const product = getFinanceProduct(slug);

  if (!product) {
    return <Navigate to="/operations/finance" replace />;
  }

  const related = financeProducts.filter((item) => product.related.includes(item.slug));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProductDetailHero
        eyebrow="Business Finance"
        title={product.title}
        subtitle={product.shortDescription}
        primaryCta={{ label: "Get Funded Now", href: financeReferralPath }}
        secondaryCta={{ label: "Back to Finance", href: "/operations/finance" }}
      />

      <main className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_0.55fr] lg:px-8">
          <div className="space-y-10">
            <section>
              <SectionHeader eyebrow="What It Is" title={`What ${product.title} is commonly used for`} />
              <p className="text-base leading-8 text-slate-600">{product.longDescription}</p>
            </section>

            <section className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-xl font-black tracking-tight text-slate-950">Common uses</h2>
                <InfoList items={product.commonUses} />
              </div>
              <div>
                <h2 className="mb-4 text-xl font-black tracking-tight text-slate-950">Who it may suit</h2>
                <InfoList items={product.whoSuits} />
              </div>
            </section>

            <section className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-xl font-black tracking-tight text-slate-950">Information lenders may ask for</h2>
                <InfoList items={product.lenderInfo} />
              </div>
              <div>
                <h2 className="mb-4 text-xl font-black tracking-tight text-slate-950">Benefits and considerations</h2>
                <InfoList items={product.considerations} />
              </div>
            </section>

            <section>
              <SectionHeader eyebrow="Process" title="How the referral pathway works" />
              <HowItWorksSteps steps={referralSteps} />
            </section>

            <section>
              <SectionHeader eyebrow="Related Products" title="Explore related finance products" />
              <RelatedProductsGrid items={related} basePath="/operations/finance" />
            </section>

            <section>
              <SectionHeader eyebrow="FAQs" title={`${product.title} FAQs`} />
              <FaqAccordion items={product.faqItems} />
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <DollarSign className="h-7 w-7 text-blue-700" />
              <h2 className="mt-4 text-xl font-black tracking-tight text-slate-950">Ready to request funding?</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Submit your enquiry to RBP. This is currently an internal referral path while a finance provider is being selected.
              </p>
              <div className="mt-5">
                <FinanceReferralButton />
              </div>
            </div>
            <MembershipBenefitCallout>{financeGiftCardCopy}</MembershipBenefitCallout>
            <ComplianceDisclaimer>
              <strong>Finance disclaimer:</strong> {financeDisclaimer}
            </ComplianceDisclaimer>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FinanceLanding() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <OperationsHero
        eyebrow="Operations · Business Finance"
        title="Business Finance Pathways for Growth, Vehicles, Equipment and Cash Flow"
        subtitle="Explore finance options for business vehicles, equipment, working capital, debtor finance, construction, and other commercial lending needs. Submit a referral request and the RBP team will review the best next step."
        primaryCta={{ label: "Get Funded Now", href: financeReferralPath }}
        secondaryCta={{ label: "Explore Finance Products", href: "#finance-products" }}
        bullets={[
          "Compare commercial finance, vehicle, equipment, cash flow, debtor, construction, and other lending pathways",
          "Use simple calculators to estimate repayments or high-level borrowing capacity",
          "Submit an internal finance referral while RBP finalises the provider pathway",
        ]}
      />

      <main>
        <section id="finance-products" className="py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Finance Products"
              title="Choose the finance pathway that best matches your need"
              description="The content is finance-provider informed, but RBP is not presenting a confirmed referral provider yet."
            />
            <OperationsProductGrid>
              {financeProducts.map((product) => (
                <OperationsProductCard
                  key={product.slug}
                  title={product.title}
                  description={product.shortDescription}
                  href={`/operations/finance/${product.slug}`}
                  cta="View finance details"
                />
              ))}
            </OperationsProductGrid>
          </div>
        </section>

        <section className="bg-slate-50 py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader eyebrow="Calculators" title="Estimate before you enquire" />
            <OperationsProductGrid>
              {financeCalculatorPages.map((calculatorPage) => (
                <OperationsProductCard
                  key={calculatorPage.slug}
                  title={calculatorPage.title}
                  description={calculatorPage.description}
                  href={`/operations/finance/${calculatorPage.slug}`}
                  cta="Open calculator"
                />
              ))}
            </OperationsProductGrid>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="space-y-5">
              <SourceAlignedNotice>
                Finance product language is aligned to common commercial finance terminology. RBP is not representing Stratton Finance or any provider as the confirmed referral partner.
              </SourceAlignedNotice>
              <MembershipBenefitCallout>{financeGiftCardCopy}</MembershipBenefitCallout>
              <FinanceReferralButton />
            </div>
            <div>
              <SectionHeader eyebrow="FAQs" title="Common finance referral questions" />
              <FaqAccordion items={financeFaqs.slice(0, 4)} />
              <Link to="/operations/finance/faqs" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800">
                View all finance FAQs <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <ComplianceDisclaimer>
              <strong>Finance disclaimer:</strong> {financeDisclaimer}
            </ComplianceDisclaimer>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export function OperationsFinanceReferralPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    phone: "",
    financeProductInterest: "Commercial Finance",
    approximateAmountRequired: "",
    purposeOfFunds: "",
    businessIdentifier: "",
    tradingTimeframe: "",
    annualRevenueRange: "",
    preferredContactMethod: "Email",
    membershipStatus: "Not sure",
    notes: "",
    consentToContact: false,
  });

  function updateField(field: keyof typeof formData, value: string | boolean) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = [
      "Finance referral enquiry",
      "",
      `Name: ${formData.firstName} ${formData.lastName}`,
      `Business: ${formData.businessName}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Product interest: ${formData.financeProductInterest}`,
      `Approximate amount required: ${formData.approximateAmountRequired}`,
      `Purpose of funds: ${formData.purposeOfFunds}`,
      `ABN/business identifier: ${formData.businessIdentifier}`,
      `Trading timeframe: ${formData.tradingTimeframe}`,
      `Annual revenue range: ${formData.annualRevenueRange}`,
      `Preferred contact method: ${formData.preferredContactMethod}`,
      `Membership status: ${formData.membershipStatus}`,
      `Optional notes: ${formData.notes || "None"}`,
      `Consent to contact: ${formData.consentToContact ? "Yes" : "No"}`,
    ].join("\n");

    window.location.href = `mailto:info@remotebusinesspartner.com.au?subject=${encodeURIComponent(
      `Finance referral enquiry - ${formData.businessName}`,
    )}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProductDetailHero
        eyebrow="Business Finance"
        title="Get Funded Now"
        subtitle="Submit a finance referral request. This frontend form currently opens an email draft to info@remotebusinesspartner.com.au and shows a confirmation state."
        primaryCta={{ label: "Back to Finance", href: "/operations/finance" }}
      />
      <main className="py-14 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
              <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950">Your finance enquiry has been received.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                The RBP team will review your request and follow up with the next steps. If your email client opened, please send the generated email so the enquiry reaches info@remotebusinesspartner.com.au.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8">
                <p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">Frontend-only placeholder</p>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">Finance referral details</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Backend email sending is not currently wired here, so submission uses a safe mailto fallback.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="First name" value={formData.firstName} onChange={(value) => updateField("firstName", value)} required />
                <TextInput label="Last name" value={formData.lastName} onChange={(value) => updateField("lastName", value)} required />
                <TextInput label="Business name" value={formData.businessName} onChange={(value) => updateField("businessName", value)} required />
                <TextInput label="Email" type="email" value={formData.email} onChange={(value) => updateField("email", value)} required />
                <TextInput label="Phone" type="tel" value={formData.phone} onChange={(value) => updateField("phone", value)} required />
                <SelectInput
                  label="Finance product interest"
                  value={formData.financeProductInterest}
                  onChange={(value) => updateField("financeProductInterest", value)}
                  options={financeProducts.map((product) => product.title)}
                  required
                />
                <TextInput label="Approximate amount required" value={formData.approximateAmountRequired} onChange={(value) => updateField("approximateAmountRequired", value)} required />
                <TextInput label="Purpose of funds" value={formData.purposeOfFunds} onChange={(value) => updateField("purposeOfFunds", value)} required />
                <TextInput label="ABN or business identifier" value={formData.businessIdentifier} onChange={(value) => updateField("businessIdentifier", value)} required />
                <TextInput label="Trading timeframe" value={formData.tradingTimeframe} onChange={(value) => updateField("tradingTimeframe", value)} required />
                <SelectInput
                  label="Annual revenue range"
                  value={formData.annualRevenueRange}
                  onChange={(value) => updateField("annualRevenueRange", value)}
                  options={["", "Under $100k", "$100k - $500k", "$500k - $1m", "$1m - $5m", "$5m+"]}
                  required
                />
                <SelectInput
                  label="Preferred contact method"
                  value={formData.preferredContactMethod}
                  onChange={(value) => updateField("preferredContactMethod", value)}
                  options={["Email", "Phone", "SMS"]}
                  required
                />
                <SelectInput
                  label="Membership status"
                  value={formData.membershipStatus}
                  onChange={(value) => updateField("membershipStatus", value)}
                  options={["Premium Member", "Free Member", "Not a member", "Not sure"]}
                  required
                />
                <label className="md:col-span-2">
                  <span className="mb-1.5 block text-sm font-bold text-slate-800">Optional notes</span>
                  <textarea
                    className={`${inputClass} min-h-28`}
                    value={formData.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                  />
                </label>
              </div>

              <label className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <input
                  type="checkbox"
                  required
                  checked={formData.consentToContact}
                  onChange={(event) => updateField("consentToContact", event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700"
                />
                <span>I consent to RBP contacting me about this finance enquiry.</span>
              </label>

              <div className="mt-8">
                <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">
                  Submit Finance Enquiry <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <MembershipBenefitCallout>{financeGiftCardCopy}</MembershipBenefitCallout>
            <ComplianceDisclaimer>
              <strong>Finance disclaimer:</strong> {financeDisclaimer}
            </ComplianceDisclaimer>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FinanceFaqPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProductDetailHero
        eyebrow="Business Finance"
        title="Finance FAQs"
        subtitle="Common questions about RBP's internal referral workflow, provider status, lender assessment, and Premium Membership gift card eligibility."
        primaryCta={{ label: "Get Funded Now", href: financeReferralPath }}
        secondaryCta={{ label: "Back to Finance", href: "/operations/finance" }}
      />
      <main className="py-14 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FaqAccordion items={financeFaqs} />
          <div className="mt-8">
            <ComplianceDisclaimer>
              <strong>Finance disclaimer:</strong> {financeDisclaimer}
            </ComplianceDisclaimer>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FinanceCalculatorPage({ slug }: { slug: string }) {
  const calculatorPage = financeCalculatorPages.find((item) => item.slug === slug);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProductDetailHero
        eyebrow="Finance Calculator"
        title={calculatorPage?.title ?? "Finance Calculator"}
        subtitle={calculatorPage?.description ?? "Estimate finance scenarios before requesting a referral."}
        primaryCta={{ label: "Get Funded Now", href: financeReferralPath }}
        secondaryCta={{ label: "Back to Finance", href: "/operations/finance" }}
      />
      <main className="py-14 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {slug === "commercial-loan-calculator" && <CommercialLoanCalculator />}
            {slug === "chattel-mortgage-calculator" && <ChattelMortgageCalculator />}
            {slug === "borrowing-capacity-calculator" && <BorrowingCapacityCalculator />}
          </div>
          <div className="mt-8">
            <ComplianceDisclaimer>
              <strong>Calculator disclaimer:</strong> These calculator results are indicative estimates only and do not represent finance approval, a lender offer, personal financial advice, or a complete assessment. {financeDisclaimer}
            </ComplianceDisclaimer>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function CommercialLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanTerm, setLoanTerm] = useState(5);
  const [frequency, setFrequency] = useState("Monthly");
  const [balloon, setBalloon] = useState(0);
  const result = useMemo(() => calculateRepayment(loanAmount, interestRate, loanTerm, frequency, balloon), [loanAmount, interestRate, loanTerm, frequency, balloon]);

  return (
    <CalculatorLayout title="Commercial Loan Calculator" result={result}>
      <NumberInput label="Loan amount" value={loanAmount} onChange={setLoanAmount} />
      <NumberInput label="Interest rate (%)" value={interestRate} onChange={setInterestRate} step="0.1" />
      <NumberInput label="Loan term (years)" value={loanTerm} onChange={setLoanTerm} />
      <SelectInput label="Repayment frequency" value={frequency} onChange={setFrequency} options={["Weekly", "Fortnightly", "Monthly"]} />
      <NumberInput label="Optional balloon/residual" value={balloon} onChange={setBalloon} />
    </CalculatorLayout>
  );
}

function ChattelMortgageCalculator() {
  const [assetPrice, setAssetPrice] = useState(80000);
  const [deposit, setDeposit] = useState(10000);
  const [loanTerm, setLoanTerm] = useState(5);
  const [interestRate, setInterestRate] = useState(9);
  const [residual, setResidual] = useState(16000);
  const [gstRegistered, setGstRegistered] = useState(false);
  const gstCredit = gstRegistered ? assetPrice / 11 : 0;
  const financeAmount = Math.max(assetPrice - deposit - gstCredit, 0);
  const result = useMemo(() => calculateRepayment(financeAmount, interestRate, loanTerm, "Monthly", residual), [financeAmount, interestRate, loanTerm, residual]);

  return (
    <CalculatorLayout title="Chattel Mortgage Calculator" result={result} extra={`Indicative finance amount used: ${formatCurrency(financeAmount)}${gstRegistered ? " after a simple estimated GST component. Confirm tax treatment with your accountant." : "."}`}>
      <NumberInput label="Asset price" value={assetPrice} onChange={setAssetPrice} />
      <NumberInput label="Deposit" value={deposit} onChange={setDeposit} />
      <NumberInput label="Loan term (years)" value={loanTerm} onChange={setLoanTerm} />
      <NumberInput label="Interest rate (%)" value={interestRate} onChange={setInterestRate} step="0.1" />
      <NumberInput label="Residual/balloon" value={residual} onChange={setResidual} />
      <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
        <input type="checkbox" checked={gstRegistered} onChange={(event) => setGstRegistered(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-700" />
        GST registered
      </label>
    </CalculatorLayout>
  );
}

function BorrowingCapacityCalculator() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(50000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(32000);
  const [existingDebt, setExistingDebt] = useState(3000);
  const [interestRate, setInterestRate] = useState(10);
  const [term, setTerm] = useState(5);
  const surplus = Math.max(monthlyRevenue - monthlyExpenses - existingDebt, 0);
  const monthlyRate = interestRate / 100 / 12;
  const months = term * 12;
  const conservativePayment = surplus * 0.55;
  const upperPayment = surplus * 0.75;
  const capacity = (payment: number) => (monthlyRate === 0 ? payment * months : payment * (1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate);

  return (
    <div>
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-black tracking-tight text-slate-950">
        <Calculator className="h-6 w-6 text-blue-700" /> Borrowing Capacity Calculator
      </h2>
      <div className="grid gap-5 md:grid-cols-2">
        <NumberInput label="Monthly revenue" value={monthlyRevenue} onChange={setMonthlyRevenue} />
        <NumberInput label="Monthly expenses" value={monthlyExpenses} onChange={setMonthlyExpenses} />
        <NumberInput label="Existing monthly debt repayments" value={existingDebt} onChange={setExistingDebt} />
        <NumberInput label="Estimated interest rate (%)" value={interestRate} onChange={setInterestRate} step="0.1" />
        <NumberInput label="Target term (years)" value={term} onChange={setTerm} />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <ResultTile label="Indicative surplus" value={formatCurrency(surplus)} />
        <ResultTile label="Lower capacity estimate" value={formatCurrency(capacity(conservativePayment))} />
        <ResultTile label="Upper capacity estimate" value={formatCurrency(capacity(upperPayment))} />
      </div>
    </div>
  );
}

function CalculatorLayout({
  title,
  children,
  result,
  extra,
}: {
  title: string;
  children: ReactNode;
  result: { repayment: number; totalRepayment: number; totalInterest: number; frequency: string };
  extra?: string;
}) {
  return (
    <div>
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-black tracking-tight text-slate-950">
        <Calculator className="h-6 w-6 text-blue-700" /> {title}
      </h2>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <ResultTile label={`Estimated ${result.frequency.toLowerCase()} repayment`} value={formatCurrency(result.repayment)} />
        <ResultTile label="Total repayment" value={formatCurrency(result.totalRepayment)} />
        <ResultTile label="Total interest" value={formatCurrency(result.totalInterest)} />
      </div>
      {extra && <p className="mt-5 text-xs leading-6 text-slate-500">{extra}</p>}
    </div>
  );
}

function calculateRepayment(principal: number, annualRate: number, years: number, frequency: string, balloon: number) {
  const paymentsPerYear = frequency === "Weekly" ? 52 : frequency === "Fortnightly" ? 26 : 12;
  const periods = Math.max(years * paymentsPerYear, 1);
  const rate = annualRate / 100 / paymentsPerYear;
  const presentBalloon = balloon / Math.pow(1 + rate, periods);
  const financed = Math.max(principal - presentBalloon, 0);
  const repayment = rate === 0 ? financed / periods : (financed * rate) / (1 - Math.pow(1 + rate, -periods));
  const totalRepayment = repayment * periods + balloon;
  return {
    repayment,
    totalRepayment,
    totalInterest: Math.max(totalRepayment - principal, 0),
    frequency,
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);
}

function ResultTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
      <p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-sm font-bold text-slate-800">{label}</span>
      <input className={inputClass} type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  step = "1",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-sm font-bold text-slate-800">{label}</span>
      <input className={inputClass} type="number" min="0" step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-sm font-bold text-slate-800">{label}</span>
      <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} required={required}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option || "Select an option"}
          </option>
        ))}
      </select>
    </label>
  );
}
