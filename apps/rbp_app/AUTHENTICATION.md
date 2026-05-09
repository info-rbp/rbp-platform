# RBP Authentication Approach

## Decision

Native Frappe owns `/login`.

`rbp_app` must not provide `rbp_app/rbp_app/www/login.html`, because that file overrides the built-in Frappe login route when the app is installed.

## Why

Frappe built-in login already handles:

- session creation
- CSRF handling
- redirect handling
- password policies
- login throttling
- standard authentication errors
- installed app compatibility

RBP route guards should redirect guests to:

```text
/login?redirect-to=<original-path>
```

The customer-facing portal remains at:

```text
/portal
/app
```

The backend/admin surface remains:

```text
/desk
```

## Branding

A branded login can be introduced later, but it must integrate with Frappe auth safely and should not break native `/api/method/login`.

Until that work is complete, use native Frappe login.
