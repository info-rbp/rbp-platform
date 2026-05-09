from pathlib import Path
import json
import re

root = Path.cwd()

api_dir = root / "apps/rbp_app/rbp_app/api"
services_dir = root / "apps/rbp_app/rbp_app/services"
doctype_dir = root / "apps/rbp_app/rbp_app/doctype"

report_path = root / "docs/architecture/phase5-reconciliation/CONTRACT_PHASE3_RECONCILIATION.md"
evidence_path = root / "docs/qa/evidence/phase5-contract-phase3-reconciliation-evidence.txt"

expected_api_modules = [
    "membership",
    "decision_desk",
    "docushare",
    "marketplace",
    "connectivity",
    "risk_advisor",
    "the_fixer",
    "me",
    "apps",
    "dashboard",
    "billing",
    "documents",
    "notifications",
    "entitlements",
    "integrations",
]

expected_service_modules = [
    "membership",
    "decision_desk",
    "docushare",
    "marketplace",
    "connectivity",
    "risk_advisor",
    "the_fixer",
    "tenancy",
    "entitlements",
    "billing",
    "files",
    "documents",
    "notifications",
    "audit",
    "apps",
]

legacy_to_canonical_doctypes = [
    ("RBP Document Brief", "RBP DocuShare Folder / RBP DocuShare Document / RBP DocuShare Share"),
    ("RBP Marketplace Enquiry", "RBP Marketplace Order"),
    ("RBP Connectivity Order", "RBP Connectivity Request / RBP Connectivity Provider / RBP Connectivity Quote"),
    ("RBP Risk Assessment", "RBP Risk Advisor Assessment / RBP Risk Advisor Risk / RBP Risk Advisor Action"),
    ("RBP Fixer Request", "RBP Fixer Case / RBP Fixer Task / RBP Fixer Update"),
]

legacy_api_names = [
    "rbp_app.api.fixer",
    "rbp_app.services.fixer",
]

def module_names(path):
    if not path.exists():
        return []
    return sorted(
        p.stem for p in path.glob("*.py")
        if p.name != "__init__.py"
    )

def doctype_names(path):
    names = []
    if not path.exists():
        return names

    for json_file in sorted(path.glob("*/*.json")):
        try:
            data = json.loads(json_file.read_text())
        except Exception:
            continue

        name = data.get("name")
        if name:
            names.append(name)

    return sorted(set(names))

def grep_text(paths, patterns):
    findings = []
    for base in paths:
        if not base.exists():
            continue
        for file in base.rglob("*"):
            if not file.is_file():
                continue
            if file.suffix.lower() not in [".md", ".py", ".json", ".ts", ".tsx", ".txt"]:
                continue
            try:
                text = file.read_text(errors="ignore")
            except Exception:
                continue
            for pattern in patterns:
                if pattern in text:
                    findings.append((str(file.relative_to(root)), pattern))
    return findings

api_modules = module_names(api_dir)
service_modules = module_names(services_dir)
doctypes = doctype_names(doctype_dir)

missing_api = [m for m in expected_api_modules if m not in api_modules]
missing_services = [m for m in expected_service_modules if m not in service_modules]

contract_paths = [
    root / "contracts",
    root / "docs/api-contracts",
    root / "docs/product-flows",
]

legacy_api_findings = grep_text(contract_paths, legacy_api_names)
legacy_doctype_findings = grep_text(contract_paths, [old for old, _ in legacy_to_canonical_doctypes])

phase3_completion = root / "apps/rbp_app/docs/phase3-completion-report.md"
phase3_completion_text = phase3_completion.read_text(errors="ignore") if phase3_completion.exists() else ""

raw_response_decision_found = "raw dictionary" in phase3_completion_text.lower()
the_fixer_decision_found = "rbp_app.api.the_fixer" in phase3_completion_text

