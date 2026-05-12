#!/usr/bin/env python3
"""Write machine-readable and Markdown reports for backend baseline validation."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def read_text(path: str) -> str:
    if not path:
        return ""
    file_path = Path(path)
    if not file_path.exists():
        return ""
    return file_path.read_text(encoding="utf-8", errors="replace").strip()


def read_stages(path: Path) -> list[dict[str, str]]:
    stages: list[dict[str, str]] = []
    if not path.exists():
        return stages
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        if not line.strip():
            continue
        name, status, log = (line.split("\t") + ["", "", ""])[:3]
        stages.append({"name": name, "status": status, "log": log})
    return stages


def canonical_json_stages(stages: list[dict[str, str]]) -> list[dict[str, str]]:
    by_name = {stage["name"]: stage for stage in stages}
    canonical_names = [
        "git_working_tree_snapshot",
        "python_compile",
        "bench_site_check",
        "frappe_migrate",
        "frappe_clear_cache",
        "rbp_app_tests",
        "git_artifact_check",
    ]
    return [
        by_name.get(name, {"name": name, "status": "skipped", "log": ""})
        for name in canonical_names
    ]


def markdown_table(stages: list[dict[str, str]]) -> str:
    rows = ["| Stage | Result | Log |", "| --- | --- | --- |"]
    for stage in stages:
        rows.append(
            f"| `{stage['name']}` | `{stage['status']}` | `{stage.get('log', '')}` |"
        )
    return "\n".join(rows)


def fenced_status(title: str, body: str) -> str:
    content = body if body else "(clean)"
    return f"## {title}\n\n```text\n{content}\n```"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--milestone", required=True)
    parser.add_argument("--status", required=True, choices=["passed", "failed"])
    parser.add_argument("--repository-root", required=True)
    parser.add_argument("--bench-root", required=True)
    parser.add_argument("--site", required=True)
    parser.add_argument("--app", required=True)
    parser.add_argument("--app-source", required=True)
    parser.add_argument("--layout-note", required=True)
    parser.add_argument("--git-branch", required=True)
    parser.add_argument("--git-commit", required=True)
    parser.add_argument("--python-version", required=True)
    parser.add_argument("--bench-version", required=True)
    parser.add_argument("--frappe-version", required=True)
    parser.add_argument("--started-at", required=True)
    parser.add_argument("--finished-at", required=True)
    parser.add_argument("--failure-reason", default="")
    parser.add_argument("--stages-file", required=True)
    parser.add_argument("--initial-status-file", required=True)
    parser.add_argument("--final-status-file", required=True)
    parser.add_argument("--report-file", required=True)
    parser.add_argument("--latest-json", required=True)
    args = parser.parse_args()

    stages = read_stages(Path(args.stages_file))
    payload = {
        "milestone": args.milestone,
        "status": args.status,
        "repository_root": args.repository_root,
        "bench_root": args.bench_root,
        "site": args.site,
        "app": args.app,
        "git_branch": args.git_branch,
        "git_commit": args.git_commit,
        "started_at": args.started_at,
        "finished_at": args.finished_at,
        "stages": canonical_json_stages(stages),
    }

    latest_json = Path(args.latest_json)
    latest_json.parent.mkdir(parents=True, exist_ok=True)
    latest_json.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

    initial_status = read_text(args.initial_status_file)
    final_status = read_text(args.final_status_file)
    report = "\n\n".join(
        [
            f"# {args.milestone}",
            f"**Result:** `{args.status}`",
            "## Environment",
            "\n".join(
                [
                    f"- Repository root: `{args.repository_root}`",
                    f"- Bench root: `{args.bench_root}`",
                    f"- Site: `{args.site}`",
                    f"- App: `{args.app}`",
                    f"- App source: `{args.app_source}`",
                    f"- Layout note: {args.layout_note}",
                    f"- Git branch: `{args.git_branch}`",
                    f"- Git commit: `{args.git_commit}`",
                    f"- Python version: `{args.python_version}`",
                    f"- Bench version: `{args.bench_version or 'unavailable'}`",
                    f"- Frappe version: `{args.frappe_version or 'unavailable'}`",
                    f"- Validation start time: `{args.started_at}`",
                    f"- Validation end time: `{args.finished_at}`",
                ]
            ),
            "## Stage Results",
            markdown_table(stages),
            fenced_status("Initial Git Status", initial_status),
            fenced_status("Final Git Status", final_status),
            "## Failure Reason\n\n"
            + (args.failure_reason if args.failure_reason else "None."),
            "## Log Files",
            "\n".join(
                f"- `{stage['name']}`: `{stage.get('log', '')}`" for stage in stages
            ),
        ]
    )

    report_file = Path(args.report_file)
    report_file.parent.mkdir(parents=True, exist_ok=True)
    report_file.write_text(report + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
