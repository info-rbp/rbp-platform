# Phase 3 Backend Environment Validation

Scope:
Documentation and validation only. Do not modify backend modules, Frappe core, generated bench files, start/apps/*, or start/sites/*.

Goals:
- Confirm redis_cache / Redis services are running.
- Confirm bench migrate can run.
- Confirm rbp_app DocTypes install/migrate cleanly.
- Confirm focused backend tests still pass.
- Confirm full bench app tests can be attempted in a correctly aligned environment.
- Confirm Mail submodule compatibility state.
- Capture blockers and remediation steps.

Validation checklist:
- Local main is current.
- Focused rbp_app unittest suite passes.
- Redis services are running.
- bench migrate runs.
- rbp_app app tests are attempted.
- Mail submodule is checked/aligned.
- No forbidden paths are committed.

Known forbidden paths:
- frappe/
- start/apps/*
- start/sites/*

Results:
- Local main was current at PR #27 merge commit.
- Focused rbp_app unittest validation passed.
- Focused validation result:
  - Ran 141 tests.
  - OK.
- Site selected:
  - rbp-minimal.localhost.
- Available sites detected:
  - frappe.localhost.
  - rbp-minimal.localhost.
- Bench executable:
  - start/env/bin/bench was not present.
  - global bench was available at /Library/Frameworks/Python.framework/Versions/3.14/bin/bench.
- bench migrate result:
  - Command: bench --site rbp-minimal.localhost migrate.
  - Result: passed.
  - rbp_app DocTypes updated successfully.
  - after_migrate hooks executed.
  - search index rebuild was queued.
- bench app test result:
  - Command: bench --site rbp-minimal.localhost run-tests --app rbp_app.
  - Result: passed.
  - Ran 173 rbp_app tests.
  - OK.
- Generated bench artifacts:
  - bench migrate/test modified local start/sites and asset files.
  - These files are generated environment artifacts and must not be committed.
  - Generated artifacts were excluded from the PR scope.
- Mail/submodule status:
  - No Mail compatibility failure occurred during this rbp_app bench test run.
- Conclusion:
  - Phase 3 backend environment validation passed for rbp-minimal.localhost.
  - Focused unittest validation and bench app validation both passed.
  - PR should remain documentation-only.

## Fresh Clean-Site Install Validation

A fresh clean-site validation was run after Phase 3 closeout documentation and policy decisions were completed.

Validation site:

```text
rbp-phase3-clean.localhost
```

Commands run from the `start/` bench directory:

```bash
bench new-site rbp-phase3-clean.localhost --admin-password admin
bench --site rbp-phase3-clean.localhost install-app rbp_app
bench --site rbp-phase3-clean.localhost set-config allow_tests true
bench --site rbp-phase3-clean.localhost migrate
bench --site rbp-phase3-clean.localhost clear-cache
bench --site rbp-phase3-clean.localhost run-tests --app rbp_app
```

Result:

```text
rbp_app installed successfully
bench migrate passed
bench clear-cache passed
bench run-tests --app rbp_app passed
```

Known notes:

- The MariaDB/MySQL superuser must be entered correctly during `bench new-site`; in this local environment, `root` was required.
- Tests must be enabled on the fresh site with `bench --site rbp-phase3-clean.localhost set-config allow_tests true`.
- Fresh bench validation can generate local files under `start/sites/*`. These are environment artifacts and must not be committed.