lines = []
lines.append("# Contract to Phase 3 Implementation Reconciliation")
lines.append("")
lines.append("## Status")
lines.append("")
lines.append("Complete for Phase 5 preflight once this document and the referenced contract addenda are merged.")
lines.append("")
lines.append("## Repository")
lines.append("")
lines.append("    info-rbp/rbp-platform")
lines.append("")
lines.append("## Scope")
lines.append("")
lines.append("This document reconciles Phase 2 contracts against the Phase 3 rbp_app implementation.")
lines.append("")
lines.append("Areas reconciled:")
lines.append("")
lines.append("- Endpoint names")
lines.append("- API response shapes")
lines.append("- DocType naming")
lines.append("- Roles and permissions")
lines.append("- Files and uploads")
lines.append("- Payments and subscriptions")
lines.append("")
lines.append("## Automated Inventory Summary")
lines.append("")
lines.append("| Area | Count | Notes |")
lines.append("|---|---:|---|")
lines.append(f"| API modules | {len(api_modules)} | apps/rbp_app/rbp_app/api |")
lines.append(f"| Service modules | {len(service_modules)} | apps/rbp_app/rbp_app/services |")
lines.append(f"| DocTypes | {len(doctypes)} | apps/rbp_app/rbp_app/doctype |")
lines.append("")
lines.append("## API Module Reconciliation")
lines.append("")
lines.append("| Expected canonical API module | Implementation status | Notes |")
lines.append("|---|---|---|")
for name in expected_api_modules:
    status = "Present" if name in api_modules else "Missing"
    note = "Canonical for Phase 5." if status == "Present" else "Needs review before integration."
    lines.append(f"| rbp_app.api.{name} | {status} | {note} |")
lines.append("")
lines.append("### API Naming Decision")
lines.append("")
lines.append("The canonical Phase 3 Fixer API module is:")
lines.append("")
lines.append("    rbp_app.api.the_fixer")
lines.append("")
lines.append("The frontend may use shorter route labels such as /the-fixer or /fixer, but backend calls must use the canonical Phase 3 API module unless an explicit alias is later added.")
lines.append("")
lines.append("## Service Module Reconciliation")
lines.append("")
lines.append("| Expected canonical service module | Implementation status | Notes |")
lines.append("|---|---|---|")
for name in expected_service_modules:
    status = "Present" if name in service_modules else "Missing"
    note = "Canonical for Phase 5." if status == "Present" else "Needs review before integration."
    lines.append(f"| rbp_app.services.{name} | {status} | {note} |")
lines.append("")
lines.append("## Response Shape Reconciliation")
lines.append("")
lines.append("| Contract area | Phase 2 planning position | Phase 3 implementation position | Phase 5 decision |")
lines.append("|---|---|---|---|")
lines.append("| API response envelope | Standard envelope was planned in Phase 2 | Phase 3 returns mostly raw dictionaries / serialized DocType payloads | Phase 5 client must integrate against Phase 3 raw dictionary responses unless a future contract-change PR introduces an envelope |")
lines.append("")
lines.append(f"Raw dictionary decision found in Phase 3 docs: {'Yes' if raw_response_decision_found else 'No'}")
lines.append("")
lines.append("## DocType Reconciliation")
lines.append("")
lines.append("Phase 3 implemented several more specific canonical DocTypes than the early Phase 2 planning names.")
lines.append("")
lines.append("| Phase 2 planning name | Phase 3 canonical implementation | Phase 5 decision |")
lines.append("|---|---|---|")
for old, new in legacy_to_canonical_doctypes:
    lines.append(f"| {old} | {new} | Use Phase 3 canonical implementation names for integration mapping. |")
lines.append("")
lines.append("## Implemented DocTypes")
lines.append("")
for name in doctypes:
    lines.append(f"- {name}")
