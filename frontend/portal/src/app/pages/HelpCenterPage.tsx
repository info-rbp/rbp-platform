import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  helpCategories as helpDataCategories,
  helpSections,
} from "../data/helpCenter";
import { usePublicBackendContent } from "../hooks/usePublicBackendContent";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { HelpCircle, Search, ChevronDown, ChevronUp, MessageCircle, ArrowRight, BookOpen, Zap, ShoppingBag, Layers, CreditCard, FileText } from "lucide-react";

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


const helpSectionLabels = Object.fromEntries(
  helpSections.map((section) => [section.id, section.label])
);

const helpCategoryLabels = Object.fromEntries(
  helpDataCategories.map((category) => [category.id, category.label])
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
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
          >
            <span className="font-semibold text-sm text-slate-900">{item.q}</span>
            {open === i ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
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

  useEffect(() => {
    setActiveSection(queryFaqSection);
  }, [queryFaqSection]);

  const filteredHelpArticles = structuredHelpArticles.filter((article) => {
    const matchesSection = !sectionParam || article.section === sectionParam;
    const matchesCategory = !categoryParam || article.category === categoryParam;
    const matchesSearch =
      !search ||
      article.question.toLowerCase().includes(search.toLowerCase()) ||
      article.answer.toLowerCase().includes(search.toLowerCase());

    return matchesSection && matchesCategory && matchesSearch;
  });

  const filteredFaqs = faqs.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) => !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((s) => s.items.length > 0);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <HelpCircle className="w-3 h-3" /> Help Center
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">How can we help?</h1>
          <p className="text-slate-300 mb-8">Search our help articles, browse FAQs by category, or contact our support team.</p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search help articles and FAQs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-4 rounded-2xl text-slate-900 text-sm focus:outline-none focus:ring-4 focus:ring-blue-400/30 shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Query-aware help state */}
      <section className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="bg-white border border-blue-100 rounded-2xl p-5">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">
              Current help view
            </div>
            <p className="text-sm text-slate-700">
              Showing <strong>{querySectionLabel}</strong>
              {queryCategoryLabel && <> for <strong>{queryCategoryLabel}</strong></>}.
              {sectionParam === "support" && " Use the support option below if your issue is not covered by the FAQs."}
            </p>
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">Browse by category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {helpCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveSection(activeSection === cat.label ? null : cat.label)}
                  className={`text-left p-4 rounded-2xl border-2 transition-all hover:shadow-md ${
                    activeSection === cat.label ? "border-blue-400 bg-blue-50" : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg ${cat.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-900 text-sm mb-0.5">{cat.label}</div>
                  <div className="text-xs text-slate-400 leading-snug">{cat.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-10 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-extrabold text-slate-900 mb-8">
            {search ? `Search results for "${search}"` : "Frequently Asked Questions"}
          </h2>
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No FAQs match your search. <Link to="/help?section=support" className="text-blue-600 font-semibold hover:underline">Contact support instead</Link>.</div>
          ) : (
            <div className="space-y-10">
              {filteredFaqs
                .filter((s) => !activeSection || s.category === activeSection)
                .map((section) => (
                  <div key={section.category}>
                    <h3 className="font-bold text-blue-700 text-sm uppercase tracking-widest mb-4">{section.category}</h3>
                    <FaqAccordion items={section.items} />
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </section>

      {/* Data-driven Help Articles */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">Structured Help Content</h2>
          {filteredHelpArticles.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-500 text-sm">
              No structured help articles match this view yet. Placeholder content will be expanded as the help centre is developed.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHelpArticles.map((article) => (
                <div key={article.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                  <div className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">
                    {helpSectionLabels[article.section] || article.section} · {helpCategoryLabels[article.category] || article.category}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{article.question}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{article.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact support CTA */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm">
            <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-slate-900 text-lg mb-1">Still need help?</h3>
              <p className="text-slate-500 text-sm leading-relaxed">This public shell directs unresolved queries to a frontend-only support enquiry path. Real ticketing and notification delivery are deferred.</p>
            </div>
            <Link to="/contact?reason=support" className="flex-shrink-0 inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 whitespace-nowrap">
              Contact Support <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
