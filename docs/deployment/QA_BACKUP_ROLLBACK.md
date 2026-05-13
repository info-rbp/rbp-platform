# QA Backup And Rollback

## Owner

QA deployment owner: RBP platform release owner.

## Backup Command

Run before backend deployment:

```bash
bench --site qa.remotebusinesspartner.com.au backup --with-files
```

Database backup path:

```text
sites/qa.remotebusinesspartner.com.au/private/backups/
```

Files backup path:

```text
sites/qa.remotebusinesspartner.com.au/private/backups/
```

## Frontend Rollback Command

The QA deploy workflow stores the previous frontend under:

```text
/var/www/rbp-frontend/releases/
```

Restore a known release on the QA host:

```bash
sudo rsync -az --delete /var/www/rbp-frontend/releases/<release-id>/ /var/www/rbp-frontend/current/
sudo systemctl reload nginx
```

## Backend Rollback Command

From the bench host:

```bash
cd /path/to/frappe-bench/apps/rbp_app
git fetch origin
git checkout <previous-good-commit>
cd /path/to/frappe-bench
bench --site qa.remotebusinesspartner.com.au migrate
bench --site qa.remotebusinesspartner.com.au clear-cache
bench restart
```

## Database Restore Command

Use only after confirming the target backup file:

```bash
bench --site qa.remotebusinesspartner.com.au restore sites/qa.remotebusinesspartner.com.au/private/backups/<database-backup>.sql.gz --with-public-files sites/qa.remotebusinesspartner.com.au/private/backups/<public-files>.tar --with-private-files sites/qa.remotebusinesspartner.com.au/private/backups/<private-files>.tar
```

Restore steps:

1. Confirm the rollback owner and previous-good frontend/backend versions.
2. Put the QA site into maintenance mode if users may be active.
3. Restore the database/files backup only when data rollback is required.
4. Restore the frontend release from `/var/www/rbp-frontend/releases/<release-id>/`.
5. Check out the previous backend commit, run `bench migrate`, `bench clear-cache`, and `bench restart`.
6. Run the smoke tests before reopening QA access.

## Previous Release Artifact Path

Frontend:

```text
/var/www/rbp-frontend/releases/<release-id>/
```

Backend:

```text
origin/main or the previous Git commit recorded in the QA deployment note.
```
