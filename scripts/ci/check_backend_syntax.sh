#!/usr/bin/env bash
set -euo pipefail

echo "Running backend syntax checks..."

test -d apps/rbp_app/rbp_app || {
  echo "FAIL: apps/rbp_app/rbp_app not found"
  exit 1
}

python3 -m compileall -q apps/rbp_app/rbp_app

echo "PASS: backend Python syntax check completed"
