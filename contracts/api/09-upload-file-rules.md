# RBP Phase 2 Backend Contracts
# 09-upload-file-rules.md

## Document Status

| Field | Value |
|---|---|
| Document | Upload / File Rules |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Draft until Phase 1 UI/UX Completion |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/09-upload-file-rules.md` |
| Intended Final Location | `rbp-platform/contracts/files/upload-file-rules.md` |
| Primary Consumers | Frappe backend, frontend, QA, admin operations, security review |

---

## 1. Purpose

This document defines the upload and file-handling rules for the Remote Business Partner Platform.

It establishes:

```text
- which product flows allow uploads
- how uploaded files are stored
- how uploaded files relate to Frappe File
- how files link to business records
- file ownership rules
- tenant visibility rules
- allowed visibility states
- allowed file types
- size and count limits
- upload API contracts
- file access rules
- workflow-state upload rules
- public media rules
- admin file actions
- file-related notifications
- audit logging
- error handling
- frontend mock-to-real mapping
- QA and security requirements
```

This is a Phase 2 backend contract document. It does not implement file handling. It defines the rules Phase 3 Frappe implementation must follow.

The purpose is to stop uploaded files from becoming “miscellaneous blobs with vibes,” which is how platforms accidentally publish private PDFs to the internet and then pretend it was a feature.

---

## 2. Scope

This document applies to all file upload and file reference behaviour across:

```text
Decision Desk
DocuShare
Marketplace
Connectivity / NBN
Risk Advisor
The Fixer
Membership / business profile, if documents are required
Portal documents
Admin uploads
Advisor/support uploads
Customer supporting documents
Marketplace listing media
Generated outcome files
Payment or billing evidence, if used
```

This document covers:

```text
RBP File Reference
Frappe File linkage
file visibility
upload permissions
download/view permissions
workflow-state upload rules
file validation
file security
file metadata
file audit events
file notification triggers
file API contracts
frontend upload behaviour
mock-to-real mapping
QA tests
```

This document does not define final storage infrastructure. It assumes Frappe File is the base file object and `RBP File Reference` wraps it with platform-specific ownership, tenant, visibility, and related-record rules.

---

## 3. Related Phase 2 Documents

This document should be read with:

```text
index.md
01-api-response-envelope-standard.md
02-naming-conventions.md
03-role-matrix.md
04-permission-model-draft.md
05-core-doctype-model.md
06-workflow-state-standards.md
07-error-catalogue.md
08-payment-state-model.md
14-notification-triggers.md
11-route-to-endpoint-map.md
12-form-field-specifications.md
13-validation-rules.md
15-admin-actions.md
16-mock-to-real-api-map.md
17-phase-2-acceptance-gate.md
```

Key dependencies:

```text
05-core-doctype-model.md
  Defines RBP File Reference.

04-permission-model-draft.md
  Defines who may upload, view, and administer files.

06-workflow-state-standards.md
  Defines upload rules by workflow state.

07-error-catalogue.md
  Defines file and upload error codes.
