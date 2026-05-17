# Legacy Function Disposition

Timestamp: 2026-05-17T04:46:21.352Z

## Function

- Function ID: `69ff594b000beaeee38e`
- Name: `rbp-platform`
- Runtime: `node-25`
- Enabled: `True`
- Status: `None`
- Entrypoint: `index.js`
- Timeout: `15`
- Created: `2026-05-09T15:56:59.364+00:00`
- Updated: `2026-05-17T04:44:15.528+00:00`
- Declared in `appwrite/appwrite.config.json`: no

## Latest deployment

- Deployment ID: `6a0947844a0c06ab8352`
- Created: `2026-05-17T04:43:52.271+00:00`
- Status: `ready`
- Activate: `False`

## Latest execution

- Execution ID: `None`
- Created: `None`
- Status: `None`
- Trigger: `None`
- Duration: `None`

## Variables

Variable keys only, values intentionally not printed:

- `RBP_ENV`
- `FRAPPE_PORT`
- `REDIS_CACHE`
- `FRONTEND_PORT`
- `REDIS_QUEUE`
- `DB_HOST`
- `FRONTEND_API_BASE_URL`
- `FRAPPE_SITE_NAME`
- `STRIPE_SUCCESS_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_CANCEL_URL`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_DEFAULT_CURRENCY`

## Verification

- `npm run appwrite:functions:verify`: rerun after inspection.
- Configured functions remain the source of truth.
- This legacy function remains unexpected unless disabled/deleted or explicitly allowlisted.

## Current disposition

Decision: retain temporarily pending owner confirmation.

Reason:

- The function is live in AppWrite.
- It is not declared in the repository AppWrite config.
- No automated deletion was performed.
- Disable/delete should only happen after confirming no webhook, schedule, route, or manual operational dependency still uses it.

## Next owner/action

1. Confirm whether this function is old test drift.
2. If unused, disable it first in AppWrite Console.
3. Rerun `npm run appwrite:functions:verify`.
4. If no impact, delete it or leave disabled through one QA cycle.
5. If it is still needed, migrate it into `appwrite/appwrite.config.json` with a named source directory, or document it as approved external drift.


## Disable action

Timestamp: 2026-05-17T04:51:09.221678Z

Action taken:

- Legacy function `69ff594b000beaeee38e` was disabled in AppWrite.
- No deletion was performed.
- `npm run appwrite:functions:verify` was rerun after disabling.

Expected post-disable state:

- Configured functions remain present.
- Configured functions remain deployable/verifiable.
- Legacy function may still appear as `unexpected` until deleted or explicitly allowlisted.

Current decision:

- Keep disabled through one QA cycle.
- If no dependency or execution need appears, delete the function and rerun `npm run appwrite:functions:verify`.
