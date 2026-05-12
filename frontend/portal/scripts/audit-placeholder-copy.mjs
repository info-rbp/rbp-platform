import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const checkedFiles = [
  "src/app/pages/about/WhatWeDoPage.tsx",
  "src/app/pages/about/OurProcessPage.tsx",
  "src/app/pages/about/WorkWithUsPage.tsx",
  "src/app/pages/legal/LegalIndexPage.tsx",
  "src/app/pages/legal/PrivacyPolicyPage.tsx",
  "src/app/pages/legal/TermsOfUsePage.tsx",
  "src/app/pages/legal/TermsOfEngagementPage.tsx",
  "src/app/pages/legal/PaymentPolicyPage.tsx",
  "src/app/pages/legal/ServicesPolicyPage.tsx",
  "src/app/pages/confirmation/ContactSuccessPage.tsx",
  "src/app/pages/confirmation/ThankYouPage.tsx",
  "src/app/pages/confirmation/BookingConfirmationPage.tsx",
  "src/app/pages/operations/OperationsComingSoonPage.tsx"
];

const bannedPhrases = [
  "public placeholder",
  "Content update in progress",
  "enhanced sitemap",
  "will be published in a future content release",
  "Placeholder confirmation",
  "Confirmation placeholder",
  "Detailed content, FAQs, and service specifics"
];

const failures = [];

for (const relativeFile of checkedFiles) {
  const absoluteFile = path.join(root, relativeFile);

  if (!fs.existsSync(absoluteFile)) {
    failures.push(`${relativeFile}: file is missing`);
    continue;
  }

  const source = fs.readFileSync(absoluteFile, "utf8");

  for (const phrase of bannedPhrases) {
    if (source.includes(phrase)) {
      failures.push(`${relativeFile}: contains banned placeholder phrase "${phrase}"`);
    }
  }
}

if (failures.length > 0) {
  console.error("[audit-placeholder-copy] Failed:");
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exit(1);
}

console.log(`[audit-placeholder-copy] Checked ${checkedFiles.length} public-facing pages.`);
console.log("[audit-placeholder-copy] OK");
