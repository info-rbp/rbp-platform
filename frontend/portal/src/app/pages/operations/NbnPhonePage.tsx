import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle,
  CreditCard,
  FileCheck,
  Info,
  Lock,
  MapPin,
  Router,
  ShieldCheck,
  Smartphone,
  Star,
  User,
  Wifi,
} from "lucide-react";

import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import {
  ComplianceDisclaimer,
  FaqAccordion,
  HowItWorksSteps,
  OperationsHero,
  OperationsProductCard,
  OperationsProductGrid,
  ProductDetailHero,
  SectionHeader,
  SourceAlignedNotice,
} from "../../components/operations/OperationsComponents";
import {
  modemOptions,
  nbnConnectionSteps,
  nbnDisclaimer,
  nbnFaqs,
  nbnFlow,
  nbnPlans,
} from "../../data/operationsNbn";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export function NbnPhonePage() {
  const { pathname } = useLocation();
  const page = pathname.split("/").filter(Boolean).at(-1);

  if (page === "check-coverage") {
    return <NbnCoveragePage />;
  }

  if (page === "our-nbn-plans") {
    return <NbnPlansPage />;
  }

  if (page === "getting-connected") {
    return <NbnGettingConnectedPage />;
  }

  if (page === "wifi-modems") {
    return <NbnWifiModemsPage />;
  }

  if (page === "connect-now") {
    return <NbnConnectNowPage />;
  }

  if (page === "faqs") {
    return <NbnFaqPage />;
  }

  return <NbnLanding />;
}

function NbnLanding() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <OperationsHero
        eyebrow="Operations · Business NBN"
        title="Business NBN and Phone Solutions Built Around Your Address"
        subtitle="Check service availability, review business NBN plan options, understand phone and modem requirements, and prepare your connection request."
        primaryCta={{ label: "Check Coverage", href: "/operations/connectivity/nbn-phone/check-coverage" }}
        secondaryCta={{ label: "View Our NBN Plans", href: "/operations/connectivity/nbn-phone/our-nbn-plans" }}
        bullets={[
          "Start with address-based coverage before choosing a plan",
          "Review speed, Wi-Fi, modem, and phone considerations in a business context",
          "Submit connection details through a frontend-only confirmation form",
        ]}
      />
      <NbnMain>
        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Business NBN Flow"
              title="Check coverage before you choose a plan"
              description="Plans vary by location and eligibility. Availability depends on the service address, NBN technology, provider terms, and network conditions."
            />
            <OperationsProductGrid>
              {nbnFlow.map((item, index) => (
                <OperationsProductCard
                  key={item.href}
                  title={item.title}
                  description={getFlowDescription(item.title)}
                  href={item.href}
                  cta={index === 0 ? "Start here" : "Open page"}
                  meta={`Step ${index + 1}`}
                />
              ))}
            </OperationsProductGrid>
          </div>
        </section>
        <section className="bg-slate-50 py-14 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <SourceAlignedNotice>
              Business NBN language is aligned to provider-style Business NBN framing. RBP does not overpromise speed, availability, installation timing, phone compatibility, or modem suitability.
            </SourceAlignedNotice>
            <ComplianceDisclaimer>
              <strong>NBN disclaimer:</strong> {nbnDisclaimer}
            </ComplianceDisclaimer>
          </div>
        </section>
      </NbnMain>
      <Footer />
    </div>
  );
}

function NbnCoveragePage() {
  return (
    <NbnPageShell
      title="Check Coverage"
      subtitle="Start with the service address so plan eligibility, NBN technology, phone needs, and modem requirements can be reviewed before connection."
      primary={{ label: "View NBN Plans", href: "/operations/connectivity/nbn-phone/our-nbn-plans" }}
    >
      <CoverageCheckForm />
    </NbnPageShell>
  );
}

