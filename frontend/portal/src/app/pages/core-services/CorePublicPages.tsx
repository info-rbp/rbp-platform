import { Link } from "react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart2,
  CheckCircle,
  ClipboardCheck,
  FileText,
  Gauge,
  SearchCheck,
  ShieldAlert,
  Target,
  Users,
  Wrench,
} from "lucide-react";

import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { PageHero } from "../../components/PageHero";

type CoreServiceKey = "businessAdvisor" | "decisionDesk" | "theFixer" | "riskAdvisor" | "bidManagement";

type ServiceCard = {
  icon: LucideIcon;
  title: string;
  desc: string;
  tags?: string[];
};

type ServiceConfig = {
  title: string;
  accent: string;
  subtitle: string;
  image: string;
  bullets: string[];
  stat: { value: string; label: string; sublabel: string };
  stats: { value: string; label: string }[];
  overviewTitle: string;
  overview: string[];
  overviewBullets: string[];
  cardsTitle: string;
  cardsIntro: string;
  cards: ServiceCard[];
  stepsTitle: string;
  stepsIntro: string;
  steps: { title: string; desc: string }[];
  outcomeTitle: string;
  outcomeIntro: string;
  outcomes: string[];
};

const heroImages = {
  advisor:
    "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  decision:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  fixer:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  risk:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  bid:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
};

const services = [
  { title: "Business Advisor", href: "/core-services/business-advisor", icon: BarChart2, desc: "Structured business guidance for strategy, performance, risk, people, and operational questions." },
  { title: "Decision Desk", href: "/core-services/decision-desk", icon: ClipboardCheck, desc: "Written guidance to help members think through a specific business decision." },
  { title: "The Fixer", href: "/core-services/the-fixer", icon: Wrench, desc: "Focused problem-solving support for one clearly defined business issue." },
  { title: "Risk Advisor", href: "/core-services/risk-advisor", icon: ShieldAlert, desc: "Practical risk identification, prioritisation, and mitigation guidance." },
  { title: "Bid Management", href: "/core-services/bid-management", icon: FileText, desc: "Tender and proposal support from opportunity review through submission readiness." },
];

