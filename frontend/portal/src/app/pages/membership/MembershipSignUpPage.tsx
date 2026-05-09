import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { MembershipPurchaseOnboardingFlow } from "../../features/membership/MembershipPurchaseOnboardingFlow";

export function MembershipSignUpPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <MembershipPurchaseOnboardingFlow />
      </main>
      <Footer />
    </div>
  );
}
