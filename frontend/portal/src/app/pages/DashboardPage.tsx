import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Briefcase, LayoutDashboard, FileText, CalendarCheck,
  Tag, Users, Settings, LogOut, Bell, ChevronRight,
  TrendingUp, Clock, CheckCircle, ArrowRight, Star,
  MessageSquare, BookOpen, Zap, Menu, X,
} from "lucide-react";

const USER = {
  name: "Remote Business Partner",
  email: "info@remotebusinesspartner.com.au",
  plan: "Growth Partner Programme",
  initials: "RB",
};

const stats = [
  { label: "Active Services", value: "3", sub: "2 in progress", icon: Zap, color: "bg-blue-50 text-blue-700", border: "border-blue-100" },
  { label: "Sessions This Month", value: "4", sub: "Next: 12 May", icon: CalendarCheck, color: "bg-violet-50 text-violet-700", border: "border-violet-100" },
  { label: "Documents", value: "18", sub: "3 awaiting review", icon: FileText, color: "bg-emerald-50 text-emerald-700", border: "border-emerald-100" },
  { label: "Action Items", value: "7", sub: "2 due this week", icon: CheckCircle, color: "bg-amber-50 text-amber-700", border: "border-amber-100" },
];

const recentActivity = [
  { type: "session", title: "Strategy Session — Q2 Review", date: "2 May 2026", status: "Completed", statusColor: "bg-emerald-50 text-emerald-700" },
  { type: "document", title: "Business Health Assessment Report", date: "28 Apr 2026", status: "Ready", statusColor: "bg-blue-50 text-blue-700" },
  { type: "action", title: "Cash Flow Forecast Template", date: "25 Apr 2026", status: "In Progress", statusColor: "bg-amber-50 text-amber-700" },
  { type: "offer", title: "Xero — 3 Months Free Activated", date: "20 Apr 2026", status: "Active", statusColor: "bg-violet-50 text-violet-700" },
];

