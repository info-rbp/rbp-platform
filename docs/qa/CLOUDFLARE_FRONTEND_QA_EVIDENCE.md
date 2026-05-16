# Cloudflare Frontend QA Evidence

Use this document to confirm the QA frontend points to Appwrite and that customer-facing flows work without legacy or mock fallbacks.

## Required Frontend Variables

- `VITE_BACKEND_PROVIDER=appwrite`
- `VITE_ENABLE_MOCK_FALLBACK=false`
- `VITE_APPWRITE_ENDPOINT`
- `VITE_APPWRITE_PROJECT_ID`
- `VITE_APPWRITE_DATABASE_ID`
- `VITE_APPWRITE_STORAGE_BUCKET_ID`
- `VITE_APPWRITE_FUNCTIONS_ENDPOINT`
- `VITE_ENABLE_APPLICATION_PROVISIONING=false`
- `VITE_ENABLE_APPLICATION_INTEREST=true`

## Validation Commands

```sh
npm run cloudflare:env:validate
npm run build
```

## Browser Checks

| Flow | Result | Notes |
|---|---|---|
| Signup |  |  |
| Login |  |  |
| Logout |  |  |
| Portal dashboard |  |  |
| Membership page |  |  |
| Free plan activation |  |  |
| Premium checkout initiation |  |  |
| Service request submission |  |  |
| Application interest submission |  |  |
| Notifications list and read |  |  |
| Admin dashboard |  |  |
| Admin service request update |  |  |
| Customer provisioning disabled |  |  |

## Assertions

- Frontend uses QA Appwrite.
- No mock fallback is active.
- No Frappe runtime route is in use.
- No customer-facing application provisioning path is exposed.

## Sign-Off

- Result:
- Reviewer:
- Remaining caveats:
