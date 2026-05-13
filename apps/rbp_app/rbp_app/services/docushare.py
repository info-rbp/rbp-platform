"""DocuShare business services."""

import json

import frappe
from frappe.utils import now_datetime

from rbp_app.permissions import is_admin_user
from rbp_app.services.audit import record_audit_event
from rbp_app.services.notifications import create_notification, emit_event_notification
from rbp_app.services.reference_ids import generate_reference_id
from rbp_app.services.service_routes import service_routes
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


FOLDER_DOCTYPE = "RBP DocuShare Folder"
DOCUMENT_DOCTYPE = "RBP DocuShare Document"
SHARE_DOCTYPE = "RBP DocuShare Share"
FILE_REFERENCE_DOCTYPE = "RBP File Reference"

FOLDER_STATUSES = {"Active", "Archived"}
DOCUMENT_STATUSES = {"Draft", "Submitted", "Active", "Archived", "Deleted"}
SHARE_STATUSES = {"Active", "Revoked", "Expired"}
VISIBILITY_VALUES = {"Private", "Tenant", "Shared"}
ACCESS_LEVELS = {"View", "Comment", "Manage"}

FOLDER_FIELDS = {"folder_name", "parent_folder", "description", "status", "visibility", "created_from", "notes"}
DOCUMENT_FIELDS = {
    "folder",
    "title",
    "description",
    "file_reference",
    "document_type",
    "status",
    "visibility",
    "version",
    "source_channel",
    "notes",
}
SHARE_FIELDS = {"share_target_user", "share_target_email", "access_level", "expires_on", "notes"}


def _safe_payload(payload):
    if payload is None:
        return {}
    if isinstance(payload, str):
        return json.loads(payload or "{}")
    return dict(payload)


def _require_user(user):
    if not user or user == "Guest":
        raise frappe.PermissionError
    return user


def _is_admin(user):
    return is_admin_user(user)


def _require_tenant(user):
    tenant = get_current_tenant_name(user)
    if not tenant:
        raise frappe.PermissionError
    return tenant


def _get_doc(doctype, name):
    if not doctype_exists(doctype):
        raise frappe.DoesNotExistError
    return frappe.get_doc(doctype, name)


def _has_field(doctype, fieldname):
    try:
        return frappe.get_meta(doctype).has_field(fieldname)
    except Exception:
        return True


def _set_fields(doc, payload, fields):
    for field in fields:
        if field in payload:
            setattr(doc, field, payload.get(field))


def _validate_value(value, allowed, message):
    if value and value not in allowed:
        raise frappe.ValidationError(message)


def _audit(event_type, user, doc, message=None, metadata=None):
    return record_audit_event(
        event_type,
        actor=user,
        tenant=getattr(doc, "tenant", None),
        subject_doctype=getattr(doc, "doctype", None),
        subject_name=doc.name,
        message=message,
        metadata=metadata or {},
    )


def _notify(user, title, message, related_doc, trigger_source, *, priority="Normal"):
    if not user:
        return None

    try:
        return create_notification(
            user=user,
            tenant=getattr(related_doc, "tenant", None),
            title=title,
            message=message,
            priority=priority,
            notification_type="Info",
            route=service_routes("docushare", related_doc.name)["portal_route"],
            related_doctype=getattr(related_doc, "doctype", None),
            related_name=related_doc.name,
            trigger_source=trigger_source,
            created_by_workflow="docushare",
        )
    except Exception:
        frappe.log_error(frappe.get_traceback(), "RBP DocuShare notification failed")
        return None


def _serialize_folder(doc):
    return {
        "name": doc.name,
        "tenant": doc.tenant,
        "owner_user": doc.owner_user,
        "folder_name": getattr(doc, "folder_name", None),
        "parent_folder": getattr(doc, "parent_folder", None),
        "description": getattr(doc, "description", None),
        "status": getattr(doc, "status", None),
        "visibility": getattr(doc, "visibility", None),
        "created_from": getattr(doc, "created_from", None),
        "notes": getattr(doc, "notes", None),
    }


