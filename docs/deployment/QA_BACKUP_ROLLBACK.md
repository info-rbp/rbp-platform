# QA Backup and Rollback

## Purpose
Use this document before QA sign-off and before any rollback action. Do not mark QA sign-off as complete until real backup evidence is captured.

## Preconditions
- QA Frappe bench access is available.
- QA deployment target is known.
- Frontend artifact or release identifier is known.
- Backend candidate commit SHA is known.
- Rollback owner is assigned.

## Backup Command
```bash
bench --site qa.remotebusinesspartner.com.au backup --with-files
```

## Backend Rollback Command
Record the exact backend rollback command for the deployed topology.

```bash
# Example only. Replace with the real approved backend rollback command.
# git checkout <previous_backend_commit>
# bench --site qa.remotebusinesspartner.com.au migrate
# bench restart
```

## Frontend Rollback Command
Record the exact frontend rollback command for the deployed topology.

```bash
# Example only. Replace with the real approved frontend rollback command.
# restore previous static artifact or redeploy previous release
```

## Required Fields
- Database backup path: `TBD`
- Files backup path: `TBD`
- Frontend artifact version: `TBD`
- Backend commit SHA: `TBD`
- Rollback owner: `TBD`
- Rollback command: `TBD`

## Rollback Checklist
1. Confirm incident owner and approver.
2. Capture current broken release version and timestamp.
3. Confirm latest successful backup exists.
4. Restore backend code or release.
5. Run required migrations or cache clears.
6. Restore frontend artifact or release.
7. Validate public routes, auth, billing entrypoints, and admin access.
8. Record outcome, time completed, and residual issues.

## Post-Rollback Validation
- Public homepage loads.
- `/applications` still shows interest-only behavior.
- `/portal/dashboard` remains protected.
- `/admin/dashboard` remains admin-only.
- Membership checkout entrypoint is in the expected state.
- Frappe Desk is reachable for admins.

## Notes
- Do not place secrets or credentials in this file.
- Replace every `TBD` before QA sign-off.
- If rollback depends on a manual hosting action, document the exact operator and release identifier.