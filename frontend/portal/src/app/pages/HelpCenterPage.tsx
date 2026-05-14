import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  helpCategories as helpDataCategories,
  helpSections,
} from "../data/helpCenter";
import { usePublicBackendContent } from "../hooks/usePublicBackendContent";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ArrowRight,
  BookOpen,
  Zap,
  ShoppingBag,
  Layers,
  CreditCard,
  FileText,
} from "lucide-react";

const helpCategories = [
  { icon: Zap, label: "Membership", desc: "Plans, billing, access, and account management", href: "/membership", color: "bg-rose-100 text-rose-700" },
  { icon: FileText, label: "Documents", desc: "Ordering, delivery, revisions, and downloads", href: "/on-demand/documents", color: "bg-teal-100 text-teal-700" },
  { icon: Layers, label: "Applications", desc: "Setup requests, access, and technical help", href: "/applications", color: "bg-violet-100 text-violet-700" },
  { icon: ShoppingBag, label: "Marketplace", desc: "Orders, packages, delivery, and enquiries", href: "/marketplace", color: "bg-amber-100 text-amber-700" },
  { icon: CreditCard, label: "Billing & Payments", desc: "Invoices, payments, and refund queries", href: "/contact?reason=billing", color: "bg-emerald-100 text-emerald-700" },
  { icon: BookOpen, label: "Resources", desc: "Accessing guides, templates, and tools", href: "/resources", color: "bg-blue-100 text-blue-700" },
];

interface FaqItem { q: string; a: string; }
interface FaqSection { category: string; items: FaqItem[]; }

const faqs: FaqSection[] = [
  {
    category: "Membership",
    items: [
      { q: "What membership plans are available?", a: "We offer Starter, Growth, Pro, and Enterprise plans. Each plan unlocks different levels of advisory access, Decision Desk credits, document downloads, and application discounts. Visit the Membership Hub to compare plans." },
      { q: "Can I cancel my membership?", a: "Yes — memberships can be cancelled at any time. Cancellation takes effect at the end of your current billing period. Contact support if you need to discuss your options." },
      { q: "How do I upgrade or downgrade my plan?", a: "You can request a plan change through your account or by contacting support. Changes take effect at the start of your next billing period." },
      { q: "Is there a free trial?", a: "We offer an introductory access period on selected plans. Check the current Membership Hub page for the latest offer." },
    ],
  },
  {
    category: "Documents & Deliverables",
    items: [
      { q: "How do I order a document?", a: "Browse the Document Centre, select the document you need, and click 'Learn More & Buy'. You'll complete a requirements brief and receive your document within the estimated delivery time." },
      { q: "How many revision rounds are included?", a: "All documents include one round of revisions as standard. Additional revision rounds can be discussed with the delivery team." },
      { q: "What formats are documents delivered in?", a: "Documents are delivered in the formats listed on each product page — typically PDF and/or Word. The format is confirmed in your requirements brief." },
      { q: "What if I'm not happy with my document?", a: "Please raise a revision request within 14 days of delivery. If we're unable to resolve the issue through revisions, contact support to discuss next steps." },
    ],
  },
  {
    category: "Applications",
    items: [
      { q: "What are Business Applications?", a: "Business Applications are white-labelled Frappe-powered business software solutions — including CRM, ERP, HR systems, and more — set up and supported by Remote Business Partner." },
      { q: "How long does setup take?", a: "Setup time varies by application — typically between 3 and 14 business days depending on complexity. Estimated times are listed on each application page." },
      { q: "Do I need technical skills?", a: "No — we handle the full setup, configuration, and initial training. Ongoing use is designed to be manageable without technical expertise." },
      { q: "Is hosting included?", a: "Setup packages include initial hosting guidance. Ongoing hosting is subject to the arrangement — full details are included in your setup package." },
    ],
  },
  {
    category: "Marketplace",
    items: [
      { q: "How are marketplace products delivered?", a: "Delivery format and timeline are listed on each product card. Digital documents are delivered to your email. Setup packages are delivered as services." },
      { q: "Can I get a bespoke package?", a: "Yes — if you don't see exactly what you need, contact us and we can scope a custom package for your business." },
      { q: "Is there a refund policy?", a: "Digital products and services that have commenced delivery are non-refundable. For issues with delivery, please contact support within 14 days." },
      { q: "Can I request a product not currently listed?", a: "Yes — use the Contact page to submit a product enquiry and our team will assess feasibility." },
    ],
  },
  {
    category: "Billing & Payments",
    items: [
      { q: "How do I pay?", a: "We accept major debit/credit cards and bank transfer. Payment options are presented at checkout or in your invoice." },
      { q: "Do you issue VAT invoices?", a: "Yes — all invoices include VAT where applicable. VAT invoices are issued automatically." },
      { q: "Who do I contact about billing issues?", a: "Contact our support team via the Contact page, selecting 'Billing' as your enquiry type." },
      { q: "Can I get a receipt for expenses?", a: "Yes — all invoices are available to download from your account or by request from the billing team." },
    ],
  },
];

const safeHelpSections = Array.isArray(helpSections) ? helpSections : [];
const safeHelpDataCategories = Array.isArray(helpDataCategories) ? helpDataCategories : [];

