import { useState } from "react";
import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import {
  CheckCircle,
  X,
  Users,
  BookOpen,
  Zap,
  Shield,
  TrendingUp,
  Star,
  MessageSquare,
  Calendar,
  Award,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Crown,
  Sparkles,
  Briefcase,
} from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1762330472160-5224035e8aa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtZW1iZXJzaGlwJTIwY29tbXVuaXR5JTIwYnVzaW5lc3MlMjBuZXR3b3JrJTIwcGVvcGxlfGVufDF8fHx8MTc3NjkzOTc5M3ww&ixlib=rb-4.1.0&q=80&w=1080";

const benefits = [
  {
    icon: Users,
    title: "Exclusive Member Community",
    desc: "Connect with a vetted network of like-minded small business owners, share insights, and access peer advisory in our private member forum.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: BookOpen,
    title: "Full Resource Library",
    desc: "Unlock 150+ guides, playbooks, templates, and case studies — all created by our senior consultants and updated quarterly.",
    color: "bg-violet-100 text-violet-700",
  },
  {
    icon: Zap,
    title: "Priority Advisory Access",
    desc: "Jump the queue. Members get priority booking for advisory sessions, ensuring faster access to the expertise you need.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Shield,
    title: "Member-Only Deals",
    desc: "Exclusive partner discounts on accounting software, HR tools, legal services, and more — negotiated specifically for RBP members.",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: TrendingUp,
    title: "Business Health Tracking",
    desc: "Regular check-ins and benchmarking reports so you always know where your business stands and what to focus on next.",
    color: "bg-rose-100 text-rose-700",
  },
  {
    icon: Calendar,
    title: "Monthly Member Events",
    desc: "Live webinars, Q&A sessions, and virtual workshops led by our consultants — exclusively for active members.",
    color: "bg-sky-100 text-sky-700",
  },
];

const plans = [
  {
    name: "Community",
    icon: Briefcase,
    price: "Free",
    billing: "No credit card required",
    desc: "The perfect starting point. Get access to our resources and community as you explore what RBP has to offer.",
    highlight: false,
    badge: null,
    cta: "Join for Free",
    color: "border-slate-200",
    iconBg: "bg-slate-100 text-slate-700",
    features: [
      { label: "Resource library (select articles)", included: true },
      { label: "Monthly newsletter", included: true },
      { label: "Member community access", included: true },
      { label: "Member-only deals", included: false },
      { label: "Advisory session credits", included: false },
      { label: "DocuShare access", included: false },
      { label: "Applications suite", included: false },
      { label: "Business health reports", included: false },
      { label: "Dedicated account manager", included: false },
      { label: "Monthly member events", included: false },
    ],
  },
  {
    name: "Professional",
    icon: Star,
    price: "$99",
    billing: "per month, billed monthly",
    desc: "For growth-stage businesses that want consistent advisory support, tools, and access to the full RBP ecosystem.",
    highlight: true,
    badge: "Most Popular",
    cta: "Start Professional",
    color: "border-blue-600",
    iconBg: "bg-blue-700 text-white",
    features: [
      { label: "Full resource library (150+ items)", included: true },
      { label: "Monthly newsletter", included: true },
      { label: "Member community access", included: true },
      { label: "Member-only deals & discounts", included: true },
      { label: "2 advisory session credits / month", included: true },
      { label: "DocuShare access", included: true },
      { label: "Applications suite", included: true },
      { label: "Quarterly business health report", included: true },
      { label: "Dedicated account manager", included: false },
      { label: "Monthly member events", included: true },
    ],
  },
  {
    name: "Executive",
    icon: Crown,
    price: "$299",
    billing: "per month, billed monthly",
    desc: "For ambitious owners who want an always-on advisory partner, full suite access, and a dedicated RBP consultant in their corner.",
    highlight: false,
    badge: "Premium",
    cta: "Start Executive",
    color: "border-slate-300",
    iconBg: "bg-amber-100 text-amber-700",
    features: [
      { label: "Full resource library (150+ items)", included: true },
      { label: "Monthly newsletter", included: true },
      { label: "Member community access", included: true },
      { label: "Member-only deals & discounts", included: true },
      { label: "Unlimited advisory session credits", included: true },
      { label: "DocuShare access", included: true },
      { label: "Applications suite", included: true },
      { label: "Monthly business health report", included: true },
      { label: "Dedicated account manager", included: true },
      { label: "Monthly member events (+ priority access)", included: true },
    ],
  },
];

const testimonials = [
  {
    quote:
      "The Professional membership paid for itself in the first month. The advisory credits alone saved us from a costly hiring mistake, and the resource library has become our go-to for operational decisions.",
    name: "Sophie T.",
    role: "Founder, Retail Tech Startup",
    initials: "ST",
    color: "bg-blue-600",
  },
  {
    quote:
      "Having a dedicated account manager through the Executive tier has been a game-changer. It's like having a senior consultant on call without the agency price tag.",
    name: "James O.",
    role: "MD, Professional Services Firm",
    initials: "JO",
    color: "bg-violet-600",
  },
  {
    quote:
      "I started on the free Community plan just to explore, and within two months I'd upgraded. The value at every tier is genuinely exceptional for a small business owner.",
    name: "Naomi A.",
    role: "Owner, Creative Agency",
    initials: "NA",
    color: "bg-emerald-600",
  },
];

