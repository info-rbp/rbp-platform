# Backup Restore Runbook

Document how production backups are taken, owned, and tested.

## Backup Inventory

| Resource | Included | Frequency | Owner | Evidence Location | Notes |
|---|---|---|---|---|---|
| Appwrite database |  |  |  |  |  |
| Appwrite storage bucket |  |  |  |  |  |
| Function source or deployment artifacts |  |  |  |  |  |
| Stripe configuration references |  |  |  |  |  |
| Cloudflare environment configuration |  |  |  |  |  |
| Email provider configuration |  |  |  |  |  |

## Restore Procedure

1. Identify the resource that must be restored.
2. Confirm the recovery point objective and recovery time objective.
3. Restore into a safe environment first when possible.
4. Validate data integrity, permissions, and linked runtime configuration.
5. Record evidence and sign-off.

## Restore Test Record

- Last restore test date:
- Tested by:
- Resources covered:
- Result:
- Follow-up actions:

## Approval

- Owner:
- Backup evidence reviewed:
- Restore evidence reviewed:
- Notes:
