import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  Briefcase, LayoutDashboard, FileText, CalendarCheck,
  Tag, Settings, LogOut, Bell, Zap, MessageSquare,
  BookOpen, Menu, X,
} from "lucide-react";

import { PortalSessionProvider, usePortalSession } from "../../context/PortalSessionContext";

const navItems = [
  { label: "Dashboard",         icon: LayoutDashboard, href: "/portal/dashboard" },
  { label: "My Services",       icon: Zap,             href: "/portal/services" },
  { label: "Advisory Sessions", icon: CalendarCheck,   href: "/portal/sessions" },
  { label: "Documents",         icon: FileText,        href: "/portal/documents" },
  { label: "Partner Offers",    icon: Tag,             href: "/portal/offers" },
  { label: "Applications",      icon: Briefcase,       href: "/portal/apps" },
  { label: "Resources",         icon: BookOpen,        href: "/portal/resources" },
  { label: "Support",           icon: MessageSquare,   href: "/portal/support" },
];

function PortalLayoutShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = usePortalSession();

  const redirectTo = `/login?redirect-to=${encodeURIComponent(`${location.pathname}${location.search}`)}`;

  useEffect(() => {
    if (!session.loading && (session.unauthenticated || session.isGuest)) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo, session.isGuest, session.loading, session.unauthenticated]);

  async function handleSignOut() {
    await fetch("/api/method/logout", { credentials: "include" }).catch(() => undefined);
    navigate("/login", { replace: true });
  }

  const today = new Date().toLocaleDateString("en-AU", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  // Page title derived from the current path
  const activeItem = navItems.find((n) => location.pathname.startsWith(n.href));
  const pageTitle = activeItem?.label ?? "Portal";
  const membershipLabel =
    session.loading
      ? "Loading account"
      : session.membershipStatus
        ? session.membershipStatus.replace(/_/g, " ")
        : "Member account";

  if (session.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-4 w-36 rounded bg-slate-200" />
          <div className="mt-4 h-3 w-full rounded bg-slate-100" />
          <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  if (session.unauthenticated || session.isGuest) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-60 bg-white border-r border-slate-100
        flex flex-col
        transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-black text-slate-800 tracking-tight leading-tight">
              Remote Business<br />Partner
            </span>
          </Link>
          <button
            className="lg:hidden p-1 text-slate-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User pill */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-2.5">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-black text-white">{session.initials}</span>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate">{session.fullName}</div>
              <div className="text-[10px] text-blue-700 font-semibold capitalize truncate">{membershipLabel}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-slate-100 space-y-0.5">
          <Link
            to="/portal/settings"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              location.pathname.startsWith("/portal/settings")
                ? "bg-blue-700 text-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Settings className="w-4 h-4" /> Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900">{pageTitle}</h1>
              <p className="text-[10px] text-slate-400 hidden sm:block">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
              <Bell className="w-4 h-4" />
              {session.notificationCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-black text-white">
                  {session.notificationCount > 9 ? "9+" : session.notificationCount}
                </span>
              ) : null}
            </button>
            <Link
              to="/portal/settings"
              className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
            >
              <span className="text-xs font-black text-white">{session.initials}</span>
            </Link>
          </div>
        </header>

        {/* Routed page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function PortalLayout() {
  return (
    <PortalSessionProvider>
      <PortalLayoutShell />
    </PortalSessionProvider>
  );
}
