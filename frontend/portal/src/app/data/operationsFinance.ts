import type { FaqItem } from "./operationsInsurance";

export interface FinanceProduct {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  commonUses: string[];
  whoSuits: string[];
  lenderInfo: string[];
  considerations: string[];
  related: string[];
  ctaLabel: string;
  faqItems: FaqItem[];
}

export const financeDisclaimer =
  "Remote Business Partner provides general information and referral pathways for business finance. We do not provide personal financial advice or guarantee approval. Finance approval, rates, fees, and terms are subject to lender criteria, assessment, documentation, and eligibility. Calculators provide indicative estimates only.";

export const financeGiftCardCopy =
  "Premium Members may receive a $250 gift card when eligible finance is approved and disbursed through the RBP referral pathway.";

export const financeReferralPath = "/operations/finance/get-funded";

function financeProduct(
  slug: string,
  title: string,
  shortDescription: string,
  commonUses: string[],
  whoSuits: string[],
  considerations: string[],
  ctaLabel: string,
  related: string[],
): FinanceProduct {
  return {
    slug,
    title,
    shortDescription,
    longDescription: `${title} can help businesses explore funding options for ${shortDescription.toLowerCase()} RBP currently handles this as an internal referral enquiry while a finance provider is being finalised, then reviews the best next step with the business.`,
    commonUses,
    whoSuits,
    lenderInfo: [
      "Business identification, ABN, and trading history",
      "Recent bank statements, financials, or revenue evidence",
      "Requested amount, purpose of funds, and preferred timeframe",
      "Existing debts, assets, liabilities, and director details where required",
    ],
    considerations,
    related,
    ctaLabel,
    faqItems: [
      {
        question: "Does RBP provide this finance directly?",
        answer:
          "No. RBP provides general information and an internal referral pathway. Approval, rates, fees, terms, and documentation are subject to lender criteria and assessment.",
      },
      {
        question: "Is approval guaranteed?",
        answer:
          "No. Finance approval depends on lender assessment, business profile, credit history, documentation, security where applicable, and eligibility.",
      },
      {
        question: "What happens after I submit the form?",
        answer:
          "The RBP team reviews the enquiry and follows up about the next steps. The current form uses a frontend mailto fallback until backend email sending is added.",
      },
    ],
  };
}

