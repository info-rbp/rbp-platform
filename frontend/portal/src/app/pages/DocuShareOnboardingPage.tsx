import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { DocuShareOnboardingFlow } from "../features/docushare";

export function DocuShareOnboardingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <DocuShareOnboardingFlow />
      </main>
      <Footer />
    </div>
  );
}
