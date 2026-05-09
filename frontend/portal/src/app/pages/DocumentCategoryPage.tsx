import { useState, useMemo } from "react";
import { Link, useParams } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { categoryMeta, allDocuments } from "../data/documentData";
import { mockDocuShareDocumentGroups, mockDocumentProducts } from "../mock";
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  FileText,
  X,
  ChevronDown,
  Star,
  Clock,
  Tag,
  LayoutGrid,
  List,
  CheckCircle,
  Filter,
} from "lucide-react";

// ── Category meta ──
// (imported from ../data/documentData)

// ── Placeholder document types ──
// (imported from ../data/documentData)

const allTypes = ["All Types", "Planning", "Marketing", "Legal", "Operations", "HR", "Finance", "Sales", "Compliance", "Governance", "Strategy"];
const allComplexities = ["All Levels", "Simple", "Standard", "Complex"];
const sortOptions = ["Featured", "A–Z", "Z–A", "Quickest Delivery", "Complexity: Low–High"];

type CategoryDocumentCard = {
  id: string;
  name: string;
  type: string;
  format: string;
  deliveryTime: string;
  complexity: string;
  popular: boolean;
  description: string;
  tags: string[];
  category: string;
};

function mockProductToDocument(product: (typeof mockDocumentProducts)[number]): CategoryDocumentCard {
  return {
    id: product.id,
    name: product.title,
    type: product.category === "documentation-suites" ? "Suite" : "Template",
    format: "Mock brief",
    deliveryTime: "Simulated",
    complexity: product.category === "documentation-suites" ? "Complex" : "Standard",
    popular: product.id === "template-policy-001" || product.id === "suite-operations-001",
    description: product.description,
    tags: [product.category, "Mock DocuShare"],
    category: product.category,
  };
}