def _serialize_document(doc):
    return {
        "name": doc.name,
        "reference_id": getattr(doc, "reference_id", None),
        "tenant": doc.tenant,
        "owner_user": doc.owner_user,
        "folder": getattr(doc, "folder", None),
        "title": getattr(doc, "title", None),
        "description": getattr(doc, "description", None),
        "file_reference": getattr(doc, "file_reference", None),
        "document_type": getattr(doc, "document_type", None),
        "status": getattr(doc, "status", None),
        "workflow_state": getattr(doc, "workflow_state", None),
        "visibility": getattr(doc, "visibility", None),
        "version": getattr(doc, "version", None),
        "submitted_on": getattr(doc, "submitted_on", None),
        "source_channel": getattr(doc, "source_channel", None),
        "assigned_to": getattr(doc, "assigned_to", None),
        "reviewed_on": getattr(doc, "reviewed_on", None),
        "closed_on": getattr(doc, "closed_on", None),
        "notes": getattr(doc, "notes", None),
        **service_routes("docushare", doc.name),
    }


def _serialize_share(doc):
    return {
        "name": doc.name,
        "tenant": doc.tenant,
        "owner_user": doc.owner_user,
        "share_target_user": getattr(doc, "share_target_user", None),
        "share_target_email": getattr(doc, "share_target_email", None),
        "folder": getattr(doc, "folder", None),
        "document": getattr(doc, "document", None),
        "access_level": getattr(doc, "access_level", None),
        "status": getattr(doc, "status", None),
        "expires_on": getattr(doc, "expires_on", None),
        "revoked_on": getattr(doc, "revoked_on", None),
        "notes": getattr(doc, "notes", None),
    }


def _active_shares_for(user, *, folder=None, document=None):
    if not doctype_exists(SHARE_DOCTYPE):
        return []

    filters = {"status": "Active"}
    if folder:
        filters["folder"] = folder
    if document:
        filters["document"] = document

    rows = frappe.get_all(
        SHARE_DOCTYPE,
        filters=filters,
        fields=[
            "name",
            "tenant",
            "owner_user",
            "share_target_user",
            "share_target_email",
            "folder",
            "document",
            "access_level",
            "status",
            "expires_on",
            "revoked_on",
            "notes",
        ],
    )

    return [
        row
        for row in rows
        if row.get("share_target_user") == user or row.get("share_target_email") == user
    ]


def _has_share_access(user, doc):
    if getattr(doc, "doctype", None) == FOLDER_DOCTYPE:
        shares = _active_shares_for(user, folder=doc.name)
    else:
        shares = _active_shares_for(user, document=doc.name)
    return bool(shares)


def _assert_same_tenant(user, doc):
    if _is_admin(user):
        return True

    tenant = _require_tenant(user)
    if getattr(doc, "tenant", None) != tenant:
        raise frappe.PermissionError
    return True


def _assert_view_access(user, doc):
    _require_user(user)
    if _is_admin(user):
        return True

    _assert_same_tenant(user, doc)
    if doc.owner_user == user:
        return True
    if getattr(doc, "visibility", None) == "Tenant":
        return True
    if getattr(doc, "visibility", None) == "Shared" and _has_share_access(user, doc):
        return True

    raise frappe.PermissionError


def _assert_manage_access(user, doc):
    _require_user(user)
    if _is_admin(user):
        return True

    _assert_same_tenant(user, doc)
    if doc.owner_user == user:
        return True

    raise frappe.PermissionError


def _validate_parent_folder(folder_name, tenant):
    if not folder_name:
        return None

    parent = _get_doc(FOLDER_DOCTYPE, folder_name)
    if parent.tenant != tenant:
        raise frappe.PermissionError
    if parent.status == "Archived":
        raise frappe.ValidationError("Cannot use an archived parent folder.")
    return parent


def _validate_document_folder(folder_name, tenant):
    if not folder_name:
        return None

    folder = _get_doc(FOLDER_DOCTYPE, folder_name)
    if folder.tenant != tenant:
        raise frappe.PermissionError
    if folder.status == "Archived":
        raise frappe.ValidationError("Cannot place a document in an archived folder.")
    return folder


def _admin_recipients():
    recipients = {"Administrator"}
    try:
        rows = frappe.get_all("Has Role", filters={"role": "System Manager"}, fields=["parent"])
        recipients.update(row.get("parent") for row in rows if row.get("parent"))
    except Exception:
        pass
    return sorted(recipients)


def _emit_notification_event(event_type, doc, message, context):
    try:
        emit_event_notification(
            event_type=event_type,
            user=None,
            tenant=getattr(doc, "tenant", None),
            customer_email=getattr(doc, "owner_user", None),
            related_doctype=DOCUMENT_DOCTYPE,
            related_name=doc.name,
            message=message,
            context=context,
        )
    except Exception:
        frappe.log_error(frappe.get_traceback(), "RBP DocuShare notification hook failed")


