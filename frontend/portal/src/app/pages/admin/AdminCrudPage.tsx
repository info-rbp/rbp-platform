export function AdminCrudPage() {
  const modules = [
    "Tenants",
    "Users",
    "Membership Plans",
    "Subscriptions",
    "Payment Events",
    "Entitlements",
    "Applications",
    "Application Interest",
    "Service Requests",
    "Notifications",
    "Audit Events",
  ] as const;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-semibold">Appwrite admin transition</p>
        <p>
          Operational records are moving behind React admin routes backed by Appwrite Functions. This page remains a staging surface while the dedicated admin operations function and schemas are rolled out.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Authoritative QA admin modules</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {modules.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