```

---

## 4. File Handling Principles

All file handling must follow these principles:

| Principle | Rule |
|---|---|
| Frappe File is not enough | Every business-relevant file must have an `RBP File Reference`. |
| Tenant-scoped by default | Files linked to customer/business records must be tenant-aware. |
| Private by default | Uploaded files must default to non-public visibility unless explicitly approved. |
| Related-record required | Files must be linked to a valid business record, except controlled temporary upload flows. |
| Backend authority | File visibility, ownership, and access must be enforced server-side. |
| No raw public URLs by accident | Public exposure must be deliberate, approved, and auditable. |
| Workflow-aware | Upload and view permissions may depend on workflow state. |
| Role-aware | Customers, advisors, support, and admins have different file permissions. |
| Audit-sensitive | Attachments, visibility changes, removals, quarantine, and public publishing must be audited. |
| Safe frontend | Frontend must show only files returned by backend-authorised APIs. |
| Mock files must map cleanly | Phase 1 mock upload fields must map into real file references before integration. |

---

## 5. Core DocType: RBP File Reference

## 5.1 Purpose

`RBP File Reference` links a Frappe `File` to an RBP business record with platform-specific rules for:

```text
tenant
owner
related record
visibility
file type
upload source
status
permissions
audit
workflow context
```

The Frappe `File` object stores the file. `RBP File Reference` defines how the platform is allowed to use it.

## 5.2 Required Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Conditional | Required for tenant/customer records |
| `owner` | Link: User | Yes | Business owner of the file reference |
| `related_doctype` | Data | Yes | Target DocType |
| `related_name` | Dynamic Link / Data | Yes | Target record name |
| `file` | Link: File | Yes | Linked Frappe File |
| `file_type` | Select / Data | Conditional | Business category of file |
| `visibility` | Select | Yes | File visibility rule |
| `uploaded_by` | Link: User | Yes | User who uploaded the file |
| `uploaded_on` | Datetime | Yes | Upload timestamp |
| `status` | Select | Yes | File lifecycle state |
| `description` | Small Text | Conditional | User/admin description |
| `source_channel` | Select | Conditional | Website, portal, admin, API, integration |
| `workflow_state_at_upload` | Data | Conditional | Related record workflow state when uploaded |
| `approved_for_public_on` | Datetime | Conditional | When public visibility was approved |
| `approved_for_public_by` | Link: User | Conditional | Admin/system approver |
| `quarantine_reason` | Small Text | Conditional | Reason if quarantined |
| `removed_on` | Datetime | Conditional | Removal timestamp |
| `removed_by` | Link: User | Conditional | Removal actor |
| `removal_reason` | Small Text | Conditional | Removal reason |

## 5.3 Optional Technical Metadata

| Fieldname | Type | Purpose |
|---|---|---|
| `original_filename` | Data | Store original upload filename |
| `stored_filename` | Data | Store normalised/stored filename if needed |
| `mime_type` | Data | MIME type |
| `file_extension` | Data | Extension |
| `file_size_bytes` | Int | Size |
| `checksum` | Data | Integrity/deduplication support |
| `scan_status` | Select | Pending, Passed, Failed, Not Required |
| `scan_provider` | Data | Malware scan provider if used |
| `scan_reference` | Data | Scan reference ID |

---

## 6. File Visibility Values

Visibility values must use lowercase snake_case in APIs.

| Frappe Label | API Value | Meaning |
|---|---|---|
| Private to Owner | `private_to_owner` | Visible only to uploader/owner and authorised admins. |
| Tenant Visible | `tenant_visible` | Visible to authorised users in the same tenant. |
| Advisor Visible | `advisor_visible` | Visible to assigned advisor/support/admin users. |
| Admin Only | `admin_only` | Visible only to authorised internal/admin roles. |
| Public | `public` | Publicly visible or available through public-facing UI. |

## 6.1 Default Visibility Rules

| Upload Context | Default Visibility |
|---|---|
| Customer supporting document | `private_to_owner` |
| Customer tenant/business document | `tenant_visible`, if intended for tenant team visibility |
| Customer response to More Information Required | `tenant_visible` or product-specific |
| Advisor working file | `advisor_visible` |
| Admin internal file | `admin_only` |
| Payment/billing evidence | `admin_only` |
| Marketplace listing media before approval | `private_to_owner` or `admin_only` |
| Marketplace listing media after publication approval | `public` |
| Final customer-facing outcome document | `tenant_visible`, unless product requires narrower visibility |

## 6.2 Visibility Rules

```text
Visibility must be explicitly set.
If visibility is missing, default to the safest available value.
Public visibility must require explicit product rule or admin approval.
Customer users must not directly set files to public.
Admin visibility changes must be audited.
```

---

## 7. File Lifecycle States

File reference status values:

| Frappe Label | API Value | Meaning |
|---|---|---|
| Active | `active` | File is active and available according to visibility rules. |
| Removed | `removed` | File has been removed or hidden from normal use. |
| Quarantined | `quarantined` | File is blocked due to security or policy concern. |
| Archived | `archived` | File is retained historically but not active. |

## 7.1 Lifecycle Rules

```text
Uploaded files usually start as Active.
Files may start as Quarantined if scan/security checks fail.
Removed files should not be shown in normal user views.
Archived files should be retained for audit/history.
Quarantined files must not be downloadable by customer users.
```

---

## 8. File Type Categories

Business-level file type values should describe the file’s role, not just its extension.

Approved file type categories:

```text
supporting_document
reference_document
business_document
identity_or_registration_document
marketplace_media
listing_image
listing_attachment
payment_evidence
serviceability_document
assessment_evidence
advisor_working_file
recommendation_document
outcome_document
admin_internal_document
other
```

## 8.1 Product-Specific Examples

| Product | Common File Types |
|---|---|
| Decision Desk | `supporting_document`, `reference_document`, `recommendation_document` |
| DocuShare | `reference_document`, `business_document`, `outcome_document` |
| Marketplace | `marketplace_media`, `listing_image`, `listing_attachment` |
| Connectivity | `serviceability_document`, `payment_evidence`, `supporting_document` |
| Risk Advisor | `assessment_evidence`, `supporting_document`, `outcome_document` |
| The Fixer | `supporting_document`, `reference_document`, `outcome_document` |
| Membership | `identity_or_registration_document`, `business_document`, `payment_evidence` |

---

## 9. Allowed File Extensions and MIME Types

Final allowed types must be confirmed during final Phase 2 lock. Draft defaults:

## 9.1 Documents

| Extension | MIME Type | Allowed |
|---|---|---:|
| `.pdf` | `application/pdf` | Yes |
| `.doc` | `application/msword` | Conditional |
| `.docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | Yes |
| `.xls` | `application/vnd.ms-excel` | Conditional |
| `.xlsx` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | Yes |
| `.csv` | `text/csv` | Conditional |
| `.txt` | `text/plain` | Conditional |
| `.rtf` | `application/rtf` | Conditional |

## 9.2 Images

| Extension | MIME Type | Allowed |
|---|---|---:|
| `.jpg` | `image/jpeg` | Yes |
| `.jpeg` | `image/jpeg` | Yes |
| `.png` | `image/png` | Yes |
| `.webp` | `image/webp` | Conditional |
| `.gif` | `image/gif` | Conditional |
| `.svg` | `image/svg+xml` | No by default |

## 9.3 Archives

| Extension | MIME Type | Allowed |
|---|---|---:|
| `.zip` | `application/zip` | No by default |
| `.rar` | `application/vnd.rar` | No |
| `.7z` | `application/x-7z-compressed` | No |

## 9.4 Executables and Scripts

These must be blocked by default:

```text
.exe
.bat
.cmd
.sh
.ps1
.js
.mjs
.vbs
.scr
.dll
.app
.dmg
.pkg
.jar
.php
.py
.rb
.pl
```

