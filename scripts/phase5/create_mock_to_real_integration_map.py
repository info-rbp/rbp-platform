from pathlib import Path
import re

root = Path.cwd()

mock_dir = root / "frontend/portal/src/app/services/mock"
api_dir = root / "apps/rbp_app/rbp_app/api"

report_path = root / "docs/architecture/phase5-integration-map/PHASE_5_MOCK_TO_REAL_API_INTEGRATION_MAP.md"
evidence_path = root / "docs/qa/evidence/phase5-mock-to-real-integration-map-evidence.txt"

domain_aliases = {
    "membership": "membership",
    "decision": "decision_desk",
    "decision_desk": "decision_desk",
    "docushare": "docushare",
    "document": "docushare",
    "documents": "documents",
    "marketplace": "marketplace",
    "connectivity": "connectivity",
    "risk": "risk_advisor",
    "risk_advisor": "risk_advisor",
    "fixer": "the_fixer",
    "the_fixer": "the_fixer",
    "portal": "dashboard",
    "dashboard": "dashboard",
    "billing": "billing",
    "payment": "billing",
    "notifications": "notifications",
    "notification": "notifications",
    "apps": "apps",
    "entitlements": "entitlements",
    "integrations": "integrations",
}

preferred_method_keywords = [
    ("list", ["list_", "list"]),
    ("get", ["get_", "get"]),
    ("create", ["create_", "create"]),
    ("update", ["update_", "update"]),
    ("submit", ["submit_", "submit"]),
    ("delete", ["delete_", "delete"]),
    ("cancel", ["cancel_", "cancel"]),
    ("attach", ["attach_", "create_file", "file"]),
    ("mark", ["mark_"]),
    ("complete", ["complete_"]),
    ("start", ["start_"]),
]

def read_text(path):
    try:
        return path.read_text(errors="ignore")
    except Exception:
        return ""

def extract_ts_exports(path):
    text = read_text(path)
    names = set()

    patterns = [
        r"export\s+async\s+function\s+([A-Za-z0-9_]+)\s*\(",
        r"export\s+function\s+([A-Za-z0-9_]+)\s*\(",
        r"export\s+const\s+([A-Za-z0-9_]+)\s*=\s*async\s*\(",
        r"export\s+const\s+([A-Za-z0-9_]+)\s*=\s*\(",
    ]

    for pattern in patterns:
        for match in re.finditer(pattern, text):
            names.add(match.group(1))

    return sorted(names)

def extract_py_functions(path):
    text = read_text(path)
    functions = []
    pending_whitelist = False

    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith("@frappe.whitelist"):
            pending_whitelist = True
            continue

        match = re.match(r"def\s+([A-Za-z0-9_]+)\s*\(", stripped)
        if match:
            functions.append({
                "name": match.group(1),
                "whitelisted": pending_whitelist,
            })
            pending_whitelist = False
        elif stripped and not stripped.startswith("@"):
            pending_whitelist = False

    return functions

def infer_domain_from_text(value):
    lower = value.lower()

    for key, domain in domain_aliases.items():
        if key in lower:
            return domain

    return ""

def infer_method(function_name, backend_methods):
    lower = function_name.lower()

    for signal, candidates in preferred_method_keywords:
        if signal in lower:
            for backend_method in backend_methods:
                backend_lower = backend_method.lower()
                if any(candidate in backend_lower for candidate in candidates):
                    return backend_method

    for backend_method in backend_methods:
        if backend_method.lower() in lower or lower in backend_method.lower():
            return backend_method

    return backend_methods[0] if len(backend_methods) == 1 else ""

mock_entries = []

if mock_dir.exists():
    for path in sorted(mock_dir.rglob("*.ts")) + sorted(mock_dir.rglob("*.tsx")):
        exports = extract_ts_exports(path)
        domain = infer_domain_from_text(path.name)
        for export in exports:
            export_domain = infer_domain_from_text(export) or domain
            mock_entries.append({
                "file": str(path.relative_to(root)),
                "export": export,
                "domain": export_domain,
            })

api_modules = {}

if api_dir.exists():
    for path in sorted(api_dir.glob("*.py")):
        if path.name == "__init__.py":
            continue
        module = path.stem
        funcs = extract_py_functions(path)
        api_modules[module] = funcs

rows = []
unmapped = []

for entry in mock_entries:
    domain = entry["domain"]
    methods = []
    if domain and domain in api_modules:
        methods = [f["name"] for f in api_modules[domain] if f["whitelisted"]]

    endpoint_method = infer_method(entry["export"], methods) if methods else ""
    endpoint = f"/api/method/rbp_app.api.{domain}.{endpoint_method}" if domain and endpoint_method else ""

    status = "Mapped" if endpoint else "Needs review"

    if status != "Mapped":
        unmapped.append(entry)

    rows.append({
        "mock_file": entry["file"],
        "mock_export": entry["export"],
        "domain": domain or "Unclear",
        "backend_endpoint": endpoint or "TBD",
        "status": status,
        "notes": "Auto-mapped by domain/function naming. Review before merge." if status == "Mapped" else "Manual mapping or documented deferral required.",
    })

