import { AdminConcepts } from "../../features/admin";

export function AdminDashboard() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Launch Admin Operations</p>
        <p>Frappe Desk is the authoritative admin backend for launch. Operational records are managed in Desk.</p>
        <a className="underline" href="/desk">Open Frappe Desk</a>
      </div>
      <AdminConcepts />
    </div>
  );
}
