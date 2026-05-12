import { Link } from "react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart2,
  CheckCircle,
  ClipboardCheck,
  FileText,
  Gauge,
  Lightbulb,
  MessageSquare,
  SearchCheck,
  ShieldAlert,
  Target,
  Users,
  Wrench,
} from "lucide-react";

import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { PageHero } from "../../components/PageHero";
import { CTABanner } from "../../components/CTABanner";

type Stat = {
  value: string;
  label: string;
};

type SectionCard = {
  icon: LucideIcon;
  title: string;
  desc: string;
  tags?: string[];
};

type Step = {
  title: string;
  desc: string;
};

type FAQ = {
  q: string;
  a: string;
};

type CoreServiceConfig = {
  title: string;
  accent: string;
  badge: string;
  subtitle: string;
  heroImage: string;
  bullets: string[];
  stat: { value: string; label: string; sublabel: string };
  stats: Stat[];
  overviewTitle: string;
  overview: string[];
  overviewBullets: string[];
  cardsTitle: string;
  cardsIntro: string;
  cards: SectionCard[];
  stepsTitle: string;
  stepsIntro: string;
  steps: Step[];
  darkTitle: string;
  darkIntro: string;
  deliverables: string[];
  faqs: FAQ[];
};

const memberCta = {
  eyebrow: "Membership access",
  title: "Unlock Core Services through your RBP membership",
  description:
    "Core Services are designed for members who need structured guidance, written advice, and practical support without turning the public website into a request form circus.",
  primaryCta: { label: "Create account to continue", href: "/portal/membership/checkout" },
  secondaryCta: { label: "Explore Core Services", href: "/core-services" },
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

const configs = {
  businessAdvisor: {
    title: "Meet Your",
    accent: "Business Advisor",
    badge: "Core Services",
    subtitle:
      "Structured business guidance that helps members clarify priorities, identify risks, and make better decisions with a practical advisory framework.",
    heroImage: heroImages.advisor,
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
      "The service is designed as a front-end overview here, with request submission and deeper workflows handled inside the logged-in member portal.",
    ],
    overviewBullets: [
      "Clarify the problem, context, and commercial impact",
      "Identify risks, options, and practical next steps",
      "Support decisions with a consistent advisory framework",
      "Connect the member to the right follow-on RBP service",
    ],
    cardsTitle: "What Business Advisor can support",
    cardsIntro: "Use Business Advisor when you need an informed view before acting.",
    cards: [
      { icon: BarChart2, title: "Business performance", desc: "Review revenue, costs, margins, capacity, and growth blockers.", tags: ["Performance", "Profitability"] },
      { icon: ShieldAlert, title: "Risk and opportunity", desc: "Surface risks and options that may be hidden inside a decision.", tags: ["Risk", "Opportunity"] },
      { icon: Users, title: "Team and operations", desc: "Assess operating rhythm, roles, responsibilities, and practical execution gaps.", tags: ["People", "Operations"] },
    ],
    stepsTitle: "How the service works for members",
    stepsIntro: "The public page explains the service; member requests happen after sign-up and login.",
    steps: [
      { title: "Choose the guidance area", desc: "Members select the type of advisory support they need from inside the member experience." },
      { title: "Provide structured context", desc: "The member supplies the relevant business context, constraints, and goals." },
      { title: "Receive guidance", desc: "RBP provides a structured view of the issue, risks, options, and recommended next steps." },
      { title: "Take action", desc: "The member can use the guidance directly or move into another Core Service." },
    ],
    darkTitle: "What members receive",
    darkIntro: "Business Advisor is about clarity, structure, and decision support rather than generic advice sprinkled over a contact form.",
    deliverables: [
      "A structured view of the issue or opportunity",
      "Practical recommendations and priority actions",
      "Risk and constraint considerations",
      "Suggested next steps and relevant RBP service pathways",
    ],
    faqs: [
      { q: "Can visitors submit a Business Advisor request from this page?", a: "No. This is a public information page. Requests and member-specific workflows are handled after a user signs up and logs in." },
      { q: "Is Business Advisor only for major strategic decisions?", a: "No. It can support practical day-to-day decisions as well as larger operational, financial, people, or growth questions." },
      { q: "Do I need a membership?", a: "Yes. Core Services are designed to be accessed through membership so guidance can be managed securely and consistently." },
    ],
  },
  decisionDesk: {
    title: "Get Written Guidance from",
    accent: "Decision Desk",
    badge: "Core Services",
    subtitle:
      "Decision Desk helps members turn a business question into structured written guidance with clear considerations, trade-offs, and next steps.",
    heroImage: heroImages.decision,
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
      "The public page now explains the service only. The old request flow belongs inside the member portal, because apparently public nav bars should not double as backend workflow engines.",
    ],
    overviewBullets: [
      "Frame the decision and relevant context",
      "Outline practical options and trade-offs",
      "Highlight risks and dependencies",
      "Provide a written recommendation pathway",
    ],
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
    darkTitle: "What members receive",
    darkIntro: "Decision Desk produces practical written guidance, not a public submission widget pretending to be a service page.",
    deliverables: [
      "A clear summary of the decision being considered",
      "Options, trade-offs, and risk considerations",
      "Recommended direction or decision pathway",
      "Next steps the member can action or escalate",
    ],
    faqs: [
      { q: "Where does a member submit a Decision Desk request?", a: "Inside the logged-in member experience, not from the public website page." },
      { q: "What kind of decisions can Decision Desk support?", a: "Commercial, operational, people, supplier, customer, pricing, growth, and general business decisions." },
      { q: "Is the response tailored?", a: "Yes. The guidance is based on the context supplied by the member through the secure workflow." },
    ],
  },
  theFixer: {
    title: "Solve a Specific Problem with",
    accent: "The Fixer",
    badge: "Core Services",
    subtitle:
      "The Fixer helps members focus on one business problem, define the root issue, and work toward practical resolution steps.",
    heroImage: heroImages.fixer,
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
      "The public page explains the service. Intake, documents, updates, and follow-through belong in the secure member area where they can be managed properly.",
    ],
    overviewBullets: [
      "Clarify the symptoms and root cause",
      "Prioritise what needs to be fixed first",
      "Identify dependencies and blockers",
      "Create a practical resolution pathway",
    ],
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
    darkTitle: "What members receive",
    darkIntro: "The Fixer keeps the focus narrow enough to be useful, which is apparently radical in a world addicted to endless discovery calls.",
    deliverables: [
      "A defined problem statement",
      "Root-cause and impact considerations",
      "Prioritised resolution steps",
      "Recommended follow-on support if needed",
    ],
    faqs: [
      { q: "Is The Fixer for broad strategy?", a: "No. It is best for one clear, specific business problem that needs practical resolution." },
      { q: "Can visitors submit a problem from the public page?", a: "No. The request flow is handled after membership sign-up and login." },
      { q: "What happens if the issue is complex?", a: "The member can be guided toward a broader advisory, managed service, or custom solution pathway." },
    ],
  },
  riskAdvisor: {
    title: "Strengthen Decisions with",
    accent: "Risk Advisor",
    badge: "Core Services",
    subtitle:
      "Risk Advisor helps members understand business risks, prioritise exposure, and identify practical controls before issues become expensive surprises.",
    heroImage: heroImages.risk,
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
    overviewBullets: [
      "Identify relevant business risks",
      "Prioritise risks by impact and urgency",
      "Clarify mitigation options and controls",
      "Connect risks to practical next steps",
    ],
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
    darkTitle: "What members receive",
    darkIntro: "Risk Advisor turns vague unease into a structured risk view. Sadly, it cannot stop humans from ignoring obvious warnings, but it tries.",
    deliverables: [
      "A structured summary of relevant risks",
      "Prioritisation by impact and urgency",
      "Control and mitigation considerations",
      "Recommended next steps or escalation pathway",
    ],
    faqs: [
      { q: "Is Risk Advisor legal or financial advice?", a: "It is business risk guidance. Where specialist advice is needed, the member can be directed to the right professional pathway." },
      { q: "Can non-members submit risk details from the public page?", a: "No. Risk details should be submitted through the secure member workflow after login." },
      { q: "What risks can be reviewed?", a: "Operational, commercial, governance, supplier, people, technology, process, and growth-related risks." },
    ],
  },
  bidManagement: {
    title: "Improve Tender Outcomes with",
    accent: "Bid Management",
    badge: "Core Services",
    subtitle:
      "Bid Management helps members understand tender opportunities, prepare stronger submissions, and manage the proposal process with more discipline.",
    heroImage: heroImages.bid,
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
      "This public page now positions Bid Management as part of Core Services. Detailed tender documents and request workflows are handled inside the member environment, where they belong. Shocking restraint.",
    ],
    overviewBullets: [
      "Assess whether an opportunity is worth pursuing",
      "Structure the response around evaluation criteria",
      "Improve clarity, compliance, and persuasiveness",
      "Prepare for submission and follow-up steps",
    ],
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
    darkTitle: "What members receive",
    darkIntro: "Bid Management helps make submissions clearer and more controlled, which is generally preferable to panic-writing at midnight before a deadline.",
    deliverables: [
      "Bid/no-bid assessment considerations",
      "Response structure and planning guidance",
      "Compliance and evidence checklist support",
      "Submission readiness and improvement recommendations",
    ],
    faqs: [
      { q: "Is Bid Management still under Managed Services?", a: "It is now presented under Core Services in the public menu, with compatible old routes redirected to the new core-services path." },
      { q: "Can visitors upload tender documents here?", a: "No. Tender documents and support workflows should be handled through the secure member area." },
      { q: "Can RBP write the full bid?", a: "Depending on membership, scope, and timing, members can be guided toward proposal writing, review, or managed support options." },
    ],
  },
} satisfies Record<string, CoreServiceConfig>;