def _notification_context(doc):
    routes = service_routes("docushare", doc.name)
    return {
        "reference_id": getattr(doc, "reference_id", None) or doc.name,
        "service_name": "DocuShare",
        "status": getattr(doc, "status", None),
        "portal_url": routes["portal_route"],
        "admin_url": routes["admin_route"],
    }


def _notify_admins_submitted(doc):
    for recipient in _admin_recipients():
        _notify(
            recipient,
            "DocuShare brief submitted",
            f"{doc.owner_user} submitted a DocuShare brief.",
            doc,
            "docushare.submit_document.admin",
            priority="High",
        )


def _notify_document_submitted(user, doc):
    _notify(
        doc.owner_user,
        "DocuShare brief submitted",
        "Your DocuShare brief has been submitted.",
        doc,
        "docushare.submit_document.user",
    )
    _notify_admins_submitted(doc)
    _emit_notification_event(
        "docushare.brief_submitted",
        doc,
        "Your DocuShare brief has been received.",
        _notification_context(doc),
    )
    _audit("docushare_document_submitted", user, doc, "DocuShare document submitted.")


def _set_status_dates(doc, status):
    timestamp = now_datetime()
    if status == "Submitted" and not getattr(doc, "submitted_on", None):
        doc.submitted_on = timestamp
    if status == "Active" and not getattr(doc, "reviewed_on", None):
        doc.reviewed_on = timestamp
    if status in {"Archived", "Deleted"}:
        doc.closed_on = timestamp


def _validate_file_reference(file_reference, tenant):
    if not file_reference:
        return None

    if not doctype_exists(FILE_REFERENCE_DOCTYPE):
        raise frappe.ValidationError("RBP File Reference is not installed.")

    file_doc = frappe.get_doc(FILE_REFERENCE_DOCTYPE, file_reference)
    if getattr(file_doc, "tenant", None) and file_doc.tenant != tenant:
        raise frappe.PermissionError
    return file_doc


def _visible_records(user, doctype, filters, fields, *, folder_records=False):
    rows = frappe.get_all(doctype, filters=filters, fields=fields, order_by="modified desc")
    if _is_admin(user):
        return rows

    tenant = _require_tenant(user)
    visible = []
    for row in rows:
        if row.get("tenant") != tenant:
            continue
        if row.get("owner_user") == user or row.get("visibility") == "Tenant":
            visible.append(row)
            continue
        if row.get("visibility") == "Shared":
            key = "folder" if folder_records else "document"
            if _active_shares_for(user, **{key: row.get("name")}):
                visible.append(row)
    return visible


