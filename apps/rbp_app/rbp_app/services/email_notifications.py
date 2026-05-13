from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Iterable

from rbp_app.services.email_templates import render_template
from rbp_app.services.notification_triggers import get_trigger

try:
    import frappe
except Exception:
    frappe = None

VALID_DELIVERY_STATUSES = frozenset({"sent", "failed", "blocked", "disabled", "skipped"})
DEFAULT_QA_SUBJECT_PREFIX = "[RBP QA]"
BLOCKED_RECIPIENT_ERROR = "No recipients after sandbox policy"


@dataclass
class EmailDeliveryResult:
    status: str
    recipient_email: str
    subject: str
    provider_message_id: str | None = None
    error_message: str | None = None
    sandboxed: bool = True


def normalize_email(value: object) -> str | None:
    if not value:
        return None
    email = str(value).strip().lower()
    if not email or "@" not in email:
        return None
    return email


def normalize_recipients(recipients: Iterable[object] | None) -> list[str]:
    if recipients is None:
        return []
    out: list[str] = []
    seen: set[str] = set()
    for value in recipients:
        email = normalize_email(value)
        if not email or email in seen:
            continue
        seen.add(email)
        out.append(email)
    return out


def _conf(key: str, default: Any = None) -> Any:
    conf = getattr(frappe, "conf", None) if frappe else None
    if not conf:
        return default
    getter = getattr(conf, "get", None)
    if not callable(getter):
        return default
    try:
        return getter(key, default)
    except Exception:
        return default


def _bool(value: object, default: bool = True) -> bool:
    if isinstance(value, bool):
        return value
    if value is None:
        return default
    normalized = str(value).strip().lower()
    if not normalized:
        return default
    if normalized in {"1", "true", "yes", "on", "enabled"}:
        return True
    if normalized in {"0", "false", "no", "off", "disabled"}:
        return False
    return default


def _list(value: object) -> list[str]:
    if value is None:
        return []
    items = value if isinstance(value, (list, tuple, set)) else str(value).split(",")
    out: list[str] = []
    seen: set[str] = set()
    for item in items:
        normalized = str(item).strip()
        seen_key = normalized.lower()
        if not normalized or seen_key in seen:
            continue
        seen.add(seen_key)
        out.append(normalized)
    return out


def email_notifications_enabled() -> bool:
    return _bool(_conf("rbp_enable_email_notifications", True), True)


def email_sandbox_enabled() -> bool:
    return _bool(_conf("rbp_email_sandbox_mode", True), True)


def qa_subject_prefix() -> str:
    configured = _conf("rbp_email_subject_prefix", DEFAULT_QA_SUBJECT_PREFIX)
    return str(configured).strip() if configured is not None else DEFAULT_QA_SUBJECT_PREFIX


def qa_recipient_allowlist() -> list[str]:
    allowlist = normalize_recipients(_list(_conf("rbp_qa_email_recipients", [])))
    if allowlist:
        return allowlist
    fallback = normalize_email(_conf("rbp_email_sandbox_recipient", None))
    return [fallback] if fallback else []


def admin_notification_recipients() -> list[str]:
    return normalize_recipients(_list(_conf("rbp_admin_notification_recipients", [])))


def apply_sandbox_recipient_policy(recipients: Iterable[object] | None) -> list[str]:
    normalized = normalize_recipients(recipients)
    if not email_sandbox_enabled():
        return normalized
    allowlist = set(qa_recipient_allowlist())
    if not allowlist:
        return []
    return [recipient for recipient in normalized if recipient in allowlist]


def build_subject(event_type: str, subject: str | None = None) -> str:
    base = str(subject if subject is not None else get_trigger(event_type).default_subject).strip()
    if not email_sandbox_enabled():
        return base
    prefix = qa_subject_prefix()
    if not prefix or base.startswith(prefix):
        return base
    return f"{prefix} {base}"


