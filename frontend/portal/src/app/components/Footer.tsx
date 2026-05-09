import { Link } from "react-router";
import { Briefcase } from "lucide-react";

const footerSections = {
  Public: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Help", href: "/help" },
  ],
  Services: [
    { label: "On-Demand", href: "/on-demand" },
    { label: "Managed Services", href: "/managed-services" },
    { label: "Applications", href: "/applications" },
    { label: "Operations", href: "/operations" },
    { label: "Marketplace", href: "/marketplace" },
  ],
  Membership: [
    { label: "Membership", href: "/membership" },
    { label: "Offers", href: "/offers" },
    { label: "Resources", href: "/resources" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/legal/privacy-policy" },
    { label: "Terms of Use", href: "/legal/terms-of-use" },
    { label: "Terms of Engagement", href: "/legal/terms-of-engagement" },
    { label: "Payment Policy", href: "/legal/payment-policy" },
    { label: "Services Policy", href: "/legal/services-policy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="mb-4 inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="block text-base font-black leading-none tracking-tight text-white">Remote Business</span>
                <span className="block text-base font-black leading-none tracking-tight text-blue-400">Partner</span>
              </div>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-slate-400">
              Public information pages for services, operations, membership, and legal policies. Content is updated progressively.
            </p>
          </div>

          {Object.entries(footerSections).map(([heading, links]) => (
            <div key={heading}>
              <h5 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">{heading}</h5>
              <ul className="space-y-2">
                {links.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className="text-sm text-slate-400 transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Remote Business Partner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
