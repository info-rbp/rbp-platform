import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import {
  Menu,
  X,
  Briefcase,
  ChevronDown,
  Search,
  LogIn,
  UserPlus,
  ArrowRight,
} from "lucide-react";

import {
  filterPublicNavigationForRuntime,
  publicNavigation,
  type MegaConfig,
} from "../data/publicNavigation";
import { useRuntimeConfig } from "../hooks/useRuntimeConfig";
import { authApi } from "../services/api/authApi";
import type { PortalCustomerAuthUser } from "../types/portal";

function normalisePath(href: string) {
  return href.split("?")[0].split("#")[0];
}

function menuLinks(config: MegaConfig) {
  return config.groups?.flatMap((group) => group.links) ?? config.links;
}

export type NavbarAccountCtaState = {
  loading: boolean;
  user: PortalCustomerAuthUser | null;
};

export function resolveNavbarAccountCtas(state: NavbarAccountCtaState) {
  if (state.loading) {
    return {
      kind: "loading" as const,
      primaryLabel: "Checking account...",
      primaryHref: undefined,
      secondaryLabel: undefined,
      secondaryHref: undefined,
    };
  }

  if (state.user) {
    return {
      kind: "authenticated" as const,
      primaryLabel: "Go to Account",
      primaryHref: "/portal/dashboard",
      secondaryLabel: "Portal Dashboard",
      secondaryHref: "/portal/dashboard",
    };
  }

  return {
    kind: "guest" as const,
    primaryLabel: "Sign In",
    primaryHref: "/sign-in",
    secondaryLabel: "Join Now",
    secondaryHref: "/membership/sign-up-now",
  };
}

