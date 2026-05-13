from __future__ import annotations
from dataclasses import asdict, dataclass
from typing import Any, Iterable

from rbp_app.services.email_templates import render_template
from rbp_app.services.notification_triggers import get_trigger

try:
    import frappe
except Exception:
    frappe = None

@dataclass
class EmailDeliveryResult:
    status: str
    recipient_email: str
    subject: str
    provider_message_id: str | None = None
    error_message: str | None = None
    sandboxed: bool = True

def _conf(key: str, default):
    if not frappe or not getattr(frappe, 'conf', None):
        return default
    return frappe.conf.get(key, default)

def _bool(value, default=True):
    if isinstance(value, bool): return value
    if value is None: return default
    return str(value).lower() in {"1","true","yes","on","enabled"}

def _list(value)->list[str]:
    if not value: return []
    if isinstance(value, (list,tuple,set)): return [str(v).strip() for v in value if str(v).strip()]
    return [x.strip() for x in str(value).split(",") if x.strip()]

def email_notifications_enabled() -> bool: return _bool(_conf("rbp_enable_email_notifications", True), True)
def email_sandbox_enabled() -> bool: return _bool(_conf("rbp_email_sandbox_mode", True), True)
def qa_subject_prefix() -> str: return str(_conf("rbp_email_subject_prefix", "[RBP QA]"))
def qa_recipient_allowlist() -> list[str]: return _list(_conf("rbp_qa_email_recipients", []))
def admin_notification_recipients() -> list[str]: return _list(_conf("rbp_admin_notification_recipients", []))
def apply_sandbox_recipient_policy(recipients: Iterable[str]) -> list[str]:
    recipients = [r for r in recipients if r]
    if not email_sandbox_enabled(): return recipients
    allow = set(qa_recipient_allowlist())
    return [r for r in recipients if r in allow]
def build_subject(event_type: str, subject: str | None = None) -> str:
    base = subject or get_trigger(event_type).default_subject
    return f"{qa_subject_prefix()} {base}" if email_sandbox_enabled() else base

def send_event_email(*, event_type: str, recipients: Iterable[str], context: dict[str, Any] | None = None, subject: str | None = None, fake_send: bool | None = None) -> list[EmailDeliveryResult]:
    event = get_trigger(event_type)
    s = build_subject(event_type, subject)
    if not email_notifications_enabled():
        return [EmailDeliveryResult(status="disabled", recipient_email=r, subject=s) for r in recipients]
    filtered = apply_sandbox_recipient_policy(recipients)
    if not filtered:
        return [EmailDeliveryResult(status="blocked", recipient_email="", subject=s, error_message="No recipients after sandbox policy", sandboxed=email_sandbox_enabled())]
    render_template(event.template_key, context)
    is_fake = email_sandbox_enabled() if fake_send is None else fake_send
    out=[]
    for r in filtered:
        if is_fake or not frappe:
            out.append(EmailDeliveryResult(status="sent", recipient_email=r, subject=s, provider_message_id=f"sandbox:{event_type}:{r}", sandboxed=True))
            continue
        try:
            frappe.sendmail(recipients=[r], subject=s, message=render_template(event.template_key, context)["html"], delayed=False)
            out.append(EmailDeliveryResult(status="sent", recipient_email=r, subject=s, sandboxed=False))
        except Exception as exc:
            out.append(EmailDeliveryResult(status="failed", recipient_email=r, subject=s, error_message=str(exc), sandboxed=False))
    return out

def as_dict_rows(rows):
    return [asdict(r) for r in rows]
