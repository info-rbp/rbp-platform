#!/usr/bin/env bash
set -euo pipefail

echo "Running Phase 5 static smoke tests..."

failures=0

require_file() {
  local path="$1"
  if [ -f "$path" ]; then
    echo "PASS file: $path"
  else
    echo "FAIL missing file: $path"
    failures=$((failures + 1))
  fi
}

require_dir() {
  local path="$1"
  if [ -d "$path" ]; then
    echo "PASS dir: $path"
  else
    echo "FAIL missing dir: $path"
    failures=$((failures + 1))
  fi
}

require_file "README.md"
require_file "docs/architecture/PHASE_5_SOURCE_FREEZE.md"
require_file "docs/architecture/PHASE_5_HANDOFF.md"

require_dir "apps/rbp_app"
require_file "apps/rbp_app/pyproject.toml"
require_file "apps/rbp_app/rbp_app/hooks.py"

require_file "apps/rbp_app/rbp_app/api/membership.py"
require_file "apps/rbp_app/rbp_app/api/decision_desk.py"
require_file "apps/rbp_app/rbp_app/api/docushare.py"
require_file "apps/rbp_app/rbp_app/api/marketplace.py"
require_file "apps/rbp_app/rbp_app/api/connectivity.py"
require_file "apps/rbp_app/rbp_app/api/risk_advisor.py"
require_file "apps/rbp_app/rbp_app/api/the_fixer.py"
require_file "apps/rbp_app/rbp_app/api/billing.py"
require_file "apps/rbp_app/rbp_app/api/notifications.py"

require_file "apps/rbp_app/rbp_app/services/membership.py"
require_file "apps/rbp_app/rbp_app/services/decision_desk.py"
require_file "apps/rbp_app/rbp_app/services/docushare.py"
require_file "apps/rbp_app/rbp_app/services/marketplace.py"
require_file "apps/rbp_app/rbp_app/services/connectivity.py"
require_file "apps/rbp_app/rbp_app/services/risk_advisor.py"
require_file "apps/rbp_app/rbp_app/services/the_fixer.py"
require_file "apps/rbp_app/rbp_app/services/tenancy.py"
require_file "apps/rbp_app/rbp_app/services/entitlements.py"
require_file "apps/rbp_app/rbp_app/services/files.py"
require_file "apps/rbp_app/rbp_app/services/audit.py"

require_dir "frontend/portal"
require_file "frontend/portal/package.json"
require_file "frontend/portal/package-lock.json"
require_file "frontend/portal/vite.config.ts"
require_file "frontend/portal/src/main.tsx"
require_file "frontend/portal/src/app/routes.tsx"

require_dir "contracts/api"
require_dir "contracts/doctypes"
require_dir "contracts/workflows"
require_dir "contracts/permissions"

require_file "contracts/api/11-route-to-endpoint-map.md"
require_file "contracts/api/16-mock-to-real-api-map.md"
require_file "contracts/doctypes/05-core-doctype-model.md"
require_file "contracts/workflows/08-payment-state-model.md"
require_file "contracts/permissions/04-permission-model-draft.md"

if grep -RIn "rbp_app.api.fixer" contracts docs 2>/dev/null; then
  echo "WARN: legacy rbp_app.api.fixer reference found. Confirm reconciliation addendum governs this."
else
  echo "PASS: no rbp_app.api.fixer references found in contracts/docs"
fi

if grep -RIn "rbp_app.api.the_fixer" contracts docs apps/rbp_app/docs 2>/dev/null | head -5; then
  echo "PASS: canonical rbp_app.api.the_fixer reference found"
else
  echo "WARN: canonical rbp_app.api.the_fixer reference not found in scanned docs"
fi

if [ "$failures" -ne 0 ]; then
  echo "Static smoke tests failed with $failures failure(s)."
  exit 1
fi

echo "Phase 5 static smoke tests passed."
