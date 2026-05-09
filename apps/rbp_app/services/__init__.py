"""Cross-app workflow services for the RBP platform layer.

Workflow modules coordinate multiple backend capability providers through rbp_app.

This package must remain safe to import. It should not execute workflows, perform
database writes, send emails, create payments, create Drive folders, or call AI
services at import time.

The initial workflow layer exposes metadata and availability checks only.
"""