def delivery_result_to_dict(result: EmailDeliveryResult) -> dict[str, object]:
    return {
        "status": result.status,
        "recipient_email": result.recipient_email,
        "subject": result.subject,
        "provider_message_id": result.provider_message_id,
        "error_message": result.error_message,
        "sandboxed": result.sandboxed,
    }


def summarize_delivery_results(results: Iterable[EmailDeliveryResult]) -> str:
    statuses = [result.status for result in results]
    if not statuses:
        return "skipped"
    if any(status == "failed" for status in statuses):
        return "failed"
    if all(status == "sent" for status in statuses):
        return "sent"
    if all(status == "disabled" for status in statuses):
        return "disabled"
    if all(status == "blocked" for status in statuses):
        return "blocked"
    return "partial"


def summarize_delivery_dicts(results: Iterable[dict[str, object]]) -> str:
    return summarize_delivery_results(
        EmailDeliveryResult(
            status=str(row.get("status") or "skipped"),
            recipient_email=str(row.get("recipient_email") or ""),
            subject=str(row.get("subject") or ""),
            provider_message_id=row.get("provider_message_id") if isinstance(row.get("provider_message_id"), str) else None,
            error_message=row.get("error_message") if isinstance(row.get("error_message"), str) else None,
            sandboxed=bool(row.get("sandboxed", True)),
        )
        for row in results
    )


def _result(**kwargs: Any) -> EmailDeliveryResult:
    result = EmailDeliveryResult(**kwargs)
    if result.status not in VALID_DELIVERY_STATUSES:
        raise ValueError(f"Unsupported delivery status: {result.status}")
    return result


def send_event_email(
    *,
    event_type: str,
    recipients: Iterable[object] | None,
    context: dict[str, Any] | None = None,
    subject: str | None = None,
    fake_send: bool | None = None,
) -> list[EmailDeliveryResult]:
    trigger = get_trigger(event_type)
    sandbox_mode = email_sandbox_enabled()
    final_subject = build_subject(event_type, subject)
    normalized_recipients = normalize_recipients(recipients)

    if not email_notifications_enabled():
        recipients_for_disabled = normalized_recipients or [""]
        return [
            _result(status="disabled", recipient_email=recipient, subject=final_subject, sandboxed=sandbox_mode)
            for recipient in recipients_for_disabled
        ]

    filtered = apply_sandbox_recipient_policy(normalized_recipients)
    if not filtered:
        return [
            _result(
                status="blocked",
                recipient_email="",
                subject=final_subject,
                error_message=BLOCKED_RECIPIENT_ERROR,
                sandboxed=sandbox_mode,
            )
        ]

    template = render_template(trigger.template_key, context or {})
    send_as_fake = sandbox_mode if fake_send is None else fake_send

    if send_as_fake:
        return [
            _result(
                status="sent",
                recipient_email=recipient,
                subject=final_subject,
                provider_message_id=f"sandbox:{event_type}:{recipient}",
                sandboxed=True,
            )
            for recipient in filtered
        ]

    if not frappe:
        return [
            _result(
                status="failed",
                recipient_email=recipient,
                subject=final_subject,
                error_message="Frappe is unavailable for real email delivery",
                sandboxed=False,
            )
            for recipient in filtered
        ]

    message_html = template.get("html") or ""
    message_text = template.get("text") or ""
    message = message_html or message_text
    out: list[EmailDeliveryResult] = []
    for recipient in filtered:
        try:
            frappe.sendmail(recipients=[recipient], subject=final_subject, message=message, delayed=False)
            out.append(_result(status="sent", recipient_email=recipient, subject=final_subject, sandboxed=False))
        except Exception as exc:
            out.append(
                _result(
                    status="failed",
                    recipient_email=recipient,
                    subject=final_subject,
                    error_message=str(exc),
                    sandboxed=False,
                )
            )
    return out


def as_dict_rows(rows: Iterable[EmailDeliveryResult]) -> list[dict[str, object]]:
    return [delivery_result_to_dict(row) for row in rows]
