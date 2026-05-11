import { useState } from "react";
import { Link, useParams } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { documentById, categoryMeta, allDocuments, type DocumentItem } from "../data/documentData";
import { mockDocuShareDocumentGroups, mockDocumentProducts } from "../mock";
import {
  ArrowRight,
  FileText,
  Clock,
  Star,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  RotateCcw,
  Truck,
  MessageCircle,
  Share2,
  Bookmark,
  Tag,
} from "lucide-react";

const productImage =
  "https://images.unsplash.com/photo-1758518731462-d091b0b4ed0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGRvY3VtZW50JTIwY29udHJhY3QlMjBzaWduaW5nJTIwcHJvZmVzc2lvbmFsJTIwZGVza3xlbnwxfHx8fDE3NzY5NTE3MDl8MA&ixlib=rb-4.1.0&q=80&w=1080";

const complexityBadge: Record<string, string> = {
  Simple: "bg-emerald-100 text-emerald-700",
  Standard: "bg-amber-100 text-amber-700",
  Complex: "bg-red-100 text-red-700",
};

type TabId = "description" | "included" | "process" | "faqs";

const tabs: { id: TabId; label: string }[] = [
  { id: "description", label: "Overview" },
  { id: "included", label: "What's Included" },
  { id: "process", label: "Delivery & Process" },
  { id: "faqs", label: "FAQs" },
];

const processSteps = [
  { step: "01", title: "Complete your brief", desc: "Fill in a structured requirements form covering your business details and document needs." },
  { step: "02", title: "Scoping & confirmation", desc: "We review your brief, confirm scope, and clarify any questions before work begins." },
  { step: "03", title: "Document creation", desc: "Our advisors create your document using professional frameworks and templates." },
  { step: "04", title: "Review & revisions", desc: "You receive the draft, review it, and we incorporate your feedback." },
  { step: "05", title: "Final delivery", desc: "Your finalised document is delivered and securely stored in your Document Nucleus account." },
];

function mockProductToDocument(product: (typeof mockDocumentProducts)[number]): DocumentItem {
  const group = mockDocuShareDocumentGroups.find((item) => item.id === product.category);

  return {
    id: product.id,
    name: product.title,
    type: group?.title ?? "DocuShare",
    format: "Mock brief",
    deliveryTime: "Simulated status only",
    complexity: product.category === "documentation-suites" ? "Complex" : "Standard",
    popular: product.id === "template-policy-001" || product.id === "suite-operations-001",
    category: product.category,
    description: product.description,
    tags: [product.category, "DocuShare", "Preview"],
    price: product.priceLabel,
    fullDescription:
      "This Document Nucleus product preview exists so the DocuShare onboarding flow can be reviewed end to end. It can be used to prefill the brief route, but it does not create a real order, document, upload, payment or delivery workflow.",
    whatsIncluded: [
      "Mock document brief context",
      "Document group and product preselection",
      "Purpose, audience and tailored questions",
      "Mock supporting upload placeholder",
      "Simulated portal status handoff",
    ],
    useCases: ["Frontend QA", "Brief review", "Portal status demonstration"],
    faqs: [
      {
        q: "Will this create a real document?",
        a: "No. Phase 1 only submits a simulated mock brief for UI review.",
      },
      {
        q: "Are files uploaded?",
        a: "No. The upload area only represents the intended frontend experience.",
      },
      {
        q: "Is payment processed?",
        a: "No. Payment and checkout flows are not part of this mock product route.",
      },
    ],
  };
}

