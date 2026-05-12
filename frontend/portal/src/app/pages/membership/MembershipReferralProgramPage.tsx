import { Link } from "react-router";
import { ArrowRight, CheckCircle, Share2, Users } from "lucide-react";

import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";

const audience = [
  "Existing members",
  "Business consultants and advisors",
  "Accountants, brokers, and professional partners",
  "Business owners who know other businesses that need support",
];

const steps = [
  "Share RBP with a business owner",
  "They review the membership offer",
  "They sign up or speak with the team",
  "Referral details are confirmed by the RBP team",
];

const benefits = [
  "Help other businesses access structured support",
  "Introduce clients or peers to useful services",
  "Support small business growth",
  "Build a relationship with the RBP ecosystem",
];

export function MembershipReferralProgramPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <section className="grid gap-8 rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-8 text-white shadow-xl sm:p-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-blue-200">
                Membership Referral Program
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Refer Businesses to Remote Business Partner
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
                Invite business owners to join RBP and help them access practical support, services, tools, and member benefits.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/portal/membership/checkout" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-slate-100">
                  Create account to continue <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">
                  Contact Us
                </Link>
              </div>
            </div>
            <aside className="rounded-[1.75rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <Share2 className="h-10 w-10 text-blue-200" />
              <h2 className="mt-4 text-2xl font-black">A practical introduction pathway</h2>
              <p className="mt-3 text-sm leading-6 text-blue-100">
                The referral program explains how businesses can be introduced to RBP. Referral details are confirmed by the RBP team.
              </p>
            </aside>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-blue-700">What it is</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-slate-950">
              A simple way to introduce business owners to RBP support.
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-600">
              The Membership Referral Program helps members, partners, and business networks introduce business owners to Remote Business Partner. It is designed for practical introductions, membership discovery, and support conversations.
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <Users className="h-9 w-9 text-blue-700" />
              <h2 className="mt-4 text-2xl font-black text-slate-950">Who it is for</h2>
              <div className="mt-6 grid gap-3">
                {audience.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-700" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">How it works</h2>
              <div className="mt-6 grid gap-3">
                {steps.map((item, index) => (
                  <div key={item} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-black text-white">{index + 1}</span>
                    <p className="pt-1 text-sm font-semibold text-slate-800">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <h2 className="text-2xl font-black text-slate-950">Referral benefits</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {benefits.map((item) => (
                <article key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <CheckCircle className="h-5 w-5 text-blue-700" />
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{item}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-blue-200 bg-blue-50 p-8 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">Ready to refer a business?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                Contact the RBP team or sign up to become part of the member network.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-0 sm:justify-end">
              <Link to="/portal/membership/checkout" className="inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800">Create account to continue</Link>
              <Link to="/contact" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100">Contact Us</Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