function CoreServicePage({ config }: { config: CoreServiceConfig }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <PageHero
        title={config.title}
        titleAccent={config.accent}
        subtitle={config.subtitle}
        badge={config.badge}
        breadcrumb={config.accent}
        image={config.heroImage}
        bullets={config.bullets}
        ctaPrimary={{ label: "Create account to continue", href: "/portal/membership/checkout" }}
        ctaSecondary={{ label: "Explore Core Services", href: "/core-services" }}
        stat={config.stat}
      />

      <div className="bg-blue-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {config.stats.map((stat) => (
              <div key={`${config.accent}-${stat.label}`}>
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
              <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-5">
                What Is It?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                {config.overviewTitle}
              </h2>
              {config.overview.map((paragraph) => (
                <p key={paragraph} className="text-slate-600 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
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
                    <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
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
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full mb-4">
              Service Focus
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {config.cardsTitle}
            </h2>
            <p className="text-slate-600 leading-relaxed">{config.cardsIntro}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {config.cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="border border-slate-200 bg-white rounded-2xl p-7 hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="w-11 h-11 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{card.desc}</p>
                  {card.tags && (
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag) => (
                        <span key={tag} className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 lg:py-28 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {config.stepsTitle}
            </h2>
            <p className="text-slate-600 leading-relaxed">{config.stepsIntro}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-[3.25rem] left-[12.5%] right-[12.5%] h-px bg-slate-200 z-0" />
            {config.steps.map((step, index) => (
              <div key={step.title} className="relative bg-white border border-slate-100 rounded-2xl p-7 shadow-sm flex flex-col items-start z-10">
                <div className="absolute top-4 right-5 text-slate-100 font-extrabold text-5xl select-none leading-none">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="w-12 h-12 bg-blue-700 rounded-2xl flex items-center justify-center mb-5 shadow-md">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
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
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/30 border border-blue-500/30 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Member Outcome</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 leading-tight">
                {config.darkTitle}
              </h2>
              <p className="text-slate-300 leading-relaxed mb-8">{config.darkIntro}</p>
              <div className="space-y-3">
                {config.deliverables.map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-700/40 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-extrabold text-blue-300">{index + 1}</span>
                    </div>
                    <span className="text-slate-200 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 text-slate-900 shadow-2xl">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-0.5">Core Service Overview</div>
                  <div className="font-extrabold text-slate-900">{config.accent}</div>
                </div>
                <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                {["Service purpose", "Member pathway", "What to prepare", "Next steps"].map((section, index) => (
                  <div key={section} className="bg-slate-50 rounded-xl p-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{section}</div>
                    <div className="space-y-1.5">
                      <div className="h-2 rounded-full bg-slate-200 w-full" />
                      <div className={`h-2 rounded-full bg-slate-200 ${index % 2 === 0 ? "w-3/4" : "w-5/6"}`} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-400 font-medium">Available through membership</div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Public Overview</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
              FAQs
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Common questions</h2>
          </div>
          <div className="space-y-3">
            {config.faqs.map((faq) => (
              <div key={faq.q} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/portal/membership/checkout"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              Create account to continue
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </div>
  );
}

export function BusinessAdvisorPage() {
  return <CoreServicePage config={configs.businessAdvisor} />;
}

export function DecisionDeskPage() {
  return <CoreServicePage config={configs.decisionDesk} />;
}

export function TheFixerPage() {
  return <CoreServicePage config={configs.theFixer} />;
}

export function RiskAdvisorPage() {
  return <CoreServicePage config={configs.riskAdvisor} />;
}

export function BidManagementPage() {
  return <CoreServicePage config={configs.bidManagement} />;
}
