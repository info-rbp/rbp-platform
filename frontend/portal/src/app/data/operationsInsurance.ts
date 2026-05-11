export interface FaqItem {
  question: string;
  answer: string;
}

export interface InsuranceProduct {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  whoFor: string[];
  coverPoints: string[];
  scenarios: string[];
  prepare: string[];
  related: string[];
  ctaLabel: string;
  faqItems: FaqItem[];
}

export const insuranceDisclaimer =
  "Remote Business Partner provides general information and referral pathways for business insurance products. Insurance quotes, policy terms, underwriting, cover availability, exclusions, and claims are managed by the relevant insurance provider or platform. Always read the Product Disclosure Statement, Target Market Determination, policy wording, and other applicable documents before deciding whether a product is suitable.";

export const giftCardDisclaimer =
  "Gift card eligibility is subject to Premium Membership status, eligible product adoption, approval or disbursement requirements where applicable, referral attribution, and RBP campaign terms. Gift card offers may be changed or withdrawn.";

export const insuranceGiftCardCopy =
  "Premium Members may receive a $50 gift card when an eligible policy is adopted through the RBP referral pathway.";

const bizCoverBaseUrl =
  "https://insure.bizcover.com.au/OccupationSelection?utm_source=RBPINSURE&utm_medium=Form&utm_campaign=RBPINSURE";

export function getInsuranceQuoteUrl(slug?: string) {
  return slug ? `${bizCoverBaseUrl}&utm_content=${slug}` : bizCoverBaseUrl;
}

function product(
  slug: string,
  title: string,
  shortDescription: string,
  coverPoints: string[],
  whoFor: string[],
  scenarios: string[],
  ctaLabel: string,
  related: string[],
): InsuranceProduct {
  return {
    slug,
    title,
    shortDescription,
    longDescription: `${title} helps businesses consider protection for ${shortDescription.toLowerCase()} RBP provides general information and then directs users to the BizCover quote pathway so cover options, pricing, policy terms, and eligibility can be assessed by the insurance platform.`,
    whoFor,
    coverPoints,
    scenarios,
    prepare: [
      "Business name, ABN, occupation, and trading activities",
      "Annual revenue, number of employees, and operating locations",
      "Existing insurance schedule or renewal documents if available",
      "Recent claims history and any contract insurance requirements",
    ],
    related,
    ctaLabel,
    faqItems: [
      {
        question: `Does RBP provide ${title} directly?`,
        answer:
          "No. RBP provides general information and a referral pathway. Quotes, cover availability, policy documents, underwriting, payment, and claims are handled by the insurance provider or platform.",
      },
      {
        question: "Will the quote page preselect this product?",
        answer:
          "The quote button uses product-specific tracking, but users should still select the occupation and cover types that match their business in the BizCover quote flow.",
      },
      {
        question: "Can Premium Members receive a gift card?",
        answer:
          "Premium Members may receive a $50 gift card when an eligible policy is adopted through the RBP referral pathway, subject to campaign terms and referral attribution.",
      },
    ],
  };
}

