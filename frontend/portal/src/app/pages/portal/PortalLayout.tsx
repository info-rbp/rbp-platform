import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  Bell,
  Briefcase,
  ChevronRight,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";

import { mockAuthService } from "../../services/mock/auth.mockService";
import {
  getPortalPageTitle,
  isPortalPathActive,
  portalNavigationSections,
} from "./portalNavigationModel";

const USER = {
  name: "Remote Business Partner",
  email: "info@remotebusinesspartner.com.au",
  plan: "Growth Partner Programme",
  initials: "RB",
};

export function PortalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleSignOut() {
    await mockAuthService.signOut();
    navigate("/signin");
  }

  const today = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pageTitle = getPortalPageTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-slate-100 bg-white transition-transform duration-200 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-700">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs font-black leading-tight tracking-tight text-slate-800">
              Remote Business
              <br />
              Partner
            </span>
          </Link>
          <button
            className="p-1 text-slate-400 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700">
              <span className="text-xs font-black text-white">{USER.initials}</span>
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-bold text-slate-800">{USER.name}</div>
              <div className="truncate text-[10px] font-semibold text-blue-700">{USER.plan}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {portalNavigationSections.map((section) => {
            const sectionActive =
              isPortalPathActive(location.pathname, section.href) ||
              section.children?.some((child) => isPortalPathActive(location.pathname, child.href));
            const SectionIcon = section.icon;

            if (!section.children?.length && section.href) {
              return (
                <Link
                  key={section.id}
                  to={section.href}
                  onClick={() => setSidebarOpen(false)}
                  className={[
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors",
                    sectionActive
                      ? "bg-blue-700 text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  <SectionIcon className="h-4 w-4 flex-shrink-0" />
                  {section.label}
                </Link>
              );
            }

            return (
              <div key={section.id} className="space-y-1.5">
                <div
                  className={[
                    "flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-[0.16em]",
                    sectionActive ? "bg-blue-50 text-blue-700" : "text-slate-500",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2">
                    <SectionIcon className="h-4 w-4" />
                    {section.label}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1 border-l border-slate-100 pl-3">
                  {section.children?.map((child) => {
                    const childActive = isPortalPathActive(location.pathname, child.href);
                    const ChildIcon = child.icon;
                    return (
                      <Link
                        key={child.id}
                        to={child.href}
                        onClick={() => setSidebarOpen(false)}
                        className={[
                          "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors",
                          childActive
                            ? "bg-blue-700 text-white"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        ].join(" ")}
                      >
                        <ChildIcon className="h-4 w-4 flex-shrink-0" />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="space-y-0.5 border-t border-slate-100 px-3 py-4">
          <Link
            to="/portal/settings"
            onClick={() => setSidebarOpen(false)}
            className={[
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors",
              isPortalPathActive(location.pathname, "/portal/settings")
                ? "bg-blue-700 text-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            ].join(" ")}
          >
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900">{pageTitle}</h1>
              <p className="hidden text-[10px] text-slate-400 sm:block">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-50">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
            </button>
            <Link
              to="/portal/settings"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-700 transition-colors hover:bg-blue-800"
            >
              <span className="text-xs font-black text-white">{USER.initials}</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