export const financeProducts: FinanceProduct[] = [
  financeProduct(
    "commercial-finance",
    "Commercial Finance",
    "asset purchase, expansion, working capital, and broader commercial growth.",
    ["Business expansion", "Asset purchase", "Working capital", "Commercial projects"],
    ["Established businesses", "Growing teams", "Owners comparing funding structures", "Businesses with mixed funding needs"],
    ["Different lending products suit different purposes.", "Security, term, fees, and repayment structure can materially change total cost."],
    "Get Commercial Finance Now",
    ["chattel-mortgage", "unsecured-business-loans", "cashflow-finance"],
  ),
  financeProduct(
    "chattel-mortgage",
    "Chattel Mortgage",
    "business assets where the business takes ownership and the lender takes security over the asset.",
    ["Business vehicles", "Equipment", "Machinery", "Commercial assets"],
    ["Businesses buying identifiable assets", "Operators wanting asset ownership", "Vehicle and equipment buyers", "GST-registered businesses seeking accountant input"],
    ["Balloon payments can lower regular repayments but increase the final amount due.", "Tax and GST outcomes should be checked with an accountant."],
    "Get Chattel Mortgage Finance",
    ["business-vehicle-finance", "commercial-equipment-finance", "commercial-finance"],
  ),
  financeProduct(
    "unsecured-business-loans",
    "Unsecured Business Loans",
    "business funding that may not require specific asset security.",
    ["Working capital", "Growth", "Marketing", "Inventory", "Short-term cash needs"],
    ["Businesses with trading history", "Owners needing flexible funding", "Businesses without a specific asset purchase", "Operators needing faster enquiry review"],
    ["Rates may be higher than secured finance.", "Lenders still assess trading profile, credit, revenue, and affordability."],
    "Get Unsecured Funding",
    ["cashflow-finance", "commercial-finance", "other-lending"],
  ),
  financeProduct(
    "commercial-equipment-finance",
    "Commercial Equipment Finance",
    "equipment purchases, leases, hire purchase, or other asset funding structures.",
    ["Machinery", "Tools", "Technology", "Medical equipment", "Hospitality equipment"],
    ["Businesses upgrading equipment", "Operators buying revenue-generating assets", "Trades and workshops", "Hospitality, medical, and service businesses"],
    ["Equipment age, supplier details, and asset type can affect lender appetite.", "Maintenance, insurance, and residual value should be considered."],
    "Get Equipment Finance",
    ["chattel-mortgage", "machinery-breakdown", "business-vehicle-finance"],
  ),
  financeProduct(
    "business-vehicle-finance",
    "Business Vehicle Finance",
    "cars, vans, utes, trucks, and fleet vehicles used by the business.",
    ["Single vehicle purchases", "Utes and vans", "Trucks", "Fleet upgrades"],
    ["Trades", "Delivery businesses", "Sales teams", "Businesses replacing or expanding vehicles"],
    ["Vehicle use, deposit, term, balloon, and ownership structure matter.", "Insurance, running costs, and tax treatment should be reviewed."],
    "Get Vehicle Finance",
    ["chattel-mortgage", "commercial-equipment-finance", "novated-leasing"],
  ),
  financeProduct(
    "novated-leasing",
    "Novated Leasing",
    "employee vehicle salary packaging options at a high level.",
    ["Employee vehicle benefits", "Salary packaging", "Fleet-adjacent employee arrangements", "Vehicle cost planning"],
    ["Employees and employers reviewing salary packaging", "Businesses with payroll capability", "Teams considering vehicle benefits", "Employees comparing personal vehicle options"],
    ["Tax, payroll, employer policy, and eligibility considerations apply.", "Independent tax and payroll advice should be obtained before proceeding."],
    "Ask About Novated Leasing",
    ["business-vehicle-finance", "chattel-mortgage", "other-lending"],
  ),
  financeProduct(
    "cashflow-finance",
    "Cashflow Finance",
    "timing gaps, short-term working capital, or uneven cash flow.",
    ["Supplier payments", "Payroll timing", "Seasonal trading gaps", "Short-term working capital"],
    ["Businesses with timing mismatches", "Operators managing growth", "Seasonal businesses", "Businesses waiting on receivables"],
    ["Short-term finance should be matched to the timing of incoming cash.", "Fees and repayment frequency can affect cash flow."],
    "Get Cashflow Support",
    ["unsecured-business-loans", "debtor-finance", "commercial-finance"],
  ),
  financeProduct(
    "debtor-finance",
    "Debtor Finance",
    "using unpaid invoices to access cash sooner.",
    ["Long customer payment terms", "Growth while invoices remain unpaid", "Contractor and B2B service models", "Working capital tied to receivables"],
    ["B2B businesses", "Contractors", "Companies with strong invoices", "Businesses with slow-paying customers"],
    ["Customer concentration, invoice quality, and debtor ageing matter.", "This may not suit every customer relationship or invoice profile."],
    "Get Debtor Finance",
    ["cashflow-finance", "unsecured-business-loans", "commercial-finance"],
  ),
  financeProduct(
    "construction-loans",
    "Construction Loans",
    "building, development, renovation, fit-out, or project-based construction needs.",
    ["Building projects", "Development finance", "Renovation and fit-out", "Project-based construction cash flow"],
    ["Builders and developers", "Businesses fitting out premises", "Owners with staged project costs", "Operators needing construction-specific review"],
    ["Valuations, permits, contracts, staged drawdowns, and project feasibility may be required.", "Construction finance can be more document-heavy than standard business lending."],
    "Get Construction Finance",
    ["commercial-finance", "other-lending", "commercial-equipment-finance"],
  ),
  financeProduct(
    "other-lending",
    "Other Lending",
    "custom finance enquiries that do not fit the standard categories.",
    ["Fit-out finance", "Franchise finance", "Acquisition finance", "Bridging requirements", "Custom commercial lending"],
    ["Businesses with unusual funding needs", "Owners unsure which product fits", "Acquisition or franchise buyers", "Operators needing referral triage"],
    ["The right structure depends on the purpose, security, timeframe, trading profile, and lender appetite.", "RBP will review the enquiry before suggesting next steps."],
    "Discuss Other Lending Options",
    ["commercial-finance", "unsecured-business-loans", "cashflow-finance"],
  ),
];

export const financeCalculatorPages = [
  {
    slug: "commercial-loan-calculator",
    title: "Commercial Loan Calculator",
    description: "Estimate indicative repayment scenarios for a commercial loan.",
  },
  {
    slug: "chattel-mortgage-calculator",
    title: "Chattel Mortgage Calculator",
    description: "Estimate indicative repayments for business vehicles and asset finance.",
  },
  {
    slug: "borrowing-capacity-calculator",
    title: "Borrowing Capacity Calculator",
    description: "Estimate a high-level borrowing capacity range from business surplus.",
  },
];

export const financeFaqs: FaqItem[] = [
  {
    question: "Does RBP provide finance directly?",
    answer:
      "No. RBP provides general information and referral pathways. The current workflow captures your enquiry internally while a finance provider is being finalised.",
  },
  {
    question: "Who reviews the enquiry?",
    answer:
      "The RBP team reviews the submitted finance enquiry and follows up about the next suitable step.",
  },
  {
    question: "Is approval guaranteed?",
    answer:
      "No. Approval, rates, fees, terms, and documentation are subject to lender criteria, assessment, and eligibility.",
  },
  {
    question: "What information should I prepare?",
    answer:
      "Prepare business details, ABN, trading timeframe, revenue range, purpose of funds, requested amount, and any relevant asset, invoice, vehicle, or project information.",
  },
  {
    question: "When does the Premium Membership gift card apply?",
    answer:
      "Premium Members may receive a $250 gift card when eligible finance is approved and disbursed through the RBP referral pathway, subject to campaign terms.",
  },
];

export function getFinanceProduct(slug?: string) {
  return financeProducts.find((productItem) => productItem.slug === slug);
}