export const insuranceProducts: InsuranceProduct[] = [
  product(
    "public-liability-insurance",
    "Public Liability Insurance",
    "third-party injury or property damage claims arising from business activities.",
    ["Third-party injury claims", "Third-party property damage", "Legal defence costs", "Customer or worksite incidents"],
    ["Trades and contractors", "Retail and hospitality operators", "Mobile service providers", "Businesses visited by customers or suppliers"],
    ["A customer slips at your premises.", "A contractor damages client property while working onsite.", "A market stall display causes injury to a visitor."],
    "Get Public Liability Quote Now",
    ["professional-indemnity", "business-insurance-pack", "goods-in-transit"],
  ),
  product(
    "professional-indemnity",
    "Professional Indemnity",
    "advice, service, design, consulting, or professional error claims.",
    ["Alleged professional negligence", "Errors or omissions", "Misleading advice allegations", "Defence costs connected to covered claims"],
    ["Consultants and agencies", "Professional service providers", "Design and advisory businesses", "Freelancers giving specialist advice"],
    ["A client alleges your advice caused financial loss.", "A project deliverable contains an error.", "A consultant is accused of breaching professional duty."],
    "Get Professional Indemnity Quote Now",
    ["public-liability-insurance", "cyber-liability", "management-liability"],
  ),
  product(
    "cyber-liability",
    "Cyber Liability",
    "cyber incidents, data breaches, cybercrime, ransomware, and digital business disruption.",
    ["Cyber incident response", "Data breach costs", "Cybercrime events", "Business interruption from cyber events"],
    ["Online businesses", "Businesses storing customer data", "Professional firms", "Businesses using cloud systems or payments"],
    ["A staff mailbox is compromised.", "Customer records are exposed.", "Ransomware interrupts business systems."],
    "Get Cyber Liability Quote Now",
    ["professional-indemnity", "management-liability", "business-interruption"],
  ),
  product(
    "management-liability",
    "Management Liability",
    "risks linked to running and managing a business.",
    ["Director and officer risks", "Employment-related claims", "Governance decisions", "Some statutory or tax audit exposures"],
    ["Company directors", "Business owners with staff", "Growing businesses", "Management teams handling governance obligations"],
    ["A former employee alleges unfair treatment.", "A regulator investigates a management decision.", "A director faces allegations about business conduct."],
    "Get Management Liability Quote Now",
    ["employment-practices-liability", "statutory-liability", "tax-audit-insurance"],
  ),
  product(
    "personal-accident-and-illness",
    "Personal Accident and Illness",
    "support when an individual cannot work due to accident or illness.",
    ["Income interruption from injury", "Income interruption from illness", "Owner operator downtime", "Contractor work interruption"],
    ["Sole traders", "Contractors", "Owner operators", "Small business principals who rely on their own labour"],
    ["A sole trader is injured and cannot attend jobs.", "An owner operator is unable to work during recovery.", "A contractor needs short-term income support after illness."],
    "Get Personal Accident Quote Now",
    ["public-liability-insurance", "business-interruption", "business-insurance-pack"],
  ),
  product(
    "tax-audit-insurance",
    "Tax Audit Insurance",
    "professional costs associated with responding to certain tax audits or investigations.",
    ["ATO review response costs", "Accounting fees", "Record preparation", "Professional support costs"],
    ["Businesses with complex records", "Companies lodging multiple tax obligations", "Owners wanting audit response support", "Businesses with external accounting costs"],
    ["The ATO requests a review of business records.", "Your accountant must prepare supporting material.", "A tax investigation creates professional fee exposure."],
    "Get Tax Audit Quote Now",
    ["management-liability", "statutory-liability", "business-insurance-pack"],
  ),
  product(
    "building-and-contents-insurance",
    "Building and Contents Insurance",
    "physical business premises, stock, fixtures, and contents.",
    ["Business buildings", "Stock and contents", "Fixtures and fittings", "Damage from insured events"],
    ["Office operators", "Retailers", "Warehouses", "Hospitality venues"],
    ["A storm damages business premises.", "Stock is damaged after an insured event.", "Office contents need repair or replacement."],
    "Get Building and Contents Quote Now",
    ["business-insurance-pack", "glass-insurance", "business-interruption"],
  ),
  product(
    "glass-insurance",
    "Glass Insurance",
    "accidental glass breakage in business premises.",
    ["Shopfront glass", "Internal glass", "Display glass", "Repair or replacement after accidental breakage"],
    ["Retail shops", "Hospitality venues", "Offices with customer-facing glass", "Businesses leasing premises with glass obligations"],
    ["A shopfront window is accidentally broken.", "Display glass is damaged after hours.", "Internal office glass needs urgent repair."],
    "Get Glass Insurance Quote Now",
    ["building-and-contents-insurance", "theft", "business-insurance-pack"],
  ),
  product(
    "business-interruption",
    "Business Interruption",
    "income loss and ongoing costs after an insured interruption event.",
    ["Lost revenue after insured damage", "Ongoing fixed costs", "Recovery period support", "Interruption connected to covered events"],
    ["Businesses with premises", "Retail and hospitality operators", "Manufacturers", "Service businesses with fixed operating costs"],
    ["A fire shuts a site temporarily.", "Storm damage interrupts trading.", "A business needs time to recover after insured property damage."],
    "Get Business Interruption Quote Now",
    ["building-and-contents-insurance", "machinery-breakdown", "business-insurance-pack"],
  ),
  product(
    "theft",
    "Theft",
    "theft of insured business property, contents, or stock.",
    ["Break-ins", "Stolen stock", "Stolen business contents", "Security-related claim evidence"],
    ["Retailers", "Warehouses", "Hospitality venues", "Businesses storing stock or tools"],
    ["Stock is stolen after a break-in.", "Business property is removed from premises.", "A venue needs replacement contents after theft."],
    "Get Theft Cover Quote Now",
    ["money", "building-and-contents-insurance", "business-insurance-pack"],
  ),
  product(
    "employment-practices-liability",
    "Employment Practices Liability",
    "employment-related allegations, disputes, or workplace claims.",
    ["Unfair dismissal allegations", "Harassment claims", "Discrimination claims", "Workplace conduct disputes"],
    ["Employers", "Businesses with managers", "Growing teams", "Companies formalising HR practices"],
    ["A former employee lodges a workplace claim.", "A business receives an allegation of discrimination.", "A manager is named in an employment dispute."],
    "Get Employment Practices Quote Now",
    ["management-liability", "statutory-liability", "business-insurance-pack"],
  ),
  product(
    "money",
    "Money",
    "loss of business money in defined circumstances.",
    ["Cash held on premises", "Money in transit", "Retail or hospitality cash handling", "Defined theft or loss circumstances"],
    ["Retailers", "Hospitality venues", "Businesses handling cash", "Operators transporting takings"],
    ["Cash is stolen from premises.", "Takings are lost in transit.", "A business needs defined money cover for daily operations."],
    "Get Money Cover Quote Now",
    ["theft", "employee-dishonesty", "business-insurance-pack"],
  ),
  product(
    "employee-dishonesty",
    "Employee Dishonesty",
    "financial loss from dishonest employee conduct.",
    ["Employee theft", "Fraud by employees", "Internal control exposures", "Dishonest conduct losses"],
    ["Employers", "Businesses with delegated financial access", "Retail and hospitality operators", "Companies with internal cash or stock controls"],
    ["An employee steals stock.", "Internal fraud causes financial loss.", "A staff member misuses access to business funds."],
    "Get Employee Dishonesty Quote Now",
    ["money", "theft", "management-liability"],
  ),
  product(
    "portable-equipment",
    "Portable Equipment",
    "business tools, devices, and portable equipment used away from premises.",
    ["Tools of trade", "Laptops and devices", "Mobile work equipment", "Equipment used offsite"],
    ["Trades", "Mobile services", "Consultants with devices", "Businesses carrying equipment between locations"],
    ["A laptop is damaged while travelling.", "Tools are stolen from a vehicle.", "Portable equipment is damaged at a client site."],
    "Get Portable Equipment Quote Now",
    ["electronic-equipment", "theft", "goods-in-transit"],
  ),
  product(
    "machinery-breakdown",
    "Machinery Breakdown",
    "machinery breakdown affecting business operations.",
    ["Plant and machinery", "Repair or replacement costs", "Operational downtime", "Production interruption risk"],
    ["Manufacturers", "Workshops", "Hospitality businesses with key equipment", "Businesses reliant on machinery"],
    ["A production machine fails.", "Critical refrigeration equipment breaks down.", "A workshop loses access to essential machinery."],
    "Get Machinery Breakdown Quote Now",
    ["business-interruption", "electronic-equipment", "business-insurance-pack"],
  ),
  product(
    "electronic-equipment",
    "Electronic Equipment",
    "business electronic equipment breakdown or damage.",
    ["Computers", "POS systems", "Office technology", "Specialist electronic devices"],
    ["Offices", "Retailers", "Hospitality venues", "Businesses using specialist electronic equipment"],
    ["A POS system is damaged.", "Office computers need replacement after an event.", "Specialist equipment fails and affects operations."],
    "Get Electronic Equipment Quote Now",
    ["portable-equipment", "machinery-breakdown", "cyber-liability"],
  ),
  product(
    "goods-in-transit",
    "Goods in Transit",
    "insured goods while they are being transported.",
    ["Customer deliveries", "Supplier collections", "Mobile stock", "Transit damage or theft risks"],
    ["Delivery businesses", "Mobile service providers", "Wholesalers", "Businesses transporting goods to customers"],
    ["Goods are damaged during delivery.", "Stock is stolen in transit.", "A supplier collection is damaged before reaching site."],
    "Get Goods in Transit Quote Now",
    ["portable-equipment", "theft", "business-insurance-pack"],
  ),
  product(
    "statutory-liability",
    "Statutory Liability",
    "certain fines, penalties, and legal costs where insurable by law.",
    ["Regulatory obligations", "Compliance exposures", "Legal costs for covered matters", "Governance-related statutory risk"],
    ["Businesses in regulated industries", "Directors and managers", "Employers", "Companies with compliance obligations"],
    ["A regulator investigates a workplace matter.", "A business faces statutory allegations.", "Management needs support responding to compliance proceedings."],
    "Get Statutory Liability Quote Now",
    ["management-liability", "employment-practices-liability", "tax-audit-insurance"],
  ),
  product(
    "business-insurance-pack",
    "Business Insurance Pack",
    "bundled business cover options across common property, liability, interruption, theft, money, machinery, and equipment risks.",
    ["Multi-cover convenience", "Property and liability options", "Operational risk bundling", "Common small business exposures"],
    ["Businesses wanting broader package cover", "Premises-based businesses", "Retail and hospitality operators", "Owners managing several insurance needs"],
    ["A business wants to package common covers.", "A retailer needs property, theft, and interruption options.", "A growing operator wants one broader quote pathway."],
    "Get Business Insurance Pack Quote Now",
    ["public-liability-insurance", "building-and-contents-insurance", "business-interruption"],
  ),
  product(
    "industries-covered",
    "Industries Covered",
    "occupation-led insurance needs across different business types.",
    ["Trades", "Professionals", "Consultants and freelancers", "Retail, hospitality, manufacturing, allied health, fitness, and beauty"],
    ["Businesses unsure which cover applies", "Owners comparing occupation-led options", "Industry-specific operators", "New businesses preparing to quote"],
    ["A trade business needs contract-ready insurance.", "A consultant wants advice-based cover options.", "A retailer needs property and liability options."],
    "Find Cover for Your Industry",
    ["public-liability-insurance", "professional-indemnity", "business-insurance-pack"],
  ),
];

