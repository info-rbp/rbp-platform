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


def test_trigger_catalog_contains_required_events():
    required={"account.created","membership.payment_succeeded","membership.payment_failed","subscription.status_changed","entitlement.granted","entitlement.suspended","service.request_submitted","docushare.brief_submitted","connectivity.nbn_order_submitted","risk_advisor.assessment_submitted","fixer.request_submitted","marketplace.listing_submitted","marketplace.enquiry_submitted","application.interest_submitted","admin.status_updated"}
    assert required.issubset(set(list_trigger_keys()))

def test_unknown_trigger_raises_value_error():
    import pytest
    with pytest.raises(ValueError): get_trigger("nope")

def test_trigger_catalog_validates_cleanly():
    assert_valid_trigger_catalog()

def test_list_notification_triggers_returns_safe_dicts():
    required_keys={"event_type","template_key","default_subject","customer_enabled","admin_enabled","portal_enabled","email_enabled","category","default_portal_url","required_context_keys","optional_context_keys","delivery_channels","sensitivity"}
    rows=list_notification_triggers()
    assert rows
    for row in rows:
        assert isinstance(row, dict)
        assert required_keys.issubset(set(row.keys()))
        assert type(row).__name__ != "NotificationTrigger"

def test_required_context_keys_are_safe():
    for trigger in list_notification_triggers():
        required_set=set(trigger["required_context_keys"])
        optional_set=set(trigger["optional_context_keys"])
        assert required_set.issubset(SAFE_CONTEXT_KEYS)
        assert optional_set.issubset(SAFE_CONTEXT_KEYS)
        assert not (required_set & DISALLOWED_CONTEXT_KEYS)
        assert not (optional_set & DISALLOWED_CONTEXT_KEYS)

def test_trigger_category_filters_are_sorted():
    service_triggers=get_triggers_by_category("service")
    assert all(t.category=="service" for t in service_triggers)
    assert [t.event_type for t in service_triggers]==sorted(t.event_type for t in service_triggers)

def test_admin_enabled_triggers_match_expected_events():
    expected={"membership.payment_succeeded","membership.payment_failed","subscription.status_changed","entitlement.suspended","service.request_submitted","docushare.brief_submitted","connectivity.nbn_order_submitted","risk_advisor.assessment_submitted","fixer.request_submitted","marketplace.listing_submitted","marketplace.enquiry_submitted","application.interest_submitted"}
    actual={t.event_type for t in get_admin_enabled_triggers()}
    assert expected.issubset(actual)
    assert "account.created" not in actual
    assert "entitlement.granted" not in actual
    assert "admin.status_updated" not in actual

def test_customer_enabled_triggers_include_all_customer_events():
    customer=get_customer_enabled_triggers()
    assert len(customer)==len(list_trigger_keys())
    assert all(t.customer_enabled is True for t in customer)

def test_billing_triggers_use_billing_sensitivity():
    for key in ("membership.payment_succeeded","membership.payment_failed","subscription.status_changed"):
        assert get_trigger(key).sensitivity=="billing"

def test_application_provisioning_event_not_present():
    keys=list_trigger_keys()
    assert "applications.provisioning_requested" not in keys
    assert all("applications_provisioning" not in key for key in keys)

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


def _fake_subscription(status="Active", payment_status="Pending"):
    return SimpleNamespace(
        doctype="RBP Subscription",
        name="SUB-1",
        user="qa@test.com",
        member="qa@test.com",
        tenant="Tenant A",
        plan="Premium",
        status=status,
        payment_status=payment_status,
        save=lambda ignore_permissions=True: None,
    )


def _fake_event(status="Paid"):
    return SimpleNamespace(
        name="PE-1",
        related_name="SUB-1",
        status=status,
        provider_customer_id="CUST-1",
        provider_payment_id="PAY-1",
        payment_provider="Stripe",
        amount=100,
        currency="AUD",
    )


def _setup_billing(monkeypatch, subscription):
    monkeypatch.setattr(b.frappe.db, "exists", lambda doctype, name: name == "SUB-1", raising=False)
    monkeypatch.setattr(b.frappe, "get_doc", lambda doctype, name: subscription)
    monkeypatch.setattr(b, "sync_subscription_entitlements", lambda sub: {"action": "noop"})


def test_billing_status_changed_not_emitted_when_status_unchanged(monkeypatch):
    subscription = _fake_subscription(status="Active", payment_status="Pending")
    event = _fake_event(status="Paid")
    _setup_billing(monkeypatch, subscription)
    seen = []
    monkeypatch.setattr(b, "_safe_emit_billing_notification", lambda **kwargs: seen.append(kwargs["event_type"]))
    b.update_subscription_from_payment_event(event)
    assert "subscription.status_changed" not in seen