export function DocumentCategoryPage() {
  const { id = "a" } = useParams<{ id: string }>();
  const categoryId = id.toLowerCase();
  const legacyMeta = categoryMeta[categoryId];
  const mockGroup = mockDocuShareDocumentGroups.find((group) => group.id === categoryId);
  const meta = legacyMeta
    ? {
        ...legacyMeta,
        description: legacyMeta.desc,
      }
    : mockGroup
      ? {
          id: mockGroup.title.slice(0, 1),
          title: mockGroup.title,
          desc: mockGroup.description,
          description: mockGroup.description,
          color: mockGroup.color,
          lightBg: mockGroup.lightBg,
          accent: mockGroup.accent,
          tag: mockGroup.tag,
          tagColor: mockGroup.tagColor,
        }
      : null;
  const docs: CategoryDocumentCard[] = legacyMeta
    ? allDocuments[categoryId] ?? []
    : mockDocumentProducts
        .filter((product) => product.category === categoryId)
        .map(mockProductToDocument);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [complexityFilter, setComplexityFilter] = useState("All Levels");
  const [sortBy, setSortBy] = useState("Featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...docs];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (typeFilter !== "All Types") result = result.filter((d) => d.type === typeFilter);
    if (complexityFilter !== "All Levels") result = result.filter((d) => d.complexity === complexityFilter);

    if (sortBy === "A–Z") result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "Z–A") result.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === "Quickest Delivery") result.sort((a, b) => a.deliveryTime.localeCompare(b.deliveryTime));
    else if (sortBy === "Complexity: Low–High") {
      const order = { Simple: 0, Standard: 1, Complex: 2 };
      result.sort((a, b) => (order[a.complexity as keyof typeof order] ?? 0) - (order[b.complexity as keyof typeof order] ?? 0));
    } else {
      result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    return result;
  }, [docs, search, typeFilter, complexityFilter, sortBy]);

  const hasActiveFilters = typeFilter !== "All Types" || complexityFilter !== "All Levels" || search.trim();

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("All Types");
    setComplexityFilter("All Levels");
  };

  const complexityColor: Record<string, string> = {
    Simple: "bg-emerald-100 text-emerald-700",
    Standard: "bg-amber-100 text-amber-700",
    Complex: "bg-red-100 text-red-700",
  };

  if (!meta) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <FileText className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Document category not found</h1>
          <p className="text-slate-500 mb-8">
            This mock category is not available. Choose a Document Nucleus group or start a new brief.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/document-nucleus/overview" className="inline-flex items-center gap-2 bg-blue-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-800 transition-all">
              View document options <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/document-nucleus/brief" className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-all">
              Start a document brief
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* ── Banner ── */}
      <div className={`${meta.color} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-5 text-xs font-semibold text-white/50 uppercase tracking-widest flex-wrap">
            <Link to="/docushare" className="hover:text-white transition-colors">Document Nucleus</Link>
            <span>/</span>
            <Link to="/document-nucleus/overview" className="hover:text-white transition-colors">Document Overview</Link>
            <span>/</span>
            <span className="text-white/90">{meta.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-extrabold text-xl">{meta.id}</span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${meta.tagColor}`}>{meta.tag}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">{meta.title}</h1>
              <p className="text-white/70 max-w-xl leading-relaxed text-sm">{meta.description}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/document-nucleus/overview"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all"
              >
                ← All Categories
              </Link>
              <Link
                to={`/document-nucleus/brief?category=${categoryId}`}
                className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold text-sm px-5 py-2.5 rounded-xl transition-all hover:bg-white/90"
              >
                Start a document brief
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-slate-50"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`sm:hidden inline-flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl border transition-all ${
                showFilters || hasActiveFilters
                  ? "bg-blue-700 text-white border-blue-700"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters {hasActiveFilters && "(active)"}
            </button>

            {/* Desktop filters */}
            <div className="hidden sm:flex items-center gap-2 flex-wrap">
              {/* Type */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={`appearance-none pl-3 pr-8 py-2.5 text-sm font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer ${
                    typeFilter !== "All Types" ? "bg-blue-50 border-blue-300 text-blue-700" : "border-slate-200 text-slate-700 bg-white"
                  }`}
                >
                  {allTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>

              {/* Complexity */}
              <div className="relative">
                <select
                  value={complexityFilter}
                  onChange={(e) => setComplexityFilter(e.target.value)}
                  className={`appearance-none pl-3 pr-8 py-2.5 text-sm font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer ${
                    complexityFilter !== "All Levels" ? "bg-blue-50 border-blue-300 text-blue-700" : "border-slate-200 text-slate-700 bg-white"
                  }`}
                >
                  {allComplexities.map((c) => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 border border-red-200 bg-red-50 px-3 py-2.5 rounded-xl transition-all"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>

            {/* Spacer */}
            <div className="flex-1 hidden sm:block" />

            {/* Sort + View toggle */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none bg-white text-slate-700 cursor-pointer"
                >
                  {sortOptions.map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
              <div className="hidden sm:flex border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile expanded filters */}
          {showFilters && (
            <div className="sm:hidden flex flex-wrap gap-2 pt-3 border-t border-slate-100 mt-3">
              <div className="relative flex-1 min-w-[140px]">
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl bg-white text-slate-700">
                  {allTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative flex-1 min-w-[140px]">
                <select value={complexityFilter} onChange={(e) => setComplexityFilter(e.target.value)} className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl bg-white text-slate-700">
                  {allComplexities.map((c) => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="inline-flex items-center gap-1 text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-3 py-2.5 rounded-xl">
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Results area ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Result count + active tags */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filtered.length}</span> of{" "}
            <span className="font-bold text-slate-900">{docs.length}</span> documents
          </p>
          {typeFilter !== "All Types" && (
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
              <Tag className="w-3 h-3" /> {typeFilter}
              <button onClick={() => setTypeFilter("All Types")} className="ml-1 hover:text-blue-900"><X className="w-3 h-3" /></button>
            </span>
          )}
          {complexityFilter !== "All Levels" && (
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
              <SlidersHorizontal className="w-3 h-3" /> {complexityFilter}
              <button onClick={() => setComplexityFilter("All Levels")} className="ml-1 hover:text-blue-900"><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-2xl">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-slate-700 mb-1">No documents found</h3>
            <p className="text-slate-400 text-sm mb-4">Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="text-sm font-bold text-blue-600 hover:underline">Clear all filters</button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all hover:-translate-y-0.5 flex flex-col"
              >
                {/* Card top accent */}
                <div className={`h-1.5 w-full ${meta.color}`} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Icon + popular badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 ${meta.lightBg} rounded-xl flex items-center justify-center`}>
                      <FileText className={`w-5 h-5 ${meta.accent}`} />
                    </div>
                    {doc.popular && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Popular
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 mb-1.5 group-hover:text-blue-700 transition-colors">{doc.name}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">{doc.description}</p>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${complexityColor[doc.complexity]}`}>
                      {doc.complexity}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {doc.type}
                    </span>
                  </div>

                  {/* Delivery + format */}
                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-400 mb-4">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {doc.deliveryTime}
                    </span>
                    <span className="font-medium">{doc.format}</span>
                  </div>

                  <Link
                    to={`/document-nucleus/product/${doc.id}`}
                    className={`inline-flex items-center justify-center gap-2 w-full text-sm font-bold py-2.5 px-4 rounded-xl transition-all ${meta.color} text-white hover:opacity-90`}
                  >
                    View document options
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List view
          <div className="space-y-3">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className={`w-12 h-12 ${meta.lightBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <FileText className={`w-5 h-5 ${meta.accent}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{doc.name}</h3>
                    {doc.popular && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Popular
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed truncate">{doc.description}</p>
                </div>

                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${complexityColor[doc.complexity]}`}>
                    {doc.complexity}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{doc.type}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> {doc.deliveryTime}
                  </span>
                  <Link
                    to={`/document-nucleus/brief?category=${categoryId}&product=${doc.id}`}
                    className={`inline-flex items-center gap-2 text-sm font-bold py-2 px-4 rounded-xl transition-all ${meta.color} text-white hover:opacity-90 whitespace-nowrap`}
                  >
                    Request <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {filtered.length > 0 && (
          <div className="mt-14 bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-slate-900">Can't find what you need?</span>
              </div>
              <p className="text-slate-500 text-sm">Get in touch and we'll scope a custom document to your exact requirements.</p>
            </div>
            <Link
              to={`/document-nucleus/brief?category=${categoryId}`}
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 whitespace-nowrap"
            >
              Create a mock DocuShare brief
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