const configs: Record<CoreServiceKey, ServiceConfig> = {
  businessAdvisor: {
    title: "Meet Your",
    accent: "Business Advisor",
    subtitle: "Structured business guidance that helps members clarify priorities, identify risks, and make better decisions with a practical advisory framework.",
    image: heroImages.advisor,
    bullets: ["Strategic guidance", "Written recommendations", "Member-led advisory pathway"],
    stat: { value: "4", label: "Core Outcomes", sublabel: "Clarity, risk, options, next steps" },
    stats: [
      { value: "1", label: "Guided advisory pathway" },
      { value: "4", label: "Core decision areas" },
      { value: "100%", label: "Member focused" },
      { value: "Practical", label: "Recommendations" },
    ],
    overviewTitle: "Expert-level guidance, without the guesswork",
    overview: [
      "Business Advisor gives members a structured way to understand a business challenge before they commit time, money, or team energy to a course of action.",
      "This public page explains the service. Request submission and deeper workflows belong inside the logged-in member area, where context can be handled securely.",
    ],
    overviewBullets: ["Clarify the problem, context, and commercial impact", "Identify risks, options, and practical next steps", "Support decisions with a consistent advisory framework", "Connect the member to the right follow-on RBP service"],
    cardsTitle: "What Business Advisor can support",
    cardsIntro: "Use Business Advisor when you need an informed view before acting.",
    cards: [
      { icon: BarChart2, title: "Business performance", desc: "Review revenue, costs, margins, capacity, and growth blockers.", tags: ["Performance", "Profitability"] },
      { icon: ShieldAlert, title: "Risk and opportunity", desc: "Surface risks and options that may be hidden inside a decision.", tags: ["Risk", "Opportunity"] },
      { icon: Users, title: "Team and operations", desc: "Assess operating rhythm, roles, responsibilities, and practical execution gaps.", tags: ["People", "Operations"] },
    ],
    stepsTitle: "How Business Advisor works for members",
    stepsIntro: "The service is positioned publicly, then delivered through the secure member experience.",
    steps: [
      { title: "Choose the guidance area", desc: "Members select the type of advisory support they need from inside the member area." },
      { title: "Provide structured context", desc: "The member supplies the relevant business context, constraints, and goals." },
      { title: "Receive guidance", desc: "RBP provides a structured view of the issue, risks, options, and recommended next steps." },
      { title: "Take action", desc: "The member can use the guidance directly or move into another Core Service." },
    ],
    outcomeTitle: "What members receive",
    outcomeIntro: "Business Advisor is about clarity, structure, and decision support rather than generic advice sprinkled over a contact form.",
    outcomes: ["A structured view of the issue or opportunity", "Practical recommendations and priority actions", "Risk and constraint considerations", "Suggested next steps and relevant RBP service pathways"],
  },
  decisionDesk: {
    title: "Get Written Guidance from",
    accent: "Decision Desk",
    subtitle: "Decision Desk helps members turn a business question into structured written guidance with clear considerations, trade-offs, and next steps.",
    image: heroImages.decision,
    bullets: ["Written guidance", "Decision support", "Clear trade-offs"],
    stat: { value: "48hrs", label: "Target Response", sublabel: "For member guidance requests" },
    stats: [
      { value: "1", label: "Focused question" },
      { value: "Written", label: "Guidance format" },
      { value: "Clear", label: "Options and trade-offs" },
      { value: "Actionable", label: "Next steps" },
    ],
    overviewTitle: "A better way to think through a business decision",
    overview: [
      "Decision Desk is for members who need clear written guidance on a specific issue, choice, or business question.",
      "The public page explains the service only. Members submit Decision Desk requests inside the secure member area, not from the public website.",
    ],
    overviewBullets: ["Frame the decision and relevant context", "Outline practical options and trade-offs", "Highlight risks and dependencies", "Provide a written recommendation pathway"],
    cardsTitle: "Decision Desk is useful for",
    cardsIntro: "Use it when a member needs written guidance before taking action.",
    cards: [
      { icon: ClipboardCheck, title: "Commercial decisions", desc: "Pricing, offers, partnerships, resourcing, and operational choices.", tags: ["Commercial", "Options"] },
      { icon: FileText, title: "Written advice", desc: "A structured response that can be reviewed and shared internally.", tags: ["Written", "Structured"] },
      { icon: Target, title: "Next-step clarity", desc: "Guidance that turns uncertainty into a practical action path.", tags: ["Clarity", "Action"] },
    ],
    stepsTitle: "How Decision Desk works for members",
    stepsIntro: "The service is positioned publicly, then delivered through the secure member area.",
    steps: [
      { title: "Define the decision", desc: "The member identifies the question, deadline, and decision context." },
      { title: "Provide supporting detail", desc: "Relevant commercial, operational, or people information is supplied inside the member flow." },
      { title: "Receive written guidance", desc: "RBP responds with a structured view of options, trade-offs, and recommended next steps." },
      { title: "Move forward", desc: "The member can act on the guidance or connect it to another Core Service." },
    ],
    outcomeTitle: "What members receive",
    outcomeIntro: "Decision Desk produces practical written guidance, not a public submission widget pretending to be a service page.",
    outcomes: ["A clear summary of the decision being considered", "Options, trade-offs, and risk considerations", "Recommended direction or decision pathway", "Next steps the member can action or escalate"],
  },
  theFixer: {
    title: "Solve a Specific Problem with",
    accent: "The Fixer",
    subtitle: "The Fixer helps members focus on one business problem, define the root issue, and work toward practical resolution steps.",
    image: heroImages.fixer,
    bullets: ["Problem focus", "Root-cause thinking", "Resolution pathway"],
    stat: { value: "1", label: "Focused Problem", sublabel: "Resolved through a structured pathway" },
    stats: [
      { value: "Focused", label: "Problem definition" },
      { value: "Practical", label: "Resolution steps" },
      { value: "Clear", label: "Escalation pathway" },
      { value: "Member", label: "Access model" },
    ],
    overviewTitle: "One problem, properly defined",
    overview: [
      "The Fixer is built for situations where a business owner knows something is not working but needs help turning the mess into an actual plan.",
      "The public page explains the service. Intake, documents, updates, and follow-through are handled inside the secure member area.",
    ],
    overviewBullets: ["Clarify the symptoms and root cause", "Prioritise what needs to be fixed first", "Identify dependencies and blockers", "Create a practical resolution pathway"],
    cardsTitle: "Common problem areas",
    cardsIntro: "The Fixer is intentionally narrow: one defined problem, one practical pathway.",
    cards: [
      { icon: Wrench, title: "Operational issues", desc: "Process breakdowns, handover gaps, customer issues, or recurring errors.", tags: ["Operations", "Process"] },
      { icon: Users, title: "People and role issues", desc: "Role confusion, accountability gaps, workload pressure, or team friction.", tags: ["People", "Clarity"] },
      { icon: Gauge, title: "Execution blockers", desc: "Things that keep delaying, derailing, or overcomplicating progress.", tags: ["Blockers", "Action"] },
    ],
    stepsTitle: "How The Fixer works for members",
    stepsIntro: "The public page is informational; the member portal handles the actual request and follow-up process.",
    steps: [
      { title: "Define the problem", desc: "The member identifies one specific business problem and the impact it is creating." },
      { title: "Map the cause", desc: "RBP helps separate symptoms from root causes, constraints, and dependencies." },
      { title: "Set the pathway", desc: "The member receives practical steps to reduce, resolve, or escalate the issue." },
      { title: "Review next action", desc: "The member can move into further support if the issue needs deeper work." },
    ],
    outcomeTitle: "What members receive",
    outcomeIntro: "The Fixer keeps the focus narrow enough to be useful, which is apparently radical in a world addicted to endless discovery calls.",
    outcomes: ["A defined problem statement", "Root-cause and impact considerations", "Prioritised resolution steps", "Recommended follow-on support if needed"],
  },
  riskAdvisor: {
    title: "Strengthen Decisions with",
    accent: "Risk Advisor",
    subtitle: "Risk Advisor helps members understand business risks, prioritise exposure, and identify practical controls before issues become expensive surprises.",
    image: heroImages.risk,
    bullets: ["Risk identification", "Control planning", "Practical mitigation"],
    stat: { value: "Prioritised", label: "Risk View", sublabel: "Exposure, impact, and action" },
    stats: [
      { value: "Identify", label: "Risk areas" },
      { value: "Assess", label: "Impact and likelihood" },
      { value: "Prioritise", label: "What matters first" },
      { value: "Mitigate", label: "Practical controls" },
    ],
    overviewTitle: "A practical view of risk, not fear theatre",
    overview: [
      "Risk Advisor helps members review potential threats across operations, finance, people, compliance, suppliers, systems, and growth decisions.",
      "It is designed to make risk easier to understand and act on, while keeping sensitive request information inside the secure member environment.",
    ],
    overviewBullets: ["Identify relevant business risks", "Prioritise risks by impact and urgency", "Clarify mitigation options and controls", "Connect risks to practical next steps"],
    cardsTitle: "Risk areas covered",
    cardsIntro: "Use Risk Advisor when a member needs a structured view of exposure and mitigation.",
    cards: [
      { icon: ShieldAlert, title: "Operational risk", desc: "Process, supplier, customer, system, and delivery vulnerabilities.", tags: ["Operations", "Controls"] },
      { icon: BarChart2, title: "Commercial risk", desc: "Financial, pricing, customer concentration, and cash flow exposure.", tags: ["Finance", "Exposure"] },
      { icon: FileText, title: "Governance risk", desc: "Policy, compliance, documentation, and accountability gaps.", tags: ["Governance", "Compliance"] },
    ],
    stepsTitle: "How Risk Advisor works for members",
    stepsIntro: "The public page explains the service; the detailed risk context is submitted securely after login.",
    steps: [
      { title: "Select the risk focus", desc: "The member identifies the area of concern or decision being reviewed." },
      { title: "Provide context", desc: "Relevant operational, financial, people, or compliance context is supplied securely." },
      { title: "Prioritise exposure", desc: "Risks are organised by likely impact, urgency, and practical importance." },
      { title: "Plan mitigation", desc: "The member receives practical control and action considerations." },
    ],
    outcomeTitle: "What members receive",
    outcomeIntro: "Risk Advisor turns vague unease into a structured risk view. Sadly, it cannot stop humans from ignoring obvious warnings, but it tries.",
    outcomes: ["A structured summary of relevant risks", "Prioritisation by impact and urgency", "Control and mitigation considerations", "Recommended next steps or escalation pathway"],
  },
  bidManagement: {
    title: "Improve Tender Outcomes with",
    accent: "Bid Management",
    subtitle: "Bid Management helps members understand tender opportunities, prepare stronger submissions, and manage the proposal process with more discipline.",
    image: heroImages.bid,
    bullets: ["Tender support", "Proposal structure", "Submission readiness"],
    stat: { value: "End-to-end", label: "Bid Support", sublabel: "Opportunity to submission" },
    stats: [
      { value: "Assess", label: "Bid/no-bid fit" },
      { value: "Plan", label: "Response strategy" },
      { value: "Prepare", label: "Submission content" },
      { value: "Review", label: "Compliance and quality" },
    ],
    overviewTitle: "Better bids start with better structure",
    overview: [
      "Bid Management supports members with tenders, proposals, and submissions where clarity, compliance, and presentation matter.",
      "This public page positions Bid Management as part of Core Services. Detailed tender documents and request workflows are handled inside the member environment.",
    ],
    overviewBullets: ["Assess whether an opportunity is worth pursuing", "Structure the response around evaluation criteria", "Improve clarity, compliance, and persuasiveness", "Prepare for submission and follow-up steps"],
    cardsTitle: "Bid Management can support",
    cardsIntro: "Use this service when a member needs help deciding, planning, or improving a bid response.",
    cards: [
      { icon: SearchCheck, title: "Opportunity review", desc: "Assess tender fit, requirements, deadlines, and likely effort.", tags: ["Tender", "Fit"] },
      { icon: FileText, title: "Proposal structure", desc: "Organise content against criteria, compliance needs, and buyer expectations.", tags: ["Proposal", "Compliance"] },
      { icon: ClipboardCheck, title: "Submission readiness", desc: "Review completeness, quality, evidence, and final response requirements.", tags: ["Readiness", "Quality"] },
    ],
    stepsTitle: "How Bid Management works for members",
    stepsIntro: "Public visitors see the offer; members manage bid documents and support requests securely.",
    steps: [
      { title: "Review the opportunity", desc: "The member provides opportunity details through the member area." },
      { title: "Assess bid fit", desc: "RBP helps evaluate requirements, risk, effort, and commercial value." },
      { title: "Plan the response", desc: "The response is structured around the criteria, evidence, and differentiators." },
      { title: "Prepare next steps", desc: "The member receives support direction for drafting, review, submission, or debrief." },
    ],
    outcomeTitle: "What members receive",
    outcomeIntro: "Bid Management helps make submissions clearer and more controlled, which is generally preferable to panic-writing at midnight before a deadline.",
    outcomes: ["Bid/no-bid assessment considerations", "Response structure and planning guidance", "Compliance and evidence checklist support", "Submission readiness and improvement recommendations"],
  },
};

