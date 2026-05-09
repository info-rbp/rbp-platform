import { Link, useSearchParams } from "react-router";
import {
  resourceCategoryFilters,
  resourceTypeFilters,
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

const featured = [
  {
    tag: "Guide",
    title: "The Small Business Operations Playbook",
    desc: "A comprehensive 40-page guide to building scalable operational systems for businesses with 2–50 employees.",
    readTime: "20 min read",
    icon: BookOpen,
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    tag: "Template",
    title: "90-Day Business Planning Template",
    desc: "A structured template to plan, track, and execute your business goals over a focused 90-day period.",
    readTime: "Free download",
    icon: FileText,
    tagColor: "bg-amber-100 text-amber-700",
  },
  {
    tag: "Case Study",
    title: "How a 5-Person Agency Grew Revenue by 3x",
    desc: "A detailed breakdown of how one of our clients restructured their operations and tripled revenue in 18 months.",
    readTime: "12 min read",
    icon: TrendingUp,
    tagColor: "bg-emerald-100 text-emerald-700",
  },
  {
    tag: "Video",
    title: "AI Tools for Small Business in 2024",
    desc: "Watch our Lead Consultant walk through the most impactful AI tools for small business owners right now.",
    readTime: "28 min watch",
    icon: Video,
    tagColor: "bg-rose-100 text-rose-700",
  },
  {
    tag: "Guide",
    title: "HR Essentials: Your First Employee Handbook",
    desc: "Everything you need to know about creating a compliant, culture-aligned employee handbook from scratch.",
    readTime: "15 min read",
    icon: BookOpen,
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    tag: "Market Intelligence",
    title: "UK SME Funding Landscape 2024",
    desc: "An overview of the current funding options available to UK small businesses, including grants and alternative finance.",
    readTime: "10 min read",
    icon: Lightbulb,
    tagColor: "bg-violet-100 text-violet-700",
  },
];


const resourceTypeLabels = Object.fromEntries(
  resourceTypeFilters.map((type) => [type.id, type.label])
);

const resourceCategoryLabels = Object.fromEntries(
  resourceCategoryFilters.map((category) => [category.id, category.label])
);

export function ResourcesPage() {
  const [searchParams] = useSearchParams();
  const selectedType = searchParams.get("type") ?? "";
  const selectedCategory = searchParams.get("category") ?? "";
  const { resources } = usePublicBackendContent();

  const filteredResources = resources.filter((resource) => {
    const matchesType = !selectedType || resource.type === selectedType;
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    return matchesType && matchesCategory;
  });

  return (
    <div className="bg-white min-h-screen">
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
        ctaSecondary={{ label: "Talk to an Advisor", href: "/contact?reason=discovery-call" }}
        stat={{ value: "150+", label: "Resources Available", sublabel: "Updated regularly" }}
      />

      {/* Categories */}
      <section id="categories" className="py-16 bg-slate-50 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Browse Resources</h2>
            <p className="text-slate-500 text-sm">
              Filter by resource type or business category using the links below.
            </p>
          </div>

          <div className="mb-8 space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Resource Types</div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={selectedCategory ? `/resources?category=${selectedCategory}` : "/resources"}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                    !selectedType ? "bg-blue-700 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  All Types
                </Link>
                {resourceTypeFilters.map((type) => (
                  <Link
                    key={type.id}
                    to={`/resources?type=${type.id}${selectedCategory ? `&category=${selectedCategory}` : ""}`}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                      selectedType === type.id ? "bg-blue-700 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {type.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Business Categories</div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={selectedType ? `/resources?type=${selectedType}` : "/resources"}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                    !selectedCategory ? "bg-blue-700 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  All Categories
                </Link>
                {resourceCategoryFilters.map((category) => (
                  <Link
                    key={category.id}
                    to={`/resources?category=${category.id}${selectedType ? `&type=${selectedType}` : ""}`}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                      selectedCategory === category.id ? "bg-blue-700 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>

            {(selectedType || selectedCategory) && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <p className="text-sm text-slate-700">
                  Showing resources
                  {selectedType && <> of type <strong>{resourceTypeLabels[selectedType] || selectedType}</strong></>}
                  {selectedCategory && <> in <strong>{resourceCategoryLabels[selectedCategory] || selectedCategory}</strong></>}
                  .
                  {filteredResources.length === 0 && " No matching resources are currently listed."}
                </p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.label}
                  className="bg-white border border-slate-100 rounded-2xl p-5 text-center hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-800 mb-1">{cat.label}</div>
                  <div className="text-xs text-slate-400 font-semibold">{cat.count} items</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block text-xs font-bold text-rose-700 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full mb-3">
                Featured
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Featured Resources</h2>
            </div>
            <Link
              to="/contact?reason=resource-request"
              className="hidden sm:inline-flex items-center gap-2 text-blue-700 font-bold text-sm hover:text-blue-800 transition-colors"
            >
              Request a resource <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg mb-5 w-fit text-xs font-bold bg-blue-100 text-blue-700">
                  {resourceTypeLabels[res.type] || res.type}
                </div>
                <h3 className="font-bold text-slate-900 mb-3 leading-snug flex-grow">{res.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">{res.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">{res.readTime || "Resource"}</span>
                  </div>
                  <Link
                    to={res.href}
                    className="text-blue-700 hover:text-blue-800 text-sm font-bold inline-flex items-center gap-1 transition-colors"
                  >
                    Access <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Lightbulb className="w-7 h-7 text-blue-700" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Get Resources in Your Inbox
          </h2>
          <p className="text-slate-600 mb-8">
            Join the Phase 1 newsletter placeholder to preview how resource updates will be presented later.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl transition-all whitespace-nowrap">
              Preview Subscribe
            </button>
          </div>
          <p className="text-slate-400 text-xs mt-3">Frontend-only placeholder. No email subscription or backend record is created.</p>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </div>
  );
}
