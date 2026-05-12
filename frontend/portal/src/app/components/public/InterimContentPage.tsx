import { Link } from "react-router";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";

interface ContentSection {
  title: string;
  body: string;
  items?: string[];
}

interface RelatedLink {
  label: string;
  href: string;
}

interface PageAction {
  label: string;
  href: string;
}

interface InterimContentPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  statusLabel?: string;
  reviewNote?: string;
  sections: ContentSection[];
  relatedLinks?: RelatedLink[];
  primaryAction?: PageAction;
  secondaryAction?: PageAction;
}

export function InterimContentPage({
  eyebrow,
  title,
  intro,
  statusLabel = "Interim content",
  reviewNote,
  sections,
  relatedLinks = [],
  primaryAction,
  secondaryAction,
}: InterimContentPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-700">
              {eyebrow}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  {title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
                  {intro}
                </p>
              </div>

              <div className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                {statusLabel}
              </div>
            </div>

            {reviewNote && (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-amber-800">
                  Review status
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-amber-900">
                  {reviewNote}
                </p>
              </div>
            )}

            <div className="mt-8 grid gap-5">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                >
                  <h2 className="text-lg font-bold text-slate-950">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {section.body}
                  </p>

                  {section.items && section.items.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {relatedLinks.length > 0 && (
              <section className="mt-8">
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">
                  Related links
                </h2>
                <div className="mt-3 flex flex-wrap gap-4">
                  {relatedLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {(primaryAction || secondaryAction) && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {primaryAction && (
                  <Link
                    to={primaryAction.href}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
                  >
                    {primaryAction.label}
                  </Link>
                )}

                {secondaryAction && (
                  <Link
                    to={secondaryAction.href}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    {secondaryAction.label}
                  </Link>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
