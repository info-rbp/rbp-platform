import { Link } from "react-router";

import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import {
  premiumMembershipFaqGroups,
  premiumMembershipRoutes,
} from "../../data/premiumMembership";

const freeMembershipFaqGroup = {
  title: "Free Membership",
  items: [
    {
      question: "What is RBP Free Membership?",
      answer:
        "RBP Free Membership is a free account-based membership that allows users to purchase RBP products and services online, access all member offers, save business details, and manage a basic member profile.",
    },
    {
      question: "Do I need Free Membership to purchase online?",
      answer:
        "Yes. Free Membership provides the account access needed to purchase eligible products and services online through the RBP platform.",
    },
    {
      question: "Does Free Membership cost anything?",
      answer: "No. RBP Free Membership is free.",
    },
    {
      question: "What is included in Free Membership?",
      answer:
        "Free Membership includes online purchasing access, one Business Advisor use per month, one Nucleus template per month, access to all member offers, and one user per account. Other services and products are available at advertised prices.",
    },
    {
      question: "Can I upgrade from Free to Premium?",
      answer:
        "Yes. Free members can upgrade to RBP Premium Membership to unlock unlimited Core Services, unlimited Nucleus access, service discounts, annual credits, marketplace discounts, operations benefits, and referral credits.",
    },
    {
      question: "What is the difference between Free and Premium?",
      answer:
        "Free Membership gives users account access and the ability to purchase online at advertised prices. RBP Premium Membership adds unlimited and discounted access, service credits, marketplace savings, premium operations benefits, and referral rewards.",
    },
  ],
};

const faqGroups = [
  freeMembershipFaqGroup,
  ...premiumMembershipFaqGroups.map((group) =>
    group.title === "Membership Basics"
      ? {
          ...group,
          items: group.items.map((item) =>
            item.question === "What is RBP Premium Membership?"
              ? {
                  ...item,
                  answer:
                    "RBP Premium Membership is the paid upgrade tier that gives small business owners access to Core Services, Nucleus resources, service discounts, marketplace savings, member offers, operations benefits, and referral rewards through the Remote Business Partner platform.",
                }
              : item
          ),
        }
      : group
  ),
];

export function MembershipFaqPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-blue-700">
              Membership FAQs
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              RBP Membership Frequently Asked Questions
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              Answers to common questions about Free Membership, RBP Premium Membership, online purchasing access, early bird pricing, inclusions, service credits, discounts, offers, users, and referral benefits.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={premiumMembershipRoutes.inclusions} className="inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800">
                View Inclusions
              </Link>
              <Link to="/portal/membership/checkout" className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
                Create account to continue
              </Link>
              <Link to="/portal/membership/checkout" className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
                Continue in portal
              </Link>
            </div>
          </section>

          <section className="mt-8 space-y-6">
            {faqGroups.map((group) => (
              <article key={group.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-950">{group.title}</h2>
                <div className="mt-6 space-y-4">
                  {group.items.map((item) => (
                    <div key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.answer}{" "}
                        {"includeTermsLink" in item && item.includeTermsLink ? (
                          <Link to={premiumMembershipRoutes.terms} className="font-semibold text-blue-700 hover:text-blue-800 hover:underline">
                            View Membership Terms.
                          </Link>
                        ) : null}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="mt-8 rounded-3xl border border-blue-200 bg-blue-50 p-8 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                Ready to compare the full membership inclusions?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                Review Free and Premium inclusions, then choose the membership tier that fits how you use the platform.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-0 sm:justify-end">
              <Link to={premiumMembershipRoutes.inclusions} className="inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800">
                View Membership Inclusions
              </Link>
              <Link to="/portal/membership/checkout" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100">
                Create account to continue
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