### 9.5 File Type Rule

Validation must check both:

```text
file extension
MIME type / detected content type
```

Do not trust only the filename extension. A file called `invoice.pdf.exe` is not a PDF. Humanity keeps trying this.

---

## 10. File Size and Count Limits

Final limits must be confirmed during final Phase 2 lock. Draft defaults:

| Context | Max File Size | Max Files Per Record | Notes |
|---|---:|---:|---|
| General supporting documents | 25 MB | 10 | Decision Desk, Fixer, Risk Advisor |
| DocuShare reference files | 25 MB | 20 | May need higher count |
| Marketplace listing images | 10 MB | 12 | Images/media |
| Marketplace listing attachments | 25 MB | 5 | Non-image docs |
| Connectivity order documents | 25 MB | 10 | Service/provisioning |
| Payment evidence | 10 MB | 5 | Admin/customer if enabled |
| Admin internal files | 50 MB | 20 | Admin-only |
| Generated outcome documents | 50 MB | 10 | Advisor/admin |

## 10.1 Size Rules

```text
Backend must enforce file size limits.
Frontend should show limits before upload.
Backend remains authoritative.
Oversized files must return file_too_large.
```

## 10.2 Count Rules

```text
Backend must enforce max file count per related record and file type.
Removed or archived files may or may not count depending on product rule.
max_files_exceeded must be returned when count is exceeded.
```

---

## 11. Upload-Supporting Product Flows

Uploads may be required or optional depending on final UI flow.

| Product / Flow | Upload Support | Typical Upload Fields |
|---|---:|---|
| Membership | Conditional | Business registration, billing evidence, onboarding docs |
| Decision Desk | Yes | Supporting documents, evidence, option references |
| DocuShare | Yes | Reference documents, source material, draft docs |
| Marketplace Listing | Yes | Images, media, listing attachments |
| Marketplace Enquiry | Conditional | Buyer attachments, evidence if enabled |
| Connectivity / NBN | Yes | Serviceability docs, identity/business docs, provisioning evidence |
| Risk Advisor | Yes | Assessment evidence, policies, incident docs |
| The Fixer | Yes | Problem evidence, screenshots, documents |
| Portal Documents | Yes | User-visible generated/shared files |
| Admin Operations | Yes | Internal/admin files, outcome files |

---

## 12. Mock-to-Real Upload Mapping

Phase 1 mock upload fields must map into `RBP File Reference`.

| Phase 1 Mock Field | Real Backend Mapping |
|---|---|
| `supporting_documents_mock` | `RBP File Reference` linked to product record |
| `reference_files_mock` | `RBP File Reference` linked to `RBP Document Brief` |
| `media_mock` | `RBP File Reference` linked to `RBP Marketplace Listing` |
| `payment_evidence_mock` | `RBP File Reference` linked to payment/billing record |
| `serviceability_documents_mock` | `RBP File Reference` linked to `RBP Connectivity Order` |
| `assessment_evidence_mock` | `RBP File Reference` linked to `RBP Risk Assessment` |
| `fixer_supporting_documents_mock` | `RBP File Reference` linked to `RBP Fixer Request` |

## 12.1 Mock Mapping Rules

```text
Mock files do not represent real persistence.
Mock file arrays must be replaced by upload APIs in Phase 5.
Each real uploaded file must create both a Frappe File and an RBP File Reference.
Mock-only fields should not remain in production DTOs.
```

---

## 13. Upload API Standards

All upload APIs must use the standard response envelope.

## 13.1 Generic Upload Pattern

```text
POST /api/method/rbp_app.api.<domain>.attach_file
```

Examples:

```text
POST /api/method/rbp_app.api.decision_desk.attach_file
POST /api/method/rbp_app.api.docushare.attach_file
POST /api/method/rbp_app.api.marketplace.attach_file
POST /api/method/rbp_app.api.connectivity.attach_file
POST /api/method/rbp_app.api.risk_advisor.attach_file
POST /api/method/rbp_app.api.fixer.attach_file
```

## 13.2 Shared File APIs

```text
GET  /api/method/rbp_app.api.files.get_file_reference
GET  /api/method/rbp_app.api.files.list_files_for_record
POST /api/method/rbp_app.api.files.remove_file_reference
POST /api/method/rbp_app.api.files.admin_change_visibility
POST /api/method/rbp_app.api.files.admin_quarantine_file
POST /api/method/rbp_app.api.files.admin_restore_file
```

## 13.3 Upload Request Fields

Upload APIs should receive or resolve:

| Field | Required | Notes |
|---|---:|---|
| `related_doctype` | Yes | Target DocType |
| `related_name` | Yes | Target record |
| `file` | Yes | Uploaded file payload / Frappe upload handle |
| `file_type` | Conditional | Business file type |
| `description` | Conditional | Optional description |
| `visibility` | Conditional | Backend may override default |
| `source_channel` | Conditional | Website, portal, admin, API |

## 13.4 Upload Response Example

```json
{
  "ok": true,
  "data": {
    "file_reference": {
      "name": "RBP-FILE-0001",
      "related_doctype": "RBP Decision Desk Request",
      "related_name": "RBP-DDR-0001",
      "file_type": "supporting_document",
      "visibility": "private_to_owner",
      "status": "active",
      "original_filename": "financial-summary.pdf",
      "file_size_bytes": 1048576,
      "uploaded_on": "2026-05-07T00:00:00Z"
    }
  },
  "message": "File uploaded",
  "errors": [],
  "meta": {
    "request_id": "uuid",
    "timestamp": "2026-05-07T00:00:00Z"
  }
}
```