lines.append("")
lines.append("## Roles and Permissions Reconciliation")
lines.append("")
lines.append("| Area | Reconciliation decision |")
lines.append("|---|---|")
lines.append("| Authenticated user access | Use Phase 3 permission helpers and service-level owner / assigned-user / tenant checks. |")
lines.append("| Admin access | System Manager and Administrator remain authoritative admin roles unless RBP-specific role fixtures are later hardened. |")
lines.append("| RBP-specific role fixtures | Deferred to QA/UAT or launch hardening if required by operating model. |")
lines.append("| Tenant access | Phase 5 must treat backend tenant checks as authoritative. Frontend visibility is not a security boundary. |")
lines.append("| Entitlements | App discovery and launcher visibility use entitlements. Product APIs are not globally hard-gated by entitlement records unless a later hardening PR changes that behavior. |")
lines.append("")
lines.append("## Files and Uploads Reconciliation")
lines.append("")
lines.append("| Area | Reconciliation decision |")
lines.append("|---|---|")
lines.append("| File model | RBP File Reference is the canonical file wrapper. |")
lines.append("| Raw upload | Raw upload client/API integration remains Phase 5 or later work. |")
lines.append("| Visibility | Phase 5 must preserve tenant, owner, and related-record visibility rules from RBP File Reference. |")
lines.append("| Contract status | Upload contracts are accepted for mapping, with final file size/type limits carried forward if not already finalized. |")
lines.append("")
lines.append("## Payments and Subscriptions Reconciliation")
lines.append("")
lines.append("| Area | Reconciliation decision |")
lines.append("|---|---|")
lines.append("| Subscription model | RBP Subscription is canonical. |")
lines.append("| Payment event model | RBP Payment Event is canonical. |")
lines.append("| Live provider | Live payment provider checkout/webhook integration remains deferred. |")
lines.append("| Phase 5 behavior | Frontend should map payment states to backend subscription/payment event states without assuming live payment execution unless that scope is explicitly opened. |")
lines.append("")
lines.append("## Contract References Updated")
lines.append("")
lines.append("The following contracts should carry a Phase 5 reconciliation addendum pointing here:")
lines.append("")
lines.append("- contracts/api/01-api-response-envelope-standard.md")
lines.append("- contracts/api/11-route-to-endpoint-map.md")
lines.append("- contracts/api/16-mock-to-real-api-map.md")
lines.append("- contracts/doctypes/05-core-doctype-model.md")
lines.append("- contracts/permissions/04-permission-model-draft.md")
lines.append("- contracts/api/09-upload-file-rules.md")
lines.append("- contracts/workflows/08-payment-state-model.md")
lines.append("")
lines.append("## Known Carry-Forward Items")
lines.append("")
lines.append("| Area | Carry-forward item | Target lane |")
lines.append("|---|---|---|")
lines.append("| API client | Raw dictionary response handling | Phase 5 integration |")
lines.append("| Fixer naming | Use rbp_app.api.the_fixer | Phase 5 integration |")
lines.append("| Uploads | Raw upload implementation and final limits | Phase 5 or security hardening |")
lines.append("| Payments | Live payment provider integration | Payment/deployment hardening |")
lines.append("| Roles | RBP-specific role fixture refinement | QA/UAT or launch hardening |")
lines.append("| Workflows | Strict transition matrix hardening where required | QA/UAT or launch hardening |")
lines.append("| Entitlements | Service-level hard gates if required | Launch hardening |")
lines.append("")
lines.append("## Automated Findings")
lines.append("")
lines.append("| Finding | Result |")
lines.append("|---|---|")
lines.append(f"| Missing expected API modules | {', '.join(missing_api) if missing_api else 'None'} |")
lines.append(f"| Missing expected service modules | {', '.join(missing_services) if missing_services else 'None'} |")
lines.append(f"| Phase 3 raw response decision found | {'Yes' if raw_response_decision_found else 'No'} |")
lines.append(f"| Phase 3 the_fixer decision found | {'Yes' if the_fixer_decision_found else 'No'} |")
lines.append(f"| Legacy API references found in contracts/docs | {len(legacy_api_findings)} |")
lines.append(f"| Legacy DocType planning references found in contracts/docs | {len(legacy_doctype_findings)} |")
lines.append("")
lines.append("Legacy references are not automatically blockers if this reconciliation document records the canonical Phase 3 mapping and relevant contracts link to this decision.")
lines.append("")
lines.append("## Acceptance")
lines.append("")
lines.append("This reconciliation step is accepted when:")
lines.append("")
lines.append("- Endpoint names are documented against the Phase 3 implementation.")
lines.append("- rbp_app.api.the_fixer is confirmed as the canonical Fixer API module.")
lines.append("- Raw dictionary API responses are confirmed as the Phase 5 integration baseline.")
lines.append("- Phase 3 canonical DocType names are mapped from Phase 2 planning names.")
lines.append("- Roles, tenant checks, entitlements, files, and payments are documented with carry-forward items.")
lines.append("- Key contract documents include a Phase 5 reconciliation addendum.")
lines.append("- No backend or frontend implementation changes are included in this PR.")

report_path.write_text("\n".join(lines) + "\n")

evidence = []
evidence.append("Phase 5 contract-to-Phase-3 reconciliation evidence")
evidence.append("")
evidence.append(f"API modules: {api_modules}")
evidence.append(f"Service modules: {service_modules}")
evidence.append(f"DocTypes: {doctypes}")
evidence.append(f"Missing API modules: {missing_api}")
evidence.append(f"Missing service modules: {missing_services}")
evidence.append(f"Raw response decision found: {raw_response_decision_found}")
evidence.append(f"The Fixer decision found: {the_fixer_decision_found}")
evidence.append("")
evidence.append("Legacy API findings:")
for file, pattern in legacy_api_findings:
    evidence.append(f"{file}: {pattern}")
evidence.append("")
evidence.append("Legacy DocType findings:")
for file, pattern in legacy_doctype_findings:
    evidence.append(f"{file}: {pattern}")

evidence_path.write_text("\n".join(evidence) + "\n")

print(f"Wrote {report_path}")
print(f"Wrote {evidence_path}")

if missing_api or missing_services:
    print("WARNING missing expected modules. Review before commit.")
else:
    print("PASS expected API and service modules present.")
