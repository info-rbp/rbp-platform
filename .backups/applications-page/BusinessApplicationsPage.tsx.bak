import { useState } from "react";
import { Link } from "react-router";
import { applicationCategories } from "../data/applications";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ArrowRight, Search, Layers, CheckCircle, X, ChevronRight } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGFwcGxpY2F0aW9ucyUyMGRhc2hib2FyZCUyMGJ1c2luZXNzJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3Nzc1NDY4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080";

type Status = "Available" | "Coming Soon" | "Setup Required";

interface App {
  id: string; name: string; brandedName: string; category: string;
  desc: string; problem: string; functions: string[]; status: Status;
}

const categories = [
  "All", "Business Management", "CRM & Sales", "Finance & Billing",
  "HR & People", "Support & Service", "Website & Digital", "AI & Automation", "Specialist",
];

const apps: App[] = [
  { id: "erpnext", name: "ERPNext", brandedName: "RBP BusinessCore", category: "Business Management", status: "Available", desc: "A complete open-source ERP covering accounting, inventory, manufacturing, HR, and more.", problem: "Disconnected business systems wasting time and causing errors.", functions: ["Accounting & finance", "Inventory management", "Project management", "Manufacturing", "Multi-currency"] },
  { id: "hrms", name: "HRMS", brandedName: "RBP PeopleDesk", category: "HR & People", status: "Available", desc: "A modern HR management system covering employees, payroll, leave, and performance.", problem: "Manual HR admin consuming management time.", functions: ["Employee records", "Payroll processing", "Leave management", "Performance reviews", "Expense claims"] },
  { id: "crm", name: "Frappe CRM", brandedName: "RBP SalesDesk", category: "CRM & Sales", status: "Available", desc: "A clean, modern CRM for managing leads, pipelines, contacts, and deals.", problem: "Losing track of prospects and failing to follow up consistently.", functions: ["Lead & deal management", "Pipeline views", "Activity tracking", "Email integration", "Reporting"] },
  { id: "helpdesk", name: "Helpdesk", brandedName: "RBP SupportDesk", category: "Support & Service", status: "Available", desc: "A customer support and ticketing system with SLA management and knowledge base.", problem: "Customer issues getting lost and response times suffering.", functions: ["Ticket management", "SLA tracking", "Knowledge base", "Customer portal", "Reporting"] },
  { id: "lms", name: "LMS", brandedName: "RBP LearnHub", category: "HR & People", status: "Available", desc: "A learning management system for delivering internal training and external courses.", problem: "No structured way to onboard staff or deliver training.", functions: ["Course creation", "Assessments & quizzes", "Progress tracking", "Certificates", "Student portal"] },
  { id: "wiki", name: "Wiki", brandedName: "RBP KnowledgeBase", category: "Support & Service", status: "Available", desc: "An internal knowledge base and documentation tool for your business.", problem: "Business knowledge living in emails and people's heads.", functions: ["Page creation & editing", "Version history", "Team permissions", "Search", "Nested structure"] },
  { id: "drive", name: "Drive", brandedName: "RBP CloudDrive", category: "Business Management", status: "Available", desc: "Secure cloud file storage and sharing for your team and clients.", problem: "Scattered files across multiple personal drives and email attachments.", functions: ["File storage & sharing", "Team folders", "Access permissions", "Document preview", "Activity log"] },
  { id: "builder", name: "Builder", brandedName: "RBP SiteBuilder", category: "Website & Digital", status: "Available", desc: "A no-code website builder for creating professional business websites.", problem: "Expensive website builds with no ability to make your own changes.", functions: ["Drag-and-drop builder", "Templates", "Mobile responsive", "SEO tools", "Publishing"] },
  { id: "webshop", name: "Webshop", brandedName: "RBP ShopFront", category: "Finance & Billing", status: "Setup Required", desc: "An ecommerce storefront integrated with ERPNext inventory and billing.", problem: "Disconnected online shop and backend stock/order management.", functions: ["Product catalogue", "Cart & checkout", "Order management", "ERPNext integration", "Customer accounts"] },
  { id: "payments", name: "Payments", brandedName: "RBP PayHub", category: "Finance & Billing", status: "Available", desc: "Payment processing and gateway integration for online and in-person payments.", problem: "Slow, manual invoicing and payment collection.", functions: ["Payment gateway integration", "Online payment links", "Recurring billing", "Refund management", "Payment reporting"] },
  { id: "mail", name: "Mail", brandedName: "RBP BusinessMail", category: "Business Management", status: "Coming Soon", desc: "Business email hosting and management platform.", problem: "Unprofessional email addresses and poor email management.", functions: ["Custom domain email", "Inbox management", "Team shared inboxes", "Email aliases", "Mobile access"] },
  { id: "newsletter", name: "Newsletter", brandedName: "RBP BroadcastHub", category: "Website & Digital", status: "Available", desc: "Email newsletter and marketing broadcast tool.", problem: "No consistent way to communicate with customers and subscribers.", functions: ["Newsletter creation", "Subscriber management", "Send scheduling", "Open & click tracking", "Unsubscribe management"] },
  { id: "gameplan", name: "Gameplan", brandedName: "RBP ProjectSpace", category: "Business Management", status: "Available", desc: "A project and goal management tool for teams.", problem: "Projects drifting without clear ownership, priorities, or visibility.", functions: ["Goal & OKR tracking", "Project boards", "Task management", "Team workspace", "Progress reporting"] },
  { id: "meet", name: "Meet", brandedName: "RBP MeetingRoom", category: "Business Management", status: "Coming Soon", desc: "Secure video conferencing and virtual meeting platform.", problem: "Reliance on third-party video platforms with data privacy concerns.", functions: ["Video meetings", "Screen sharing", "Recording", "Meeting rooms", "Calendar integration"] },
  { id: "telephony", name: "Telephony", brandedName: "RBP VoiceDesk", category: "Support & Service", status: "Coming Soon", desc: "Business telephony and call management integrated with CRM.", problem: "Call management disconnected from customer records.", functions: ["Inbound call routing", "CRM integration", "Call recording", "IVR setup", "Reporting"] },
  { id: "whatsapp", name: "Frappe WhatsApp", brandedName: "RBP WhatsApp Connect", category: "CRM & Sales", status: "Setup Required", desc: "WhatsApp Business API integration for customer messaging and CRM.", problem: "Customer conversations happening outside your business systems.", functions: ["WhatsApp Business API", "CRM integration", "Template messages", "Conversation tracking", "Team inboxes"] },
  { id: "openai", name: "Frappe OpenAI", brandedName: "RBP AIAssist", category: "AI & Automation", status: "Available", desc: "OpenAI integration for AI-powered features across Frappe applications.", problem: "Time-consuming manual tasks that AI could handle.", functions: ["AI text generation", "Document summarisation", "Email drafting", "Custom AI workflows", "Integration hooks"] },
  { id: "rbpapp", name: "RBP App", brandedName: "RBP Platform App", category: "Business Management", status: "Available", desc: "The core Remote Business Partner platform application.", problem: "Managing your RBP membership, services, and platform access.", functions: ["Membership management", "Service requests", "Document access", "Advisory booking", "Platform navigation"] },
  { id: "education", name: "Education", brandedName: "RBP EduManager", category: "Specialist", status: "Available", desc: "Education management system for schools, training providers, and learning businesses.", problem: "Complex student, curriculum, and assessment management.", functions: ["Student management", "Curriculum planning", "Assessment tools", "Attendance tracking", "Parent portal"] },
  { id: "lending", name: "Lending", brandedName: "RBP LendingDesk", category: "Finance & Billing", status: "Setup Required", desc: "Loan origination and lending management application.", problem: "Manual loan management and repayment tracking.", functions: ["Loan origination", "Repayment schedules", "Interest calculation", "Borrower management", "Reporting"] },
  { id: "assets", name: "Assets", brandedName: "RBP AssetTracker", category: "Business Management", status: "Available", desc: "Business asset management and depreciation tracking.", problem: "No clear view of business assets, values, or depreciation.", functions: ["Asset register", "Depreciation tracking", "Maintenance schedules", "Asset reports", "ERPNext integration"] },
  { id: "slides", name: "Slides", brandedName: "RBP PresentationHub", category: "Website & Digital", status: "Coming Soon", desc: "Presentation creation tool integrated with business data.", problem: "Time-consuming presentation creation from disparate data sources.", functions: ["Slide creation", "Templates", "Data integration", "Sharing & export", "Collaboration"] },
];