## 13.5 List Files Response Example

```json
{
  "ok": true,
  "data": {
    "files": [
      {
        "name": "RBP-FILE-0001",
        "file_type": "supporting_document",
        "visibility": "private_to_owner",
        "status": "active",
        "original_filename": "financial-summary.pdf",
        "file_size_bytes": 1048576,
        "uploaded_on": "2026-05-07T00:00:00Z",
        "can_view": true,
        "can_remove": true,
        "download_url": "/api/method/rbp_app.api.files.download?file_reference=RBP-FILE-0001"
      }
    ]
  },
  "message": "Files loaded",
  "errors": [],
  "meta": {
    "request_id": "uuid"
  }
}
```

## 13.6 Download/View API Rule

Download URLs must be permission-checked.

Do not expose direct Frappe file URLs for private files unless Frappe access controls are guaranteed and tested.

Recommended pattern:

```text
GET /api/method/rbp_app.api.files.download?file_reference=<name>
```

This endpoint must:

```text
resolve file reference
check user permission
check related record permission
check visibility
check status
stream or redirect safely
audit sensitive access if required
```

---

## 14. Upload Permission Rules

A user may upload a file only when all of the following are true:

```text
user is authenticated, unless public upload is explicitly allowed
related_doctype is allowed for uploads
related_name exists
user can access the related record
user can attach files to the related record
related record workflow state allows uploads
file type is allowed
file size is within limit
file count limit is not exceeded
visibility is allowed for the user's role
```

## 14.1 Role-Based Upload Rules

| Role | Upload Authority |
|---|---|
| Guest | No uploads by default; public form uploads only if explicitly whitelisted |
| Website User | Own draft/authenticated intake records only |
| RBP Member | Own or tenant-authorised records |
| RBP Business Owner | Tenant-authorised records |
| RBP Team Member | Conditional tenant-authorised records |
| RBP Advisor | Assigned records only, usually advisor/internal/outcome files |
| RBP Marketplace Seller | Own listings |
| RBP Marketplace Buyer | Own enquiries if buyer uploads are enabled |
| RBP Support Agent | Assigned/queue records where permitted |
| RBP Admin | Full operational upload access |
| System Manager | Full system access |
| Administrator | Full access |

## 14.2 Upload Denial Examples

Return `file_attach_denied` when:

```text
record does not support uploads
user cannot access record
workflow state blocks upload
user role cannot upload to that record
file is being attached to another tenant's record
```

Return `upload_not_allowed_in_state` when:

```text
record is Closed, Cancelled, Archived, or otherwise locked for upload
```

---

## 15. File View / Download Permission Rules

A user may view or download a file only when all of the following are true:

```text
file reference exists
file reference status allows viewing
user has access to related record
visibility permits the user's role/context
tenant matches or an authorised internal exception applies
file is not quarantined
file is not removed
```

## 15.1 Visibility Access Matrix

| Visibility | Guest | Website User | RBP Member | Business Owner | Team Member | Advisor | Support Agent | RBP Admin | System Manager |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `public` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| `private_to_owner` | No | Owner only | Owner only | Owner/Tenant policy | Owner/conditional | No | Conditional | Yes | Yes |
| `tenant_visible` | No | No | Tenant | Tenant | Conditional | No | Conditional | Yes | Yes |
| `advisor_visible` | No | No | Conditional | Conditional | No | Assigned | Conditional | Yes | Yes |
| `admin_only` | No | No | No | No | No | No | Conditional | Yes | Yes |

## 15.2 Safe Not Found Rule

If a user attempts to access a file from another tenant, backend may return:

```text
file_not_found
```

instead of:

```text
file_access_denied
```

when revealing file existence would leak information.

---

## 16. Workflow-State Upload Rules

Upload availability depends on the related record’s workflow state.

| Workflow State | Customer Upload | Advisor/Support Upload | Admin Upload |
|---|---:|---:|---:|
| Draft | Yes, if product supports uploads | No | Yes |
| Payment Pending | Conditional | No | Yes |
| Payment Failed | Conditional | No | Yes |
| Submitted | Conditional supplemental upload | Conditional | Yes |
| In Review | Conditional if requested | Yes, internal/admin depending on role | Yes |
| More Information Required | Yes, requested files | Yes | Yes |
| Assigned | Conditional | Yes | Yes |
| In Progress | Conditional | Yes | Yes |
| Outcome Ready | No, unless clarification/dispute flow | Yes, outcome files | Yes |
| Closed | No | No, unless admin reopened | Admin only |
| Rejected | No, unless resubmission allowed | No | Admin only |
| Cancelled | No | No | Admin only |
| Archived | No | No | Admin/system only |

## 16.1 State Rule

When upload is blocked by workflow state, return:

```text
upload_not_allowed_in_state
```

or:

```text
record_locked
```

depending on the context.

---

## 17. Product-Specific Upload Rules

## 17.1 Decision Desk

### Supported Files

```text
supporting_document
reference_document
advisor_working_file
recommendation_document
outcome_document
admin_internal_document
```

### Rules

```text
Customer may upload supporting documents in Draft.
Customer may upload additional documents in More Information Required.
Advisor may upload recommendation or working files when assigned.
Recommendation documents should become customer-visible only when marked Outcome Ready / Recommendation Ready.
Admin internal files remain admin_only.
```

