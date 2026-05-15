import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  Briefcase, Mail, Lock, Eye, EyeOff, User, Building2,
  ArrowRight, CheckCircle, ChevronRight, Linkedin,
} from "lucide-react";
import {
  clearPendingAccountIntent,
  getPendingAccountIntent,
  getSafeReturnTo,
  mockAuthService,
} from "../services/mock/auth.mockService";

type Tab = "signin" | "signup";

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

const benefits = [
  "Access exclusive partner offers and discounts",
  "Manage your advisory sessions and documents",
  "Track business milestones and action plans",
  "Connect with your dedicated RBP consultant",
];

export function SignInPage({ initialTab = "signin" }: { initialTab?: Tab }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pendingIntent = getPendingAccountIntent();
  const returnTo = getSafeReturnTo(searchParams.get("returnTo") ?? pendingIntent?.returnTo);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupBusinessName, setSignupBusinessName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const response = await mockAuthService.signIn({ email, password });

    if (response.ok) {
      clearPendingAccountIntent();
      navigate(returnTo, { replace: true });
    } else {
      setError(response.message);
      setLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const name = `${signupFirstName} ${signupLastName}`.trim();
    const response = await mockAuthService.signUp({
      name,
      email: signupEmail,
      businessName: signupBusinessName,
      password: signupPassword,
    });

    if (response.ok) {
      clearPendingAccountIntent();
      navigate(returnTo, { replace: true });
    } else {
      setError(response.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-black text-slate-800 tracking-tight">
            Remote Business Partner
          </span>
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
        >
          Back to site <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      <div className="flex-1 flex items-stretch">
        <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] bg-blue-700 flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full opacity-40" />
            <div className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] bg-blue-800 rounded-full opacity-50" />
          </div>

          <div className="relative z-10">
            <span className="inline-block text-xs font-bold text-blue-200 uppercase tracking-widest bg-blue-600/50 px-3 py-1 rounded-full mb-6">
              Agile Authority in Consulting
            </span>
            <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-4">
              Your business,<br />better supported.
            </h1>
            <p className="text-blue-100 leading-relaxed max-w-sm">
              Sign in to your RBP account to access your advisory dashboard, partner offers, and business tools — all in one place.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-blue-100" />
                </div>
                <span className="text-sm text-blue-100 leading-snug">{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 lg:py-16">
          <div className="w-full max-w-md">
            <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
              <button
                onClick={() => setTab("signin")}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  tab === "signin"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab("signup")}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  tab === "signup"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Create Account
              </button>
            </div>

            {tab === "signin" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome back</h2>
                  <p className="text-slate-500 text-sm">
                    Sign in to your RBP account to continue{pendingIntent ? `: ${pendingIntent.label}` : "."}
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleSignIn}>
                  {error && (
                    <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
                      <span className="text-xs font-medium">{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        placeholder="you@yourbusiness.com.au"
                        required
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">Password</label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                        placeholder="Enter your password"
                        required
                        className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        rememberMe ? "bg-blue-700 border-blue-700" : "border-slate-300 bg-white"
                      }`}
                    >
                      {rememberMe && <CheckCircle className="w-3 h-3 text-white" />}
                    </button>
                    <span className="text-xs text-slate-600 font-medium">Remember me for 30 days</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all mt-2"
                  >
                    {loading ? "Signing in..." : "Sign In"} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {tab === "signup" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Create your account</h2>
                  <p className="text-slate-500 text-sm">Create an Appwrite-backed account to continue into the member portal.</p>
                </div>

                <form className="space-y-4" onSubmit={handleSignUp}>
                  {error && (
                    <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
                      <span className="text-xs font-medium">{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">First name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={signupFirstName}
                          onChange={(event) => setSignupFirstName(event.currentTarget.value)}
                          placeholder="Jane"
                          required
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Last name</label>
                      <input
                        type="text"
                        value={signupLastName}
                        onChange={(event) => setSignupLastName(event.currentTarget.value)}
                        placeholder="Smith"
                        required
                        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Business name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={signupBusinessName}
                        onChange={(event) => setSignupBusinessName(event.currentTarget.value)}
                        placeholder="Your Business Pty Ltd"
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(event) => setSignupEmail(event.currentTarget.value)}
                        placeholder="you@yourbusiness.com.au"
                        required
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={signupPassword}
                        onChange={(event) => setSignupPassword(event.currentTarget.value)}
                        placeholder="Create a strong password"
                        required
                        className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={signupConfirmPassword}
                        onChange={(event) => setSignupConfirmPassword(event.currentTarget.value)}
                        placeholder="Repeat your password"
                        required
                        className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all"
                  >
                    {loading ? "Creating account..." : "Create Account"} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
