"""Risk Advisor business services."""

import json

import frappe
from frappe.utils import now_datetime

from rbp_app.permissions import is_admin_user
from rbp_app.services.audit import record_audit_event
from rbp_app.services.notifications import create_notification
from rbp_app.services.reference_ids import generate_reference_id
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


ASSESSMENT_DOCTYPE = "RBP Risk Advisor Assessment"
RISK_DOCTYPE = "RBP Risk Advisor Risk"
ACTION_DOCTYPE = "RBP Risk Advisor Action"

ASSESSMENT_STATUSES = {
    "Draft",
    "Submitted",
    "In Review",
    "Reviewed",
    "Closed",
    "Cancelled",
}
ASSESSMENT_STATUS_TRANSITIONS = {
    "Draft": {"Submitted", "In Review", "Cancelled"},
    "Submitted": {"In Review", "Reviewed", "Closed", "Cancelled"},
    "In Review": {"Reviewed", "Closed", "Cancelled"},
    "Reviewed": {"In Review", "Closed", "Cancelled"},
    "Closed": set(),
    "Cancelled": set(),
}
RISK_STATUSES = {"Open", "Monitoring", "Mitigated", "Accepted", "Closed"}
ACTION_STATUSES = {"Open", "In Progress", "Completed", "Cancelled"}

DRAFT_ASSESSMENT_FIELDS = {
    "business_profile",
    "title",
    "assessment_type",
    "business_area",
    "summary",
    "notes",
}
ADMIN_ASSESSMENT_FIELDS = {"assigned_to", "notes", "risk_score", "risk_level"}
RISK_FIELDS = {
    "title",
    "category",
    "description",
    "likelihood",
    "impact",
    "status",
    "owner_user",
    "notes",
}
ACTION_FIELDS = {
    "title",
    "description",
    "priority",
    "status",
    "assigned_to",
    "due_date",
    "notes",
}


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


def _require_tenant(user):
    tenant = get_current_tenant_name(user)
    if not tenant:
        raise frappe.PermissionError
    return tenant


def _is_admin(user):
    return is_admin_user(user)


def _get_doc(doctype, name):
    if not doctype_exists(doctype):
        raise frappe.DoesNotExistError
    return frappe.get_doc(doctype, name)


def _set_fields(doc, payload, allowed_fields):
    for field in allowed_fields:
        if field in payload:
            setattr(doc, field, payload.get(field))


def _validate_assessment_transition(current_status, next_status):
    if next_status not in ASSESSMENT_STATUSES:
        raise frappe.ValidationError("Invalid Risk Advisor assessment status.")
    if current_status == next_status:
        return
    allowed = ASSESSMENT_STATUS_TRANSITIONS.get(current_status, set())
    if next_status not in allowed:
        raise frappe.ValidationError("Invalid Risk Advisor assessment status transition.")


def calculate_risk_score(likelihood, impact):
    return int(likelihood or 0) * int(impact or 0)


def derive_risk_level(score):
    score = int(score or 0)
    if score >= 20:
        return "Critical"
    if score >= 12:
        return "High"
    if score >= 5:
        return "Medium"
    return "Low"


def _apply_risk_score(doc):
    score = calculate_risk_score(getattr(doc, "likelihood", None), getattr(doc, "impact", None))
    doc.risk_score = score
    doc.risk_level = derive_risk_level(score)


def _serialize_assessment(doc, risks=None, actions=None):
    return {
        "name": doc.name,
        "tenant": doc.tenant,
        "owner_user": doc.owner_user,
        "business_profile": getattr(doc, "business_profile", None),
        "title": getattr(doc, "title", None),
        "assessment_type": getattr(doc, "assessment_type", None),
        "business_area": getattr(doc, "business_area", None),
        "summary": getattr(doc, "summary", None),
        "status": doc.status,
        "workflow_state": getattr(doc, "workflow_state", None),
        "risk_score": getattr(doc, "risk_score", None),
        "risk_level": getattr(doc, "risk_level", None),
        "assigned_to": getattr(doc, "assigned_to", None),
        "submitted_on": getattr(doc, "submitted_on", None),
        "reviewed_on": getattr(doc, "reviewed_on", None),
        "closed_on": getattr(doc, "closed_on", None),
        "notes": getattr(doc, "notes", None),
        "risks": risks or [],
        "actions": actions or [],
    }


