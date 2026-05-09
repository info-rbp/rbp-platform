import { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { Calculator, AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router";

function CashFlowCalc() {
  const [monthly, setMonthly] = useState("");
  const [costs, setCosts] = useState("");
  const result = monthly && costs ? Number(monthly) - Number(costs) : null;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <h3 className="font-bold text-slate-900 mb-1">Cash Flow Calculator</h3>
      <p className="text-slate-500 text-sm mb-5">Estimate your monthly net cash position.</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">Monthly Revenue ($)</label>
          <input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="e.g. 10000" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">Monthly Costs ($)</label>
          <input type="number" value={costs} onChange={(e) => setCosts(e.target.value)} placeholder="e.g. 7000" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
        </div>
      </div>
      {result !== null && (
        <div className={`rounded-xl p-4 text-center ${result >= 0 ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
          <div className={`text-2xl font-extrabold ${result >= 0 ? "text-emerald-700" : "text-red-700"}`}>
            {result >= 0 ? "+" : ""}${result.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Estimated monthly net cash</div>
        </div>
      )}
    </div>
  );
}

function LoanRepaymentCalc() {
  const [loan, setLoan] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  let monthly = null;
  if (loan && rate && years) {
    const p = Number(loan);
    const r = Number(rate) / 100 / 12;
    const n = Number(years) * 12;
    monthly = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <h3 className="font-bold text-slate-900 mb-1">Loan Repayment Estimator</h3>
      <p className="text-slate-500 text-sm mb-5">Estimate your monthly loan repayment.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">Loan Amount ($)</label>
          <input type="number" value={loan} onChange={(e) => setLoan(e.target.value)} placeholder="e.g. 50000" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">Annual Rate (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 5" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">Term (years)</label>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="e.g. 5" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
        </div>
      </div>
      {monthly !== null && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-sky-700">${monthly.toFixed(2)}</div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Estimated monthly repayment</div>
        </div>
      )}
    </div>
  );
}

function BreakEvenCalc() {
  const [fixed, setFixed] = useState("");
  const [price, setPrice] = useState("");
  const [variable, setVariable] = useState("");
  let units = null;
  if (fixed && price && variable && Number(price) > Number(variable)) {
    units = Math.ceil(Number(fixed) / (Number(price) - Number(variable)));
  }
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <h3 className="font-bold text-slate-900 mb-1">Break-Even Calculator</h3>
      <p className="text-slate-500 text-sm mb-5">Find out how many units you need to sell to break even.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">Fixed Costs ($/mo)</label>
          <input type="number" value={fixed} onChange={(e) => setFixed(e.target.value)} placeholder="e.g. 5000" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">Price per Unit ($)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 100" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">Variable Cost/Unit ($)</label>
          <input type="number" value={variable} onChange={(e) => setVariable(e.target.value)} placeholder="e.g. 40" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
        </div>
      </div>
      {units !== null && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-violet-700">{units.toLocaleString()} units</div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Estimated monthly break-even volume</div>
        </div>
      )}
    </div>
  );
}

function GrossMarginCalc() {
  const [revenue, setRevenue] = useState("");
  const [cogs, setCogs] = useState("");
  let margin = null;
  if (revenue && cogs && Number(revenue) > 0) {
    margin = ((Number(revenue) - Number(cogs)) / Number(revenue)) * 100;
  }
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <h3 className="font-bold text-slate-900 mb-1">Gross Margin Calculator</h3>
      <p className="text-slate-500 text-sm mb-5">Calculate your gross profit margin percentage.</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">Revenue ($)</label>
          <input type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} placeholder="e.g. 100000" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">Cost of Goods Sold ($)</label>
          <input type="number" value={cogs} onChange={(e) => setCogs(e.target.value)} placeholder="e.g. 60000" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
        </div>
      </div>
      {margin !== null && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-emerald-700">{margin.toFixed(1)}%</div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Gross margin</div>
        </div>
      )}
    </div>
  );
}

export function FinanceCalculatorsPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <section className="bg-gradient-to-br from-slate-900 to-violet-950 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/operations" className="hover:text-white transition-colors">Operations Centre</Link>
            <span>/</span>
            <span className="text-white">Finance Calculators</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/20 border border-violet-500/30 text-violet-300 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            <Calculator className="w-3 h-3" /> Finance Calculators
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Practical financial tools for your business</h1>
          <p className="text-slate-300 max-w-xl">Cash flow, loan repayments, break-even, and gross margin — quick estimates to inform your business decisions.</p>
        </div>
      </section>

      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-start gap-2 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>These calculators provide estimates only. Results are indicative and do not constitute financial advice. Always consult a qualified financial professional before making business decisions.</span>
          </div>
        </div>
      </div>

      <section className="py-14 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <CashFlowCalc />
          <LoanRepaymentCalc />
          <BreakEvenCalc />
          <GrossMarginCalc />
        </div>
      </section>

      <section className="py-12 bg-slate-50 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-xl font-extrabold text-slate-900 mb-3">Need more than estimates?</h2>
          <p className="text-slate-600 text-sm mb-6">Our finance advisory team can build a full financial model, cash flow forecast, or investment readiness plan for your business.</p>
          <Link to="/operations/finance" className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5">
            Explore Finance Pathways <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}