const faqs = [
  {
    q: "Can I switch between membership tiers?",
    a: "Yes, absolutely. You can upgrade or downgrade your membership at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data remains accessible for 30 days after cancellation so you can export anything you need. After that, your account is archived securely.",
  },
  {
    q: "Are advisory session credits carried over?",
    a: "On the Professional plan, up to 2 unused credits roll over each month (maximum 4 at any time). On the Executive plan, sessions are unlimited so rollover doesn't apply.",
  },
  {
    q: "Is there a minimum commitment period?",
    a: "No. All paid memberships are month-to-month with no lock-in. We earn your loyalty through value, not contracts.",
  },
  {
    q: "Do member-only deals require a minimum spend?",
    a: "No minimum spend required. Deals are unlocked the moment your membership is active, and most are available immediately via your member dashboard.",
  },
  {
    q: "Can I get a custom membership for my team?",
    a: "Yes — for businesses with 5 or more staff members requiring access, we offer custom team plans. Reach out via our Contact page for a tailored quote.",
  },
];

const stats = [
  { value: "500+", label: "Active Members" },
  { value: "92%", label: "Renewal Rate" },
  { value: "$1,200", label: "Avg. Annual Member Savings" },
  { value: "4.9/5", label: "Member Satisfaction" },
];

export function MembershipPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <PageHero
        title="Join the RBP"
        titleAccent="Member Community"
        subtitle="Unlock expert advisory, powerful business tools, exclusive partner deals, and a network of ambitious small business owners — all in one membership."
        badge="Membership"
        breadcrumb="Membership"
        image={heroImage}
        bullets={["No long-term contracts", "Cancel anytime", "Free tier available"]}
        ctaPrimary={{ label: "See Membership Plans", href: "#plans" }}
        ctaSecondary={{ label: "Talk to Us First", href: "/contact" }}
        stat={{ value: "500+", label: "Active Members", sublabel: "And growing every month" }}
      />

      {/* ── Stats bar ── */}
      <div className="bg-blue-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold text-white mb-1">{s.value}</div>
                <div className="text-sm font-semibold text-blue-200">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Member Benefits ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
              Why Become a Member
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Everything you need to run a better business
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Membership gives you access to tools, advisory, and community that would ordinarily cost a small business tens of thousands a year.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <div className={`w-11 h-11 ${b.color} rounded-xl flex items-center justify-center mb-5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{b.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Membership Plans ── */}
      <section id="plans" className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
              Membership Plans
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Choose the plan that fits your ambition
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Start free and upgrade as you grow. No hidden costs, no lock-in — just straightforward value at every level.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.name}
                  className={`relative bg-white rounded-3xl border-2 ${plan.color} p-8 flex flex-col ${
                    plan.highlight ? "shadow-2xl shadow-blue-100 ring-2 ring-blue-600 ring-offset-2" : "shadow-sm"
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div
                      className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        plan.highlight
                          ? "bg-blue-700 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {plan.badge}
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-6">
                    <div className={`w-12 h-12 ${plan.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 mb-1">{plan.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{plan.desc}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                      {plan.price !== "Free" && (
                        <span className="text-slate-400 text-sm font-semibold mb-1">/mo</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs mt-1 font-medium">{plan.billing}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 flex-grow mb-8">
                    {plan.features.map((f) => (
                      <li key={f.label} className="flex items-start gap-3">
                        {f.included ? (
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            f.included ? "text-slate-700" : "text-slate-400"
                          }`}
                        >
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    to="/contact"
                    className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all ${
                      plan.highlight
                        ? "bg-blue-700 hover:bg-blue-800 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 hover:border-slate-300 hover:-translate-y-0.5"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm text-slate-400 mt-8 font-medium">
            All prices are exclusive of GST. Need a team plan?{" "}
            <Link to="/contact" className="text-blue-700 hover:text-blue-800 font-bold">
              Contact us for a custom quote.
            </Link>
          </p>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
              Member Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Heard from our members
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex flex-col gap-5"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <MessageSquare className="w-7 h-7 text-blue-200" />
                <p className="text-slate-700 text-sm leading-relaxed flex-grow italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What sets us apart ── */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/30 border border-blue-500/30 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">The RBP Difference</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 leading-tight">
                This isn't just a subscription. It's a{" "}
                <span className="text-blue-400">business partnership.</span>
              </h2>
              <p className="text-slate-300 leading-relaxed mb-8">
                Most business tools give you software. RBP membership gives you software <em>plus</em> the human expertise to use it well. Our consultants are embedded in your experience at every tier — not locked behind an enterprise price wall.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Award, text: "Senior consultants with real SME experience" },
                  { icon: Sparkles, text: "Tools curated specifically for small businesses" },
                  { icon: Shield, text: "Transparent pricing — no surprise charges" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-700/40 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-blue-300" />
                      </div>
                      <span className="text-slate-200 font-semibold text-sm">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "500+", label: "Active Members" },
                { value: "92%", label: "Renewal Rate" },
                { value: "$1,200", label: "Avg. Annual Member Savings" },
                { value: "4.9 / 5", label: "Member Satisfaction Score" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
                >
                  <div className="text-3xl font-extrabold text-white mb-1">{s.value}</div>
                  <div className="text-slate-400 text-xs font-semibold">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
              FAQs
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-bold text-slate-900 text-sm">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t border-slate-50">
                    <p className="text-slate-600 text-sm leading-relaxed pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-slate-500 text-sm mb-4">Still have questions?</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              Talk to our team
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}