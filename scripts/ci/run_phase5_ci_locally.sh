#!/usr/bin/env bash
set -euo pipefail

echo "Running Phase 5 CI guardrails locally..."

bash scripts/ci/check_repository_guardrails.sh
bash scripts/ci/phase5_static_smoke.sh
bash scripts/ci/check_backend_syntax.sh

echo "Running frontend install/build locally..."

cd frontend/portal

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

npm run build

rm -rf dist

cd ../..

echo "Phase 5 local CI guardrails passed."