def _serialize_risk(doc):
    return {
        "name": doc.name,
        "tenant": doc.tenant,
        "assessment": doc.assessment,
        "title": getattr(doc, "title", None),
        "category": getattr(doc, "category", None),
        "description": getattr(doc, "description", None),
        "likelihood": getattr(doc, "likelihood", None),
        "impact": getattr(doc, "impact", None),
        "risk_score": getattr(doc, "risk_score", None),
        "risk_level": getattr(doc, "risk_level", None),
        "status": getattr(doc, "status", None),
        "owner_user": getattr(doc, "owner_user", None),
        "notes": getattr(doc, "notes", None),
    }


def _serialize_action(doc):
    return {
        "name": doc.name,
        "tenant": doc.tenant,
        "assessment": doc.assessment,
        "risk": doc.risk,
        "title": getattr(doc, "title", None),
        "description": getattr(doc, "description", None),
        "priority": getattr(doc, "priority", None),
        "status": getattr(doc, "status", None),
        "assigned_to": getattr(doc, "assigned_to", None),
        "due_date": getattr(doc, "due_date", None),
        "completed_on": getattr(doc, "completed_on", None),
        "notes": getattr(doc, "notes", None),
    }


def _assert_assessment_access(user, doc, *, owner_only=False, manage=False):
    _require_user(user)

    if _is_admin(user):
        return True

    user_tenant = _require_tenant(user)
    if doc.tenant != user_tenant:
        raise frappe.PermissionError

    is_owner = doc.owner_user == user
    is_assigned = getattr(doc, "assigned_to", None) == user

    if manage:
        raise frappe.PermissionError
    if owner_only and not is_owner:
        raise frappe.PermissionError
    if is_owner or is_assigned:
        return True

    raise frappe.PermissionError


def _get_risk_parent(risk):
    if not risk.assessment:
        raise frappe.ValidationError("Risk is missing its parent assessment.")
    return _get_doc(ASSESSMENT_DOCTYPE, risk.assessment)


def _get_action_parent(action):
    if not action.risk:
        raise frappe.ValidationError("Action is missing its parent risk.")
    risk = _get_doc(RISK_DOCTYPE, action.risk)
    assessment = _get_risk_parent(risk)
    return risk, assessment


def _audit(event_type, user, doc, message=None, metadata=None):
    return record_audit_event(
        event_type,
        actor=user,
        tenant=getattr(doc, "tenant", None),
        subject_doctype=getattr(doc, "doctype", None) or ASSESSMENT_DOCTYPE,
        subject_name=doc.name,
        workflow_state=getattr(doc, "workflow_state", None) or getattr(doc, "status", None),
        message=message,
        metadata=metadata or {},
    )


def _notify(user, title, message, assessment, trigger_source, *, priority="Normal", notification_type="Info"):
    if not user:
        return None
    return create_notification(
        user=user,
        tenant=getattr(assessment, "tenant", None),
        title=title,
        message=message,
        priority=priority,
        notification_type=notification_type,
        route=f"/portal/risk-advisor/{assessment.name}",
        related_doctype=ASSESSMENT_DOCTYPE,
        related_name=assessment.name,
        trigger_source=trigger_source,
        created_by_workflow="risk_advisor",
    )


def _admin_recipients():
    recipients = {"Administrator"}
    try:
        rows = frappe.get_all("Has Role", filters={"role": "System Manager"}, fields=["parent"])
        recipients.update(row.get("parent") for row in rows if row.get("parent"))
    except Exception:
        pass
    return sorted(recipients)


def _notify_admins_submitted(assessment):
    for recipient in _admin_recipients():
        _notify(
            recipient,
            "Risk assessment submitted",
            f"{assessment.owner_user} submitted a Risk Advisor assessment.",
            assessment,
            "risk_advisor.submit_assessment.admin",
            priority="High",
        )


