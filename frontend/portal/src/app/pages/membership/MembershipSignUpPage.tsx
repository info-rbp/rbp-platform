import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { MembershipTierSignupFlow } from "../../features/membership/MembershipTierSignupFlow";

export function MembershipSignUpPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <MembershipTierSignupFlow />
      </main>
      <Footer />
    </div>
  );
}