lines = []
lines.append("# Phase 5 Mock-to-Real API Integration Map")
lines.append("")
lines.append("## Status")
lines.append("")
lines.append("Draft generated from frontend mock services and Phase 3 backend API modules.")
lines.append("")
lines.append("This document must be manually reviewed before the PR is merged.")
lines.append("")
lines.append("## Repository")
lines.append("")
lines.append("    info-rbp/rbp-platform")
lines.append("")
lines.append("## Purpose")
lines.append("")
lines.append("This document maps every frontend mock service export to one backend API endpoint or an explicit deferral.")
lines.append("")
lines.append("It is a Phase 5 preflight artifact. It does not implement frontend/backend integration.")
lines.append("")
lines.append("## Acceptance Rule")
lines.append("")
lines.append("Every row in the mapping table must end with one of:")
lines.append("")
lines.append("- Mapped")
lines.append("- Deferred")
lines.append("")
lines.append("No row may remain Needs review before this step is complete.")
lines.append("")
lines.append("## Canonical Backend Decisions")
lines.append("")
lines.append("| Area | Decision |")
lines.append("|---|---|")
lines.append("| The Fixer API | Use rbp_app.api.the_fixer as canonical. |")
lines.append("| API response shape | Use Phase 3 raw dictionary / serialized DocType responses unless a later contract-change PR introduces an envelope. |")
lines.append("| Files | Use RBP File Reference as canonical file wrapper. |")
lines.append("| Payments | Use RBP Subscription and RBP Payment Event as canonical payment/subscription models. |")
lines.append("| Entitlements | Use entitlement-aware app discovery for launcher visibility; product APIs are not globally hard-gated unless a later hardening PR changes this. |")
lines.append("")
lines.append("## Integration Mapping Table")
lines.append("")
lines.append("| Mock service file | Mock export | Domain | Backend endpoint | Status | Notes / Deferral |")
lines.append("|---|---|---|---|---|---|")

for row in rows:
    lines.append(
        f"| {row['mock_file']} | {row['mock_export']} | {row['domain']} | {row['backend_endpoint']} | {row['status']} | {row['notes']} |"
    )

if not rows:
    lines.append("| None found | None | Unclear | TBD | Needs review | No mock service exports were detected. Review scanner and frontend services. |")

lines.append("")
lines.append("## Deferred Items Register")
lines.append("")
lines.append("| Mock service / Area | Deferral | Reason | Owner / Workstream | Target Phase |")
lines.append("|---|---|---|---|---|")
lines.append("|  |  |  |  |  |")
lines.append("")
lines.append("## Manual Review Checklist")
lines.append("")
lines.append("| Check | Status | Notes |")
lines.append("|---|---|---|")
lines.append("| Every mock export is listed | Pending | Compare against frontend/portal/src/app/services/mock. |")
lines.append("| Every mock export has a backend endpoint or deferral | Pending | No Needs review rows allowed before merge. |")
lines.append("| The Fixer mappings use rbp_app.api.the_fixer | Pending | Do not use rbp_app.api.fixer unless an alias is later created. |")
lines.append("| Response shape handling is documented | Pending | Client must expect raw dictionary responses. |")
lines.append("| File/upload mappings use RBP File Reference | Pending | Raw upload implementation may remain deferred. |")
lines.append("| Payment mappings use RBP Subscription / RBP Payment Event | Pending | Live provider work may remain deferred. |")
lines.append("| No implementation files changed | Pending | This PR is documentation/evidence only. |")
lines.append("")
lines.append("## Final Decision")
lines.append("")
lines.append("| Item | Status |")
lines.append("|---|---|")
lines.append("| All mock services mapped or deferred | Pending |")
lines.append("| Ready for first real API integration pilot | Pending |")
lines.append("")
lines.append("## Evidence")
lines.append("")
lines.append("Supporting evidence files:")
lines.append("")
lines.append("- docs/qa/evidence/phase5-frontend-mock-service-inventory.txt")
lines.append("- docs/qa/evidence/phase5-backend-api-inventory.txt")
lines.append("- docs/qa/evidence/phase5-mock-to-real-integration-map-evidence.txt")

report_path.write_text("\n".join(lines) + "\n")

evidence = []
evidence.append("Phase 5 mock-to-real integration map evidence")
evidence.append("")
evidence.append(f"Mock exports detected: {len(mock_entries)}")
evidence.append(f"Backend API modules detected: {len(api_modules)}")
evidence.append(f"Rows mapped automatically: {sum(1 for r in rows if r['status'] == 'Mapped')}")
evidence.append(f"Rows needing review: {sum(1 for r in rows if r['status'] == 'Needs review')}")
evidence.append("")
evidence.append("Detected backend modules:")
for module in sorted(api_modules):
    whitelisted = [f["name"] for f in api_modules[module] if f["whitelisted"]]
    evidence.append(f"- {module}: {', '.join(whitelisted) if whitelisted else 'no whitelisted methods detected'}")
evidence.append("")
evidence.append("Unmapped mock exports:")
for item in unmapped:
    evidence.append(f"- {item['file']} :: {item['export']}")

evidence_path.write_text("\n".join(evidence) + "\n")

print(f"Wrote {report_path}")
print(f"Wrote {evidence_path}")
print(f"Mock exports detected: {len(mock_entries)}")
print(f"Rows needing review: {len(unmapped)}")
if unmapped:
    print("WARNING: Manual review required. Do not merge while Needs review rows remain.")
else:
    print("PASS: All detected mock exports were auto-mapped.")
