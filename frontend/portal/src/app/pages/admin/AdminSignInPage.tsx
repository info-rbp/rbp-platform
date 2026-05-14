import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Briefcase, Eye, EyeOff, AlertCircle, Lock, Mail, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-700 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div className="text-white font-extrabold text-lg tracking-tight">Remote Business Partner</div>
          <div className="text-slate-400 text-xs font-semibold mt-0.5">Admin QA Preview</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="mb-5 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-xs leading-6 text-amber-100">
            <p className="font-semibold">Operational administration remains in Frappe Desk.</p>
            <p>This React admin area is a QA preview surface and must not be treated as the source of truth.</p>
            <a className="mt-2 inline-flex items-center gap-1 font-semibold underline" href="/desk">
              Open Frappe Desk <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <h1 className="text-white font-extrabold text-base mb-1">Administrator Sign In</h1>
          <p className="text-slate-400 text-xs mb-6">Restricted QA access for authorised personnel.</p>

          {error && (
            <div className="flex items-start gap-2 bg-red-950/60 border border-red-800/60 text-red-400 text-xs px-3 py-2.5 rounded-xl mb-4">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@remotebusinesspartner.com.au"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-600 text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-600 text-sm pl-9 pr-10 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Sign In to Admin Preview"}
            </button>
          </form>
        </div>

        <div className="mt-5 text-center">
          <Link to="/" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">
            ← Return to public site
          </Link>
        </div>
      </div>
    </div>
  );
}
