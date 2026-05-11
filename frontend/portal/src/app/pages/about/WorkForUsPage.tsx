import { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { ExpressionOfInterestForm } from "../../components/forms/ExpressionOfInterestForm";

export function WorkForUsPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-700">
            Work For Us
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Register interest in future opportunities with Remote Business Partner.
          </h1>
          <p className="mt-5 max-w-3xl text-slate-600">
            This page is for future employment, contractor, advisory, internship, and specialist
            opportunities.
          </p>
          <div className="mt-8">
            <ExpressionOfInterestForm submitted={submitted} onSubmitted={() => setSubmitted(true)} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