export function DocumentProductPage() {
  const { id = "a1" } = useParams<{ id: string }>();
  const mockProduct = mockDocumentProducts.find((product) => product.id === id);
  const doc = documentById[id] ?? (mockProduct ? mockProductToDocument(mockProduct) : undefined);

  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabId>("description");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!doc) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <FileText className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Document not found</h1>
          <p className="text-slate-500 mb-8">This document doesn't exist or may have moved.</p>
          <Link to="/document-nucleus/overview" className="inline-flex items-center gap-2 bg-blue-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-800 transition-all">
            Browse Documents <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const mockGroup = mockDocuShareDocumentGroups.find((group) => group.id === doc.category);
  const meta =
    categoryMeta[doc.category] ??
    (mockGroup
      ? {
          id: mockGroup.title.slice(0, 1),
          title: mockGroup.title,
          desc: mockGroup.description,
          color: mockGroup.color,
          lightBg: mockGroup.lightBg,
          accent: mockGroup.accent,
          tag: mockGroup.tag,
          tagColor: mockGroup.tagColor,
        }
      : categoryMeta.a);
  const formats = doc.format.split(" / ");
  const currentFormat = selectedFormat || formats[0];
  const briefHref = `/document-nucleus/brief?category=${doc.category}&product=${doc.id}`;

  // Related docs — same category, excluding current
  const related = allDocuments[doc.category]?.filter((d) => d.id !== doc.id).slice(0, 4) ?? [];

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* ── Breadcrumb ── */}
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest flex-wrap">
            <Link to="/docushare" className="hover:text-blue-600 transition-colors">Document Nucleus</Link>
            <span>/</span>
            <Link to="/document-nucleus/overview" className="hover:text-blue-600 transition-colors">Overview</Link>
            <span>/</span>
            <Link to={`/document-nucleus/category/${doc.category}`} className={`hover:text-blue-600 transition-colors ${meta.accent}`}>
              {meta.title}
            </Link>
            <span>/</span>
            <span className="text-slate-700">{doc.name}</span>
          </div>
        </div>
      </div>

      {/* ── Main product section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ── LEFT: Gallery ── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3] shadow-md">
              <img src={productImage} alt={doc.name} className="w-full h-full object-cover" />
              {/* Overlay doc mockup */}
              <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent">
                <div className="bg-white/95 rounded-xl px-5 py-4 shadow-xl flex items-center gap-4 w-full max-w-sm">
                  <div className={`w-10 h-10 ${meta.lightBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <FileText className={`w-5 h-5 ${meta.accent}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-400 font-semibold truncate">{meta.title} — {doc.type}</div>
                    <div className="font-extrabold text-slate-900 truncate">{doc.name}</div>
                  </div>
                </div>
              </div>
              {/* Popular badge */}
              {doc.popular && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-extrabold px-3 py-1.5 rounded-full shadow">
                  <Star className="w-3 h-3 fill-amber-900" /> Popular Choice
                </div>
              )}
            </div>

            {/* Thumbnail strip — doc preview cards */}
            <div className="grid grid-cols-3 gap-3">
              {["Full Document", "Example Structure", "Delivery Format"].map((label, i) => (
                <div
                  key={label}
                  className={`rounded-xl border-2 p-3 text-center cursor-pointer transition-all ${
                    i === 0 ? `${meta.lightBg} border-current ${meta.accent}` : "border-slate-200 hover:border-slate-300 bg-slate-50"
                  }`}
                >
                  <FileText className={`w-5 h-5 mx-auto mb-1.5 ${i === 0 ? meta.accent : "text-slate-400"}`} />
                  <div className="text-xs font-semibold text-slate-600">{label}</div>
                </div>
              ))}
            </div>

            {/* Trust bar */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, label: "Secure process", sub: "Encrypted delivery" },
                { icon: RotateCcw, label: "Revisions included", sub: "One round standard" },
                { icon: Truck, label: "Fast turnaround", sub: doc.deliveryTime },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center bg-slate-50 rounded-xl p-3">
                  <Icon className="w-5 h-5 text-slate-500 mb-1.5" />
                  <div className="text-xs font-bold text-slate-700">{label}</div>
                  <div className="text-xs text-slate-400">{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Product info ── */}
          <div className="flex flex-col">
            {/* Category + type tags */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Link
                to={`/document-nucleus/category/${doc.category}`}
                className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${meta.tagColor} hover:opacity-80 transition-opacity`}
              >
                <Tag className="w-3 h-3" /> {meta.title}
              </Link>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{doc.type}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${complexityBadge[doc.complexity]}`}>
                {doc.complexity}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3 leading-tight">
              {doc.name}
            </h1>

            {/* Short description */}
            <p className="text-slate-600 leading-relaxed mb-6">{doc.description}</p>

            {/* Divider */}
            <div className="border-t border-slate-100 mb-6" />

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-extrabold text-slate-900">{doc.price}</span>
              <span className="text-slate-400 text-sm font-medium mb-1">one-time · ex. VAT</span>
            </div>

            {/* Format selector */}
            {formats.length > 1 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-700">Format</span>
                  <span className="text-xs text-slate-400">{currentFormat}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {formats.map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                        currentFormat === fmt
                          ? `${meta.color} text-white border-transparent`
                          : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery */}
            <div className="flex items-center gap-2 mb-6 text-sm text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Estimated delivery: <span className="font-bold text-slate-900">{doc.deliveryTime}</span> after brief submission</span>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 mb-6">
              <Link
                to={briefHref}
                className={`inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl font-extrabold text-base transition-all shadow-lg ${meta.color} text-white hover:opacity-90 shadow-blue-200`}
              >
                Continue to mock brief
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/document-nucleus/brief"
                className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl font-bold text-base border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Start a different document brief
              </Link>
            </div>

            {/* Quick actions */}
            <div className="flex gap-3 mb-6">
              <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                <Bookmark className="w-4 h-4" /> Save
              </button>
              <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>

            {/* What's included teaser */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">What's included</div>
              <ul className="space-y-2">
                {doc.whatsIncluded.slice(0, 4).map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className={`w-4 h-4 ${meta.accent} flex-shrink-0 mt-0.5`} />
                    {item}
                  </li>
                ))}
                {doc.whatsIncluded.length > 4 && (
                  <li className="text-xs font-bold text-blue-600 pl-6">
                    + {doc.whatsIncluded.length - 4} more — see full list below
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Detail tabs ── */}
      <div className="border-t border-slate-200 bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-6 py-4 text-sm font-bold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? `${meta.accent} border-current`
                    : "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Overview tab */}
        {activeTab === "description" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-extrabold text-slate-900">About this document</h2>
              <p className="text-slate-600 leading-relaxed">{doc.fullDescription}</p>
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Who is this for?</h3>
                <div className="flex flex-wrap gap-2">
                  {doc.useCases.map((u) => (
                    <span key={u} className={`text-sm font-semibold px-3 py-1.5 rounded-xl ${meta.lightBg} ${meta.accent}`}>
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Document details</div>
                {[
                  { label: "Format", value: doc.format },
                  { label: "Type", value: doc.type },
                  { label: "Complexity", value: doc.complexity },
                  { label: "Delivery", value: doc.deliveryTime },
                  { label: "Price", value: doc.price },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                    <span className="text-slate-500 font-medium">{label}</span>
                    <span className="font-bold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* What's included tab */}
        {activeTab === "included" && (
          <div className="max-w-3xl space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900">What's included</h2>
            <p className="text-slate-500">Every item listed below is included as standard in your {doc.name} document.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doc.whatsIncluded.map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className={`w-7 h-7 ${meta.lightBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <CheckCircle className={`w-4 h-4 ${meta.accent}`} />
                  </div>
                  <span className="text-slate-700 text-sm font-medium leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery & process tab */}
        {activeTab === "process" && (
          <div className="max-w-2xl space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">How it works</h2>
              <p className="text-slate-500">Every document follows the same five-step process from order to delivery.</p>
            </div>
            <div className="space-y-4">
              {processSteps.map((s, i) => (
                <div key={s.step} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 ${meta.color} text-white rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0`}>
                      {i + 1}
                    </div>
                    {i < processSteps.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                  </div>
                  <div className="pb-6">
                    <div className="font-bold text-slate-900 mb-1">{s.title}</div>
                    <div className="text-slate-500 text-sm leading-relaxed">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className={`${meta.lightBg} border-2 rounded-2xl p-6`}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className={`w-5 h-5 ${meta.accent}`} />
                <span className="font-bold text-slate-900">Estimated delivery: {doc.deliveryTime}</span>
              </div>
              <p className="text-slate-600 text-sm">Delivery time starts from the point we receive your completed requirements brief.</p>
            </div>
          </div>
        )}

        {/* FAQs tab */}
        {activeTab === "faqs" && (
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Frequently asked questions</h2>
            {doc.faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-900">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Related documents ── */}
      {related.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">More from {meta.title}</div>
                <h2 className="text-2xl font-extrabold text-slate-900">You may also need</h2>
              </div>
              <Link
                to={`/document-nucleus/category/${doc.category}`}
                className={`text-sm font-bold ${meta.accent} hover:underline hidden sm:inline`}
              >
                View all in {meta.title} →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((rel) => (
                <div key={rel.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all hover:-translate-y-0.5 flex flex-col group">
                  <div className={`h-1 w-full ${meta.color}`} />
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 ${meta.lightBg} rounded-xl flex items-center justify-center`}>
                        <FileText className={`w-5 h-5 ${meta.accent}`} />
                      </div>
                      {rel.popular && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Popular
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">{rel.name}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">{rel.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                      <span className="font-bold text-slate-900">{rel.price}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {rel.deliveryTime}</span>
                    </div>
                    <Link
                      to={`/document-nucleus/product/${rel.id}`}
                      className={`inline-flex items-center justify-center gap-2 w-full text-sm font-bold py-2.5 px-4 rounded-xl transition-all ${meta.color} text-white hover:opacity-90`}
                    >
                      View document options
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky buy bar (mobile) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white border-t border-slate-200 px-4 py-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-slate-900 truncate">{doc.name}</div>
            <div className="text-slate-500 text-xs">{doc.price} · {doc.deliveryTime}</div>
          </div>
          <Link
            to={briefHref}
            className={`inline-flex items-center gap-2 ${meta.color} text-white font-bold py-3 px-5 rounded-xl text-sm transition-all hover:opacity-90 flex-shrink-0`}
          >
            Start brief <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Bottom padding for mobile sticky bar */}
      <div className="h-20 sm:hidden" />

      <Footer />
    </div>
  );
}
