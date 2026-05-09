export interface FileUploadMockProps {
  title?: string;
  description?: string;
}

export function FileUploadMock({
  title = "Mock file upload",
  description = "Phase 1 does not upload files. This placeholder captures the intended upload experience only.",
}: FileUploadMockProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <button
        type="button"
        className="mt-4 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
      >
        Choose mock files
      </button>
    </div>
  );
}