def test_billing_status_changed_emitted_when_status_changes(monkeypatch):
    subscription = _fake_subscription(status="Past Due", payment_status="Failed")
    event = _fake_event(status="Paid")
    _setup_billing(monkeypatch, subscription)
    seen = []
    monkeypatch.setattr(b, "_safe_emit_billing_notification", lambda **kwargs: seen.append(kwargs["event_type"]))
    b.update_subscription_from_payment_event(event)
    assert seen.count("subscription.status_changed") == 1


def test_billing_payment_success_emits_success_event(monkeypatch):
    subscription = _fake_subscription(status="Active")
    _setup_billing(monkeypatch, subscription)
    seen = []
    monkeypatch.setattr(b, "_safe_emit_billing_notification", lambda **kwargs: seen.append(kwargs["event_type"]))
    b.update_subscription_from_payment_event(_fake_event(status="Paid"))
    assert "membership.payment_succeeded" in seen


def test_billing_payment_failure_emits_failure_event(monkeypatch):
    subscription = _fake_subscription(status="Active")
    _setup_billing(monkeypatch, subscription)
    seen = []
    monkeypatch.setattr(b, "_safe_emit_billing_notification", lambda **kwargs: seen.append(kwargs["event_type"]))
    b.update_subscription_from_payment_event(_fake_event(status="Failed"))
    assert "membership.payment_failed" in seen


def test_billing_notification_failure_does_not_break_subscription_update(monkeypatch):
    subscription = _fake_subscription(status="Past Due")
    _setup_billing(monkeypatch, subscription)
    monkeypatch.setattr(b, "emit_event_notification", lambda **kwargs: (_ for _ in ()).throw(RuntimeError("boom")))
    updated = b.update_subscription_from_payment_event(_fake_event(status="Paid"))
    assert updated.status == "Active"


def test_entitlement_granted_not_emitted_when_no_changes(monkeypatch):
    seen = []
    subscription = SimpleNamespace(name="SUB-1", user="qa@test.com", member="qa@test.com", tenant="T", status="Active", payment_status="Paid", plan="P")
    monkeypatch.setattr(e, "grant_membership_entitlements", lambda subscription: [])
    monkeypatch.setattr(e, "_safe_emit_entitlement_notification", lambda **kwargs: seen.append(kwargs["event_type"]))
    out = e.sync_subscription_entitlements(subscription)
    assert out["action"] == "granted"
    assert "entitlement.granted" not in seen


def test_entitlement_granted_emitted_when_changes_exist(monkeypatch):
    seen = []
    subscription = SimpleNamespace(name="SUB-1", user="qa@test.com", member="qa@test.com", tenant="T", status="Active", payment_status="Paid", plan="P")
    monkeypatch.setattr(e, "grant_membership_entitlements", lambda subscription: [{"name": "ENT-1"}])
    monkeypatch.setattr(e, "_safe_emit_entitlement_notification", lambda **kwargs: seen.append(kwargs["event_type"]))
    e.sync_subscription_entitlements(subscription)
    assert "entitlement.granted" in seen


def test_entitlement_suspended_not_emitted_when_no_changes(monkeypatch):
    seen = []
    subscription = SimpleNamespace(name="SUB-1", user="qa@test.com", member="qa@test.com", tenant="T", status="Cancelled", payment_status="Failed", plan="P")
    monkeypatch.setattr(e, "suspend_membership_entitlements", lambda subscription, status: [])
    monkeypatch.setattr(e, "_safe_emit_entitlement_notification", lambda **kwargs: seen.append(kwargs["event_type"]))
    out = e.sync_subscription_entitlements(subscription)
    assert out["action"] == "suspended"
    assert "entitlement.suspended" not in seen


def test_entitlement_suspended_emitted_when_changes_exist(monkeypatch):
    seen = []
    subscription = SimpleNamespace(name="SUB-1", user="qa@test.com", member="qa@test.com", tenant="T", status="Cancelled", payment_status="Failed", plan="P")
    monkeypatch.setattr(e, "suspend_membership_entitlements", lambda subscription, status: [{"name": "ENT-1"}])
    monkeypatch.setattr(e, "_safe_emit_entitlement_notification", lambda **kwargs: seen.append(kwargs["event_type"]))
    e.sync_subscription_entitlements(subscription)
    assert "entitlement.suspended" in seen


def test_entitlement_notification_failure_does_not_break_sync(monkeypatch):
    subscription = SimpleNamespace(name="SUB-1", user="qa@test.com", member="qa@test.com", tenant="T", status="Active", payment_status="Paid", plan="P")
    monkeypatch.setattr(e, "grant_membership_entitlements", lambda subscription: [{"name": "ENT-1"}])
    monkeypatch.setattr(e, "emit_event_notification", lambda **kwargs: (_ for _ in ()).throw(RuntimeError("boom")))
    out = e.sync_subscription_entitlements(subscription)
    assert out["action"] == "granted"