## 17.2 DocuShare

### Supported Files

```text
reference_document
business_document
advisor_working_file
outcome_document
admin_internal_document
```

### Rules

```text
Customer may upload reference/source documents.
Reviewer/admin may upload drafts or final outcome documents.
Final documents must have deliberate visibility.
Admin-only review files must not be exposed to customer users unless shared.
```

## 17.3 Marketplace

### Supported Files

```text
marketplace_media
listing_image
listing_attachment
admin_internal_document
```

### Rules

```text
Seller may upload listing media while listing is Draft.
Listing media must not become public until listing is approved/published.
Seller cannot set visibility to public directly.
Admin approval or publication workflow controls public exposure.
Buyer attachments are disabled unless final marketplace flow allows them.
```

## 17.4 Connectivity / NBN

### Supported Files

```text
serviceability_document
identity_or_registration_document
business_document
payment_evidence
supporting_document
admin_internal_document
```

### Rules

```text
Customer may upload order/supporting documents during Draft or More Information Required.
Support/admin may upload provisioning evidence or admin documents.
Payment evidence should default to admin_only unless user visibility is explicitly required.
```

## 17.5 Risk Advisor

### Supported Files

```text
assessment_evidence
supporting_document
reference_document
advisor_working_file
outcome_document
admin_internal_document
```

### Rules

```text
Customer may upload evidence during Draft.
Customer may upload requested evidence in More Information Required.
Advisor notes/files may remain advisor_visible or admin_only.
Final customer-facing assessment outputs should be deliberately shared.
```

## 17.6 The Fixer

### Supported Files

```text
supporting_document
reference_document
advisor_working_file
outcome_document
admin_internal_document
```

### Rules

```text
Customer may upload problem evidence during Draft.
Customer may upload requested files in More Information Required.
Support/admin may upload resolution or internal documents.
Resolution files become visible only when intentionally shared.
```

## 17.7 Membership / Business Profile

### Supported Files

```text
identity_or_registration_document
business_document
payment_evidence
admin_internal_document
```

### Rules

```text
Uploads are conditional based on final onboarding requirements.
Business registration documents should default to private_to_owner or tenant_visible.
Billing evidence should default to admin_only unless explicitly customer-visible.
```

---

## 18. Public File Rules

Public files require special handling.

## 18.1 Public Visibility Allowed For

```text
published marketplace listing media
public downloadable resources intentionally published by admin
public website assets managed through approved content flow
```

## 18.2 Public Visibility Not Allowed For

```text
customer supporting documents
business registration documents
payment evidence
advisor working files
admin internal documents
private recommendation drafts
risk assessment evidence
fixer request evidence
connectivity/provisioning documents
```

## 18.3 Public Approval Requirements

A file may become public only when:

```text
related record supports public files
related record is in a public-eligible state
acting user has admin/publication authority
file type is public-eligible
visibility change is audited
public approval fields are recorded
```

Required public approval fields:

```text
approved_for_public_on
approved_for_public_by
```

## 18.4 Public Media Example

Marketplace listing image flow:

```text
Seller uploads image
  ↓
RBP File Reference created as private_to_owner or admin_only
  ↓
Listing submitted for review
  ↓
Admin approves listing
  ↓
System/admin changes approved listing media to public
  ↓
Public listing displays images
```

---

## 19. Removal, Quarantine, and Archive Rules

## 19.1 Remove File Reference

Removing a file reference should usually hide the file from normal platform use without necessarily deleting the underlying Frappe File immediately.

Allowed actors:

```text
file owner, if record state permits
Business Owner, if tenant policy permits
RBP Admin
System Manager
Administrator
```

Required fields:

```text
removed_on
removed_by
removal_reason, if admin removal or policy requires it
```

## 19.2 Quarantine File

Quarantine is for security, policy, malware, or suspicious-content handling.

Allowed actors:

```text
RBP Admin
System Manager
Administrator
System/security scanner
```

Effects:

```text
status = quarantined
normal download blocked
customer visibility blocked
admin/security review required
audit event created
notification optional depending on policy
```

## 19.3 Archive File

Archive is for historical retention.

Allowed actors:

```text
RBP Admin
System Manager
Administrator
System retention process
```

Effects:

```text
status = archived
removed from active lists
retained for history/audit
restorable only by authorised admin/system action
```

---

## 20. File Naming and Metadata Rules

## 20.1 Original Filename

The original filename may be stored for user display:

```text
original_filename
```

It must be sanitised before display.

## 20.2 Stored Filename

Stored filenames should be normalised or generated to avoid collisions and unsafe characters.

Recommended pattern:

```text
<doctype_slug>-<record_name>-<uuid>.<extension>
```

Example:

```text
decision-desk-rbp-ddr-0001-550e8400.pdf
```

## 20.3 Filename Safety

Filenames must be sanitised to prevent:

```text
path traversal
script injection
HTML injection
special-character issues
duplicate overwrite
misleading extensions
```

Block or normalise filenames containing:

```text
../
..\
null bytes
HTML tags
control characters
extreme length
```

## 20.4 Metadata Rules

Metadata must not expose:

```text
private server paths
storage provider secrets
temporary signed URLs beyond intended use
internal virus scan details to unauthorised users
```

---

## 21. Security Requirements

File handling must satisfy these security requirements:

