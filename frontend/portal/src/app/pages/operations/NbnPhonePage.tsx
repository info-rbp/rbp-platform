import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { ArrowRight, CheckCircle, Router, Wifi } from "lucide-react";

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
      primary={{ label: "Connect Now", href: "/operations/connectivity/nbn-phone/connect-now" }}
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
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return <ConfirmationPanel title="Your connection request has been received." message="The RBP team will review coverage, plan suitability, modem requirements, and phone setup before confirming next steps." />;
  }

  return (
    <form onSubmit={(event) => handleFrontendSubmit(event, setSubmitted)} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <SectionHeader eyebrow="Connect Now Form" title="Submit your preferred connection details" />
      <div className="grid gap-5 md:grid-cols-2">
        <TextInput label="Business name" required />
        <TextInput label="Service address" required />
        <SelectInput label="Selected plan" options={nbnPlans.map((plan) => plan.name)} required />
        <SelectInput label="Modem preference" options={["Review my existing router", "Supplied router option", "Need Wi-Fi coverage advice", "Not sure"]} required />
        <SelectInput label="Phone service required" options={["No", "Yes", "Not sure"]} required />
        <SelectInput label="Number porting required" options={["No", "Yes", "Not sure"]} required />
        <TextInput label="Existing phone number (optional)" />
        <TextInput label="Contact name" required />
        <TextInput label="Email" type="email" required />
        <TextInput label="Phone" type="tel" required />
        <TextInput label="Preferred connection date" type="date" required />
        <label className="md:col-span-2">
          <span className="mb-1.5 block text-sm font-bold text-slate-800">Notes</span>
          <textarea className={`${inputClass} min-h-28`} />
        </label>
      </div>
      <label className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700" />
        <span>I consent to RBP contacting me about this Business NBN connection request.</span>
      </label>
      <SubmitButton label="Submit Connect Now Request" />
    </form>
  );
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
