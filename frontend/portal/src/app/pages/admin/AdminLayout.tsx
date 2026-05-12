import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  Briefcase, LayoutDashboard, Users, Zap, AppWindowIcon,
  FileText, Tag, Wrench, Settings, LogOut,
  Menu, X, ChevronRight, ChevronDown, Bell,
  ShoppingBag, BookOpen, HelpCircle, Globe,
} from "lucide-react";
import { mockAdminAuthService } from "../../services/mock/auth.mockService";

// ── Nav data ──────────────────────────────────────────────────────────────────

interface NavChild { label: string; href: string; }
interface NavGroup  { key: string; label: string; icon: React.ElementType; children: NavChild[]; }

const NAV_GROUPS: NavGroup[] = [
  {
    key: "admin-dashboard", label: "Admin Dashboard", icon: LayoutDashboard,
    children: [
      { label: "Dashboard",       href: "/admin/dashboard" },
      { label: "To Do Tasks",     href: "/admin/tasks" },
      { label: "Discovery Calls", href: "/admin/discovery-calls" },
      { label: "Other",           href: "/admin/other" },
    ],
  },
  {
    key: "on-demand", label: "On-Demand Services", icon: Zap,
    children: [
      { label: "Dashboard",            href: "/admin/on-demand" },
      { label: "Business Advisor",     href: "/admin/on-demand/business-advisor" },
      { label: "Decision Desk",        href: "/admin/on-demand/decision-desk" },
      { label: "The Fixer",            href: "/admin/on-demand/the-fixer" },
      { label: "Document Nucleus",     href: "/admin/on-demand/document-nucleus" },
      { label: "Templates",            href: "/admin/on-demand/document-nucleus/templates" },
      { label: "Documentation Suites", href: "/admin/on-demand/document-nucleus/documentation-suites" },
      { label: "Toolkits",             href: "/admin/on-demand/document-nucleus/toolkits" },
      { label: "Process",              href: "/admin/on-demand/document-nucleus/process" },
      { label: "On-Demand Services",   href: "/admin/on-demand/services" },
    ],
  },
  {
    key: "managed-services", label: "Managed Services", icon: Briefcase,
    children: [
      { label: "Dashboard",            href: "/admin/managed-services" },
      { label: "Bid Management",       href: "/admin/managed-services/bid-management" },
      { label: "Real Estate",          href: "/admin/managed-services/real-estate" },
      { label: "HR Services",          href: "/admin/managed-services/hr-services" },
      { label: "Document Management",  href: "/admin/managed-services/document-management" },
      { label: "Business Sale Support",href: "/admin/managed-services/business-sale-support" },
      { label: "Custom Solutions",     href: "/admin/managed-services/custom-solutions" },
    ],
  },
  {
    key: "applications", label: "Applications", icon: AppWindowIcon,
    children: [
      { label: "Dashboard",            href: "/admin/applications" },
      { label: "Operations and Finance",href: "/admin/applications/operations-finance" },
      { label: "People and HR",        href: "/admin/applications/people-hr" },
      { label: "Sales and CRM",        href: "/admin/applications/sales-crm" },
      { label: "Documents",            href: "/admin/applications/documents" },
      { label: "Support Desk",         href: "/admin/applications/support-desk" },
      { label: "Learning",             href: "/admin/applications/learning" },
      { label: "Analytics",            href: "/admin/applications/analytics" },
      { label: "Payments and Billing", href: "/admin/applications/payments-billing" },
      { label: "Integrations",         href: "/admin/applications/integrations" },
    ],
  },
  {
    key: "operations", label: "Operations", icon: Wrench,
    children: [
      { label: "Dashboard",             href: "/admin/operations" },
      { label: "Business Finance",      href: "/admin/operations/business-finance" },
      { label: "Business Insurance",    href: "/admin/operations/business-insurance" },
      { label: "Superloop Connectivity",href: "/admin/operations/superloop-connectivity" },
      { label: "Calculators",           href: "/admin/operations/calculators" },
    ],
  },
  {
    key: "marketplace", label: "Marketplace", icon: ShoppingBag,
    children: [
      { label: "Dashboard",     href: "/admin/marketplace" },
      { label: "Marketplace",   href: "/admin/marketplace/listings" },
      { label: "Listings",      href: "/admin/marketplace/listings" },
      { label: "Buying Process",href: "/admin/marketplace/buying-process" },
      { label: "List With Us",  href: "/admin/marketplace/list-with-us" },
    ],
  },
  {
    key: "membership", label: "Membership", icon: Users,
    children: [
      { label: "Dashboard",     href: "/admin/membership" },
      { label: "Memberships",   href: "/admin/membership/memberships" },
      { label: "Members",       href: "/admin/membership/members" },
      { label: "Payments",      href: "/admin/membership/payments" },
      { label: "Portal Access", href: "/admin/membership/portal-access" },
    ],
  },
  {
    key: "offers", label: "Offers", icon: Tag,
    children: [
      { label: "Dashboard",       href: "/admin/offers" },
      { label: "All Offers",      href: "/admin/offers/all" },
      { label: "Offer Listings",  href: "/admin/offers/listings" },
      { label: "Offer Categories",href: "/admin/offers/categories" },
      { label: "Redemptions",     href: "/admin/offers/redemptions" },
    ],
  },
  {
    key: "resources", label: "Resources", icon: BookOpen,
    children: [
      { label: "Resource Dashboard", href: "/admin/resources" },
      { label: "Articles",           href: "/admin/resources/articles" },
      { label: "Guides",             href: "/admin/resources/guides" },
      { label: "Tools",              href: "/admin/resources/tools" },
      { label: "Downloads",          href: "/admin/resources/downloads" },
      { label: "Educational",        href: "/admin/resources/educational" },
    ],
  },
  {
    key: "help-center", label: "Help Center", icon: HelpCircle,
    children: [
      { label: "Dashboard",                 href: "/admin/help-center" },
      { label: "Frequently Asked Questions",href: "/admin/help-center/faqs" },
      { label: "Knowledge Base",            href: "/admin/help-center/knowledge-base" },
      { label: "Troubleshooting",           href: "/admin/help-center/troubleshooting" },
      { label: "Resources",                 href: "/admin/help-center/resources" },
      { label: "Support Center",            href: "/admin/help-center/support" },
    ],
  },
  {
    key: "site-content", label: "Site Content", icon: Globe,
    children: [
      { label: "Public Pages",   href: "/admin/site-content/pages" },
      { label: "Page Sections",  href: "/admin/site-content/sections" },
      { label: "Mega Menu",      href: "/admin/site-content/mega-menu" },
      { label: "SEO / Metadata", href: "/admin/site-content/seo" },
      { label: "Header / Footer",href: "/admin/site-content/header-footer" },
      { label: "Content Status", href: "/admin/site-content/status" },
    ],
  },
  {
    key: "settings", label: "Settings", icon: Settings,
    children: [
      { label: "Platform Settings",    href: "/admin/settings/platform" },
      { label: "Admin Users",          href: "/admin/settings/admin-users" },
      { label: "Integration Settings", href: "/admin/settings/integrations" },
      { label: "Firebase Readiness",   href: "/admin/settings/firebase-readiness" },
      { label: "Access Control",       href: "/admin/settings/access-control" },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function isChildActive(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

function getActiveGroup(pathname: string): string | null {
  return NAV_GROUPS.find(g => g.children.some(c => isChildActive(c.href, pathname)))?.key ?? null;
}

// ── Layout ────────────────────────────────────────────────────────────────────

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialise open groups with whichever group owns the current route
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const active = getActiveGroup(window.location.pathname);
    return active ? new Set([active]) : new Set(["admin-dashboard"]);
  });

  // Auth guard
  useEffect(() => {
    if (localStorage.getItem("rbp_admin_auth") !== "true") {
      navigate("/admin/signin", { replace: true });
    }
  }, [navigate]);

  // Auto-expand the group that owns the new route whenever the path changes
  useEffect(() => {
    const active = getActiveGroup(location.pathname);
    if (active) {
      setOpenGroups(prev => {
        if (prev.has(active)) return prev;
        return new Set([...prev, active]);
      });
    }
  }, [location.pathname]);

  function toggleGroup(key: string) {
    setOpenGroups(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  async function handleSignOut() {
    await mockAdminAuthService.signOut();
    navigate("/admin/signin");
  }

  // Derive breadcrumb label for the top bar
  const activeGroupLabel = NAV_GROUPS.find(g =>
    g.children.some(c => isChildActive(c.href, location.pathname))
  )?.label ?? "Admin";
  const activeChildLabel = NAV_GROUPS
    .flatMap(g => g.children)
    .find(c => isChildActive(c.href, location.pathname))?.label ?? null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-800 flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 bg-blue-700 rounded-xl flex items-center justify-center">
          <Briefcase className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-white font-extrabold text-xs tracking-tight leading-tight">RBP Admin</div>
          <div className="text-slate-500 text-[10px]">Management Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
        {NAV_GROUPS.map((group) => {
          const Icon         = group.icon;
          const isOpen       = openGroups.has(group.key);
          const groupActive  = group.children.some(c => isChildActive(c.href, location.pathname));

          return (
            <div key={group.key}>
              {/* Group header button */}
              <button
                onClick={() => toggleGroup(group.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  groupActive
                    ? "text-white bg-slate-800"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{group.label}</span>
                <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Child links */}
              {isOpen && (
                <div className="mt-0.5 mb-1 space-y-0.5">
                  {group.children.map((child) => {
                    const childActive = isChildActive(child.href, location.pathname);
                    return (
                      <Link
                        key={child.label + child.href}
                        to={child.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-2 pl-9 pr-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          childActive
                            ? "bg-blue-700 text-white"
                            : "text-slate-500 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        <span className="flex-1 truncate">{child.label}</span>
                        {childActive && <ChevronRight className="w-3 h-3 flex-shrink-0" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Admin info + sign out — pinned bottom */}
      <div className="px-2 py-4 border-t border-slate-800 flex-shrink-0 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-blue-700 rounded-xl flex items-center justify-center">
            <span className="text-xs font-black text-white">AD</span>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Admin User</div>
            <div className="text-[10px] text-slate-500 truncate">Super Admin</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-slate-950 border-r border-slate-800 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-56 bg-slate-950 border-r border-slate-800 flex flex-col lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">
                {activeGroupLabel}
              </span>
              {activeChildLabel && activeChildLabel !== activeGroupLabel && (
                <>
                  <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-600 truncate">{activeChildLabel}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              View Site
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
