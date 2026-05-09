# Step 16 The Fixer Flow Checklist

## Route Smoke List

- /on-demand/the-fixer
- /portal/services
- /portal/dashboard
- /admin/the-fixer
- /admin/requests

## Flow Checks

- User can view The Fixer overview.
- User can enter issue title.
- User can select issue category.
- User can describe the issue.
- User can select business impact.
- User can enter affected stakeholders.
- User can select urgency.
- User can select scope.
- User can describe what has been tried.
- User sees mock upload placeholder.
- User can acknowledge no files are uploaded.
- User can enter desired resolution.
- User can review the request.
- User can submit mock request.
- Confirmation shows mock reference.
- Status timeline is visible.
- Portal handoff link is present.
- Admin concept link is present.

## Safety Checks

- No real backend logic.
- No real auth logic.
- No real payment processing.
- No real upload/storage.
- No real support ticket.
- No real email.
- No real advisor assignment.
- No Frappe APIs.

## Responsive QA Placeholders

- Mobile layout reviewed.
- Tablet layout reviewed.
- Desktop layout reviewed.

## Build

Run:

    npm run build
    rm -rf dist
    git status