def create_assessment(user, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    tenant = _require_tenant(user)

    if not doctype_exists(ASSESSMENT_DOCTYPE):
        raise frappe.DoesNotExistError

    doc = frappe.get_doc(
        {
            "doctype": ASSESSMENT_DOCTYPE,
            "tenant": tenant,
            "owner_user": user,
            "status": "Draft",
            "workflow_state": "Draft",
            "assessment_type": "General",
            "risk_score": 0,
            "risk_level": "Low",
        }
    )
    _set_fields(doc, payload, DRAFT_ASSESSMENT_FIELDS)
    if frappe.get_meta(ASSESSMENT_DOCTYPE).has_field("reference_id") and not getattr(doc, "reference_id", None):
        doc.reference_id = generate_reference_id("RBP-RISK")
    if frappe.get_meta(ASSESSMENT_DOCTYPE).has_field("submitted_on") and not getattr(doc, "submitted_on", None):
        doc.submitted_on = now_datetime()
    if frappe.get_meta(ASSESSMENT_DOCTYPE).has_field("source_channel") and not getattr(doc, "source_channel", None):
        doc.source_channel = "portal"
    doc.insert(ignore_permissions=True)

    _audit("risk_advisor_assessment_created", user, doc, "Risk Advisor assessment created.")
    return _serialize_assessment(doc)


def update_draft_assessment(user, assessment_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    doc = _get_doc(ASSESSMENT_DOCTYPE, assessment_name)
    _assert_assessment_access(user, doc, owner_only=True)

    if doc.status != "Draft":
        raise frappe.ValidationError("Only draft Risk Advisor assessments can be updated by the owner.")

    _set_fields(doc, payload, DRAFT_ASSESSMENT_FIELDS)
    doc.workflow_state = doc.status
    doc.save(ignore_permissions=True)

    _audit("risk_advisor_assessment_updated", user, doc, "Risk Advisor assessment updated.")
    return _serialize_assessment(doc)


def submit_assessment(user, assessment_name):
    user = _require_user(user)
    doc = _get_doc(ASSESSMENT_DOCTYPE, assessment_name)
    _assert_assessment_access(user, doc, owner_only=True)

    if doc.status != "Draft":
        raise frappe.ValidationError("Only draft Risk Advisor assessments can be submitted.")

    _validate_assessment_transition(doc.status, "Submitted")
    doc.status = "Submitted"
    doc.workflow_state = "Submitted"
    doc.submitted_on = now_datetime()
    doc.save(ignore_permissions=True)

    _notify(
        doc.owner_user,
        "Risk assessment submitted",
        "Your Risk Advisor assessment has been submitted.",
        doc,
        "risk_advisor.submit_assessment.user",
    )
    _notify_admins_submitted(doc)
    _audit("risk_advisor_assessment_submitted", user, doc, "Risk Advisor assessment submitted.")
    return _serialize_assessment(doc)


def list_my_assessments(user, filters=None):
    user = _require_user(user)
    filters = _safe_payload(filters)

    if not doctype_exists(ASSESSMENT_DOCTYPE):
        return {"assessments": [], "count": 0}

    query_filters = {}
    for field in ("status", "assessment_type", "business_area", "risk_level"):
        if filters.get(field):
            query_filters[field] = filters[field]

    if not _is_admin(user):
        query_filters["tenant"] = _require_tenant(user)

    rows = frappe.get_all(
        ASSESSMENT_DOCTYPE,
        filters=query_filters,
        fields=[
            "name",
            "tenant",
            "owner_user",
            "business_profile",
            "title",
            "assessment_type",
            "business_area",
            "status",
            "workflow_state",
            "risk_score",
            "risk_level",
            "assigned_to",
            "submitted_on",
            "reviewed_on",
            "closed_on",
            "modified",
        ],
        order_by="modified desc",
    )

    if not _is_admin(user):
        rows = [row for row in rows if row.get("owner_user") == user or row.get("assigned_to") == user]

    return {"assessments": rows, "count": len(rows)}


def get_assessment(user, assessment_name):
    user = _require_user(user)
    doc = _get_doc(ASSESSMENT_DOCTYPE, assessment_name)
    _assert_assessment_access(user, doc)

    risks = []
    actions = []
    if doctype_exists(RISK_DOCTYPE):
        risks = frappe.get_all(
            RISK_DOCTYPE,
            filters={"assessment": doc.name},
            fields=[
                "name",
                "tenant",
                "assessment",
                "title",
                "category",
                "description",
                "likelihood",
                "impact",
                "risk_score",
                "risk_level",
                "status",
                "owner_user",
                "notes",
            ],
            order_by="modified desc",
        )
    if doctype_exists(ACTION_DOCTYPE):
        actions = frappe.get_all(
            ACTION_DOCTYPE,
            filters={"assessment": doc.name},
            fields=[
                "name",
                "tenant",
                "assessment",
                "risk",
                "title",
                "description",
                "priority",
                "status",
                "assigned_to",
                "due_date",
                "completed_on",
                "notes",
            ],
            order_by="modified desc",
        )

    return _serialize_assessment(doc, risks=risks, actions=actions)


def admin_assign_assessment(user, assessment_name, assigned_to):
    user = _require_user(user)
    if not _is_admin(user):
        raise frappe.PermissionError
    if not assigned_to:
        raise frappe.ValidationError("Assigned advisor is required.")

    doc = _get_doc(ASSESSMENT_DOCTYPE, assessment_name)
    _validate_assessment_transition(doc.status, "In Review")
    doc.assigned_to = assigned_to
    doc.status = "In Review"
    doc.workflow_state = "In Review"
    doc.reviewed_on = now_datetime()
    doc.save(ignore_permissions=True)

    _notify(
        assigned_to,
        "Risk assessment assigned",
        "A Risk Advisor assessment has been assigned to you.",
        doc,
        "risk_advisor.admin_assign_assessment",
        priority="High",
    )
    _audit(
        "risk_advisor_assessment_assigned",
        user,
        doc,
        "Risk Advisor assessment assigned.",
        {"assigned_to": assigned_to},
    )
    return _serialize_assessment(doc)


def admin_update_assessment_status(user, assessment_name, status, payload=None):
    user = _require_user(user)
    if not _is_admin(user):
        raise frappe.PermissionError
    payload = _safe_payload(payload)
    doc = _get_doc(ASSESSMENT_DOCTYPE, assessment_name)
    previous_status = doc.status
    _validate_assessment_transition(previous_status, status)

    _set_fields(doc, payload, ADMIN_ASSESSMENT_FIELDS)
    doc.status = status
    doc.workflow_state = status

    if status in {"In Review", "Reviewed"} and not getattr(doc, "reviewed_on", None):
        doc.reviewed_on = now_datetime()
    if status in {"Closed", "Cancelled"}:
        doc.closed_on = now_datetime()

    doc.save(ignore_permissions=True)

    if status != previous_status:
        _notify(
            doc.owner_user,
            "Risk assessment status changed",
            f"Your Risk Advisor assessment is now {status}.",
            doc,
            "risk_advisor.admin_update_assessment_status",
        )

    _audit(
        "risk_advisor_assessment_status_updated",
        user,
        doc,
        "Risk Advisor assessment status updated.",
        {"from": previous_status, "to": status},
    )
    return _serialize_assessment(doc)


def create_risk(user, assessment_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    assessment = _get_doc(ASSESSMENT_DOCTYPE, assessment_name)
    _assert_assessment_access(user, assessment)

    if not doctype_exists(RISK_DOCTYPE):
        raise frappe.DoesNotExistError

    risk = frappe.get_doc(
        {
            "doctype": RISK_DOCTYPE,
            "tenant": assessment.tenant,
            "assessment": assessment.name,
            "likelihood": 1,
            "impact": 1,
            "status": "Open",
            "owner_user": user,
        }
    )
    _set_fields(risk, payload, RISK_FIELDS)
    _apply_risk_score(risk)
    risk.insert(ignore_permissions=True)

    _notify(
        assessment.owner_user,
        "Risk created",
        "A risk has been added to your Risk Advisor assessment.",
        assessment,
        "risk_advisor.create_risk",
    )
    _audit("risk_advisor_risk_created", user, risk, "Risk Advisor risk created.", {"assessment": assessment.name})
    return _serialize_risk(risk)


def update_risk(user, risk_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    risk = _get_doc(RISK_DOCTYPE, risk_name)
    assessment = _get_risk_parent(risk)
    _assert_assessment_access(user, assessment)

    if risk.tenant != assessment.tenant:
        raise frappe.PermissionError
    if "status" in payload and payload["status"] not in RISK_STATUSES:
        raise frappe.ValidationError("Invalid Risk Advisor risk status.")

    _set_fields(risk, payload, RISK_FIELDS)
    _apply_risk_score(risk)
    risk.save(ignore_permissions=True)

    _audit("risk_advisor_risk_updated", user, risk, "Risk Advisor risk updated.", {"assessment": assessment.name})
    return _serialize_risk(risk)


def create_action(user, risk_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    risk = _get_doc(RISK_DOCTYPE, risk_name)
    assessment = _get_risk_parent(risk)
    _assert_assessment_access(user, assessment)

    if risk.tenant != assessment.tenant:
        raise frappe.PermissionError
    if not doctype_exists(ACTION_DOCTYPE):
        raise frappe.DoesNotExistError

    action = frappe.get_doc(
        {
            "doctype": ACTION_DOCTYPE,
            "tenant": assessment.tenant,
            "assessment": assessment.name,
            "risk": risk.name,
            "priority": "Normal",
            "status": "Open",
        }
    )
    _set_fields(action, payload, ACTION_FIELDS)
    action.insert(ignore_permissions=True)

    if getattr(action, "assigned_to", None):
        _notify(
            action.assigned_to,
            "Risk action assigned",
            "A Risk Advisor action has been assigned to you.",
            assessment,
            "risk_advisor.create_action.assigned",
            priority="High",
        )
    _audit("risk_advisor_action_created", user, action, "Risk Advisor action created.", {"risk": risk.name})
    return _serialize_action(action)


def update_action(user, action_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    action = _get_doc(ACTION_DOCTYPE, action_name)
    risk, assessment = _get_action_parent(action)
    _assert_assessment_access(user, assessment)

    if action.tenant != assessment.tenant or risk.tenant != assessment.tenant:
        raise frappe.PermissionError
    if "status" in payload and payload["status"] not in ACTION_STATUSES:
        raise frappe.ValidationError("Invalid Risk Advisor action status.")

    previous_assignee = getattr(action, "assigned_to", None)
    _set_fields(action, payload, ACTION_FIELDS)
    if action.status == "Completed" and not getattr(action, "completed_on", None):
        action.completed_on = now_datetime()
    action.save(ignore_permissions=True)

    if getattr(action, "assigned_to", None) and action.assigned_to != previous_assignee:
        _notify(
            action.assigned_to,
            "Risk action assigned",
            "A Risk Advisor action has been assigned to you.",
            assessment,
            "risk_advisor.update_action.assigned",
            priority="High",
        )
    _audit("risk_advisor_action_updated", user, action, "Risk Advisor action updated.", {"risk": risk.name})
    return _serialize_action(action)


def complete_action(user, action_name):
    user = _require_user(user)
    action = _get_doc(ACTION_DOCTYPE, action_name)
    risk, assessment = _get_action_parent(action)
    _assert_assessment_access(user, assessment)

    if action.tenant != assessment.tenant or risk.tenant != assessment.tenant:
        raise frappe.PermissionError

    action.status = "Completed"
    action.completed_on = now_datetime()
    action.save(ignore_permissions=True)

    recipients = {assessment.owner_user, getattr(action, "assigned_to", None)}
    for recipient in sorted(user for user in recipients if user):
        _notify(
            recipient,
            "Risk action completed",
            "A Risk Advisor action has been completed.",
            assessment,
            "risk_advisor.complete_action",
            notification_type="Success",
        )

    _audit("risk_advisor_action_completed", user, action, "Risk Advisor action completed.", {"risk": risk.name})
    return _serialize_action(action)