```text
No public exposure of private files.
No cross-tenant file access.
No unauthorised file downloads.
No customer access to admin_only files.
No customer access to raw storage paths.
No executable/script uploads by default.
No SVG uploads by default unless sanitised.
No direct trust in file extension alone.
No upload to locked records unless admin-authorised.
No public marketplace media before approval/publication.
Quarantined files must be blocked from normal access.
File visibility changes must be audited.
Private file download endpoints must perform backend permission checks.
```

## 21.1 Malware / Content Scanning

Final scanning provider is not defined in this draft.

Draft rule:

```text
If malware/content scanning is enabled, files may begin with scan_status = Pending.
Files failing scan must be marked Quarantined.
Quarantined files must not be downloadable by customer users.
Admin/security review must be required.
```

## 21.2 Sensitive Document Handling

Sensitive document types include:

```text
business registration documents
identity documents
financial documents
payment evidence
risk assessment evidence
contracts/legal documents
admin internal documents
```

These should default to:

```text
private_to_owner
tenant_visible
admin_only
```

not:

```text
public
```

A magnificent discovery, apparently.

---

## 22. Frontend Upload Contract

Frontend upload components must support:

```text
file type restrictions
file size guidance
max file count guidance
upload progress
upload success state
upload failure state
retry handling
remove file action
file list display
file visibility display, where appropriate
locked upload state
requested-file upload state
admin-only/public warnings where appropriate
```

## 22.1 Frontend Must Not

```text
assume uploaded file is visible before backend confirms
assume file is public because listing is public
assume mock file arrays are real persistence
expose direct private file URLs
allow customer users to set public visibility
hide security failures behind generic messages
```

## 22.2 Recommended Frontend File DTO

```ts
export type FileReferenceDto = {
  name: string;
  related_doctype: string;
  related_name: string;
  file_type: string;
  visibility: "private_to_owner" | "tenant_visible" | "advisor_visible" | "admin_only" | "public";
  status: "active" | "removed" | "quarantined" | "archived";
  original_filename: string;
  file_size_bytes: number;
  uploaded_on: string;
  uploaded_by?: string;
  can_view: boolean;
  can_remove: boolean;
  download_url?: string;
};
```

---

## 23. Error Handling

File APIs must use standard errors from `07-error-catalogue.md`.

Key file errors:

```text
file_required
file_not_found
file_too_large
file_empty
unsupported_file_type
file_upload_failed
file_attach_denied
file_visibility_denied
file_visibility_invalid
file_access_denied
file_quarantined
file_removed
max_files_exceeded
upload_not_allowed_in_state
public_file_requires_approval
```

## 23.1 Example: Unsupported File Type

