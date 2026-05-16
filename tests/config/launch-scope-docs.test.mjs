import test from "node:test";
import assert from "node:assert/strict";

import { readRepoFile } from "../helpers/env-files.mjs";

const launchScope = readRepoFile("docs/launch/LAUNCH_SCOPE.md");
const qaScope = readRepoFile("docs/qa/QA_RELEASE_SCOPE.md");
const checklist = readRepoFile("docs/launch/LAUNCH_SCOPE_ACCEPTANCE_CHECKLIST.md");

for (const [label, content] of Object.entries({ launchScope, qaScope })) {
  test(`${label} documents the Appwrite-backed admin path`, () => {
    assert.match(content, /React `\/admin`/);
    assert.match(content, /Appwrite Functions/);
    assert.doesNotMatch(content, /Frappe Desk is the operational admin backend/i);
  });
}

test("launch scope acceptance checklist separates foundation, runtime, QA, and production states", () => {
  assert.match(checklist, /Foundation Complete/);
  assert.match(checklist, /Runtime Implemented/);
  assert.match(checklist, /QA Validated/);
  assert.match(checklist, /Production Blocked/);
});