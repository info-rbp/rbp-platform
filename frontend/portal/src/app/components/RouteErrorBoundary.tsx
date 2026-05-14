import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { AlertTriangle, ArrowRight, Home, LifeBuoy } from "lucide-react";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

function getTechnicalNote(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`.trim();
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown route error";
}

export function RouteErrorBoundary() {
  const error = useRouteError();
  const technicalNote = getTechnicalNote(error);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <p className="mt-6 text-center text-xs font-extrabold uppercase tracking-widest text-blue-700">
              Page unavailable
            </p>
            <h1 className="mt-3 text-center text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              This page could not be loaded.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-slate-600">
              Please return home or try another section.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
              >
                <Home className="h-4 w-4" />
                Return home
              </Link>
              <Link
                to="/help"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <LifeBuoy className="h-4 w-4" />
                Visit Help Center
              </Link>
            </div>

            {import.meta.env.DEV ? (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                  Technical note
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{technicalNote}</p>
                <Link
                  to="/contact"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800"
                >
                  Report this issue <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
