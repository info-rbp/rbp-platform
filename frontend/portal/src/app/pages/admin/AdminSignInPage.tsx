import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  Briefcase,
  Eye,
  EyeOff,
  AlertCircle,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";

import { environment } from "../../config/environment";
import { mockAdminAuthService } from "../../services/mock/auth.mockService";

export function AdminSignInPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const response = await mockAdminAuthService.signIn({ email, password });

    if (response.ok) {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. Please check your email and password.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 shadow-lg">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div className="text-lg font-extrabold tracking-tight text-white">
            Remote Business Partner
          </div>
          <div className="mt-0.5 text-xs font-semibold text-slate-400">Admin QA Preview</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <div className="mb-5 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-xs leading-6 text-amber-100">
            <p className="font-semibold">
              For this QA release, operational administration is managed through Frappe Desk.
            </p>
            <p>
              The React admin interface is a preview surface unless explicitly connected to backend persistence.
            </p>
            {environment.frappeDeskUrl ? (
              <a
                className="mt-2 inline-flex items-center gap-1 font-semibold underline"
                href={environment.frappeDeskUrl}
              >
                Open Frappe Desk <ArrowRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <p className="mt-2 font-semibold">
                Frappe Desk URL will be provided in the QA environment.
              </p>
            )}
          </div>

          <h1 className="mb-1 text-base font-extrabold text-white">Administrator Sign In</h1>
          <p className="mb-6 text-xs text-slate-400">
            Restricted QA access for authorised personnel.
          </p>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-800/60 bg-red-950/60 px-3 py-2.5 text-xs text-red-400">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@remotebusinesspartner.com.au"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-600 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-10 text-sm text-white placeholder-slate-600 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-sm font-bold text-white transition-all hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                "Sign In to Admin Preview"
              )}
            </button>
          </form>
        </div>

        <div className="mt-5 text-center">
          <Link to="/" className="text-xs text-slate-600 transition-colors hover:text-slate-400">
            ← Return to public site
          </Link>
        </div>
      </div>
    </div>
  );
}
