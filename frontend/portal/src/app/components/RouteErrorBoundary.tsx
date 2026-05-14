import { Link, isRouteErrorResponse, useRouteError } from "react-router";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

function getFriendlyMessage(error: unknown) {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        title: "Page not found",
        message: "That page could not be found. Please return home or try another section.",
      };
    }

    return {
      title: "Something went wrong",
      message: "This page could not be loaded. Please return home or try another section.",
    };
  }

  return {
    title: "Something went wrong",
    message: "This page could not be loaded. Please return home or try another section.",
  };
}

function getTechnicalNote(error: unknown) {
  if (!import.meta.env.DEV) {
    return "";
  }

  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`.trim();
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected route error.";
}

export function RouteErrorBoundary() {
  const error = useRouteError();
  const { title, message } = getFriendlyMessage(error);
  const technicalNote = getTechnicalNote(error);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
            We hit a snag
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-900">{title}</h1>
          <p className="mt-4 text-slate-600">{message}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"
            >
              Return home
            </Link>
            <Link
              to="/help"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
            >
              Visit Help Center
            </Link>
          </div>
          {technicalNote ? (
            <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs text-slate-500">
              <p className="font-bold uppercase tracking-widest text-slate-400">Technical note</p>
              <p className="mt-2">{technicalNote}</p>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
