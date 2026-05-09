import { useState } from "react";
import { useNavigate } from "react-router";
import { PortalAdminReference } from "./PortalAdminReference";
import { OrderSummaryCard } from "../../components/domain";
import { ConfirmationPanel } from "../../components/flow";
import { mockPortalSettingsProfile } from "../../mock";
import { User, Mail, Lock, Bell, Shield, CreditCard, LogOut, CheckCircle, ChevronRight } from "lucide-react";

const tabs = ["Profile", "Security", "Notifications", "Membership", "Billing"] as const;
type Tab = typeof tabs[number];

const USER = mockPortalSettingsProfile;

export function PortalSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleSignOut() {
    navigate("/sign-in");
  }

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <PortalAdminReference
        portalRoute="/portal/settings"
        controlledBy={["Admin Membership > Portal Access", "Admin Settings"]}
      />

      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-1">Settings</h2>
        <p className="text-sm text-slate-500">Manage mock profile, business details, preferences, and membership summary state.</p>
      </div>

      {saved ? (
        <ConfirmationPanel
          title="Settings saved locally"
          message="This confirmation is frontend-only. No account, billing, password, or notification preference changes are persisted."
          reference="SETTINGS-MOCK-001"
          statusLabel="Mock save confirmation"
        />
      ) : null}

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-full sm:w-auto sm:inline-flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Profile ── */}
      {activeTab === "Profile" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <User className="w-4 h-4 text-blue-700" />
            <h3 className="text-sm font-extrabold text-slate-900">Profile Information</h3>
          </div>
          <div className="px-5 py-5 space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-black text-white">RB</span>
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900">{USER.firstName} {USER.lastName}</div>
                <button className="text-xs font-semibold text-blue-700 hover:underline mt-0.5">Change photo</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "First Name",     value: USER.firstName, type: "text" },
                { label: "Last Name",      value: USER.lastName,  type: "text" },
                { label: "Email Address",  value: USER.email,     type: "email" },
                { label: "Phone Number",   value: USER.phone,     type: "tel" },
                { label: "Business Name",  value: USER.business,  type: "text" },
                { label: "ABN",            value: USER.abn,       type: "text" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                {saved ? <><CheckCircle className="w-3.5 h-3.5" /> Saved!</> : "Save Changes"}
              </button>
              <button className="text-xs font-semibold text-slate-500 hover:text-slate-700">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Security ── */}
      {activeTab === "Security" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
              <Lock className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-extrabold text-slate-900">Change Password</h3>
            </div>
            <div className="px-5 py-5 space-y-4">
              {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                <div key={label}>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>
                  <input
                    type="password"
                    placeholder="••••••••••"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              ))}
              <button className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all">
                Update Password
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
              <Shield className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-extrabold text-slate-900">Two-Factor Authentication</h3>
            </div>
            <div className="px-5 py-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-800 mb-0.5">Authenticator App</div>
                <div className="text-xs text-slate-500">Add an extra layer of security to your account.</div>
              </div>
              <button className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl transition-colors flex-shrink-0">
                Enable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Notifications ── */}
      {activeTab === "Notifications" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <Bell className="w-4 h-4 text-blue-700" />
            <h3 className="text-sm font-extrabold text-slate-900">Notification Preferences</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { label: "Session reminders",          sub: "48 hours before an advisory session",  on: true },
              { label: "New documents available",    sub: "When your consultant uploads a file",   on: true },
              { label: "Action item due dates",      sub: "3 days before an action item is due",   on: false },
              { label: "Partner offer alerts",       sub: "When new exclusive offers are added",   on: true },
              { label: "RBP news & updates",         sub: "Monthly newsletter and announcements",  on: false },
            ].map((item) => (
              <NotificationRow key={item.label} {...item} />
            ))}
          </div>
        </div>
      )}

      {/* ── Membership ── */}
      {activeTab === "Membership" && (
        <div className="space-y-4">
          <div className="bg-blue-700 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-36 h-36 bg-blue-600 rounded-full opacity-40 pointer-events-none" />
            <div className="relative z-10">
              <div className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1">Current Plan</div>
              <div className="text-lg font-extrabold text-white mb-0.5">{USER.plan}</div>
              <div className="text-xs text-blue-100 mb-4">Renews on <span className="font-bold text-white">{USER.renewalDate}</span></div>
              <div className="flex flex-wrap gap-3">
                <button className="text-xs font-bold bg-white text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">
                  Upgrade Plan
                </button>
                <button className="text-xs font-bold text-blue-200 hover:text-white transition-colors">
                  View all plans
                </button>
              </div>
            </div>
          </div>
          <OrderSummaryCard
            title="Membership Account Summary"
            lines={[
              { label: "Status", value: USER.membershipStatus },
              { label: "Plan", value: USER.plan },
              { label: "Renewal", value: USER.renewalDate },
              { label: "Account mode", value: "Mock only" },
            ]}
          />
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">Plan Inclusions</h3>
            </div>
            <div className="px-5 py-4 space-y-3">
              {[
                "4 advisory sessions per month",
                "Dedicated RBP consultant",
                "Full document library access",
                "Partner offer discounts",
                "Business health reporting",
                "Priority email & phone support",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-xs text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Billing ── */}
      {activeTab === "Billing" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-extrabold text-slate-900">Payment Method</h3>
            </div>
            <div className="px-5 py-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 bg-slate-800 rounded-lg flex items-center justify-center">
                  <span className="text-[9px] font-black text-white">VISA</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">•••• •••• •••• 4242</div>
                  <div className="text-[10px] text-slate-400">Expires 08/28</div>
                </div>
              </div>
              <button className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1">
                Update <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">Billing History</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { date: "1 May 2026",  desc: "Growth Partner Programme — Monthly",  amount: "$299.00", status: "Paid" },
                { date: "1 Apr 2026",  desc: "Growth Partner Programme — Monthly",  amount: "$299.00", status: "Paid" },
                { date: "1 Mar 2026",  desc: "Growth Partner Programme — Monthly",  amount: "$299.00", status: "Paid" },
              ].map((inv) => (
                <div key={inv.date} className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{inv.desc}</div>
                    <div className="text-[10px] text-slate-400">{inv.date}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-extrabold text-slate-900">{inv.amount}</span>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg">{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sign out */}
      <div className="border-t border-slate-100 pt-4">
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}

function NotificationRow({ label, sub, on }: { label: string; sub: string; on: boolean }) {
  const [enabled, setEnabled] = useState(on);
  return (
    <div className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
      <div>
        <div className="text-xs font-bold text-slate-800">{label}</div>
        <div className="text-[10px] text-slate-400">{sub}</div>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${enabled ? "bg-blue-700" : "bg-slate-200"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}