export const insuranceProductGroups = [
  {
    title: "Essential liability covers",
    products: ["public-liability-insurance", "professional-indemnity", "cyber-liability", "management-liability", "employment-practices-liability", "statutory-liability"],
  },
  {
    title: "Business pack and property covers",
    products: ["business-insurance-pack", "building-and-contents-insurance", "glass-insurance", "business-interruption", "theft", "money"],
  },
  {
    title: "Equipment and operational covers",
    products: ["portable-equipment", "machinery-breakdown", "electronic-equipment", "goods-in-transit", "employee-dishonesty", "tax-audit-insurance", "personal-accident-and-illness"],
  },
];

export const insuranceFaqs: FaqItem[] = [
  {
    question: "Is Remote Business Partner the insurer or broker?",
    answer:
      "No. RBP provides general information and a referral pathway. Insurance quotes, policy terms, underwriting, cover availability, exclusions, and claims sit with the relevant insurance provider or platform.",
  },
  {
    question: "Where does the quote button take me?",
    answer:
      "The quote button opens the BizCover occupation selection flow with RBP referral tracking so you can enter business details and review available options.",
  },
  {
    question: "Should I read policy documents before buying?",
    answer:
      "Yes. Always read the Product Disclosure Statement, Target Market Determination, policy wording, and other applicable documents before deciding whether a product suits your business.",
  },
  {
    question: "When does the Premium Membership gift card apply?",
    answer:
      "Premium Members may receive a $50 gift card when an eligible policy is adopted through the RBP referral pathway, subject to campaign terms and referral attribution.",
  },
];

export function getInsuranceProduct(slug?: string) {
  return insuranceProducts.find((productItem) => productItem.slug === slug);
}