def create_folder(user, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    tenant = _require_tenant(user)

    if not doctype_exists(FOLDER_DOCTYPE):
        raise frappe.DoesNotExistError

    _validate_parent_folder(payload.get("parent_folder"), tenant)
    _validate_value(payload.get("status"), FOLDER_STATUSES, "Invalid DocuShare folder status.")
    _validate_value(payload.get("visibility"), VISIBILITY_VALUES, "Invalid DocuShare folder visibility.")

    doc = frappe.get_doc(
        {
            "doctype": FOLDER_DOCTYPE,
            "tenant": tenant,
            "owner_user": user,
            "status": "Active",
            "visibility": "Private",
        }
    )
    _set_fields(doc, payload, FOLDER_FIELDS)
    doc.insert(ignore_permissions=True)

    _audit("docushare_folder_created", user, doc, "DocuShare folder created.")
    return _serialize_folder(doc)


def update_folder(user, folder_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    doc = _get_doc(FOLDER_DOCTYPE, folder_name)
    _assert_manage_access(user, doc)

    _validate_parent_folder(payload.get("parent_folder"), doc.tenant)
    _validate_value(payload.get("status"), FOLDER_STATUSES, "Invalid DocuShare folder status.")
    _validate_value(payload.get("visibility"), VISIBILITY_VALUES, "Invalid DocuShare folder visibility.")

    _set_fields(doc, payload, FOLDER_FIELDS)
    doc.save(ignore_permissions=True)

    _audit("docushare_folder_updated", user, doc, "DocuShare folder updated.")
    return _serialize_folder(doc)


def list_folders(user, filters=None):
    user = _require_user(user)
    filters = _safe_payload(filters)
    if not doctype_exists(FOLDER_DOCTYPE):
        return {"folders": [], "count": 0}

    query_filters = {}
    for field in ("status", "visibility", "parent_folder"):
        if filters.get(field):
            query_filters[field] = filters[field]
    if not _is_admin(user):
        query_filters["tenant"] = _require_tenant(user)

    rows = _visible_records(
        user,
        FOLDER_DOCTYPE,
        query_filters,
        [
            "name",
            "reference_id",
            "tenant",
            "owner_user",
            "folder_name",
            "parent_folder",
            "description",
            "status",
            "visibility",
            "created_from",
            "notes",
            "modified",
        ],
        folder_records=True,
    )
    return {"folders": rows, "count": len(rows)}


def get_folder(user, folder_name):
    user = _require_user(user)
    doc = _get_doc(FOLDER_DOCTYPE, folder_name)
    _assert_view_access(user, doc)
    return _serialize_folder(doc)


def create_document(user, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    tenant = _require_tenant(user)

    if not doctype_exists(DOCUMENT_DOCTYPE):
        raise frappe.DoesNotExistError

    _validate_document_folder(payload.get("folder"), tenant)
    _validate_file_reference(payload.get("file_reference"), tenant)
    _validate_value(payload.get("status"), DOCUMENT_STATUSES, "Invalid DocuShare document status.")
    _validate_value(payload.get("visibility"), VISIBILITY_VALUES, "Invalid DocuShare document visibility.")

    doc = frappe.get_doc(
        {
            "doctype": DOCUMENT_DOCTYPE,
            "tenant": tenant,
            "owner_user": user,
            "status": "Draft",
            "workflow_state": "Draft",
            "visibility": "Private",
            "version": "1",
            "source_channel": "portal",
        }
    )
    _set_fields(doc, payload, DOCUMENT_FIELDS)
    doc.source_channel = "portal"
    if _has_field(DOCUMENT_DOCTYPE, "reference_id") and not getattr(doc, "reference_id", None):
        doc.reference_id = generate_reference_id("RBP-DOC")
    if payload.get("submit"):
        doc.status = "Submitted"
        doc.workflow_state = "Submitted"
        _set_status_dates(doc, "Submitted")
    doc.insert(ignore_permissions=True)

    _audit("docushare_document_created", user, doc, "DocuShare document created.")
    if payload.get("submit"):
        _notify_document_submitted(user, doc)
    return _serialize_document(doc)


def update_document(user, document_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    doc = _get_doc(DOCUMENT_DOCTYPE, document_name)
    _assert_manage_access(user, doc)

    _validate_document_folder(payload.get("folder"), doc.tenant)
    _validate_file_reference(payload.get("file_reference"), doc.tenant)
    _validate_value(payload.get("status"), DOCUMENT_STATUSES, "Invalid DocuShare document status.")
    _validate_value(payload.get("visibility"), VISIBILITY_VALUES, "Invalid DocuShare document visibility.")

    _set_fields(doc, payload, DOCUMENT_FIELDS)
    if "status" in payload:
        doc.workflow_state = doc.status
        _set_status_dates(doc, doc.status)
    doc.save(ignore_permissions=True)

    _audit("docushare_document_updated", user, doc, "DocuShare document updated.")
    return _serialize_document(doc)


def list_documents(user, filters=None):
    user = _require_user(user)
    filters = _safe_payload(filters)
    if not doctype_exists(DOCUMENT_DOCTYPE):
        return {"documents": [], "count": 0}

    query_filters = {}
    for field in ("status", "visibility", "folder", "document_type"):
        if filters.get(field):
            query_filters[field] = filters[field]
    if not _is_admin(user):
        query_filters["tenant"] = _require_tenant(user)

    rows = _visible_records(
        user,
        DOCUMENT_DOCTYPE,
        query_filters,
        [
            "name",
            "tenant",
            "owner_user",
            "folder",
            "title",
            "description",
            "file_reference",
            "document_type",
            "status",
            "workflow_state",
            "visibility",
            "version",
            "submitted_on",
            "source_channel",
            "assigned_to",
            "reviewed_on",
            "closed_on",
            "notes",
            "modified",
        ],
    )
    rows = [{**row, **service_routes("docushare", row.get("name"))} for row in rows]
    return {"documents": rows, "count": len(rows)}


def get_document(user, document_name):
    user = _require_user(user)
    doc = _get_doc(DOCUMENT_DOCTYPE, document_name)
    _assert_view_access(user, doc)
    return _serialize_document(doc)


def admin_update_status(user, document_name, status, payload=None):
    user = _require_user(user)
    if not _is_admin(user):
        raise frappe.PermissionError
    if status not in DOCUMENT_STATUSES:
        raise frappe.ValidationError("Invalid DocuShare document status.")

    payload = _safe_payload(payload)
    doc = _get_doc(DOCUMENT_DOCTYPE, document_name)
    previous_status = getattr(doc, "status", None)

    _set_fields(doc, payload, {"assigned_to", "notes", "visibility"})
    doc.status = status
    doc.workflow_state = status
    _set_status_dates(doc, status)
    doc.save(ignore_permissions=True)

    if status != previous_status:
        _notify(
            doc.owner_user,
            "DocuShare status changed",
            f"Your DocuShare brief is now {status}.",
            doc,
            "docushare.admin_update_status",
        )
        context = _notification_context(doc)
        context["admin_note"] = payload.get("notes")
        _emit_notification_event(
            "admin.status_updated",
            doc,
            f"Your DocuShare brief is now {status}.",
            context,
        )

    _audit(
        "docushare_document_status_updated",
        user,
        doc,
        "DocuShare document status updated.",
        {"from": previous_status, "to": status},
    )
    return _serialize_document(doc)


def _create_share(user, parent_doc, payload, *, target_field, event_type, title, trigger_source):
    _assert_manage_access(user, parent_doc)
    payload = _safe_payload(payload)
    _validate_value(payload.get("access_level"), ACCESS_LEVELS, "Invalid DocuShare access level.")

    if not payload.get("share_target_user") and not payload.get("share_target_email"):
        raise frappe.ValidationError("Share target user or email is required.")

    share = frappe.get_doc(
        {
            "doctype": SHARE_DOCTYPE,
            "tenant": parent_doc.tenant,
            "owner_user": parent_doc.owner_user,
            "access_level": "View",
            "status": "Active",
            target_field: parent_doc.name,
        }
    )
    _set_fields(share, payload, SHARE_FIELDS)
    share.insert(ignore_permissions=True)

    parent_doc.visibility = "Shared"
    parent_doc.save(ignore_permissions=True)

    recipient = getattr(share, "share_target_user", None) or getattr(share, "share_target_email", None)
    _notify(recipient, title, "A DocuShare item has been shared with you.", parent_doc, trigger_source, priority="High")
    _audit(event_type, user, share, title, {target_field: parent_doc.name})
    return _serialize_share(share)


def share_folder(user, folder_name, payload):
    user = _require_user(user)
    if not doctype_exists(SHARE_DOCTYPE):
        raise frappe.DoesNotExistError

    folder = _get_doc(FOLDER_DOCTYPE, folder_name)
    return _create_share(
        user,
        folder,
        payload,
        target_field="folder",
        event_type="docushare_folder_shared",
        title="DocuShare folder shared",
        trigger_source="docushare.share_folder",
    )


def share_document(user, document_name, payload):
    user = _require_user(user)
    if not doctype_exists(SHARE_DOCTYPE):
        raise frappe.DoesNotExistError

    document = _get_doc(DOCUMENT_DOCTYPE, document_name)
    return _create_share(
        user,
        document,
        payload,
        target_field="document",
        event_type="docushare_document_shared",
        title="DocuShare document shared",
        trigger_source="docushare.share_document",
    )


def revoke_share(user, share_name):
    user = _require_user(user)
    share = _get_doc(SHARE_DOCTYPE, share_name)

    parent = _get_doc(FOLDER_DOCTYPE, share.folder) if getattr(share, "folder", None) else _get_doc(DOCUMENT_DOCTYPE, share.document)
    _assert_manage_access(user, parent)

    share.status = "Revoked"
    share.revoked_on = now_datetime()
    share.save(ignore_permissions=True)

    recipient = getattr(share, "share_target_user", None) or getattr(share, "share_target_email", None)
    _notify(recipient, "DocuShare access revoked", "A DocuShare share has been revoked.", parent, "docushare.revoke_share")
    _audit("docushare_share_revoked", user, share, "DocuShare share revoked.")
    return _serialize_share(share)
