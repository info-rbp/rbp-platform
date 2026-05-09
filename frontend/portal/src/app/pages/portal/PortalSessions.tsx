import { Link } from "react-router";
import { PortalAdminReference } from "./PortalAdminReference";
import { CalendarCheck, Clock, Users, Video, ArrowRight, ChevronRight, Plus } from "lucide-react";

const upcoming = [
  { title: "Monthly Strategy Session",   date: "Tue 12 May 2026", time: "10:00 AM",  consultant: "James Reynolds",  type: "Advisory",  mode: "Video Call" },
  { title: "Financial Planning Review",  date: "Wed 20 May 2026", time: "2:00 PM",   consultant: "Amanda Kowalski", type: "Finance",   mode: "Video Call" },
  { title: "HR Policy Workshop",         date: "Thu 29 May 2026", time: "11:00 AM",  consultant: "James Reynolds",  type: "HR",        mode: "Phone Call" },
];

const past = [
  { title: "Q2 Strategy Session",        date: "2 May 2026",   consultant: "James Reynolds",  type: "Advisory", outcome: "Action plan delivered" },
  { title: "Cash Flow Deep Dive",        date: "18 Apr 2026",  consultant: "Amanda Kowalski", type: "Finance",  outcome: "3-month forecast created" },
  { title: "Tender Readiness Review",    date: "5 Apr 2026",   consultant: "James Reynolds",  type: "Managed",  outcome: "Bid strategy approved" },
  { title: "Onboarding Session",         date: "22 Mar 2026",  consultant: "James Reynolds",  type: "Advisory", outcome: "RBP plan activated" },
];

const typeColor: Record<string, string> = {
  Advisory: "bg-blue-50 text-blue-700",
  Finance:  "bg-violet-50 text-violet-700",
  HR:       "bg-emerald-50 text-emerald-700",
  Managed:  "bg-amber-50 text-amber-700",
};

export function PortalSessions() {
  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <PortalAdminReference
        portalRoute="/portal/sessions"
        controlledBy={["Admin Dashboard > Discovery Calls", "Admin On-Demand Services > Business Advisor"]}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">Advisory Sessions</h2>
          <p className="text-sm text-slate-500">Manage your upcoming and past advisory sessions with the RBP team.</p>
        </div>
        <Link
          to="/contact"
          className="hidden sm:inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Book a Session
        </Link>
      </div>

      {/* Upcoming */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Upcoming Sessions</h3>
          <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">{upcoming.length} scheduled</span>
        </div>
        <div className="divide-y divide-slate-50">
          {upcoming.map((s) => (
            <div key={s.title} className="px-5 py-4 flex items-center gap-4">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <CalendarCheck className="w-5 h-5 text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-extrabold text-slate-900 mb-1">{s.title}</div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock className="w-3 h-3" /> {s.date} · {s.time}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Users className="w-3 h-3" /> {s.consultant}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Video className="w-3 h-3" /> {s.mode}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${typeColor[s.type] ?? "bg-slate-50 text-slate-600"}`}>
                  {s.type}
                </span>
                <button className="text-[10px] font-bold text-slate-500 hover:text-blue-700 border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-lg transition-colors">
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past sessions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Past Sessions</h3>
          <button className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {past.map((s) => (
            <div key={s.title} className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CalendarCheck className="w-4 h-4 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">{s.title}</div>
                  <div className="text-[10px] text-slate-400">{s.date} · {s.consultant}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-slate-400 hidden sm:block">{s.outcome}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${typeColor[s.type] ?? "bg-slate-50 text-slate-600"}`}>
                  {s.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-700 rounded-2xl px-6 py-5 flex items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-blue-800 rounded-full opacity-50 pointer-events-none" />
        <div className="relative z-10">
          <div className="text-sm font-extrabold text-white mb-1">Need more advisory time?</div>
          <p className="text-xs text-blue-100">Book an additional session or upgrade your membership plan for unlimited access.</p>
        </div>
        <Link
          to="/contact"
          className="relative z-10 inline-flex items-center gap-1.5 bg-white text-blue-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-all flex-shrink-0"
        >
          Book Now <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
