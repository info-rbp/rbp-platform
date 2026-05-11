import { CheckCircle } from "lucide-react";

interface DiscoveryCallBookingEmbedProps {
  submitted: boolean;
  onSubmitted: () => void;
}

export function DiscoveryCallBookingEmbed({ submitted, onSubmitted }: DiscoveryCallBookingEmbedProps) {
  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle className="mx-auto h-10 w-10 text-emerald-600" />
        <h2 className="mt-4 text-2xl font-black text-slate-900">
          Discovery call request received
        </h2>
        <p className="mt-2 text-slate-600">
          We will review your details and follow up with the next available booking option.
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
      <h2 className="text-2xl font-black text-slate-900">Request a discovery call</h2>
      <p className="mt-2 text-sm text-slate-600">
        Share a few details so we can understand the context and recommend the right next step.
      </p>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-bold text-slate-700">
            Full name <span className="text-red-500">*</span>
            <input required className="rounded-xl border border-slate-200 px-4 py-3 font-normal" />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-slate-700">
            Email address <span className="text-red-500">*</span>
            <input required type="email" className="rounded-xl border border-slate-200 px-4 py-3 font-normal" />
          </label>
        </div>

        <label className="grid gap-1.5 text-sm font-bold text-slate-700">
          Main reason for call <span className="text-red-500">*</span>
          <select required className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal">
            <option value="">Select a reason...</option>
            <option>I want to understand RBP membership</option>
            <option>I need help choosing the right service</option>
            <option>I want business advisory support</option>
            <option>I need document or process support</option>
            <option>I want to discuss partnership opportunities</option>
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
          Request Discovery Call
        </button>
      </div>
    </form>
  );
}
