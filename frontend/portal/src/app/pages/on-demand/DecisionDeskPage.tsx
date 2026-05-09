import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { DecisionDeskFlow } from "../../features/decision-desk";

export function DecisionDeskPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <DecisionDeskFlow />
      </main>
      <Footer />
    </div>
  );
}
