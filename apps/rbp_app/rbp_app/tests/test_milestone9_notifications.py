import sys, types
frappe=types.SimpleNamespace(conf={},session=types.SimpleNamespace(user="qa@test.com"),log_error=lambda *a,**k:None,get_traceback=lambda:"",get_all=lambda *a,**k:[],db=types.SimpleNamespace(count=lambda *a,**k:0,set_value=lambda *a,**k:None),get_doc=lambda *a,**k:None,sendmail=lambda **k:None)
mod=types.ModuleType("frappe")
for k,v in frappe.__dict__.items(): setattr(mod,k,v)
utils=types.ModuleType("frappe.utils"); utils.now_datetime=lambda: None
sys.modules.setdefault("frappe",mod); sys.modules.setdefault("frappe.utils",utils)
from rbp_app.services.notification_triggers import get_trigger, list_trigger_keys
from rbp_app.services.email_templates import render_template
from rbp_app.services import email_notifications as en
from rbp_app.services import notifications as n


def test_trigger_catalog_contains_required_events():
    required={"account.created","membership.payment_succeeded","membership.payment_failed","subscription.status_changed","entitlement.granted","entitlement.suspended","service.request_submitted","docushare.brief_submitted","connectivity.nbn_order_submitted","risk_advisor.assessment_submitted","fixer.request_submitted","marketplace.listing_submitted","marketplace.enquiry_submitted","application.interest_submitted","admin.status_updated"}
    assert required.issubset(set(list_trigger_keys()))

def test_unknown_trigger_raises_value_error():
    import pytest
    with pytest.raises(ValueError): get_trigger("nope")

def test_template_rendering_fields():
    body=render_template("membership_payment_succeeded",{"reference_id":"REF1","portal_url":"/portal/dashboard","amount":"10.00","currency":"AUD"})
    assert "REF1" in body["html"] and "/portal/dashboard" in body["text"] and "10.00" in body["text"]

def test_sandbox_policy(monkeypatch):
    monkeypatch.setattr(en,"email_sandbox_enabled",lambda:True)
    monkeypatch.setattr(en,"qa_recipient_allowlist",lambda:[])
    assert en.apply_sandbox_recipient_policy(["a@b.com"])==[]
    monkeypatch.setattr(en,"qa_recipient_allowlist",lambda:["a@b.com"])
    assert en.apply_sandbox_recipient_policy(["a@b.com","x@y.com"])==["a@b.com"]

def test_subject_prefix(monkeypatch):
    monkeypatch.setattr(en,"email_sandbox_enabled",lambda:True)
    monkeypatch.setattr(en,"qa_subject_prefix",lambda:"[RBP QA]")
    assert en.build_subject("account.created").startswith("[RBP QA]")

def test_send_event_email_sandbox(monkeypatch):
    monkeypatch.setattr(en,"email_notifications_enabled",lambda:True)
    monkeypatch.setattr(en,"email_sandbox_enabled",lambda:True)
    monkeypatch.setattr(en,"qa_recipient_allowlist",lambda:["qa@test.com"])
    out=en.send_event_email(event_type="account.created", recipients=["qa@test.com"])
    assert out[0].status=="sent"

def test_send_event_email_blocked(monkeypatch):
    monkeypatch.setattr(en,"email_notifications_enabled",lambda:True)
    monkeypatch.setattr(en,"email_sandbox_enabled",lambda:True)
    monkeypatch.setattr(en,"qa_recipient_allowlist",lambda:[])
    out=en.send_event_email(event_type="account.created", recipients=["x@test.com"])
    assert out[0].status=="blocked"

def test_emit_unknown_trigger():
    out=n.emit_event_notification(event_type="nope")
    assert out["ok"] is False and out["reason"]=="unknown_trigger"

def test_emit_valid_summary(monkeypatch):
    monkeypatch.setattr(n,"create_notification",lambda **k: type("D",(),{"name":"N1"})())
    monkeypatch.setattr(n,"send_event_email",lambda **k:[en.EmailDeliveryResult(status="sent",recipient_email="qa@test.com",subject="x")])
    out=n.emit_event_notification(event_type="account.created", user="qa@test.com")
    assert out["ok"] is True and out["email"]=="sent"

def test_emit_admin_recipients(monkeypatch):
    monkeypatch.setattr(n,"create_notification",lambda **k: None)
    seen={}
    def fake_send(**kwargs):
        seen["recipients"]=kwargs["recipients"]
        return [en.EmailDeliveryResult(status="sent",recipient_email="a@a.com",subject="x")]
    monkeypatch.setattr(n,"send_event_email",fake_send)
    n.emit_event_notification(event_type="membership.payment_succeeded", user="u@test.com", admin_recipients=["admin@test.com"])
    assert "admin@test.com" in seen["recipients"]
