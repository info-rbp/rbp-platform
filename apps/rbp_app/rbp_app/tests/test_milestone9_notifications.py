import sys, types
from types import SimpleNamespace

frappe=types.SimpleNamespace(conf={},session=types.SimpleNamespace(user="qa@test.com"),log_error=lambda *a,**k:None,get_traceback=lambda:"",get_all=lambda *a,**k:[],db=types.SimpleNamespace(count=lambda *a,**k:0,set_value=lambda *a,**k:None),get_doc=lambda *a,**k:None,sendmail=lambda **k:None)
mod=types.ModuleType("frappe")
for k,v in frappe.__dict__.items(): setattr(mod,k,v)
utils=types.ModuleType("frappe.utils"); utils.now_datetime=lambda: None; utils.getdate=lambda v:v; utils.nowdate=lambda:"2026-01-01"
sys.modules.setdefault("frappe",mod); sys.modules.setdefault("frappe.utils",utils)

from rbp_app.services.notification_triggers import (
    DISALLOWED_CONTEXT_KEYS,
    SAFE_CONTEXT_KEYS,
    assert_valid_trigger_catalog,
    get_admin_enabled_triggers,
    get_customer_enabled_triggers,
    get_trigger,
    get_triggers_by_category,
    list_notification_triggers,
    list_trigger_keys,
)
from rbp_app.services.email_templates import render_template
from rbp_app.services import email_notifications as en
from rbp_app.services import notifications as n
from rbp_app.services import billing as b
from rbp_app.services import entitlements as e

# existing tests omitted for brevity in this patch; keep behavior checks

def test_trigger_catalog_contains_required_events():
    required={"account.created","membership.payment_succeeded","membership.payment_failed","subscription.status_changed","entitlement.granted","entitlement.suspended","service.request_submitted","docushare.brief_submitted","connectivity.nbn_order_submitted","risk_advisor.assessment_submitted","fixer.request_submitted","marketplace.listing_submitted","marketplace.enquiry_submitted","application.interest_submitted","admin.status_updated"}
    assert required.issubset(set(list_trigger_keys()))

def test_unknown_trigger_raises_value_error():
    import pytest
    with pytest.raises(ValueError): get_trigger("nope")

def test_template_rendering_fields():
    body=render_template("membership_payment_succeeded",{"reference_id":"REF1","portal_url":"/portal/dashboard","amount":"10.00","currency":"AUD"})
    assert "REF1" in body["html"] and "/portal/dashboard" in body["text"] and "10.00" in body["text"]

def test_normalize_email_accepts_basic_email():
    assert en.normalize_email(" USER@Example.COM ")=="user@example.com"

def test_normalize_email_rejects_invalid_values():
    assert en.normalize_email(None) is None
    assert en.normalize_email("") is None
    assert en.normalize_email("not-an-email") is None

def test_normalize_recipients_deduplicates_case_insensitive():
    assert en.normalize_recipients(["A@Test.com", "a@test.com", "b@test.com"]) == ["a@test.com", "b@test.com"]

def test_qa_allowlist_normalizes_config(monkeypatch):
    monkeypatch.setattr(en, "_conf", lambda k, d=None: " QA@Test.com,qa@test.com ")
    assert en.qa_recipient_allowlist() == ["qa@test.com"]

def test_sandbox_policy_blocks_without_allowlist(monkeypatch):
    monkeypatch.setattr(en,"email_sandbox_enabled",lambda:True)
    monkeypatch.setattr(en,"qa_recipient_allowlist",lambda:[])
    assert en.apply_sandbox_recipient_policy(["a@b.com"])==[]

def test_sandbox_policy_allows_only_allowlisted_case_insensitive(monkeypatch):
    monkeypatch.setattr(en, "email_sandbox_enabled", lambda: True)
    monkeypatch.setattr(en, "qa_recipient_allowlist", lambda: ["qa@test.com"])
    assert en.apply_sandbox_recipient_policy(["QA@Test.com", "user@test.com"]) == ["qa@test.com"]

def test_subject_prefix_not_duplicated(monkeypatch):
    monkeypatch.setattr(en,"email_sandbox_enabled",lambda:True)
    monkeypatch.setattr(en,"qa_subject_prefix",lambda:"[RBP QA]")
    assert en.build_subject("account.created", "[RBP QA] Existing") == "[RBP QA] Existing"

def test_send_event_email_disabled_with_no_recipients(monkeypatch):
    monkeypatch.setattr(en, "email_notifications_enabled", lambda: False)
    monkeypatch.setattr(en, "email_sandbox_enabled", lambda: True)
    out = en.send_event_email(event_type="account.created", recipients=[])
    assert len(out) == 1 and out[0].status == "disabled" and out[0].recipient_email == ""

def test_send_event_email_blocked_when_sandbox_has_no_allowed_recipients(monkeypatch):
    monkeypatch.setattr(en,"email_notifications_enabled",lambda:True)
    monkeypatch.setattr(en,"email_sandbox_enabled",lambda:True)
    monkeypatch.setattr(en,"qa_recipient_allowlist",lambda:[])
    out=en.send_event_email(event_type="account.created", recipients=["x@test.com"])
    assert out[0].status=="blocked" and out[0].error_message == en.BLOCKED_RECIPIENT_ERROR

def test_send_event_email_fake_sends_in_sandbox_without_calling_frappe(monkeypatch):
    monkeypatch.setattr(en,"email_notifications_enabled",lambda:True)
    monkeypatch.setattr(en,"email_sandbox_enabled",lambda:True)
    monkeypatch.setattr(en,"qa_recipient_allowlist",lambda:["qa@test.com"])
    class F: pass
    f=F(); f.sendmail=lambda **k: (_ for _ in ()).throw(RuntimeError("must not be called"))
    monkeypatch.setattr(en, "frappe", f)
    out=en.send_event_email(event_type="account.created", recipients=["qa@test.com"])
    assert out[0].status=="sent" and out[0].provider_message_id.startswith("sandbox:")

def test_send_event_email_real_mode_requires_frappe(monkeypatch):
    monkeypatch.setattr(en,"email_notifications_enabled",lambda:True)
    monkeypatch.setattr(en,"email_sandbox_enabled",lambda:False)
    monkeypatch.setattr(en, "frappe", None)
    out = en.send_event_email(event_type="account.created", recipients=["qa@test.com"], fake_send=False)
    assert out[0].status == "failed"

def test_send_event_email_real_mode_captures_sendmail_exception(monkeypatch):
    monkeypatch.setattr(en,"email_notifications_enabled",lambda:True)
    monkeypatch.setattr(en,"email_sandbox_enabled",lambda:False)
    class F: pass
    f=F(); f.sendmail=lambda **k: (_ for _ in ()).throw(RuntimeError("boom"))
    monkeypatch.setattr(en, "frappe", f)
    out = en.send_event_email(event_type="account.created", recipients=["qa@test.com"], fake_send=False)
    assert out[0].status == "failed"

def test_summarize_delivery_results():
    r=lambda s: en.EmailDeliveryResult(status=s, recipient_email="a@test.com", subject="x")
    assert en.summarize_delivery_results([r("sent")])=="sent"
    assert en.summarize_delivery_results([r("disabled")])=="disabled"
    assert en.summarize_delivery_results([r("blocked")])=="blocked"
    assert en.summarize_delivery_results([r("sent"),r("failed")])=="failed"
    assert en.summarize_delivery_results([r("sent"),r("blocked")])=="partial"
    assert en.summarize_delivery_results([])=="skipped"
