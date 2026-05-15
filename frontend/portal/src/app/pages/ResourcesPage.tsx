import { Link, useSearchParams } from "react-router";
import {
  resourceCategoryFilters,
  resourceTypeFilters,
  publicResources,
} from "../data/resources";
import { usePublicBackendContent } from "../hooks/usePublicBackendContent";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CTABanner } from "../components/CTABanner";
import { PageHero } from "../components/PageHero";
import { BookOpen, TrendingUp, Lightbulb, FileText, Video, Download, ArrowRight, Clock } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1628130421517-649b3ecaf514?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGtub3dsZWRnZSUyMGxpYnJhcnklMjBsZWFybmluZyUyMHJlc291cmNlc3xlbnwxfHx8fDE3NzY5MjMzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080";

const categories = [
  { icon: BookOpen, label: "Guides & Playbooks", count: 24, color: "bg-blue-100 text-blue-700" },
  { icon: TrendingUp, label: "Market Intelligence", count: 18, color: "bg-violet-100 text-violet-700" },
  { icon: Video, label: "Video Tutorials", count: 12, color: "bg-rose-100 text-rose-700" },
  { icon: FileText, label: "Templates", count: 36, color: "bg-amber-100 text-amber-700" },
  { icon: Download, label: "Downloads", count: 20, color: "bg-emerald-100 text-emerald-700" },
  { icon: Lightbulb, label: "Case Studies", count: 9, color: "bg-sky-100 text-sky-700" },
];

const safeResourceTypeFilters = Array.isArray(resourceTypeFilters) ? resourceTypeFilters : [];
const safeResourceCategoryFilters = Array.isArray(resourceCategoryFilters) ? resourceCategoryFilters : [];
const safeStaticResources = Array.isArray(publicResources) ? publicResources : [];

const resourceTypeLabels = Object.fromEntries(safeResourceTypeFilters.map((type) => [type.id, type.label]));
const resourceCategoryLabels = Object.fromEntries(safeResourceCategoryFilters.map((category) => [category.id, category.label]));

function safeResourceHref(href?: string) {
  if (!href || href.trim() === "" || href === "#" || href.includes("undefined") || href.includes("null")) {
    return "/resources";
  }
  return href;
}

export function ResourcesPage() {
  const [searchParams] = useSearchParams();
  const selectedType = searchParams.get("type") ?? "";
  const selectedCategory = searchParams.get("category") ?? "";
  const { resources, isLoading, errorMessage } = usePublicBackendContent();

  const safeResources = Array.isArray(resources) ? resources : [];
  const resourceCards = safeResources.length > 0 ? safeResources : safeStaticResources;
  const showingFallbackResources = safeResources.length === 0 && safeStaticResources.length > 0;

  const filteredResources = resourceCards.filter((resource) => {
    const matchesType = !selectedType || resource.type === selectedType;
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    return matchesType && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        title="Resources &"
        titleAccent="Knowledge Hub"
        subtitle="A curated library of guides, templates, case studies, and market intelligence to help you run a better business."
        badge="Resources"
        breadcrumb="Resources"
        image={heroImage}
        bullets={["Industry reports & guides", "Downloadable templates", "Webinar & training library"]}
        ctaPrimary={{ label: "Browse Resources", href: "#categories" }}
        ctaSecondary={{ label: "Talk to an Advisor", href: "/about/discovery-call" }}
        stat={{ value: "150+", label: "Resources Available", sublabel: "Updated regularly" }}
      />

      {(isLoading || errorMessage || showingFallbackResources) && (
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-4 text-sm text-slate-600 sm:px-6 lg:px-8">
            {isLoading ? <p>Loading the latest resources. You can keep browsing while content finishes loading.</p> : null}
            {!isLoading && errorMessage ? <p>Live resource content is unavailable right now. Showing curated launch-draft resources instead.</p> : null}
            {!isLoading && !errorMessage && showingFallbackResources ? <p>Showing curated launch-draft resources while the live library is being prepared.</p> : null}
          </div>
        </section>
      )}

      <section id="categories" className="scroll-mt-32 bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-slate-900">Browse Resources</h2>
            <p className="text-sm text-slate-500">Filter by resource type or business category using the links below.</p>
          </div>

          <div className="mb-8 space-y-4">
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Resource Types</div>
              <div className="flex flex-wrap gap-2">
                <Link to={selectedCategory ? `/resources?category=${selectedCategory}` : "/resources"} className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${!selectedType ? "bg-blue-700 text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>All Types</Link>
                {safeResourceTypeFilters.map((type) => (
                  <Link key={type.id} to={`/resources?type=${type.id}${selectedCategory ? `&category=${selectedCategory}` : ""}`} className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${selectedType === type.id ? "bg-blue-700 text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>{type.label}</Link>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Business Categories</div>
              <div className="flex flex-wrap gap-2">
                <Link to={selectedType ? `/resources?type=${selectedType}` : "/resources"} className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${!selectedCategory ? "bg-blue-700 text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>All Categories</Link>
                {safeResourceCategoryFilters.map((category) => (
                  <Link key={category.id} to={`/resources?category=${category.id}${selectedType ? `&type=${selectedType}` : ""}`} className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${selectedCategory === category.id ? "bg-blue-700 text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>{category.label}</Link>
                ))}
              </div>
            </div>

            {(selectedType || selectedCategory) && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm text-slate-700">
                  Showing resources{selectedType && <> of type <strong>{resourceTypeLabels[selectedType] || selectedType}</strong></>}{selectedCategory && <> in <strong>{resourceCategoryLabels[selectedCategory] || selectedCategory}</strong></>}.
                  {filteredResources.length === 0 && " No matching resources are currently listed."}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button key={cat.label} className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${cat.color}`}><Icon className="h-5 w-5" /></div>
                  <div className="mb-1 text-xs font-bold text-slate-800">{cat.label}</div>
                  <div className="text-xs font-semibold text-slate-400">{cat.count} items</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="mb-3 inline-block rounded-full bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-rose-700">Featured</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Featured Resources</h2>
            </div>
            <Link to="/contact?reason=resource-request" className="hidden items-center gap-2 text-sm font-bold text-blue-700 transition-colors hover:text-blue-800 sm:inline-flex">Request a resource <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {filteredResources.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-12 text-center shadow-sm">
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">Resources are being curated.</h3>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">We are preparing guides, templates, and support material for members and business owners.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/help" className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800">Visit Help Center</Link>
                <Link to="/contact" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100">Contact support</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">{resourceTypeLabels[resource.type] || resource.type || "Resource"}</div>
                  <h3 className="mb-3 flex-grow leading-snug font-bold text-slate-900">{resource.title}</h3>
                  <p className="mb-5 text-sm leading-relaxed text-slate-600">{resource.summary}</p>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-slate-400"><Clock className="h-3.5 w-3.5" /><span className="text-xs font-semibold">{resource.readTime || "Resource"}</span></div>
                    <Link to={safeResourceHref(resource.href)} className="inline-flex items-center gap-1 text-sm font-bold text-blue-700 transition-colors hover:text-blue-800">Access <ArrowRight className="h-3.5 w-3.5" /></Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100"><Lightbulb className="h-7 w-7 text-blue-700" /></div>
          <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Get Resources in Your Inbox</h2>
          <p className="mb-8 text-slate-600">Join the Phase 1 newsletter placeholder to preview how resource updates will be presented later.</p>
          <p className="mt-3 text-xs text-slate-400">Frontend-only placeholder. No email subscription or backend record is created.</p>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </div>
  );
}