function MegaMenuPanel({ config, onClose }: { config: MegaConfig; onClose: () => void }) {
  return (
    <div className="absolute left-0 right-0 top-full z-50 px-4">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-b-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="grid lg:grid-cols-[300px_1fr]">
          <aside className="border-b border-slate-200 bg-slate-50 px-8 py-7 lg:border-b-0 lg:border-r">
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-950">
              {config.label}
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {config.description}
            </p>
          </aside>

          <div className="p-6 lg:p-7">
            {config.groups ? (
              <div className="grid gap-6 xl:grid-cols-4">
                {config.groups.map((group) => (
                  <div key={`${config.key}-${group.heading}`}>
                    <h3 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">
                      {group.heading}
                    </h3>
                    <div className="space-y-2">
                      {group.links.map((link) => (
                        <Link
                          key={`${config.key}-${link.href}-${link.label}`}
                          to={link.href}
                          onClick={onClose}
                          className="group flex min-h-[46px] items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
                        >
                          <span className="block text-sm font-bold leading-tight text-slate-900 group-hover:text-blue-700">
                            {link.label}
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-700" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {config.links.map((link) => (
                  <Link
                    key={`${config.key}-${link.href}-${link.label}`}
                    to={link.href}
                    onClick={onClose}
                    className="group flex min-h-[64px] items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
                  >
                    <span>
                      <span className="block text-sm font-bold leading-tight text-slate-900 group-hover:text-blue-700">
                        {link.label}
                      </span>
                      {link.desc && (
                        <span className="mt-1 block text-xs leading-snug text-slate-500">
                          {link.desc}
                        </span>
                      )}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-700" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Close menu"
        className="fixed inset-0 -z-10 cursor-default"
        onClick={onClose}
      />
    </div>
  );
}

function MobileSection({
  config,
  isOpen,
  onToggle,
  onClose,
}: {
  config: MegaConfig;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="border-t border-slate-100">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
      >
        {config.label}
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="bg-slate-50 pb-2">
          <p className="px-6 pt-3 pb-2 text-xs leading-5 text-slate-500">
            {config.description}
          </p>

          {config.groups ? (
            config.groups.map((group) => (
              <div key={`${config.key}-${group.heading}`}>
                <p className="px-6 pb-1 pt-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                  {group.heading}
                </p>
                {group.links.map((link) => (
                  <Link
                    key={`${config.key}-${link.href}-${link.label}`}
                    to={link.href}
                    onClick={onClose}
                    className="flex items-center justify-between px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    {link.label}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                ))}
              </div>
            ))
          ) : (
            config.links.map((link) => (
              <Link
                key={`${config.key}-${link.href}-${link.label}`}
                to={link.href}
                onClick={onClose}
                className="flex items-center justify-between px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              >
                {link.label}
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { config } = useRuntimeConfig();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<PortalCustomerAuthUser | null>(null);
  const [accountLoading, setAccountLoading] = useState(true);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadCurrentUser() {
      setAccountLoading(true);
      const response = await authApi.getCurrentUser();
      if (!active) {
        return;
      }

      setCurrentUser(response.ok && response.data ? response.data : null);
      setAccountLoading(false);
    }

    loadCurrentUser();
    window.addEventListener("rbp-auth-changed", loadCurrentUser);

    return () => {
      active = false;
      window.removeEventListener("rbp-auth-changed", loadCurrentUser);
    };
  }, []);

  const menus = filterPublicNavigationForRuntime(publicNavigation, config.features);
  const activeMenu = menus.find((menu) => menu.key === openDropdown) ?? null;
  const accountCtas = resolveNavbarAccountCtas({
    loading: accountLoading,
    user: currentUser,
  });

  function toggleDropdown(key: string) {
    setOpenDropdown((prev) => (prev === key ? null : key));
  }

  function closeMobile() {
    setMobileOpen(false);
    setOpenMobileAccordion(null);
  }

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-white"
      }`}
    >
      <div className="border-b border-slate-100 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-6 h-6 bg-blue-700 rounded-md flex items-center justify-center">
                <Briefcase className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-black text-slate-800 tracking-tight">
                Remote Business Partner
              </span>
              <span className="sm:hidden text-sm font-black text-slate-800">RBP</span>
            </Link>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
              {accountCtas.kind === "loading" ? (
                <span className="hidden sm:inline-flex items-center text-xs font-semibold text-slate-500 px-3 py-1.5">
                  {accountCtas.primaryLabel}
                </span>
              ) : null}
              {accountCtas.kind === "authenticated" ? (
                <Link
                  to={accountCtas.primaryHref || "/portal/dashboard"}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-lg transition-all ml-1"
                >
                  {accountCtas.primaryLabel}
                </Link>
              ) : null}
              {accountCtas.kind === "guest" ? (
                <>
                  <Link
                    to={accountCtas.primaryHref || "/sign-in"}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-white transition-all ml-1"
                  >
                    <LogIn className="w-3 h-3" /> {accountCtas.primaryLabel}
                  </Link>
                  <Link
                    to={accountCtas.secondaryHref || "/membership/sign-up-now"}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-lg transition-all ml-1"
                  >
                    <UserPlus className="w-3 h-3" /> {accountCtas.secondaryLabel}
                  </Link>
                </>
              ) : null}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors ml-1"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="border-b border-slate-100 bg-white px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search services, applications, resources..."
              className="flex-1 text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
            />
            <button type="button" onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="hidden lg:block bg-white border-b border-slate-100 relative">
        <div className="w-full px-3 sm:px-4 lg:px-6 2xl:px-8">
          <nav className="h-12 overflow-x-auto" aria-label="Primary navigation">
            <div className="mx-auto flex h-12 min-w-max items-center justify-center gap-0.5">
              {menus.map((menu) => {
                const isOpen = openDropdown === menu.key;
                const isActive = menuLinks(menu).some((link) => {
                  const path = normalisePath(link.href);
                  return path !== "/" && location.pathname.startsWith(path);
                });

                return (
                  <button
                    type="button"
                    key={menu.key}
                    onClick={() => toggleDropdown(menu.key)}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    className={`flex shrink-0 items-center gap-1 px-2 py-2 xl:px-2.5 rounded-lg text-[12px] xl:text-[13px] font-semibold transition-all whitespace-nowrap ${
                      isActive || isOpen
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span>{menu.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {activeMenu && (
          <MegaMenuPanel
            config={activeMenu}
            onClose={() => setOpenDropdown(null)}
          />
        )}
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl max-h-[85vh] overflow-y-auto">
          <Link
            to="/"
            onClick={closeMobile}
            className={`flex items-center px-5 py-3.5 text-sm font-semibold transition-colors border-b border-slate-100 ${
              location.pathname === "/" ? "text-blue-700 bg-blue-50" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            Home
          </Link>

          {menus.map((menu) => (
            <MobileSection
              key={menu.key}
              config={menu}
              isOpen={openMobileAccordion === menu.key}
              onToggle={() => setOpenMobileAccordion((prev) => (prev === menu.key ? null : menu.key))}
              onClose={closeMobile}
            />
          ))}

          <div className="border-t border-slate-100 px-4 py-4 space-y-2">
            {accountCtas.kind === "loading" ? (
              <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-500">
                {accountCtas.primaryLabel}
              </div>
            ) : null}
            {accountCtas.kind === "authenticated" ? (
              <Link
                to={accountCtas.primaryHref || "/portal/dashboard"}
                onClick={closeMobile}
                className="flex items-center justify-center gap-2 py-3 text-sm font-bold bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors"
              >
                {accountCtas.secondaryLabel}
              </Link>
            ) : null}
            {accountCtas.kind === "guest" ? (
              <>
                <Link
                  to={accountCtas.primaryHref || "/sign-in"}
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 py-3 text-sm font-semibold border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <LogIn className="w-4 h-4" /> {accountCtas.primaryLabel}
                </Link>
                <Link
                  to={accountCtas.secondaryHref || "/membership/sign-up-now"}
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 py-3 text-sm font-bold bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors"
                >
                  <UserPlus className="w-4 h-4" /> {accountCtas.secondaryLabel}
                </Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
