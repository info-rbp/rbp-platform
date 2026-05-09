#!/usr/bin/env bash
set -euo pipefail

echo "Running repository guardrail checks..."

failures=0

check_required_path() {
  local path="$1"
  local label="$2"

  if [ -e "$path" ]; then
    echo "PASS: $label exists"
  else
    echo "FAIL: $label missing at $path"
    failures=$((failures + 1))
  fi
}

check_absent_path() {
  local path="$1"
  local label="$2"

  if [ -e "$path" ]; then
    echo "FAIL: $label exists at $path"
    failures=$((failures + 1))
  else
    echo "PASS: $label absent"
  fi
}

check_required_path "apps/rbp_app" "Consolidated rbp_app"
check_required_path "apps/rbp_app/rbp_app/hooks.py" "rbp_app hooks.py"
check_required_path "apps/rbp_app/rbp_app/api" "rbp_app API modules"
check_required_path "apps/rbp_app/rbp_app/services" "rbp_app services"
check_required_path "apps/rbp_app/rbp_app/doctype" "rbp_app DocTypes"
check_required_path "frontend/portal" "Frontend portal"
check_required_path "frontend/portal/package.json" "Frontend package.json"
check_required_path "frontend/portal/package-lock.json" "Frontend package-lock.json"
check_required_path "contracts" "Contracts"
check_required_path "docs" "Docs"

check_absent_path "frappe" "Frappe framework core directory"
check_absent_path "apps/frappe" "apps/frappe framework core directory"
check_absent_path "frontend/portal/node_modules" "Frontend node_modules"
check_absent_path "frontend/portal/dist" "Frontend dist build output"
check_absent_path "frontend/portal/build" "Frontend build output"
check_absent_path "logs" "Logs directory"

if git ls-files | grep -E '^(frontend/portal/node_modules/|frontend/portal/dist/|frontend/portal/build/|logs/)'; then
  echo "FAIL: forbidden generated/runtime paths are tracked"
  failures=$((failures + 1))
else
  echo "PASS: no forbidden generated/runtime paths are tracked"
fi

if git ls-files | grep -E '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$'; then
  echo "FAIL: local env files are tracked"
  failures=$((failures + 1))
else
  echo "PASS: no local env files are tracked"
fi

if [ "$failures" -ne 0 ]; then
  echo "Repository guardrail checks failed with $failures failure(s)."
  exit 1
fi

echo "Repository guardrail checks passed."