const statusColors: Record<Status, string> = {
  Available: "bg-emerald-100 text-emerald-700",
  "Coming Soon": "bg-amber-100 text-amber-700",
  "Setup Required": "bg-blue-100 text-blue-700",
};

const applicationAnchorSections = applicationCategories;

export function BusinessApplicationsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = apps.filter((a) => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.brandedName.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.15)_0%,_transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/20 border border-violet-500/30 text-violet-300 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <Layers className="w-3 h-3" /> Business Applications
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                Business software, <span className="text-violet-400">set up for you.</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                White-labelled Frappe-powered applications — from CRM and ERP to HR, helpdesk, and AI tools. We set them up, brand them, and support them for your business.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["30+ applications", "White-labelled", "Setup & support included"].map((b) => (
                  <div key={b} className="flex items-center gap-1.5 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" /> {b}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/contact?reason=application-setup" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-7 py-4 rounded-xl transition-all shadow-lg hover:-translate-y-0.5">
                  Request a Setup <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/marketplace" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-4 rounded-xl transition-all">
                  View Setup Packages
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border border-white/10">
                <img src={heroImage} alt="Business applications" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 rounded-2xl p-4 shadow-xl">
                <div className="text-2xl font-extrabold">30+</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Applications</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search + filter */}
      <div className="sticky top-[84px] z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search applications…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 flex-nowrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                    activeCategory === cat ? "bg-violet-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Application anchor sections */}
      <section id="overview" className="py-16 bg-slate-50 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-violet-700 uppercase tracking-widest bg-white px-3 py-1 rounded-full mb-4">
              Application Areas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Explore application categories
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              These sections support the public navigation links and provide clear destinations for each application area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {applicationAnchorSections.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm scroll-mt-32"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">{item.summary}</p>
                <Link
                  to={`/contact?reason=${item.id}`}
                  className="inline-flex items-center gap-2 text-violet-700 font-bold text-sm hover:text-violet-800"
                >
                  Discuss {item.title} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Layers className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <div className="text-slate-500 font-semibold">No applications match your search.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((app) => (
                <div key={app.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-violet-200 transition-all hover:-translate-y-0.5 flex flex-col group">
                  <div className="h-1 w-full bg-gradient-to-r from-violet-600 to-blue-600" />
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-extrabold text-slate-900 group-hover:text-violet-700 transition-colors">{app.brandedName}</div>
                        <div className="text-xs text-slate-400 font-medium">Powered by {app.name}</div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ml-2 ${statusColors[app.status]}`}>{app.status}</span>
                    </div>
                    <div className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full inline-block w-fit mb-3">{app.category}</div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3 flex-1">{app.desc}</p>
                    <div className="bg-slate-50 rounded-xl p-3 mb-4">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Solves</div>
                      <p className="text-xs text-slate-600 leading-relaxed">{app.problem}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {app.functions.slice(0, 3).map((f) => (
                        <span key={f} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{f}</span>
                      ))}
                      {app.functions.length > 3 && (
                        <span className="text-xs text-slate-400 px-2 py-0.5">+{app.functions.length - 3} more</span>
                      )}
                    </div>
                    <Link
                      to="/contact?reason=application-setup"
                      className="inline-flex items-center justify-center gap-2 w-full bg-violet-700 hover:bg-violet-800 text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-all"
                    >
                      {app.status === "Available" ? "Request Setup" : app.status === "Setup Required" ? "Enquire" : "Join Waitlist"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Not sure which application is right for you?</h2>
          <p className="text-slate-600 mb-6">Speak to our team and we'll help you identify the right tools for your business needs and budget.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contact?reason=application-setup" className="inline-flex items-center gap-2 bg-violet-700 hover:bg-violet-800 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg hover:-translate-y-0.5">
              Talk to Our Team <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/marketplace" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-7 py-3.5 rounded-xl transition-all hover:bg-white">
              View Setup Packages <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
