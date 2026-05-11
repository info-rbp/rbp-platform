import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, CheckCircle, ExternalLink, FileText, Gift, ShieldCheck } from "lucide-react";

import type { FaqItem } from "../../data/operationsInsurance";

interface Cta {
  label: string;
  href: string;
  external?: boolean;
}

export function OperationsHero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  bullets = [],
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
  bullets?: string[];
}) {
  return (
    <section className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-blue-300">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <SmartButton cta={primaryCta} variant="primary" />
            {secondaryCta && <SmartButton cta={secondaryCta} variant="secondary" />}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <p className="text-sm font-bold text-white">What you can do here</p>
          <div className="mt-5 space-y-3">
            {bullets.map((bullet) => (
              <div key={bullet} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                <span className="text-sm leading-6 text-slate-200">{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SmartButton({ cta, variant }: { cta: Cta; variant: "primary" | "secondary" }) {
  const classes =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "border border-white/20 bg-white/10 text-white hover:bg-white/15";
  const content = (
    <>
      {cta.label}
      {cta.external ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
    </>
  );

  if (cta.external) {
    return (
      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${classes}`}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={cta.href} className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${classes}`}>
      {content}
    </Link>
  );
}

export function ProductDetailHero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
}) {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <SmartButton cta={primaryCta} variant="primary" />
          {secondaryCta && <SmartButton cta={secondaryCta} variant="secondary" />}
        </div>
      </div>
    </section>
  );
}

export function OperationsProductGrid({
  children,
  columns = "lg:grid-cols-3",
}: {
  children: ReactNode;
  columns?: string;
}) {
  return <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${columns}`}>{children}</div>;
}

export function OperationsProductCard({
  title,
  description,
  href,
  cta = "Learn more",
  meta,
}: {
  title: string;
  description: string;
  href: string;
  cta?: string;
  meta?: string;
}) {
  return (
    <Link
      to={href}
      className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {meta && <span className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-700">{meta}</span>}
      <h3 className="text-lg font-black tracking-tight text-slate-950 group-hover:text-blue-700">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
        {cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>}
    </div>
  );
}

export function InfoList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
          <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function HowItWorksSteps({ steps }: { steps: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((step, index) => (
        <div key={step} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-sm font-black text-white">
            {index + 1}
          </div>
          <p className="text-sm font-semibold leading-6 text-slate-800">{step}</p>
        </div>
      ))}
    </div>
  );
}

export function MembershipBenefitCallout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex gap-3">
        <Gift className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-sm font-semibold leading-6 text-amber-900">{children}</p>
      </div>
    </div>
  );
}

export function ComplianceDisclaimer({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex gap-3">
        <FileText className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
        <p className="text-xs leading-6 text-slate-600">{children}</p>
      </div>
    </div>
  );
}

export function AffiliateQuoteButton({ href, label = "Get Quote Now" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
    >
      {label}
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}

export function FinanceReferralButton({ label = "Get Funded Now" }: { label?: string }) {
  return (
    <Link
      to="/operations/finance/get-funded"
      className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold text-slate-900">
            {item.question}
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-90" />
          </summary>
          <p className="px-5 pb-5 text-sm leading-7 text-slate-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function RelatedProductsGrid({
  items,
  basePath,
}: {
  items: Array<{ slug: string; title: string; shortDescription: string }>;
  basePath: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <OperationsProductGrid>
      {items.map((item) => (
        <OperationsProductCard
          key={item.slug}
          title={item.title}
          description={item.shortDescription}
          href={`${basePath}/${item.slug}`}
          cta="View related product"
        />
      ))}
    </OperationsProductGrid>
  );
}

export function SourceAlignedNotice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
      <div className="flex gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
        <p className="text-sm leading-7 text-blue-950">{children}</p>
      </div>
    </div>
  );
}