function MembershipCta() {
  return (
    <section className="py-16 bg-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 lg:p-10 shadow-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700 mb-3">Membership access</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-3">Unlock Core Services through your RBP membership</h2>
            <p className="text-slate-600 leading-relaxed">Core Services are designed for members who need structured guidance, written advice, and practical support. Sign up to access the secure member workflows.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/membership/sign-up-now" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-800 transition-all">
              Sign Up for Membership <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/core-services" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
              Explore Core Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicePage({ config }: { config: ServiceConfig }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        title={config.title}
        titleAccent={config.accent}
        subtitle={config.subtitle}
        badge="Core Services"
        breadcrumb={config.accent}
        image={config.image}
        bullets={config.bullets}
        ctaPrimary={{ label: "Sign Up for Membership", href: "/membership/sign-up-now" }}
        ctaSecondary={{ label: "Explore Core Services", href: "/core-services" }}
        stat={config.stat}
      />

      <div className="bg-blue-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {config.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-5">What Is It?</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">{config.overviewTitle}</h2>
              {config.overview.map((paragraph) => <p key={paragraph} className="text-slate-600 leading-relaxed mb-6">{paragraph}</p>)}
              <div className="space-y-3 mt-8">
                {config.overviewBullets.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {config.cards.slice(0, 4).map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-sm transition-all">
                    <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4"><Icon className="w-5 h-5" /></div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1.5">{card.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{card.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full mb-4">Service Focus</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">{config.cardsTitle}</h2>
            <p className="text-slate-600 leading-relaxed">{config.cardsIntro}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {config.cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="border border-slate-200 bg-white rounded-2xl p-7 hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="w-11 h-11 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-5"><Icon className="w-5 h-5" /></div>
                  <h3 className="font-bold text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{card.desc}</p>
                  {card.tags && <div className="flex flex-wrap gap-2">{card.tags.map((tag) => <span key={tag} className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1">{tag}</span>)}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 lg:py-28 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">{config.stepsTitle}</h2>
            <p className="text-slate-600 leading-relaxed">{config.stepsIntro}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-[3.25rem] left-[12.5%] right-[12.5%] h-px bg-slate-200 z-0" />
            {config.steps.map((step, index) => (
              <div key={step.title} className="relative bg-white border border-slate-100 rounded-2xl p-7 shadow-sm flex flex-col items-start z-10">
                <div className="absolute top-4 right-5 text-slate-100 font-extrabold text-5xl select-none leading-none">{String(index + 1).padStart(2, "0")}</div>
                <div className="w-12 h-12 bg-blue-700 rounded-2xl flex items-center justify-center mb-5 shadow-md"><CheckCircle className="w-6 h-6 text-white" /></div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Step {index + 1}</div>
                <h3 className="font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/30 border border-blue-500/30 rounded-full mb-6"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /><span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Member Outcome</span></span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 leading-tight">{config.outcomeTitle}</h2>
              <p className="text-slate-300 leading-relaxed mb-8">{config.outcomeIntro}</p>
              <div className="space-y-3">
                {config.outcomes.map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-700/40 border border-blue-500/30 flex items-center justify-center flex-shrink-0"><span className="text-xs font-extrabold text-blue-300">{index + 1}</span></div>
                    <span className="text-slate-200 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-slate-900 shadow-2xl">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <div><div className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-0.5">Core Service Overview</div><div className="font-extrabold text-slate-900">{config.accent}</div></div>
                <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center flex-shrink-0"><FileText className="w-5 h-5 text-white" /></div>
              </div>
              <div className="space-y-4">
                {["Service purpose", "Member context", "Guidance output", "Next steps"].map((label, index) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</div>
                    <div className="space-y-1.5"><div className="h-2 rounded-full bg-slate-200" /><div className={`h-2 rounded-full bg-slate-200 ${index % 2 === 0 ? "w-3/4" : "w-5/6"}`} /></div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between"><div className="text-xs text-slate-400 font-medium">Available through membership</div><span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Member Service</span></div>
            </div>
          </div>
        </div>
      </section>

      <MembershipCta />
      <Footer />
    </div>
  );
}

export function CoreServicesLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        title="Explore"
        titleAccent="Core Services"
        subtitle="Core Services bring together RBP's main advisory, decision support, problem-solving, risk, and bid management services for members."
        badge="Core Services"
        breadcrumb="Core Services"
        image={heroImages.advisor}
        bullets={["Business guidance", "Written advice", "Member service pathways"]}
        ctaPrimary={{ label: "Sign Up for Membership", href: "/membership/sign-up-now" }}
        ctaSecondary={{ label: "Compare Core Services", href: "#core-service-list" }}
        stat={{ value: "5", label: "Core Services", sublabel: "Advisor, Decision Desk, Fixer, Risk, Bid" }}
      />
      <section id="core-service-list" className="py-20 lg:py-28 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-5">Core service overview</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-5">Guidance and support for common business pressure points</h2>
            <p className="text-slate-600 leading-relaxed">These pages explain what each service is and when to use it. Service requests, document uploads, and client-specific workflows happen after members sign in.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link key={service.href} to={service.href} className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
                  <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-5"><Icon className="w-6 h-6" /></div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600 mb-5">{service.desc}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-700">Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full mb-5">How Core Services work</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">Public overview first, secure member workflow second</h2>
              <p className="text-slate-600 leading-relaxed mb-6">The public site helps visitors understand the service offer. Once a user becomes a member, request submission, files, status updates, and service history are handled in the authenticated member area.</p>
              <div className="space-y-3">
                {["Choose the Core Service that matches the issue", "Sign up or sign in as a member", "Submit the request through the secure member area", "Track guidance, outcomes, and next steps from the portal"].map((item) => (
                  <div key={item} className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /><span className="text-slate-700 font-medium text-sm">{item}</span></div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300 mb-4">Core Services</p>
              <h3 className="text-2xl font-extrabold mb-5">Designed for members, explained for visitors</h3>
              <p className="text-slate-300 leading-relaxed mb-6">This structure keeps the frontend website clean while preserving the secure backend/member workflow for actual requests. Astonishingly, the public site does not need to be a filing cabinet with buttons.</p>
              <Link to="/membership/sign-up-now" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-800 transition-all">Sign Up for Membership <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>
      <MembershipCta />
      <Footer />
    </div>
  );
}

export function CoreBusinessAdvisorPage() {
  return <ServicePage config={configs.businessAdvisor} />;
}

export function CoreDecisionDeskPage() {
  return <ServicePage config={configs.decisionDesk} />;
}

export function CoreTheFixerPage() {
  return <ServicePage config={configs.theFixer} />;
}

export function CoreRiskAdvisorPage() {
  return <ServicePage config={configs.riskAdvisor} />;
}

export function CoreBidManagementPage() {
  return <ServicePage config={configs.bidManagement} />;
}
