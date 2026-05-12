#!/usr/bin/env bash
set -euo pipefail

MILESTONE="Milestone 2: Confirm Backend Baseline"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$REPO_ROOT" ] || [ ! -d "$REPO_ROOT/.git" ]; then
	printf '%s\n' "ERROR: confirm_backend_baseline.sh must be run from inside the repository."
	exit 1
fi

RBP_BENCH_ROOT="${RBP_BENCH_ROOT:-start}"
RBP_BASELINE_SITE="${RBP_BASELINE_SITE:-rbp-minimal.localhost}"
RBP_APP_NAME="${RBP_APP_NAME:-rbp_app}"

if [[ "$RBP_BENCH_ROOT" = /* ]]; then
	BENCH_ROOT="$RBP_BENCH_ROOT"
else
	BENCH_ROOT="$REPO_ROOT/$RBP_BENCH_ROOT"
fi

REPORT_DIR="$REPO_ROOT/reports/backend-baseline"
LOG_DIR="$REPORT_DIR/logs"
REPORT_FILE="$REPORT_DIR/backend-baseline-$TIMESTAMP.md"
LATEST_JSON="$REPORT_DIR/latest.json"
STAGES_FILE="$LOG_DIR/stages-$TIMESTAMP.tsv"
INITIAL_STATUS_FILE="$LOG_DIR/git-status-initial-$TIMESTAMP.txt"
FINAL_STATUS_FILE="$LOG_DIR/git-status-final-$TIMESTAMP.txt"
ARTIFACT_LOG="$LOG_DIR/git-artifact-check-$TIMESTAMP.log"
PYTHON_HELPER="$SCRIPT_DIR/confirm_backend_baseline.py"

mkdir -p "$LOG_DIR"
: > "$STAGES_FILE"

OVERALL_STATUS="failed"
FAILURE_REASON=""
APP_SOURCE_PATH=""
LAYOUT_NOTE=""
PYTHON_VERSION=""
BENCH_VERSION=""
FRAPPE_VERSION=""
BENCH_BIN=""

stage_status() {
	local name="$1"
	local status="$2"
	local log_file="${3:-}"
	printf '%s\t%s\t%s\n' "$name" "$status" "$log_file" >> "$STAGES_FILE"
}

finish() {
	local exit_code=$?
	local finished_at
	local git_branch
	local git_commit

	finished_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
	git -C "$REPO_ROOT" status --short --untracked-files=all > "$FINAL_STATUS_FILE" 2>/dev/null || true
	for required_stage in \
		git_working_tree_snapshot \
		python_compile \
		bench_site_check \
		frappe_migrate \
		frappe_clear_cache \
		rbp_app_tests \
		git_artifact_check
	do
		if ! awk -F '\t' -v stage="$required_stage" '$1 == stage { found = 1 } END { exit found ? 0 : 1 }' "$STAGES_FILE"; then
			stage_status "$required_stage" "skipped" ""
		fi
	done
	git_branch="$(git -C "$REPO_ROOT" branch --show-current 2>/dev/null || printf 'unknown')"
	git_commit="$(git -C "$REPO_ROOT" rev-parse HEAD 2>/dev/null || printf 'unknown')"

	if [ "$exit_code" -eq 0 ] && [ -z "$FAILURE_REASON" ]; then
		OVERALL_STATUS="passed"
	fi

	"$PYTHON_HELPER" \
		--milestone "$MILESTONE" \
		--status "$OVERALL_STATUS" \
		--repository-root "$REPO_ROOT" \
		--bench-root "$BENCH_ROOT" \
		--site "$RBP_BASELINE_SITE" \
		--app "$RBP_APP_NAME" \
		--app-source "${APP_SOURCE_PATH:-unresolved}" \
		--layout-note "${LAYOUT_NOTE:-unresolved}" \
		--git-branch "$git_branch" \
		--git-commit "$git_commit" \
		--python-version "${PYTHON_VERSION:-unavailable}" \
		--bench-version "${BENCH_VERSION:-}" \
		--frappe-version "${FRAPPE_VERSION:-}" \
		--started-at "$STARTED_AT" \
		--finished-at "$finished_at" \
		--failure-reason "$FAILURE_REASON" \
		--stages-file "$STAGES_FILE" \
		--initial-status-file "$INITIAL_STATUS_FILE" \
		--final-status-file "$FINAL_STATUS_FILE" \
		--report-file "$REPORT_FILE" \
		--latest-json "$LATEST_JSON" >/dev/null 2>&1 || true

	if [ "$OVERALL_STATUS" = "passed" ]; then
		printf '%s\n' "Backend baseline validation passed."
	else
		printf '%s\n' "Backend baseline validation failed."
		if [ -n "$FAILURE_REASON" ]; then
			printf 'Failure: %s\n' "$FAILURE_REASON"
		fi
	fi
	printf 'Report: %s\n' "$REPORT_FILE"
	printf 'Logs: %s\n' "$LOG_DIR"
	exit "$exit_code"
}
trap finish EXIT

fail_stage() {
	local message="$1"
	FAILURE_REASON="$message"
	printf 'ERROR: %s\n' "$message" >&2
	exit 1
}

run_stage() {
	local name="$1"
	local log_file="$2"
	shift 2
	printf 'Running %s...\n' "$name"
	{
		printf 'Stage: %s\n' "$name"
		printf 'Command:'
		printf ' %q' "$@"
		printf '\n\n'
	} > "$log_file"
	if "$@" >> "$log_file" 2>&1; then
		stage_status "$name" "passed" "$log_file"
	else
		local rc=$?
		stage_status "$name" "failed" "$log_file"
		fail_stage "Stage '$name' failed with exit code $rc. See $log_file."
	fi
}

resolve_app_source() {
	local expected="$REPO_ROOT/$RBP_APP_NAME/$RBP_APP_NAME"
	local consolidated="$REPO_ROOT/apps/$RBP_APP_NAME/$RBP_APP_NAME"

	if [ -d "$expected" ]; then
		APP_SOURCE_PATH="$expected"
		LAYOUT_NOTE="Expected source path exists: $RBP_APP_NAME/$RBP_APP_NAME."
	elif [ -d "$consolidated" ]; then
		APP_SOURCE_PATH="$consolidated"
		LAYOUT_NOTE="Expected $RBP_APP_NAME/$RBP_APP_NAME was not present; detected consolidated source path apps/$RBP_APP_NAME/$RBP_APP_NAME."
	else
		fail_stage "Could not find backend source path. Checked '$expected' and '$consolidated'."
	fi
}

bench_command() {
	if [ -x "$BENCH_ROOT/env/bin/bench" ]; then
		printf '%s\n' "$BENCH_ROOT/env/bin/bench"
	elif command -v bench >/dev/null 2>&1; then
		command -v bench
	else
		return 1
	fi
}

generated_artifact_match() {
	local path="$1"
	case "$path" in
		*__pycache__/*|*__pycache__/|*.pyc|*.pyo|*.pytest_cache/*|*.pytest_cache/|*.coverage|*htmlcov/*|*htmlcov/|*node_modules/*|*node_modules/|*dist/*|*dist/|*build/*|*build/|start/sites/*/private/backups/*|start/sites/*/private/backups/|start/sites/*/logs/*|start/sites/*/logs/|start/logs/*|start/logs/|*.log)
			return 0
			;;
		*)
			return 1
			;;
	esac
}

artifact_check() {
	local blockers=0
	git -C "$REPO_ROOT" status --short --untracked-files=all > "$FINAL_STATUS_FILE"
	{
		printf 'Initial git status:\n'
		cat "$INITIAL_STATUS_FILE"
		printf '\nFinal git status:\n'
		cat "$FINAL_STATUS_FILE"
		printf '\nGenerated artifact blockers:\n'
	} > "$ARTIFACT_LOG"

	while IFS= read -r line; do
		[ -n "$line" ] || continue
		local path="${line:3}"
		if [[ "$path" == *" -> "* ]]; then
			path="${path##* -> }"
		fi
		if generated_artifact_match "$path"; then
			printf '%s\n' "$line" >> "$ARTIFACT_LOG"
			blockers=1
		fi
	done < "$FINAL_STATUS_FILE"

	if [ "$blockers" -ne 0 ]; then
		return 1
	fi
	printf 'None.\n' >> "$ARTIFACT_LOG"
	return 0
}

printf '%s\n' "$MILESTONE"
printf 'Repository root: %s\n' "$REPO_ROOT"
cd "$REPO_ROOT"

resolve_app_source
PYTHON_VERSION="$(python3 --version 2>&1 || true)"

git status --short --untracked-files=all > "$INITIAL_STATUS_FILE"
stage_status "git_working_tree_snapshot" "passed" "$INITIAL_STATUS_FILE"
if [ -s "$INITIAL_STATUS_FILE" ]; then
	printf '%s\n' "Existing working tree changes detected; continuing and recording them in the report."
fi

run_stage \
	"python_compile" \
	"$LOG_DIR/python-compile-$TIMESTAMP.log" \
	python3 -m compileall -q "$APP_SOURCE_PATH"

BENCH_CHECK_LOG="$LOG_DIR/bench-site-check-$TIMESTAMP.log"
{
	printf 'Bench root: %s\n' "$BENCH_ROOT"
	printf 'Site: %s\n' "$RBP_BASELINE_SITE"
} > "$BENCH_CHECK_LOG"

if [ ! -d "$BENCH_ROOT" ]; then
	stage_status "bench_site_check" "failed" "$BENCH_CHECK_LOG"
	fail_stage "Bench root '$BENCH_ROOT' does not exist. Restore or create the local bench before this milestone can pass."
fi
if [ ! -d "$BENCH_ROOT/sites" ]; then
	stage_status "bench_site_check" "failed" "$BENCH_CHECK_LOG"
	fail_stage "Bench sites directory '$BENCH_ROOT/sites' does not exist. Restore the bench sites directory before this milestone can pass."
fi
if [ ! -d "$BENCH_ROOT/sites/$RBP_BASELINE_SITE" ]; then
	stage_status "bench_site_check" "failed" "$BENCH_CHECK_LOG"
	fail_stage "Site '$RBP_BASELINE_SITE' does not exist under '$BENCH_ROOT/sites'. Create or restore the minimal Frappe site before this milestone can pass."
fi

BENCH_BIN="$(bench_command || true)"
if [ -z "$BENCH_BIN" ]; then
	stage_status "bench_site_check" "failed" "$BENCH_CHECK_LOG"
	fail_stage "Could not find a bench executable. Expected '$BENCH_ROOT/env/bin/bench' or a 'bench' command on PATH."
fi
BENCH_VERSION="$("$BENCH_BIN" --version 2>/dev/null || true)"
{
	printf 'Bench executable: %s\n' "$BENCH_BIN"
	printf 'Bench version: %s\n' "${BENCH_VERSION:-unavailable}"
	printf '\nValidating bench command from bench root...\n'
} >> "$BENCH_CHECK_LOG"
if ! (cd "$BENCH_ROOT" && "$BENCH_BIN" --site "$RBP_BASELINE_SITE" --help >> "$BENCH_CHECK_LOG" 2>&1); then
	stage_status "bench_site_check" "failed" "$BENCH_CHECK_LOG"
	fail_stage "Bench root '$BENCH_ROOT' exists, but the bench CLI does not recognize it as a runnable bench for site '$RBP_BASELINE_SITE'. Restore the bench runtime before this milestone can pass."
fi
stage_status "bench_site_check" "passed" "$BENCH_CHECK_LOG"

FRAPPE_VERSION="$(cd "$BENCH_ROOT" && "$BENCH_BIN" version 2>/dev/null | sed -n '/^frappe /p' || true)"

run_stage \
	"frappe_migrate" \
	"$LOG_DIR/frappe-migrate-$TIMESTAMP.log" \
	env RBP_BASELINE_SITE="$RBP_BASELINE_SITE" bash -c 'cd "$0" && "$1" --site "$RBP_BASELINE_SITE" migrate' "$BENCH_ROOT" "$BENCH_BIN"

run_stage \
	"frappe_clear_cache" \
	"$LOG_DIR/frappe-clear-cache-$TIMESTAMP.log" \
	env RBP_BASELINE_SITE="$RBP_BASELINE_SITE" bash -c 'cd "$0" && "$1" --site "$RBP_BASELINE_SITE" clear-cache' "$BENCH_ROOT" "$BENCH_BIN"

RBP_APP_TEST_LOG="$LOG_DIR/rbp-app-tests-$TIMESTAMP.log"
run_stage \
	"rbp_app_tests" \
	"$RBP_APP_TEST_LOG" \
	env RBP_BASELINE_SITE="$RBP_BASELINE_SITE" RBP_APP_NAME="$RBP_APP_NAME" bash -c 'cd "$0" && "$1" --site "$RBP_BASELINE_SITE" run-tests --app "$RBP_APP_NAME"' "$BENCH_ROOT" "$BENCH_BIN"

if grep -E '(^FAILED|^ERROR:|Traceback|ModuleNotFoundError)' "$RBP_APP_TEST_LOG" >/dev/null 2>&1; then
	fail_stage "rbp_app_tests output contains failures even though the command exited successfully. See $RBP_APP_TEST_LOG."
fi

printf '%s\n' "Running git_artifact_check..."
if artifact_check; then
	stage_status "git_artifact_check" "passed" "$ARTIFACT_LOG"
else
	stage_status "git_artifact_check" "failed" "$ARTIFACT_LOG"
	fail_stage "Generated bench/site/build/runtime artifacts are present in git status. See $ARTIFACT_LOG."
fi

OVERALL_STATUS="passed"