function NbnPlansPage() {
  return (
    <NbnPageShell
      title="Our NBN Plans"
      subtitle="Review business NBN plan tiers. Speeds, plan availability, higher-speed eligibility, and business-hour performance depend on address and technology type."
      primary={{ label: "Getting Connected", href: "/operations/connectivity/nbn-phone/getting-connected" }}
    >
      <OperationsProductGrid>
        {nbnPlans.map((plan) => (
          <div key={plan.slug} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <Wifi className="h-6 w-6 text-blue-700" />
            <h2 className="mt-4 text-xl font-black tracking-tight text-slate-950">{plan.name}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{plan.summary}</p>
            <ul className="mt-5 space-y-2">
              {plan.bestFor.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-slate-700">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </OperationsProductGrid>
      <ComplianceDisclaimer>
        Higher speed plans may only be available on certain NBN technology types. Wi-Fi performance may be lower than Ethernet performance.
      </ComplianceDisclaimer>
    </NbnPageShell>
  );
}

function NbnGettingConnectedPage() {
  return (
    <NbnPageShell
      title="Getting Connected"
      subtitle="Understand the steps RBP reviews before your business connection proceeds, including plan eligibility, phone number porting, modem setup, and installation needs."
      primary={{ label: "Review WiFi Modems", href: "/operations/connectivity/nbn-phone/wifi-modems" }}
    >
      <HowItWorksSteps steps={nbnConnectionSteps} />
    </NbnPageShell>
  );
}

function NbnWifiModemsPage() {
  return (
    <NbnPageShell
      title="WiFi Modems"
      subtitle="Router suitability depends on NBN technology, speed tier, Wi-Fi coverage needs, VoIP requirements, and provider settings."
      primary={{ label: "Continue in portal", href: "/portal/services/nbn/start" }}
    >
      <OperationsProductGrid>
        {modemOptions.map((option) => (
          <div key={option.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <Router className="h-6 w-6 text-blue-700" />
            <h2 className="mt-4 text-xl font-black tracking-tight text-slate-950">{option.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{option.description}</p>
          </div>
        ))}
      </OperationsProductGrid>
      <Link
        to="/operations/connectivity/nbn-phone/check-coverage"
        className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800"
      >
        Check Compatibility <ArrowRight className="h-4 w-4" />
      </Link>
    </NbnPageShell>
  );
}

function NbnConnectNowPage() {
  return (
    <NbnPageShell
      title="Connect Now"
      subtitle="Submit connection details once you are ready for RBP to review coverage, plan suitability, modem requirements, and phone setup."
      primary={{ label: "Check Coverage First", href: "/operations/connectivity/nbn-phone/check-coverage" }}
    >
      <ConnectNowForm />
    </NbnPageShell>
  );
}

function NbnFaqPage() {
  return (
    <NbnPageShell
      title="Business NBN FAQs"
      subtitle="Answers about coverage, technology type, speed choice, phone number porting, routers, installation, VoIP, and what happens after connection request submission."
      primary={{ label: "Check Coverage", href: "/operations/connectivity/nbn-phone/check-coverage" }}
    >
      <FaqAccordion items={nbnFaqs} />
    </NbnPageShell>
  );
}

function NbnPageShell({
  title,
  subtitle,
  primary,
  children,
}: {
  title: string;
  subtitle: string;
  primary: { label: string; href: string };
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProductDetailHero
        eyebrow="Business NBN"
        title={title}
        subtitle={subtitle}
        primaryCta={primary}
        secondaryCta={{ label: "Business NBN Overview", href: "/operations/connectivity/nbn-phone" }}
      />
      <NbnMain>
        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">{children}</div>
        </section>
        <section className="px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <ComplianceDisclaimer>
              <strong>NBN disclaimer:</strong> {nbnDisclaimer}
            </ComplianceDisclaimer>
          </div>
        </section>
      </NbnMain>
      <Footer />
    </div>
  );
}

function NbnMain({ children }: { children: ReactNode }) {
  return (
    <main>
      <div className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8" aria-label="Business NBN navigation">
          {nbnFlow.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </main>
  );
}

function CoverageCheckForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return <ConfirmationPanel title="Coverage request received" message="The RBP team will review service address availability, NBN technology, speed-tier eligibility, phone requirements, and modem suitability before confirming next steps." />;
  }

  return (
    <form onSubmit={(event) => handleFrontendSubmit(event, setSubmitted)} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <SectionHeader eyebrow="Coverage Check Form" title="Tell us where the service is needed" />
      <div className="grid gap-5 md:grid-cols-2">
        <TextInput label="Business name" required />
        <TextInput label="Service address" required />
        <TextInput label="Contact name" required />
        <TextInput label="Email" type="email" required />
        <TextInput label="Phone" type="tel" required />
        <TextInput label="Current provider (optional)" />
        <SelectInput label="Phone number porting required" options={["No", "Yes", "Not sure"]} required />
        <TextInput label="Number of users" type="number" required />
        <SelectInput label="Primary usage" options={["Cloud tools", "Video calls", "EFTPOS and email", "Data-heavy uploads", "VoIP and phones", "Mixed business use"]} required />
        <SelectInput label="Preferred speed tier (optional)" options={["Not sure", "Essential Business", "Performance Business", "High-Speed Business", "Enterprise Review"]} />
      </div>
      <SubmitButton label="Submit Coverage Check" />
    </form>
  );
}

function ConnectNowForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [family, setFamily] = useState<PlanFamily>("TotalBiz");
  const [selectedPlanId, setSelectedPlanId] = useState("totalbiz-1000");
  const [selectedModemId, setSelectedModemId] = useState("tplink");
  const [eeroUnits, setEeroUnits] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "direct-debit">("card");
  const [isPremium, setIsPremium] = useState(true);
  const [addressChecked, setAddressChecked] = useState(false);
  const [acknowledged, setAcknowledged] = useState({
    contract: false,
    provisioning: false,
    phone: false,
  });
  const [formData, setFormData] = useState({
    tradingName: "",
    serviceAddress: "",
    legalName: "",
    alternateTradingName: "",
    abn: "",
    businessType: "Private Company",
    industry: "Information Technology",
    employees: "1-10",
    contactName: "",
    dateOfBirth: "",
    email: "",
    mobile: "",
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    billingPostcode: "",
    saveCard: false,
  });

  const selectedPlan = signupPlans.find((plan) => plan.id === selectedPlanId) ?? signupPlans[1];
  const selectedModem = getSelectedModem(selectedModemId, eeroUnits);
  const monthlyPrice = isPremium ? selectedPlan.price * 0.9 : selectedPlan.price;
  const upfrontTotal = selectedModem.upfront + selectedModem.shipping;
  const currentStep = signupSteps[stepIndex];
  const canReview = acknowledged.contract && acknowledged.provisioning && acknowledged.phone;

  function updateField(field: keyof typeof formData, value: string | boolean) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function goNext() {
    setStepIndex((current) => Math.min(current + 1, signupSteps.length - 1));
  }

  function goBack() {
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function handleAddressSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAddressChecked(true);
  }

  function handleCompleteOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goNext();
  }

  if (currentStep.id === "confirmation") {
    return (
      <SignupCanvas>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-xl border border-emerald-200 bg-white p-8 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-950">Your NBN order has been submitted.</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              This frontend mock has captured the signup journey. The RBP team would now verify serviceability, confirm the 14-day provisioning schedule, review hardware shipping, and prepare activation next steps.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <SummaryTile label="Order reference" value="RBP-NBN-2048" />
              <SummaryTile label="Provisioning target" value="Approximately 14 days" />
              <SummaryTile label="Selected service" value={selectedPlan.name} />
              <SummaryTile label="Hardware" value={selectedModem.name} />
            </div>

            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-black tracking-tight text-slate-950">Next steps</h3>
              <div className="mt-4 space-y-3">
                {[
                  "Network availability is verified at the submitted service address.",
                  "A technical review confirms phone, VoIP, modem, and porting requirements.",
                  "Hardware shipping is arranged once pre-activation checks are complete.",
                  "Connection timing is confirmed before activation.",
                ].map((item) => (
                  <div key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                    <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <SignupSummary
            selectedPlan={selectedPlan}
            selectedModem={selectedModem}
            monthlyPrice={monthlyPrice}
            upfrontTotal={upfrontTotal}
            isPremium={isPremium}
          />
        </div>
      </SignupCanvas>
    );
  }

  return (
    <SignupCanvas>
      <SignupProgress currentStep={stepIndex} setStepIndex={setStepIndex} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          {currentStep.id === "address" && (
            <form onSubmit={handleAddressSubmit}>
              <SignupHeader
                icon={<MapPin className="h-6 w-6" />}
                title="Check your NBN availability."
                description="Enter the business trading name and service address so the mock signup can confirm address-based availability before plan selection."
              />
              <div className="grid gap-5 md:grid-cols-2">
                <SignUpTextField
                  label="Business Trading Name"
                  value={formData.tradingName}
                  onChange={(value) => updateField("tradingName", value)}
                  required
                />
                <SignUpTextField
                  label="Full Business Address"
                  value={formData.serviceAddress}
                  onChange={(value) => updateField("serviceAddress", value)}
                  required
                />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-800 px-5 py-3 text-sm font-bold text-white hover:bg-blue-900">
                  Check availability <ArrowRight className="h-4 w-4" />
                </button>
                <span className="text-xs font-semibold text-slate-500">No real NBN or provider systems are queried in this mock.</span>
              </div>

              {addressChecked && (
                <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="mt-1 h-6 w-6 shrink-0 text-emerald-700" />
                    <div>
                      <h3 className="text-xl font-black tracking-tight text-slate-950">Good news, business NBN is available at this address.</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-700">
                        Your location at <strong>{formData.serviceAddress || "123 Business Way, North Sydney NSW 2060"}</strong> is ready to continue through this mock signup flow.
                      </p>
                      <ProvisioningNotice />
                      <button type="button" onClick={goNext} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-blue-800 hover:bg-blue-50">
                        View available plans <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}

          {currentStep.id === "plan" && (
            <div>
              <SignupHeader
                icon={<Wifi className="h-6 w-6" />}
                title="Choose your business internet plan."
                description="Select the performance level that matches your operational needs. Prices are standard advertised monthly prices with no promotional six-month pricing."
              />
              <PremiumBanner isPremium={isPremium} setIsPremium={setIsPremium} />
              <ProvisioningNotice />
              <div className="mb-6 flex gap-2 overflow-x-auto border-b border-slate-200">
                {(["TotalBiz", "ProBiz"] as PlanFamily[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFamily(item)}
                    className={`shrink-0 border-b-4 px-4 py-3 text-sm font-black ${
                      family === item ? "border-blue-800 text-blue-800" : "border-transparent text-slate-500 hover:text-blue-800"
                    }`}
                  >
                    {item === "TotalBiz" ? "TotalBiz (Asymmetric)" : "ProBiz (Symmetric)"}
                  </button>
                ))}
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                {signupPlans
                  .filter((plan) => plan.family === family)
                  .map((plan) => (
                    <PlanChoiceCard
                      key={plan.id}
                      plan={plan}
                      selected={plan.id === selectedPlanId}
                      isPremium={isPremium}
                      onSelect={() => setSelectedPlanId(plan.id)}
                    />
                  ))}
              </div>
              <p className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-600">
                All plans shown require a 36-month contract. Early termination fees may apply. Prices are subject to change with notice. Availability depends on service address, NBN technology type, provider terms, and network conditions.
              </p>
              <SignupActions onBack={goBack} onNext={goNext} nextLabel="Choose modem" />
            </div>
          )}

          {currentStep.id === "modem" && (
            <div>
              <SignupHeader
                icon={<Router className="h-6 w-6" />}
                title="Choose your modem."
                description="Select the hardware that best fits your business connectivity, Wi-Fi, and phone requirements."
              />
              <div className="space-y-4">
                {modemChoices.map((modem) => (
                  <ModemChoiceCard
                    key={modem.id}
                    modem={modem}
                    selected={selectedModemId === modem.id}
                    eeroUnits={eeroUnits}
                    onSelect={() => setSelectedModemId(modem.id)}
                    onEeroUnits={setEeroUnits}
                  />
                ))}
              </div>
              <SignupActions onBack={goBack} onNext={goNext} nextLabel="Continue to details" />
            </div>
          )}

          {currentStep.id === "details" && (
            <form onSubmit={(event) => {
              event.preventDefault();
              goNext();
            }}>
              <SignupHeader
                icon={<Building2 className="h-6 w-6" />}
                title="Your business details."
                description="Provide the registered details for your organisation and primary contact before review."
              />
              <SignupCard title="Business Info" icon={<Building2 className="h-5 w-5" />}>
                <div className="grid gap-5 md:grid-cols-2">
                  <SignUpTextField label="Legal Business Name" value={formData.legalName} onChange={(value) => updateField("legalName", value)} required />
                  <SignUpTextField label="Trading Name (Optional)" value={formData.alternateTradingName} onChange={(value) => updateField("alternateTradingName", value)} />
                  <SignUpTextField label="ABN / ACN" value={formData.abn} onChange={(value) => updateField("abn", value)} required />
                  <SignUpSelectField label="Business Type" value={formData.businessType} onChange={(value) => updateField("businessType", value)} options={["Private Company", "Sole Trader", "Government", "Non-Profit"]} />
                  <SignUpSelectField label="Industry" value={formData.industry} onChange={(value) => updateField("industry", value)} options={["Information Technology", "Healthcare", "Finance", "Manufacturing", "Professional Services", "Retail"]} />
                  <SignUpSelectField label="Number of Employees" value={formData.employees} onChange={(value) => updateField("employees", value)} options={["1-10", "11-50", "51-200", "201+"]} />
                </div>
              </SignupCard>
              <SignupCard title="Primary Contact" icon={<User className="h-5 w-5" />}>
                <div className="grid gap-5 md:grid-cols-2">
                  <SignUpTextField label="Full Name" value={formData.contactName} onChange={(value) => updateField("contactName", value)} required />
                  <SignUpTextField label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(value) => updateField("dateOfBirth", value)} required />
                  <SignUpTextField label="Work Email" type="email" value={formData.email} onChange={(value) => updateField("email", value)} required />
                  <SignUpTextField label="Mobile Number" type="tel" value={formData.mobile} onChange={(value) => updateField("mobile", value)} required actionLabel="Send OTP" />
                </div>
                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-700">Enter the 6-digit code sent to your mobile</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <input
                        key={index}
                        aria-label={`OTP digit ${index + 1}`}
                        maxLength={1}
                        className="h-11 w-11 rounded-lg border border-slate-300 bg-white text-center text-lg font-black outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                      />
                    ))}
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <CheckCircle className="h-4 w-4" /> Identity verified securely via mock 2FA
                  </p>
                </div>
              </SignupCard>
              <div className="grid gap-4 md:grid-cols-2">
                <ContactToggle title="Service Contact" description="Same as Primary Contact" />
                <ContactToggle title="Billing Contact" description="Same as Primary Contact" />
              </div>
              <SignupActions onBack={goBack} nextLabel="Continue to review" submit />
            </form>
          )}

          {currentStep.id === "review" && (
            <div>
              <SignupHeader
                icon={<FileCheck className="h-6 w-6" />}
                title="Review your NBN order"
                description="Confirm your details before moving to payment and finalising this mock business NBN signup."
              />
              <div className="grid gap-5 md:grid-cols-2">
                <SummaryTile label="Plan" value={selectedPlan.name} detail={`${selectedPlan.speed} Mbps - 36-month contract`} />
                <SummaryTile label="Service address" value={formData.serviceAddress || "123 Business Way, North Sydney NSW 2060"} />
                <SummaryTile label="Hardware" value={selectedModem.name} detail={selectedModem.note} />
                <SummaryTile label="Monthly recurring" value={formatMoney(monthlyPrice)} detail={isPremium ? "Includes 10% Premium customer discount" : "Standard advertised monthly price"} />
              </div>
              <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
                <div className="flex gap-3">
                  <CalendarDays className="mt-1 h-5 w-5 shrink-0 text-blue-800" />
                  <div>
                    <h3 className="font-black tracking-tight text-slate-950">Provisioning Schedule</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      Your service will be provisioned approximately 14 days from today. The technical team would conduct serviceability and pre-activation checks before confirming the installation path.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-black tracking-tight text-slate-950">Final acknowledgements</h3>
                <ReviewCheck checked={acknowledged.contract} onChange={(value) => setAcknowledged((current) => ({ ...current, contract: value }))}>
                  I understand all plans in this mock signup are shown as 36-month contract options.
                </ReviewCheck>
                <ReviewCheck checked={acknowledged.provisioning} onChange={(value) => setAcknowledged((current) => ({ ...current, provisioning: value }))}>
                  I understand provisioning is approximately 14 days and depends on address, technology type, installation requirements, and provider terms.
                </ReviewCheck>
                <ReviewCheck checked={acknowledged.phone} onChange={(value) => setAcknowledged((current) => ({ ...current, phone: value }))}>
                  I understand phone, VoIP, number porting, and modem suitability must be confirmed before connection.
                </ReviewCheck>
              </div>
              <SignupActions onBack={goBack} onNext={goNext} nextLabel="Continue to payment" disabled={!canReview} />
            </div>
          )}

          {currentStep.id === "payment" && (
            <form onSubmit={handleCompleteOrder}>
              <SignupHeader
                icon={<CreditCard className="h-6 w-6" />}
                title="Set up payment."
                description="Select your preferred payment method and enter placeholder billing details for this frontend mock."
              />
              <div className="mb-6 inline-flex rounded-lg bg-slate-100 p-1">
                {[
                  { id: "card", label: "Credit/Debit Card", icon: <CreditCard className="h-4 w-4" /> },
                  { id: "direct-debit", label: "Direct Debit", icon: <Building2 className="h-4 w-4" /> },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as "card" | "direct-debit")}
                    className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold ${
                      paymentMethod === method.id ? "bg-white text-blue-800 shadow-sm" : "text-slate-500 hover:text-blue-800"
                    }`}
                  >
                    {method.icon}
                    {method.label}
                  </button>
                ))}
              </div>
              <SignupCard title={paymentMethod === "card" ? "Card Details" : "Direct Debit Details"} icon={<Lock className="h-5 w-5" />}>
                {paymentMethod === "card" ? (
                  <div className="grid gap-5 md:grid-cols-2">
                    <SignUpTextField label="Cardholder Name" value={formData.cardholderName} onChange={(value) => updateField("cardholderName", value)} required />
                    <SignUpTextField label="Card Number" value={formData.cardNumber} onChange={(value) => updateField("cardNumber", value)} placeholder="0000 0000 0000 0000" required />
                    <SignUpTextField label="Expiry Date" value={formData.expiry} onChange={(value) => updateField("expiry", value)} placeholder="MM / YY" required />
                    <SignUpTextField label="CVC / CVV" value={formData.cvc} onChange={(value) => updateField("cvc", value)} placeholder="123" required />
                    <SignUpTextField label="Billing Postcode" value={formData.billingPostcode} onChange={(value) => updateField("billingPostcode", value)} required />
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    <SignUpTextField label="Account Name" value={formData.cardholderName} onChange={(value) => updateField("cardholderName", value)} required />
                    <SignUpTextField label="BSB" value={formData.cardNumber} onChange={(value) => updateField("cardNumber", value)} placeholder="000-000" required />
                    <SignUpTextField label="Account Number" value={formData.expiry} onChange={(value) => updateField("expiry", value)} required />
                    <SignUpTextField label="Billing Postcode" value={formData.billingPostcode} onChange={(value) => updateField("billingPostcode", value)} required />
                  </div>
                )}
                <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-slate-600">
                  <input
                    type="checkbox"
                    checked={formData.saveCard}
                    onChange={(event) => updateField("saveCard", event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700"
                  />
                  <span>Save payment information for recurring billing in this mock flow.</span>
                </label>
              </SignupCard>
              <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <ShieldCheck className="h-5 w-5" /> Payments are presented as encrypted and secured for mockup purposes. No payment is processed.
              </p>
              <SignupActions onBack={goBack} nextLabel="Complete Order" submit />
            </form>
          )}
        </section>

        <SignupSummary
          selectedPlan={selectedPlan}
          selectedModem={selectedModem}
          monthlyPrice={monthlyPrice}
          upfrontTotal={upfrontTotal}
          isPremium={isPremium}
        />
      </div>
    </SignupCanvas>
  );
}

type SignupStepId = "address" | "plan" | "modem" | "details" | "review" | "payment" | "confirmation";
type PlanFamily = "TotalBiz" | "ProBiz";

interface SignupPlan {
  id: string;
  family: PlanFamily;
  name: string;
  badge?: string;
  speed: string;
  price: number;
  exGst?: boolean;
  popular?: boolean;
  features: string[];
}

interface SelectedModem {
  name: string;
  upfront: number;
  shipping: number;
  note: string;
}

const signupSteps: Array<{ id: SignupStepId; label: string }> = [
  { id: "address", label: "Address" },
  { id: "plan", label: "Plan" },
  { id: "modem", label: "Modem" },
  { id: "details", label: "Details" },
  { id: "review", label: "Review" },
  { id: "payment", label: "Payment" },
  { id: "confirmation", label: "Confirmation" },
];

const signupPlans: SignupPlan[] = [
  {
    id: "totalbiz-500",
    family: "TotalBiz",
    name: "TotalBiz 500/50",
    badge: "Starter",
    speed: "500/50",
    price: 100,
    features: ["Static IP included", "2 VoIP lines", "36-month contract"],
  },
  {
    id: "totalbiz-1000",
    family: "TotalBiz",
    name: "TotalBiz 1000/100",
    badge: "Advanced",
    speed: "1000/100",
    price: 119,
    popular: true,
    features: ["Static IP included", "4 VoIP lines", "Prioritized data"],
  },
  {
    id: "totalbiz-2000",
    family: "TotalBiz",
    name: "TotalBiz 2000/200",
    badge: "Elite",
    speed: "2000/200",
    price: 175,
    features: ["Dual static IPs", "8 VoIP lines", "Premium rack hardware"],
  },
  {
    id: "probiz-250",
    family: "ProBiz",
    name: "ProBiz 250/250",
    speed: "250/250",
    price: 379,
    exGst: true,
    features: ["Symmetric speeds", "24/7 enterprise support", "99.95% uptime SLA"],
  },
  {
    id: "probiz-500",
    family: "ProBiz",
    name: "ProBiz 500/500",
    speed: "500/500",
    price: 449,
    exGst: true,
    features: ["Symmetric speeds", "24/7 enterprise support", "99.95% uptime SLA"],
  },
  {
    id: "probiz-1000",
    family: "ProBiz",
    name: "ProBiz 1000/1000",
    speed: "1000/1000",
    price: 649,
    exGst: true,
    features: ["Symmetric speeds", "24/7 enterprise support", "99.99% uptime SLA"],
  },
];

const modemChoices = [
  {
    id: "byo",
    name: "BYO",
    description: "Use your own compatible hardware.",
    upfront: 0,
    shipping: 0,
    badge: "Compatibility check required",
    features: ["Existing router may be suitable", "VoIP compatibility must be confirmed", "No hardware shipping fee"],
  },
  {
    id: "tplink",
    name: "TP-Link VB433v",
    description: "High-performance business router with VoIP compatibility.",
    upfront: 0,
    shipping: 20,
    badge: "FREE TP-Link modem offer (36mo)",
    features: ["VoIP compatible", "Plug and play setup", "$20 shipping fee"],
  },
  {
    id: "eero",
    name: "Amazon eero 7",
    description: "Wi-Fi 7 mesh option for wider wireless coverage.",
    upfront: 0,
    shipping: 0,
    badge: "Wi-Fi 7 Mesh",
    features: ["1 unit free shipping", "2 units $199", "3 units $359", "Not compatible with VoIP"],
  },
];

function getSelectedModem(modemId: string, eeroUnits: number): SelectedModem {
  if (modemId === "tplink") {
    return { name: "TP-Link VB433v", upfront: 0, shipping: 20, note: "VoIP compatible, $20 shipping" };
  }

  if (modemId === "eero") {
    const upfront = eeroUnits === 1 ? 0 : eeroUnits === 2 ? 199 : 359;
    return { name: `Amazon eero 7 (${eeroUnits} unit${eeroUnits > 1 ? "s" : ""})`, upfront, shipping: 0, note: "Wi-Fi 7 mesh, not VoIP compatible" };
  }

  return { name: "BYO compatible router", upfront: 0, shipping: 0, note: "Compatibility must be confirmed before activation" };
}

function SignupCanvas({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl bg-slate-50 p-3 sm:p-5 lg:p-6">{children}</div>;
}

function SignupHeader({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="mb-7">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-800">{icon}</div>
      <h2 className="text-3xl font-black tracking-tight text-slate-950">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function SignupProgress({ currentStep, setStepIndex }: { currentStep: number; setStepIndex: (index: number) => void }) {
  return (
    <div className="mb-6 overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex min-w-max items-center">
        {signupSteps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => index < signupSteps.length - 1 && setStepIndex(index)}
              className="flex items-center"
              disabled={index === signupSteps.length - 1}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${
                  isComplete ? "bg-emerald-600 text-white" : isCurrent ? "bg-blue-800 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {isComplete ? <CheckCircle className="h-5 w-5" /> : index + 1}
              </span>
              <span className={`ml-2 mr-4 text-sm font-bold ${isCurrent ? "text-blue-800" : "text-slate-500"}`}>{step.label}</span>
              {index < signupSteps.length - 1 && <span className="mr-4 h-px w-8 bg-slate-200" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PremiumBanner({ isPremium, setIsPremium }: { isPremium: boolean; setIsPremium: (value: boolean) => void }) {
  return (
    <div className="mb-5 flex flex-col gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Star className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
        <div>
          <p className="text-sm font-black text-emerald-950">Premium customers receive 10% off advertised monthly plan prices.</p>
          <p className="mt-1 text-xs leading-5 text-emerald-800">Toggle the benefit in this mock to compare standard and Premium pricing.</p>
        </div>
      </div>
      <label className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-emerald-900">
        <input type="checkbox" checked={isPremium} onChange={(event) => setIsPremium(event.target.checked)} className="h-4 w-4 rounded border-emerald-300 text-emerald-700" />
        Premium customer
      </label>
    </div>
  );
}

function ProvisioningNotice() {
  return (
    <div className="my-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-800" />
        <div>
          <p className="text-sm font-black text-slate-950">Provisioning notice</p>
          <p className="mt-1 text-xs leading-6 text-slate-600">
            Your service will be provisioned approximately 14 days from today, subject to site survey, infrastructure availability, address eligibility, and provider terms.
          </p>
        </div>
      </div>
    </div>
  );
}

function PlanChoiceCard({ plan, selected, isPremium, onSelect }: { plan: SignupPlan; selected: boolean; isPremium: boolean; onSelect: () => void }) {
  const discounted = plan.price * 0.9;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex h-full flex-col rounded-xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        selected ? "border-blue-800 ring-2 ring-blue-100" : "border-slate-200"
      }`}
    >
      {plan.popular && <span className="absolute right-4 top-4 rounded-full bg-blue-800 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white">Most Popular</span>}
      {plan.badge && <span className="mb-4 w-fit rounded-full bg-blue-800 px-3 py-1 text-xs font-bold text-white">{plan.badge}</span>}
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black tracking-tight text-slate-950">{plan.speed.split("/")[0]}</span>
        <span className="text-sm font-bold text-slate-500">/ {plan.speed.split("/")[1]} Mbps</span>
      </div>
      <ul className="mt-5 flex-1 space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm leading-6 text-slate-600">
            <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 border-t border-slate-200 pt-4">
        <p className="text-2xl font-black text-slate-950">
          {formatMoney(plan.price)} <span className="text-xs font-semibold text-slate-500">/mo{plan.exGst ? " ex GST" : ""}</span>
        </p>
        {isPremium && <p className="mt-1 text-sm font-black text-emerald-700">{formatMoney(discounted)} Premium Price</p>}
        <span className={`mt-4 inline-flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-bold ${selected ? "bg-blue-800 text-white" : "border border-blue-800 text-blue-800"}`}>
          {selected ? "Selected" : plan.family === "ProBiz" ? "Select Pro" : "Select Plan"}
        </span>
      </div>
    </button>
  );
}

function ModemChoiceCard({
  modem,
  selected,
  eeroUnits,
  onSelect,
  onEeroUnits,
}: {
  modem: (typeof modemChoices)[number];
  selected: boolean;
  eeroUnits: number;
  onSelect: () => void;
  onEeroUnits: (units: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border bg-white p-5 text-left shadow-sm transition hover:border-blue-300 ${selected ? "border-blue-800 ring-2 ring-blue-100" : "border-slate-200"}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-blue-800">
            <Router className="h-7 w-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black tracking-tight text-slate-950">{modem.name}</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{modem.badge}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{modem.description}</p>
            <ul className="mt-3 space-y-1.5">
              {modem.features.map((feature) => (
                <li key={feature} className="text-sm leading-6 text-slate-600">
                  - {feature}
                </li>
              ))}
            </ul>
            {modem.id === "eero" && (
              <div className="mt-4 flex flex-wrap gap-2">
                {[1, 2, 3].map((unitCount) => (
                  <span
                    key={unitCount}
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelect();
                      onEeroUnits(unitCount);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelect();
                        onEeroUnits(unitCount);
                      }
                    }}
                    className={`rounded-lg border px-3 py-2 text-xs font-bold ${eeroUnits === unitCount && selected ? "border-blue-800 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600"}`}
                  >
                    {unitCount} Unit{unitCount > 1 ? "s" : ""} {unitCount === 1 ? "(Free)" : unitCount === 2 ? "($199)" : "($359)"}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xl font-black text-slate-950">{formatMoney(modem.id === "eero" ? getSelectedModem("eero", eeroUnits).upfront : modem.upfront)}</p>
          <p className="text-xs font-semibold text-slate-500">{modem.shipping > 0 ? `${formatMoney(modem.shipping)} shipping` : "No shipping charge"}</p>
        </div>
      </div>
    </button>
  );
}

function SignupCard({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2 text-blue-800">
        {icon}
        <h3 className="text-xl font-black tracking-tight text-slate-950">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function ContactToggle({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <p className="text-sm font-black text-slate-950">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
      <div className="relative h-6 w-12 rounded-full bg-emerald-600">
        <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
      </div>
    </div>
  );
}

function ReviewCheck({ checked, onChange, children }: { checked: boolean; onChange: (value: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700" />
      <span>{children}</span>
    </label>
  );
}

function SignupActions({
  onBack,
  onNext,
  nextLabel,
  disabled = false,
  submit = false,
}: {
  onBack: () => void;
  onNext?: () => void;
  nextLabel: string;
  disabled?: boolean;
  submit?: boolean;
}) {
  return (
    <div className="mt-8 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-800">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <button
        type={submit ? "submit" : "button"}
        onClick={submit ? undefined : onNext}
        disabled={disabled}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-5 py-3 text-sm font-bold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {nextLabel} <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function SignupSummary({
  selectedPlan,
  selectedModem,
  monthlyPrice,
  upfrontTotal,
  isPremium,
}: {
  selectedPlan: SignupPlan;
  selectedModem: SelectedModem;
  monthlyPrice: number;
  upfrontTotal: number;
  isPremium: boolean;
}) {
  return (
    <aside className="h-fit rounded-xl border-2 border-blue-800 bg-white p-5 shadow-lg lg:sticky lg:top-28">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-950">Order Summary</h3>
          <p className="text-sm font-semibold text-slate-500">Business Pro NBN</p>
        </div>
        <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">Active Plan</span>
      </div>
      <div className="space-y-3 border-b border-slate-200 pb-4">
        <SummaryRow label="Plan" value={selectedPlan.name} />
        <SummaryRow label="Monthly recurring" value={formatMoney(monthlyPrice)} />
        <SummaryRow label="Upfront charge" value={formatMoney(upfrontTotal)} />
        <SummaryRow label="Hardware" value={selectedModem.name} />
      </div>
      <div className="space-y-2 py-4 text-xs font-semibold text-slate-500">
        <p className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-blue-800" /> First provisioning target: approximately 14 days
        </p>
        <p className="flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-blue-800" /> 36-month contract term
        </p>
        {isPremium && (
          <p className="flex items-center gap-2 text-emerald-700">
            <Star className="h-4 w-4" /> Premium 10% monthly discount applied
          </p>
        )}
      </div>
      <p className="rounded-lg bg-slate-50 p-3 text-xs leading-6 text-slate-500">
        This is a frontend-only mock signup. No order, payment, provisioning, NBN query, or provider submission occurs.
      </p>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-black text-slate-950">{value}</span>
    </div>
  );
}

function SummaryTile({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">{label}</p>
      <p className="mt-2 text-lg font-black tracking-tight text-slate-950">{value}</p>
      {detail && <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>}
    </div>
  );
}

function SignUpTextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  actionLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  actionLabel?: string;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span>
      <span className="flex gap-2">
        <input
          className={inputClass}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
        />
        {actionLabel && (
          <button type="button" className="shrink-0 rounded-lg bg-emerald-700 px-4 text-sm font-bold text-white hover:bg-emerald-800">
            {actionLabel}
          </button>
        )}
      </span>
    </label>
  );
}

function SignUpSelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label>
      <span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span>
      <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 2 }).format(value);
}

function handleFrontendSubmit(event: FormEvent<HTMLFormElement>, setSubmitted: (value: boolean) => void) {
  event.preventDefault();
  setSubmitted(true);
}

function ConfirmationPanel({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8">
      <CheckCircle className="h-8 w-8 text-emerald-600" />
      <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-700">{message}</p>
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button type="submit" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">
      {label} <ArrowRight className="h-4 w-4" />
    </button>
  );
}

function TextInput({ label, type = "text", required = false }: { label: string; type?: string; required?: boolean }) {
  return (
    <label>
      <span className="mb-1.5 block text-sm font-bold text-slate-800">{label}</span>
      <input className={inputClass} type={type} required={required} />
    </label>
  );
}

function SelectInput({ label, options, required = false }: { label: string; options: string[]; required?: boolean }) {
  return (
    <label>
      <span className="mb-1.5 block text-sm font-bold text-slate-800">{label}</span>
      <select className={inputClass} required={required}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function getFlowDescription(title: string) {
  switch (title) {
    case "Check Coverage":
      return "Confirm service address details, technology considerations, users, usage, phone porting, and preferred speed tier.";
    case "Our NBN Plans":
      return "Compare business plan tiers from essential use through performance, high-speed, and enterprise review needs.";
    case "Getting Connected":
      return "Understand the steps from eligibility confirmation through phone setup, modem readiness, installation, and activation.";
    case "WiFi Modems":
      return "Review BYO router, supplied router, coverage, VoIP, and higher-speed hardware considerations.";
    case "Connect Now":
      return "Submit connection details once the business is ready for plan and setup review.";
    default:
      return "Review common questions about availability, speeds, phone setup, modems, installation, and next steps.";
  }
}