const quickLinks = [
  { label: "Book a Session", icon: CalendarCheck, href: "/contact", color: "bg-blue-700 text-white hover:bg-blue-800" },
  { label: "Browse Partner Offers", icon: Tag, href: "/offers", color: "bg-slate-900 text-white hover:bg-slate-800" },
  { label: "View Documents", icon: FileText, href: "/docushare", color: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50" },
  { label: "Explore Services", icon: BookOpen, href: "/on-demand", color: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50" },
];

const upcomingSessions = [
  { title: "Monthly Strategy Session", date: "Tue 12 May, 10:00 AM", consultant: "James R.", type: "Advisory" },
  { title: "Financial Planning Review", date: "Wed 20 May, 2:00 PM", consultant: "Amanda K.", type: "Finance" },
];

const navItems = [
  { label: "Dashboard",         icon: LayoutDashboard, href: "/portal/dashboard",  active: true },
  { label: "My Services",       icon: Zap,             href: "/portal/services" },
  { label: "Advisory Sessions", icon: CalendarCheck,   href: "/portal/sessions" },
  { label: "Documents",         icon: FileText,        href: "/portal/documents" },
  { label: "Partner Offers",    icon: Tag,             href: "/portal/offers" },
  { label: "Applications",      icon: Briefcase,       href: "/portal/apps" },
  { label: "Resources",         icon: BookOpen,        href: "/portal/resources" },
  { label: "Support",           icon: MessageSquare,   href: "/portal/support" },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleSignOut() {
    navigate("/sign-in");
  }

  const today = new Date().toLocaleDateString("en-AU", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── Sidebar ── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
          <button className="lg:hidden p-1 text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User pill */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-2.5">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-black text-white">{USER.initials}</span>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate">{USER.name}</div>
              <div className="text-[10px] text-blue-700 font-semibold truncate">{USER.plan}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                item.active
                  ? "bg-blue-700 text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-slate-100 space-y-0.5">
          <Link to="#" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
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

      {/* ── Main content ── */}
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
              <h1 className="text-sm font-extrabold text-slate-900">Members Dashboard</h1>
              <p className="text-[10px] text-slate-400 hidden sm:block">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full" />
            </button>
            <div className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-xs font-black text-white">{USER.initials}</span>
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 px-4 sm:px-6 py-6 space-y-6 overflow-y-auto">

          {/* Welcome banner */}
          <div className="bg-blue-700 rounded-2xl px-6 py-5 flex items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-600 rounded-full opacity-40 pointer-events-none" />
            <div className="absolute -bottom-10 right-16 w-32 h-32 bg-blue-800 rounded-full opacity-40 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-bold text-blue-100 uppercase tracking-widest">{USER.plan}</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mb-1">
                Good to see you back, {USER.name.split(" ")[0]}.
              </h2>
              <p className="text-sm text-blue-100">
                You have <span className="font-bold text-white">2 action items</span> due this week and an upcoming session on <span className="font-bold text-white">12 May</span>.
              </p>
            </div>
            <Link
              to="/contact"
              className="relative z-10 hidden sm:inline-flex items-center gap-1.5 bg-white text-blue-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-all flex-shrink-0"
            >
              Book a Session <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className={`bg-white rounded-2xl p-4 border ${s.border} shadow-sm`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mb-0.5">{s.value}</div>
                <div className="text-xs font-semibold text-slate-700 mb-0.5">{s.label}</div>
                <div className="text-[10px] text-slate-400">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Middle row: activity + quick links */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Recent activity — 2/3 width */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900">Recent Activity</h3>
                <button className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {recentActivity.map((item) => (
                  <div key={item.title} className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        {item.type === "session" && <CalendarCheck className="w-4 h-4 text-slate-500" />}
                        {item.type === "document" && <FileText className="w-4 h-4 text-slate-500" />}
                        {item.type === "action" && <CheckCircle className="w-4 h-4 text-slate-500" />}
                        {item.type === "offer" && <Tag className="w-4 h-4 text-slate-500" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">{item.title}</div>
                        <div className="text-[10px] text-slate-400">{item.date}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links — 1/3 width */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900">Quick Actions</h3>
              </div>
              <div className="p-4 space-y-2.5">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`flex items-center justify-between gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all ${link.color}`}
                  >
                    <div className="flex items-center gap-2">
                      <link.icon className="w-3.5 h-3.5" />
                      {link.label}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row: upcoming sessions + consultant card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Upcoming sessions */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900">Upcoming Sessions</h3>
                <Link to="/contact" className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
                  Book new <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-slate-50">
                {upcomingSessions.map((session) => (
                  <div key={session.title} className="px-5 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CalendarCheck className="w-5 h-5 text-blue-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 mb-0.5">{session.title}</div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Clock className="w-3 h-3" /> {session.date}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Users className="w-3 h-3" /> {session.consultant}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-lg flex-shrink-0">
                      {session.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Consultant */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900">Your Consultant</h3>
              </div>
              <div className="p-5 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center mb-3">
                  <span className="text-lg font-black text-white">JR</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900 mb-0.5">James Reynolds</div>
                <div className="text-xs text-blue-700 font-semibold mb-1">Senior Business Adviser</div>
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-[10px] text-slate-400 ml-1">5.0</span>
                </div>
                <div className="text-xs text-slate-500 leading-relaxed mb-4">
                  Specialising in growth strategy, financial planning, and operational efficiency for Australian SMEs.
                </div>
                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Send a Message
                </Link>
              </div>
            </div>
          </div>

          {/* Performance snapshot */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-900">Business Health Snapshot</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3" /> On Track
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: "Revenue Growth", value: 72, color: "bg-blue-600" },
                { label: "Operational Efficiency", value: 58, color: "bg-violet-600" },
                { label: "Strategic Milestone Progress", value: 85, color: "bg-emerald-600" },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600">{metric.label}</span>
                    <span className="text-xs font-extrabold text-slate-900">{metric.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${metric.color}`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}