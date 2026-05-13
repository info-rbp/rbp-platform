export function AdminCrudPage() {
  const workspaces = [
    ["RBP Operations", "/app/workspace/rbp-operations"],
    ["RBP Membership", "/app/workspace/rbp-membership"],
    ["RBP Billing", "/app/workspace/rbp-billing"],
    ["RBP Applications", "/app/workspace/rbp-applications"],
    ["RBP Notifications", "/app/workspace/rbp-notifications"],
    ["RBP Marketplace", "/app/workspace/rbp-marketplace"],
    ["RBP Services", "/app/workspace/rbp-services"],
    ["RBP Support", "/app/workspace/rbp-support"],
  ] as const;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Preview only</p>
        <p>Operational records are managed in Frappe Desk and its RBP workspaces.</p>
        <a className="underline" href="/desk">Open Frappe Desk</a>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Authoritative launch workspaces</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {workspaces.map(([label, href]) => (
            <li key={href}>
              <a className="underline" href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
