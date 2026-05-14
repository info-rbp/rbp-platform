import { Link } from "react-router";

import { Footer } from "../Footer";
import { Navbar } from "../Navbar";

type LegalSection = {
  title: string;
  body: string[];
  bullets?: string[];
};

type RelatedLink = {
  label: string;
  href: string;
};

export function LegalPageLayout({
  title,
  intro,
  sections,
  relatedLinks,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
  relatedLinks: RelatedLink[];
}) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Legal
            </p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-slate-600">{intro}</p>

            <section className="mt-8 rounded-xl border border-amber-100 bg-amber-50 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                Launch Draft
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                This page is provided as launch-draft policy content for QA and public preview. It should be reviewed and approved before final release, and it is not legal advice.
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-700">Last updated: May 2026</p>
            </section>

            <div className="mt-10 space-y-8">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
                  <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.bullets?.length ? (
                    <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" aria-hidden />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            <section className="mt-10 border-t border-slate-200 pt-8">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">
                Related public links
              </h2>
              <div className="mt-3 flex flex-wrap gap-4">
                {relatedLinks.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
