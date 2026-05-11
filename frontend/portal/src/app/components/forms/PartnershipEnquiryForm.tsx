import { CheckCircle } from "lucide-react";

interface PartnershipEnquiryFormProps {
  submitted: boolean;
  onSubmitted: () => void;
}

export function PartnershipEnquiryForm({ submitted, onSubmitted }: PartnershipEnquiryFormProps) {
  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle className="mx-auto h-10 w-10 text-emerald-600" />
        <h2 className="mt-4 text-2xl font-black text-slate-900">
          Partnership enquiry received
        </h2>
        <p className="mt-2 text-slate-600">
          We will review the partnership details and follow up if there is a clear fit.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmitted();
      }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="text-2xl font-black text-slate-900">Submit a partnership enquiry</h2>
      <p className="mt-2 text-sm text-slate-600">
        Tell us who you are, what you offer, and how the partnership could support the RBP ecosystem.
      </p>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-bold text-slate-700">
            Organisation name <span className="text-red-500">*</span>
            <input required className="rounded-xl border border-slate-200 px-4 py-3 font-normal" />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-slate-700">
            Contact name <span className="text-red-500">*</span>
            <input required className="rounded-xl border border-slate-200 px-4 py-3 font-normal" />
          </label>
        </div>

        <label className="grid gap-1.5 text-sm font-bold text-slate-700">
          Email address <span className="text-red-500">*</span>
          <input required type="email" className="rounded-xl border border-slate-200 px-4 py-3 font-normal" />
        </label>

        <label className="grid gap-1.5 text-sm font-bold text-slate-700">
          Partnership type <span className="text-red-500">*</span>
          <select required className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal">
            <option value="">Select partnership type...</option>
            <option>Advisory partnership</option>
            <option>Service delivery partnership</option>
            <option>Technology or application partnership</option>
            <option>Marketplace partnership</option>
            <option>Referral partnership</option>
            <option>Content or resource partnership</option>
            <option>Other</option>
          </select>
        </label>

        <label className="grid gap-1.5 text-sm font-bold text-slate-700">
          Message <span className="text-red-500">*</span>
          <textarea required rows={5} className="resize-none rounded-xl border border-slate-200 px-4 py-3 font-normal" />
        </label>

        <button
          type="submit"
          className="w-fit rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800"
        >
          Submit Partnership Enquiry
        </button>
      </div>
    </form>
  );
}
