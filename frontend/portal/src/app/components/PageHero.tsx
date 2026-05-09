import { Link } from "react-router";
import { ChevronRight, Home, ArrowRight, CheckCircle } from "lucide-react";

interface PageHeroProps {
  title: string;
  titleAccent?: string; // highlighted word(s) appended after title
  subtitle?: string;
  badge?: string;
  breadcrumb?: string;
  image?: string;
  bullets?: string[];
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  stat?: { value: string; label: string; sublabel?: string };
}

export function PageHero({
  title,
  titleAccent,
  subtitle,
  badge,
  breadcrumb,
  image,
  bullets,
  ctaPrimary,
  ctaSecondary,
  stat,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-12 pb-20 lg:pt-16 lg:pb-24">
      {/* Background decoration blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-8">
          <Link to="/" className="hover:text-blue-700 transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-blue-700 font-semibold">{breadcrumb || title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* ── Left: Content ── */}
          <div className="lg:col-span-6 xl:col-span-7">
            {/* Badge */}
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-bold tracking-wider uppercase">{badge}</span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              {title}
              {titleAccent && (
                <>
                  {" "}
                  <span className="text-blue-700 relative">
                    {titleAccent}
                    <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 300 6" fill="none">
                      <path d="M0 3 Q75 0 150 3 Q225 6 300 3" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
                    </svg>
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Trust bullets */}
            {bullets && bullets.length > 0 && (
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-10">
                {bullets.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-slate-600 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTAs */}
            {(ctaPrimary || ctaSecondary) && (
              <div className="flex flex-col sm:flex-row gap-3">
                {ctaPrimary && (
                  <Link
                    to={ctaPrimary.href}
                    className="inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-7 py-3.5 rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-100"
                  >
                    {ctaPrimary.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                {ctaSecondary && (
                  <Link
                    to={ctaSecondary.href}
                    className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 bg-white px-7 py-3.5 rounded-xl font-bold transition-all hover:bg-slate-50"
                  >
                    {ctaSecondary.label}
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* ── Right: Image ── */}
          {image && (
            <div className="lg:col-span-6 xl:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 aspect-[4/3]">
                <img
                  src={image}
                  alt={badge || title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
              </div>

              {/* Floating stat card */}
              {stat && (
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 z-20 border border-slate-100">
                  <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">{stat.label}</div>
                  {stat.sublabel && (
                    <div className="text-xs text-slate-400 mt-0.5">{stat.sublabel}</div>
                  )}
                </div>
              )}

              {/* Decorative corner badge */}
              <div className="absolute -top-4 -right-4 bg-blue-700 text-white rounded-2xl shadow-xl p-4 z-20">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-0.5">Remote Business</div>
                <div className="text-sm font-extrabold">Partner</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