```json
{
  "ok": false,
  "data": null,
  "message": "File upload failed",
  "errors": [
    {
      "field": "supporting_documents",
      "code": "unsupported_file_type",
      "message": "This file type is not supported."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

## 23.2 Example: Upload Not Allowed in State

```json
{
  "ok": false,
  "data": null,
  "message": "Upload not allowed",
  "errors": [
    {
      "field": "workflow_state",
      "code": "upload_not_allowed_in_state",
      "message": "Files cannot be uploaded while this record is in its current state."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

## 23.3 Example: File Access Denied

```json
{
  "ok": false,
  "data": null,
  "message": "File access denied",
  "errors": [
    {
      "field": null,
      "code": "file_access_denied",
      "message": "You do not have access to this file."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

---

## 24. Notifications

File-related notification triggers should be used where the file action is user-actionable or operationally important.

Potential triggers:

| Trigger | Recipient | When |
|---|---|---|
| `file_uploaded` | Admin/support optional | Customer uploads file to submitted/review record |
| `supporting_document_uploaded` | Admin/support | Supporting document added |
| `more_information_file_uploaded` | Admin/support/advisor | Customer responds to More Information Required |
| `outcome_document_uploaded` | Customer | Outcome/final file shared |
| `marketplace_media_uploaded` | Admin | Seller uploads listing media |
| `marketplace_media_approved_public` | Seller/admin | Media becomes public |
| `file_visibility_changed` | Admin/security | Visibility changed |
| `file_quarantined` | Admin/security | File quarantined |
| `file_removed` | User/admin depending on context | File removed |

Notification rules must be finalised in:

```text
14-notification-triggers.md
```

---

## 25. Audit Events

File handling must create audit logs for sensitive actions.

Audit event keys:

```text
file_attached
file_uploaded
file_viewed
file_downloaded
file_removed
file_archived
file_restored
file_quarantined
file_scan_failed
file_visibility_changed
file_public_approved
file_access_denied
```

## 25.1 Audit Event Data

Audit events should record:

```text
acting user or system actor
tenant
related_doctype
related_name
file_reference
file
previous_visibility, if changed
new_visibility, if changed
previous_status, if changed
new_status, if changed
source_channel
request_id
timestamp
reason, if admin action
```

## 25.2 File View/Download Auditing

Not every file view/download must create a high-volume audit entry by default.

Audit downloads for:

```text
admin_only files
payment evidence
identity/business registration documents
quarantined access attempts
cross-tenant denied attempts
public visibility changes
final outcome documents, if required by policy
```

---

## 26. Admin File Actions

Admin file actions must be explicit.

Recommended admin APIs:

```text
POST /api/method/rbp_app.api.files.admin_change_visibility
POST /api/method/rbp_app.api.files.admin_quarantine_file
POST /api/method/rbp_app.api.files.admin_restore_file
POST /api/method/rbp_app.api.files.admin_remove_file_reference
POST /api/method/rbp_app.api.files.admin_approve_public_file
POST /api/method/rbp_app.api.files.admin_archive_file
```

## 26.1 Admin Action Requirements

Every admin file action must validate:

```text
admin role
target file reference exists
related record access
current status
requested status/visibility
reason, where required
public eligibility, where applicable
audit event creation
notification trigger, where applicable
```

## 26.2 Public Approval Action

`admin_approve_public_file` must require:

```text
file_reference
reason or approval note
confirmation that related record is public-eligible
confirmation that file type is public-eligible
confirmation that record workflow state allows public visibility
```

---

## 27. Frappe Implementation Notes

Recommended backend structure:

```text
rbp_app/
└── rbp_app/
    ├── api/
    │   └── files.py
    ├── services/
    │   ├── files.py
    │   ├── audit.py
    │   ├── notifications.py
    │   └── tenancy.py
    ├── doctype/
    │   └── rbp_file_reference/
    ├── permissions.py
    ├── guards.py
    └── hooks.py
```

## 27.1 Service-Layer Function Examples

```python
def attach_file(user: str, payload: dict, file_obj):
    ...

def create_file_reference(user: str, file_doc: str, payload: dict):
    ...

def list_files_for_record(user: str, doctype: str, name: str):
    ...

def get_file_reference(user: str, file_reference: str):
    ...

def can_view_file(user: str, file_reference: str) -> bool:
    ...

def can_attach_file(user: str, doctype: str, name: str) -> bool:
    ...

def change_file_visibility(user: str, file_reference: str, visibility: str, reason: str):
    ...

def quarantine_file(user: str, file_reference: str, reason: str):
    ...

def remove_file_reference(user: str, file_reference: str, reason: str | None = None):
    ...
```

## 27.2 Guard Functions

```python
require_file_upload_allowed(user, related_doctype, related_name)
require_file_view_allowed(user, file_reference)
require_file_visibility_change_allowed(user, file_reference, visibility)
require_file_admin_action(user, action, file_reference)
```

## 27.3 Implementation Rules

```text
Do not modify Frappe core.
Use Frappe File for actual stored file.
Use RBP File Reference for platform business rules.
Use service layer for permission/visibility checks.
Use API methods as thin wrappers.
Use standard response envelope.
Use standard error catalogue.
```

---

## 28. Validation Rules

Upload validation must include:

```text
related_doctype is required.
related_name is required.
related record must exist.
user must have access to related record.
user must be allowed to attach files to related record.
workflow state must permit upload.
file is required.
file must not be empty.
file extension must be allowed.
file MIME/content type must be allowed.
file size must be within limit.
file count must not exceed product/record limit.
file_type must be allowed for the product/record.
visibility must be allowed for the user's role.
public visibility must require approval.
tenant must match related record.
```

File reference validation must include:

```text
owner is required.
uploaded_by is required.
uploaded_on is required.
file is required.
status is required.
visibility is required.
related_doctype and related_name are required.
```

---

## 29. Indexing Requirements

Recommended indexes for `RBP File Reference`:

```text
tenant
owner
related_doctype
related_name
file
file_type
visibility
status
uploaded_by
uploaded_on
approved_for_public_on
scan_status
```

List APIs will commonly filter by:

```text
related_doctype
related_name
tenant
owner
file_type
visibility
status
uploaded_from
uploaded_to
```

---

## 30. Reporting and Admin Review Requirements

Admin views should eventually support:

```text
files by tenant
files by product record
admin_only files
public files
quarantined files
removed files
large files
files pending scan
files with failed scan
marketplace media pending public approval
files uploaded during More Information Required
payment evidence files
```

Recommended filters:

```text
tenant
related_doctype
related_name
file_type
visibility
status
uploaded_by
uploaded_from
uploaded_to
scan_status
approved_for_public_by
```

---

## 31. QA Test Requirements

## 31.1 Upload Validation Tests

```text
test_upload_requires_file
test_upload_rejects_empty_file
test_upload_rejects_unsupported_extension
test_upload_rejects_unsupported_mime_type
test_upload_rejects_file_too_large
test_upload_rejects_when_max_files_exceeded
test_upload_requires_related_record
test_upload_rejects_invalid_file_type_for_product
```

## 31.2 Permission Tests

```text
test_guest_cannot_upload_private_file
test_member_can_upload_to_own_draft_request
test_member_cannot_upload_to_other_tenant_record
test_business_owner_can_upload_to_tenant_record
test_team_member_upload_requires_tenant_permission
test_advisor_can_upload_to_assigned_record
test_unassigned_advisor_cannot_upload
test_seller_can_upload_to_own_listing
test_seller_cannot_set_public_visibility
test_admin_can_upload_admin_only_file
```

## 31.3 Visibility Tests

```text
test_private_to_owner_visible_to_owner_only
test_tenant_visible_visible_to_authorised_tenant_users
test_advisor_visible_visible_to_assigned_advisor
test_admin_only_hidden_from_member
test_public_visible_to_guest_after_approval
test_public_visibility_requires_admin_approval
test_cross_tenant_file_access_denied
```

## 31.4 Workflow-State Tests

```text
test_customer_can_upload_in_draft
test_customer_can_upload_in_more_information_required
test_customer_cannot_upload_to_closed_record
test_customer_cannot_upload_to_archived_record
test_admin_can_attach_file_to_closed_record_if_allowed
test_upload_not_allowed_in_state_returns_standard_error
```

## 31.5 File Lifecycle Tests

```text
test_file_reference_created_after_upload
test_file_removed_hides_from_normal_lists
test_quarantined_file_blocks_download
test_archived_file_removed_from_active_lists
test_admin_restore_file_changes_status
test_file_visibility_change_creates_audit_log
```

## 31.6 Marketplace Media Tests

```text
test_listing_image_starts_private
test_listing_image_not_public_before_approval
test_admin_approval_sets_listing_media_public
test_rejected_listing_media_not_public
test_archived_listing_media_removed_from_public_listing
```

## 31.7 Security Tests

```text
test_executable_file_upload_rejected
test_svg_upload_rejected_by_default
test_filename_path_traversal_sanitised
test_private_download_endpoint_checks_permission
test_download_does_not_expose_storage_path
test_quarantined_file_download_denied
test_raw_private_file_url_not_exposed_to_unauthorised_user
```

## 31.8 Error Envelope Tests

```text
test_file_too_large_returns_standard_envelope
test_unsupported_file_type_returns_standard_envelope
test_file_access_denied_returns_standard_envelope
test_file_attach_denied_returns_standard_envelope
test_public_file_requires_approval_returns_standard_envelope
```

---

## 32. Open Items for Final Phase 2 Lock

These items must be confirmed before Phase 2 sign-off:

| Item | Status | Notes |
|---|---|---|
| Final allowed file extensions | Draft | Needs security/product confirmation |
| Final max file size per product | Draft | Needs infrastructure/product confirmation |
| Final max file count per product | Draft | Needs UX/product confirmation |
| Final malware/content scanning approach | Draft | Needs infrastructure/security decision |
| Final public media process | Draft | Marketplace-specific |
| Final customer file removal rules | Draft | Depends on workflow and retention policy |
| Final retention/archive policy | Draft | Legal/admin decision |
| Final generated document handling | Draft | Depends on DocuShare/outcome flows |
| Final buyer enquiry attachment support | Draft | Marketplace decision |
| Final payment evidence upload support | Draft | Billing decision |
| Final admin file review UI | Draft | Depends on admin concepts |
| Final signed/private download URL strategy | Draft | Depends on deployment/storage model |

---

## 33. Upload/File Rules Acceptance Checklist

This document is ready for Phase 2 draft use when:

```text
RBP File Reference is defined.
Frappe File linkage is defined.
File visibility values are defined.
File lifecycle states are defined.
File type categories are defined.
Allowed file types are drafted.
File size and count limits are drafted.
Upload-supporting product flows are listed.
Mock-to-real file mapping is defined.
Upload API standards are defined.
Download/view API rules are defined.
Upload permission rules are defined.
File view/download permission rules are defined.
Workflow-state upload rules are defined.
Product-specific upload rules are defined.
Public file rules are defined.
Removal/quarantine/archive rules are defined.
File naming and metadata rules are defined.
Security requirements are defined.
Frontend upload contract is defined.
Error handling is defined.
Notification and audit requirements are defined.
Admin file actions are defined.
Frappe implementation notes are defined.
Validation and indexing requirements are defined.
Reporting/admin review requirements are defined.
QA tests are defined.
Open items are listed for final lock.
```

---

## 34. Phase 2 Sign-Off Criteria

This Upload / File Rules document can be signed off only when:

```text
Every Phase 1 upload field has a real backend mapping.
Every upload-capable form has allowed file types and limits.
Every uploaded file maps to Frappe File and RBP File Reference.
Every file has ownership, tenant, visibility, status, and related record rules.
Every product flow defines when uploads are allowed.
Every workflow state defines upload availability.
Every role has upload and view permissions.
Every public file path requires approval or explicit product rule.
Every file error maps to the Error Catalogue.
Every upload API uses the standard response envelope.
Every file-related admin action is defined.
Every file visibility change is auditable.
Every sensitive file access path is protected.
QA tests cover upload, view, visibility, workflow, and security rules.
```

Until then, this remains a draft.

---

## 35. Final Rule

A file is not just a file.

On this platform, every uploaded file must answer:

```text
Who uploaded it?
Who owns it?
Which tenant does it belong to?
Which record is it attached to?
What type of file is it?
Who can see it?
Can it ever be public?
What state was the record in when uploaded?
Can it be removed?
Can it be downloaded?
Was it scanned?
Was it audited?
```

If the system cannot answer those questions, the file does not belong in production. It belongs in a cautionary tale with a postmortem attached.

---

## Phase 5 Contract Reconciliation Addendum

This contract has been reconciled against the Phase 3 rbp_app implementation for Phase 5 preflight.

Authoritative reconciliation record:

    docs/architecture/phase5-reconciliation/CONTRACT_PHASE3_RECONCILIATION.md

If this document conflicts with the Phase 3 implementation in endpoint names, response shapes, DocType names, role behavior, file handling, or payment behavior, the reconciliation record governs Phase 5 integration until a later contract-change PR updates the underlying contract.

Key Phase 5 decisions:

- rbp_app.api.the_fixer is the canonical backend API module for The Fixer.
- Phase 5 frontend integration will use the Phase 3 raw dictionary / serialized DocType response shape unless a later contract-change PR introduces a shared envelope.
- Phase 3 canonical DocType names may differ from early Phase 2 planning names.
- RBP File Reference is the canonical file wrapper.
- RBP Subscription and RBP Payment Event are the canonical payment/subscription models.
- Live payment provider integration and raw upload implementation remain deferred unless explicitly opened in Phase 5.

