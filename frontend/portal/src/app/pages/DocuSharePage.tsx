import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CTABanner } from "../components/CTABanner";
import { PageHero } from "../components/PageHero";
import { Shield, FolderOpen, Share2, Search, Lock, Cloud, ArrowRight, CheckCircle } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1569235186275-626cb53b83ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMG1hbmFnZW1lbnQlMjBzZWN1cmUlMjBmaWxpbmclMjBvZmZpY2V8ZW58MXx8fHwxNzc2OTIzMzAzfDA&ixlib=rb-4.1.0&q=80&w=1080";

const features = [
  { icon: Shield, title: "Enterprise-Grade Security", desc: "Your documents are encrypted and protected with bank-level security protocols." },
  { icon: FolderOpen, title: "Smart Organisation", desc: "Automatically categorise and tag documents with intelligent folder structures." },
  { icon: Share2, title: "Seamless Sharing", desc: "Share documents with team members, clients, or partners with granular permissions." },
  { icon: Search, title: "Powerful Search", desc: "Find any document in seconds with full-text search and smart filters." },
  { icon: Lock, title: "Access Controls", desc: "Define who can view, edit, or download each document with role-based access." },
  { icon: Cloud, title: "Cloud Storage", desc: "Access your documents from anywhere, on any device, at any time." },
];

const benefits = [
  "Eliminate document chaos and version confusion",
  "Reduce time spent searching for files by up to 80%",
  "Maintain compliance with secure audit trails",
  "Collaborate in real-time with team members",
  "Never lose a document again with automatic backups",
];

export function DocuSharePage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <PageHero
        title="DocuShare — Secure"
        titleAccent="Document Management"
        subtitle="Centralise, organise, and share your business documents with confidence. Stop searching and start finding."
        badge="DocuShare"
        breadcrumb="DocuShare"
        image={heroImage}
        bullets={["256-bit encrypted storage", "Instant team sharing", "Full audit trails"]}
        ctaPrimary={{ label: "Explore Documents", href: "/document-nucleus/overview" }}
        ctaSecondary={{ label: "Start a mock brief", href: "/document-nucleus/brief" }}
        stat={{ value: "256-bit", label: "Encryption Standard", sublabel: "Bank-level security" }}
      />

      {/* Overview */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block text-xs font-bold text-violet-700 uppercase tracking-widest bg-violet-50 px-3 py-1 rounded-full mb-5">
                What is DocuShare?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Your Business Documents, Finally Under Control
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                DocuShare is Remote Business Partner's secure document management platform designed specifically for small businesses. Stop losing hours searching through email attachments and scattered folders.
              </p>
              <div className="space-y-3 mb-8">
                {benefits.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{b}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/document-nucleus/brief"
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                Create a mock DocuShare brief <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img src={heroImage} alt="DocuShare" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Platform Features</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Everything you need to manage your business documents efficiently and securely.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-violet-700" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </div>
  );
}
