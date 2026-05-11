import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";

import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import { OperationsHero, OperationsProductCard, OperationsProductGrid, SectionHeader } from "../../components/operations/OperationsComponents";

const currentLinks = [
  {
    title: "Business Insurance",
    description: "Explore common business insurance products and get a quote through the RBP BizCover referral pathway.",
    href: "/operations/insurance",
  },
  {
    title: "Business Finance",
    description: "Review finance product pathways, use calculators, and submit an internal referral enquiry.",
    href: "/operations/finance",
  },
  {
    title: "Business NBN",
    description: "Start with coverage, compare plan tiers, review modem and phone needs, then connect now.",
    href: "/operations/connectivity/nbn-phone",
  },
  {
    title: "Contact",
    description: "Tell RBP about an operational need that is not yet listed in the Operations section.",
    href: "/contact",
  },
];

export function OperationsComingSoonPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <OperationsHero
        eyebrow="Operations · Coming Soon"
        title="More Operational Resources Are Coming Soon"
        subtitle="We are continually adding new operational tools, referral pathways, business support resources, and partner services to help businesses run better."
        primaryCta={{ label: "Explore Current Operations Support", href: "/operations" }}
        secondaryCta={{ label: "Contact Us About an Operational Need", href: "/contact" }}
        bullets={[
          "New operational resources, partner pathways, tools, and guides will be announced soon",
          "The Operations section will keep expanding as RBP adds practical business support",
          "Current support is available across insurance, finance, and Business NBN",
        ]}
      />

      <main>
        <section className="py-14 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
              <Sparkles className="h-8 w-8 text-blue-700" />
              <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950">Always adding more</h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                RBP is always adding more ways to support business operations. New operational resources, partner pathways, tools, and guides will be announced soon.
              </p>
            </div>

            <div>
              <SectionHeader
                eyebrow="Current Sections"
                title="Explore what is available now"
                description="While new operational resources are being prepared, these sections are ready to help businesses review core operational needs."
              />
              <OperationsProductGrid columns="lg:grid-cols-2">
                {currentLinks.map((item) => (
                  <OperationsProductCard key={item.href} {...item} cta="Open section" />
                ))}
              </OperationsProductGrid>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-14 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-950">Have an operational need now?</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Contact RBP and describe the resource, referral pathway, or partner service your business is looking for.
            </p>
            <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">
              Contact RBP <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