const helpSectionLabels = Object.fromEntries(
  safeHelpSections.map((section) => [section.id, section.label])
);

const helpCategoryLabels = Object.fromEntries(
  safeHelpDataCategories.map((category) => [category.id, category.label])
);

const helpCategoryToFaqSection: Record<string, string> = {
  "on-demand-services": "Documents & Deliverables",
  applications: "Applications",
  marketplace: "Marketplace",
  membership: "Membership",
  resources: "Resources",
};

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="space-y-2">
      {safeItems.map((item, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-slate-200">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50"
          >
            <span className="text-sm font-semibold text-slate-900">{item.q}</span>
            {open === i ? (
              <ChevronUp className="h-4 w-4 flex-shrink-0 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-400" />
            )}
          </button>
          {open === i && (
            <div className="border-t border-slate-100 px-5 pb-4 pt-3 text-sm leading-relaxed text-slate-600">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function HelpCenterPage() {
  const [searchParams] = useSearchParams();
  const sectionParam = searchParams.get("section") ?? "faqs";
  const categoryParam = searchParams.get("category") ?? "";
  const querySectionLabel = helpSectionLabels[sectionParam] ?? "Help Center";
  const queryCategoryLabel = helpCategoryLabels[categoryParam] ?? "";
  const queryFaqSection = helpCategoryToFaqSection[categoryParam] ?? null;

  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(queryFaqSection);
  const { helpArticles: structuredHelpArticles } = usePublicBackendContent();
  const safeStructuredHelpArticles = Array.isArray(structuredHelpArticles)
    ? structuredHelpArticles
    : [];

  useEffect(() => {
    setActiveSection(queryFaqSection);
  }, [queryFaqSection]);

  const filteredHelpArticles = safeStructuredHelpArticles.filter((article) => {
    const matchesSection = !sectionParam || article.section === sectionParam;
    const matchesCategory = !categoryParam || article.category === categoryParam;
    const matchesSearch =
      !search ||
      article.question.toLowerCase().includes(search.toLowerCase()) ||
      article.answer.toLowerCase().includes(search.toLowerCase());

    return matchesSection && matchesCategory && matchesSearch;
  });

  const filteredFaqs = faqs
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          !search ||
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-br from-slate-900 to-blue-950 py-16 text-white lg:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-300">
            <HelpCircle className="h-3 w-3" /> Help Center
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">How can we help?</h1>
          <p className="mb-8 text-slate-300">Search our help articles, browse FAQs by category, or contact our support team.</p>
          <div className="relative mx-auto max-w-lg">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search help articles and FAQs…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-2xl pl-12 pr-5 py-4 text-sm text-slate-900 shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-400/30"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-blue-100 bg-blue-50">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-blue-100 bg-white p-5">
            <div className="mb-1 text-xs font-bold uppercase tracking-widest text-blue-700">
              Current help view
            </div>
            <p className="text-sm text-slate-700">
              Showing <strong>{querySectionLabel}</strong>
              {queryCategoryLabel && (
                <>
                  {" "}for <strong>{queryCategoryLabel}</strong>
                </>
              )}
              .
              {sectionParam === "support" &&
                " Use the support option below if your issue is not covered by the FAQs."}
            </p>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-extrabold text-slate-900">Browse by category</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {helpCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveSection(activeSection === cat.label ? null : cat.label)}
                  className={`rounded-2xl border-2 p-4 text-left transition-all hover:shadow-md ${
                    activeSection === cat.label
                      ? "border-blue-400 bg-blue-50"
                      : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${cat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="mb-0.5 text-sm font-bold text-slate-900">{cat.label}</div>
                  <div className="text-xs leading-snug text-slate-400">{cat.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-10 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-xl font-extrabold text-slate-900">
            {search ? `Search results for "${search}"` : "Frequently Asked Questions"}
          </h2>
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              No FAQs match your search.{" "}
              <Link to="/help?section=support" className="font-semibold text-blue-600 hover:underline">
                Contact support instead
              </Link>
              .
            </div>
          ) : (
            <div className="space-y-10">
              {filteredFaqs
                .filter((section) => !activeSection || section.category === activeSection)
                .map((section) => (
                  <div key={section.category}>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-blue-700">
                      {section.category}
                    </h3>
                    <FaqAccordion items={section.items} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-slate-100 bg-white py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-extrabold text-slate-900">Structured Help Content</h2>
          {filteredHelpArticles.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
              No structured help articles match this view yet. Placeholder content will be expanded as the help centre is developed.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHelpArticles.map((article) => (
                <div key={article.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-700">
                    {helpSectionLabels[article.section] || article.section} · {helpCategoryLabels[article.category] || article.category}
                  </div>
                  <h3 className="mb-2 font-bold text-slate-900">{article.question}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{article.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <MessageCircle className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-extrabold text-slate-900">Still need help?</h3>
              <p className="text-sm leading-relaxed text-slate-500">This public shell directs unresolved queries to a frontend-only support enquiry path. Real ticketing and notification delivery are deferred.</p>
            </div>
            <Link
              to="/contact?reason=support"
              className="inline-flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-800"
            >
              Contact Support <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
