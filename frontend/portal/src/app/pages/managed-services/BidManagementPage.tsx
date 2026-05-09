import { Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { CTABanner } from "../../components/CTABanner";
import { PageHero } from "../../components/PageHero";
import { BarChart3, ArrowRight, CheckCircle } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1758611972678-bc3b29b4718f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG9wZXJhdGlvbnMlMjB0ZWFtJTIwbWFuYWdlbWVudCUyMG9mZmljZXxlbnwxfHx8fDE3Nzc1NDY4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080";

const deliverables = ["Tender opportunity identification & monitoring","Bid/no-bid assessment support","Full proposal writing & editing","Compliance & eligibility checklist management","Submission coordination & deadline management","Debrief & feedback review post-submission","Pipeline reporting & strategy sessions"];

const steps = [
  { title: "Opportunity identification", desc: "We monitor public and private sector portals to identify relevant opportunities for your business." },
  { title: "Bid strategy & assessment", desc: "We assess each opportunity for fit, winnability, and resource requirements before recommending a bid/no-bid decision." },
  { title: "Proposal development", desc: "Our bid writers develop a compelling, compliant proposal that highlights your strengths and addresses the evaluators' requirements." },
  { title: "Submission & follow-up", desc: "We manage submission and coordinate post-submission feedback and debrief sessions." },
];

export function BidManagementPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <PageHero
        title="Bid Management"
        titleAccent="Service"
        subtitle="End-to-end management of tenders, bids, and proposals — from opportunity identification through to submission and debrief."
        badge="Managed Services"
        breadcrumb="Bid Management"
        image={heroImage}
        bullets={["Opportunity monitoring", "Full proposal writing", "Submission management"]}
        ctaPrimary={{ label: "Enquire About Bid Management", href: "/contact" }}
        ctaSecondary={{ label: "All Managed Services", href: "/managed-services" }}
        stat={{ value: "End-to-end", label: "Bid Support", sublabel: "Identification to submission" }}
      />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">What's included</h2>
              <ul className="space-y-3">
                {deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> {d}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/contact" className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5">
                  Start a Conversation <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">How we work</h2>
              <div className="space-y-5">
                {steps.map((s, i) => (
                  <div key={s.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center font-extrabold text-xs flex-shrink-0">{i + 1}</div>
                      {i < steps.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                    </div>
                    <div className="pb-4">
                      <div className="font-bold text-slate-900 mb-1 text-sm">{s.title}</div>
                      <div className="text-slate-500 text-sm leading-relaxed">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <CTABanner />
      <Footer />
    </div>
  );
}
