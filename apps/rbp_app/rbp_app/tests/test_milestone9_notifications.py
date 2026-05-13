import sys
import types
import json
from pathlib import Path
from types import SimpleNamespace

import pytest


frappe_stub = types.ModuleType("frappe")
frappe_stub.conf = {}
frappe_stub.session = SimpleNamespace(user="qa@test.com")
frappe_stub.PermissionError = type("PermissionError", (Exception,), {})
frappe_stub.DoesNotExistError = type("DoesNotExistError", (Exception,), {})
frappe_stub.ValidationError = type("ValidationError", (Exception,), {})
frappe_stub.log_error = lambda *a, **k: None
frappe_stub.get_traceback = lambda: ""
frappe_stub.get_roles = lambda: ["System Manager"]
frappe_stub.throw = lambda message, exc=None: (_ for _ in ()).throw(exc(message) if exc else Exception(message))
frappe_stub.whitelist = lambda *a, **k: (lambda fn: fn) if not a or not callable(a[0]) else a[0]
frappe_stub.get_all = lambda *a, **k: []
frappe_stub.db = SimpleNamespace(count=lambda *a, **k: 0, set_value=lambda *a, **k: None)
frappe_stub.get_doc = lambda *a, **k: None
frappe_stub.sendmail = lambda **k: None

utils_stub = types.ModuleType("frappe.utils")
utils_stub.now_datetime = lambda: "2026-05-13 10:00:00"
utils_stub.getdate = lambda value: value
utils_stub.nowdate = lambda: "2026-05-13"
sys.modules.setdefault("frappe", frappe_stub)
sys.modules.setdefault("frappe.utils", utils_stub)

from rbp_app.services.notification_triggers import (  # noqa: E402
    assert_valid_trigger_catalog,
    get_trigger,
    list_notification_triggers,
    list_trigger_keys,
)
from rbp_app.services.email_templates import TEMPLATE_TITLES, render_template  # noqa: E402
from rbp_app.services import email_notifications as en  # noqa: E402
from rbp_app.services import notifications as n  # noqa: E402


ROOT = Path(__file__).resolve().parents[3]


def test_trigger_catalog_contains_required_events():
    required = {
        "account.created",
        "membership.payment_succeeded",
        "membership.payment_failed",
        "subscription.status_changed",
        "entitlement.granted",
        "entitlement.suspended",
        "service.request_submitted",
        "docushare.brief_submitted",
        "connectivity.nbn_order_submitted",
        "risk_advisor.assessment_submitted",
        "fixer.request_submitted",
        "marketplace.listing_submitted",
        "marketplace.enquiry_submitted",
        "application.interest_submitted",
        "admin.status_updated",
    }
    assert required.issubset(set(list_trigger_keys()))
    assert_valid_trigger_catalog()
    assert "applications.provisioning_requested" not in set(list_trigger_keys())


def test_unknown_trigger_raises_value_error():
    with pytest.raises(ValueError):
        get_trigger("nope")


def test_template_registry_renders_all_supported_templates():
    context = {
        "customer_name": "QA Tester",
        "business_name": "RBP QA",
        "reference_id": "REF-123",
        "portal_url": "/portal/dashboard",
        "status": "received",
        "amount": "10.00",
        "currency": "AUD",
        "admin_note": "Looks good",
    }
    for template_key in TEMPLATE_TITLES:
        rendered = render_template(template_key, context)
        assert rendered["title"]
        assert "REF-123" in rendered["html"]
        assert "/portal/dashboard" in rendered["text"]
        assert "10.00 AUD" in rendered["text"]


def test_template_registry_escapes_user_controlled_values():
    rendered = render_template(
        "admin_status_updated",
        {
            "customer_name": "<script>bad()</script>",
            "reference_id": "REF-123",
            "portal_url": "/portal/dashboard",
            "admin_note": "<b>unsafe</b>",
        },
    )
    assert "<script>" not in rendered["html"]
    assert "&lt;script&gt;" in rendered["html"]
    assert "&lt;b&gt;unsafe&lt;/b&gt;" in rendered["html"]


def test_unknown_template_key_returns_generic_safe_output():
    rendered = render_template("unknown_key", {"reference_id": "REF-1", "portal_url": "/portal"})
    assert rendered["title"] == "RBP notification"
    assert "REF-1" in rendered["html"]


def test_normalize_recipients_lowercases_and_deduplicates():
    assert en.normalize_recipients([" A@Test.com ", "a@test.com", "", "bad", "b@test.com"]) == [
        "a@test.com",
        "b@test.com",
    ]


def test_sandbox_with_empty_allowlist_blocks_delivery(monkeypatch):
    monkeypatch.setattr(en, "email_notifications_enabled", lambda: True)
    monkeypatch.setattr(en, "email_sandbox_enabled", lambda: True)
    monkeypatch.setattr(en, "qa_recipient_allowlist", lambda: [])
    out = en.send_event_email(event_type="account.created", recipients=["x@test.com"])
    assert out[0].status == "blocked"
    assert out[0].error_message == en.BLOCKED_RECIPIENT_ERROR


def test_sandbox_allowlist_permits_only_allowlisted_case_insensitive(monkeypatch):
    monkeypatch.setattr(en, "email_sandbox_enabled", lambda: True)
    monkeypatch.setattr(en, "qa_recipient_allowlist", lambda: ["qa@test.com"])
    assert en.apply_sandbox_recipient_policy(["QA@Test.com", "user@test.com"]) == ["qa@test.com"]


def test_deprecated_sandbox_recipient_fallback(monkeypatch):
    values = {
        "rbp_qa_email_recipients": "",
        "rbp_email_sandbox_recipient": "Fallback@Test.com",
    }
    monkeypatch.setattr(en, "_conf", lambda key, default=None: values.get(key, default))
    assert en.qa_recipient_allowlist() == ["fallback@test.com"]


def test_sandbox_mode_never_calls_frappe_sendmail(monkeypatch):
    monkeypatch.setattr(en, "email_notifications_enabled", lambda: True)
    monkeypatch.setattr(en, "email_sandbox_enabled", lambda: True)
    monkeypatch.setattr(en, "qa_recipient_allowlist", lambda: ["qa@test.com"])
    monkeypatch.setattr(
        en,
        "frappe",
        SimpleNamespace(sendmail=lambda **k: (_ for _ in ()).throw(RuntimeError("must not send"))),
    )
    out = en.send_event_email(event_type="account.created", recipients=["qa@test.com"])
    assert out[0].status == "sent"
    assert out[0].provider_message_id == "sandbox:account.created:qa@test.com"


def test_real_mode_failure_returns_failed_without_raising(monkeypatch):
    monkeypatch.setattr(en, "email_notifications_enabled", lambda: True)
    monkeypatch.setattr(en, "email_sandbox_enabled", lambda: False)
    monkeypatch.setattr(
        en,
        "frappe",
        SimpleNamespace(sendmail=lambda **k: (_ for _ in ()).throw(RuntimeError("smtp down"))),
    )
    out = en.send_event_email(event_type="account.created", recipients=["qa@test.com"], fake_send=False)
    assert out[0].status == "failed"
    assert "smtp down" in out[0].error_message


def test_delivery_summary_statuses():
    result = lambda status: en.EmailDeliveryResult(status=status, recipient_email="qa@test.com", subject="x")
    assert en.summarize_delivery_results([]) == "skipped"
    assert en.summarize_delivery_results([result("sent")]) == "sent"
    assert en.summarize_delivery_results([result("failed")]) == "failed"
    assert en.summarize_delivery_results([result("blocked")]) == "blocked"
    assert en.summarize_delivery_results([result("disabled")]) == "disabled"
    assert en.summarize_delivery_results([result("sent"), result("blocked")]) == "partial"


def test_admin_recipient_config_is_parsed(monkeypatch):
    monkeypatch.setattr(en, "_conf", lambda key, default=None: " Admin@Test.com,admin@test.com,ops@test.com ")
    assert en.admin_notification_recipients() == ["admin@test.com", "ops@test.com"]


def test_admin_enabled_trigger_sends_to_admin_recipients(monkeypatch):
    captured = {}
    monkeypatch.setattr(n, "create_notification", lambda **kwargs: None)
    monkeypatch.setattr(n, "_record_delivery_logs", lambda **kwargs: None)
    monkeypatch.setattr(n, "admin_notification_recipients", lambda: ["admin@test.com"])

    def fake_send(**kwargs):
        captured["recipients"] = kwargs["recipients"]
        return [
            en.EmailDeliveryResult(status="sent", recipient_email=recipient, subject="x")
            for recipient in kwargs["recipients"]
        ]

    monkeypatch.setattr(n, "send_event_email", fake_send)
    n.emit_event_notification(
        event_type="membership.payment_succeeded",
        user=None,
        customer_email="customer@test.com",
        related_name="PAY-1",
    )
    assert captured["recipients"] == ["customer@test.com", "admin@test.com"]


def test_admin_disabled_trigger_does_not_send_admin_recipients(monkeypatch):
    captured = {}
    monkeypatch.setattr(n, "create_notification", lambda **kwargs: None)
    monkeypatch.setattr(n, "_record_delivery_logs", lambda **kwargs: None)
    monkeypatch.setattr(n, "admin_notification_recipients", lambda: ["admin@test.com"])
    monkeypatch.setattr(
        n,
        "send_event_email",
        lambda **kwargs: captured.setdefault("recipients", kwargs["recipients"]) or [],
    )
    n.emit_event_notification(event_type="account.created", user=None, customer_email="customer@test.com")
    assert captured["recipients"] == ["customer@test.com"]


def test_record_delivery_logs_noops_when_doctype_missing(monkeypatch):
    monkeypatch.setattr(n, "_doctype_exists", lambda doctype: False)
    n._record_delivery_logs(notification_name=None, deliveries=[], event_type="account.created")


def test_record_delivery_logs_noops_when_frappe_unavailable(monkeypatch):
    monkeypatch.setattr(n, "frappe", None)
    n._record_delivery_logs(notification_name=None, deliveries=[{"status": "sent"}], event_type="account.created")


def test_record_delivery_logs_attempts_insert_when_doctype_exists(monkeypatch):
    inserted = []

    class Doc:
        def __init__(self, payload):
            self.payload = payload

        def insert(self, ignore_permissions=False):
            inserted.append((self.payload, ignore_permissions))

    monkeypatch.setattr(n, "_doctype_exists", lambda doctype: True)
    monkeypatch.setattr(n.frappe, "get_doc", lambda payload: Doc(payload))
    n._record_delivery_logs(
        notification_name="NOTIF-1",
        event_type="account.created",
        related_doctype="RBP Account",
        related_name="ACC-1",
        deliveries=[
            {
                "recipient_email": "qa@test.com",
                "status": "sent",
                "provider_message_id": "sandbox:1",
                "sandboxed": True,
            }
        ],
    )
    assert inserted[0][0]["event_type"] == "account.created"
    assert inserted[0][0]["sent_on"] == "2026-05-13 10:00:00"
    assert inserted[0][0]["payload_summary"] == "account.created:sent:Email"
    assert inserted[0][1] is True


def test_record_delivery_logging_failure_does_not_raise(monkeypatch):
    monkeypatch.setattr(n, "_doctype_exists", lambda doctype: True)
    monkeypatch.setattr(n.frappe, "get_doc", lambda payload: (_ for _ in ()).throw(RuntimeError("boom")))
    n._record_delivery_logs(notification_name=None, deliveries=[{"status": "sent"}], event_type="account.created")


def test_admin_apis(monkeypatch):
    from rbp_app.api import notifications as api

    assert api.list_triggers()["triggers"] == list_notification_triggers()

    monkeypatch.setattr(api.frappe, "get_roles", lambda: [])
    with pytest.raises(frappe_stub.PermissionError):
        api.send_test_notification()

    captured = {}
    monkeypatch.setattr(api.frappe, "get_roles", lambda: ["System Manager"])
    monkeypatch.setattr(api, "emit_event_notification", lambda **kwargs: captured.setdefault("kwargs", kwargs))
    api.send_test_notification(recipient_email="qa@test.com")
    assert captured["kwargs"]["context"]["customer_name"] == "QA Tester"
    assert captured["kwargs"]["context"]["status"] == "qa-test"

    monkeypatch.setattr(api, "doctype_exists", lambda doctype: False)
    assert api.admin_list_notification_events()["events"] == []
    assert api.admin_list_notification_deliveries()["deliveries"] == []

    rows = [{"name": "DEL-1", "status": "sent", "sent_on": "2026-05-13 10:00:00"}]
    monkeypatch.setattr(api, "doctype_exists", lambda doctype: True)
    monkeypatch.setattr(api.frappe, "get_all", lambda *args, **kwargs: rows)
    assert api.admin_list_notification_deliveries()["deliveries"] == rows


def test_emit_event_notification_unknown_trigger_is_structured_failure():
    result = n.emit_event_notification(event_type="missing.event")
    assert result["ok"] is False
    assert result["reason"] == "unknown_trigger"


def test_emit_event_notification_respects_email_disabled(monkeypatch):
    trigger = SimpleNamespace(
        event_type="custom.event",
        template_key="account_created",
        default_subject="Subject",
        customer_enabled=True,
        admin_enabled=False,
        portal_enabled=False,
        email_enabled=False,
        default_portal_url="/portal/custom",
    )
    monkeypatch.setattr("rbp_app.services.notification_triggers.get_trigger", lambda event_type: trigger)
    monkeypatch.setattr(n, "send_event_email", lambda **kwargs: (_ for _ in ()).throw(RuntimeError("no email")))
    result = n.emit_event_notification(event_type="custom.event", user="qa@test.com", customer_email="qa@test.com")
    assert result["ok"] is True
    assert result["email"] == "not_requested"
    assert result["deliveries"] == []


def _doctype_json(relative_path):
    with (ROOT / relative_path).open() as handle:
        return json.load(handle)


def test_notification_delivery_doctype_schema():
    schema = _doctype_json("rbp_app/rbp_app/rbp_app/doctype/rbp_notification_delivery/rbp_notification_delivery.json")
    field_map = {field["fieldname"]: field for field in schema["fields"]}
    for fieldname in (
        "notification",
        "event_type",
        "channel",
        "recipient_email",
        "status",
        "provider_message_id",
        "error_message",
        "sandboxed",
        "related_doctype",
        "related_name",
        "sent_on",
        "payload_summary",
    ):
        assert fieldname in field_map
    assert {"sent", "failed", "blocked", "disabled", "skipped"}.issubset(set(field_map["status"]["options"].splitlines()))
    assert field_map["sandboxed"]["fieldtype"] == "Check"
    assert "raw_payload" not in field_map
    assert "provider_payload" not in field_map


def test_application_interest_doctype_schema():
    schema = _doctype_json("rbp_app/rbp_app/rbp_app/doctype/rbp_application_interest/rbp_application_interest.json")
    field_map = {field["fieldname"]: field for field in schema["fields"]}
    assert field_map["user"]["reqd"] == 1
    assert field_map["application_name"]["reqd"] == 1
    assert field_map["status"]["default"] == "Received"
    assert "applications_provisioning" not in json.dumps(schema)


def test_submit_application_interest_creates_record_and_emits(monkeypatch):
    from rbp_app.api import applications as api

    emitted = []

    class Doc:
        name = "RBP-APP-INT-0001"
        creation = "2026-05-13 10:00:00"

        def __init__(self, payload):
            self.__dict__.update(payload)

        def insert(self, ignore_permissions=False):
            self.ignore_permissions = ignore_permissions

    monkeypatch.setattr(api, "require_login", lambda: "member@example.com")
    monkeypatch.setattr(api, "doctype_exists", lambda doctype: True)
    monkeypatch.setattr(api, "get_current_tenant_name", lambda user=None: "TENANT-1")
    monkeypatch.setattr(api.frappe, "get_doc", lambda payload: Doc(payload))
    monkeypatch.setattr(api, "emit_event_notification", lambda **kwargs: emitted.append(kwargs))

    result = api.submit_application_interest("CRM", application_key="crm", business_name="RBP QA", notes="Interested")
    assert result["name"] == "RBP-APP-INT-0001"
    assert result["status"] == "Received"
    assert emitted[0]["event_type"] == "application.interest_submitted"
    assert emitted[0]["context"]["application_name"] == "CRM"


def test_application_interest_notification_failure_is_fail_open(monkeypatch):
    from rbp_app.api import applications as api

    class Doc:
        name = "RBP-APP-INT-0001"
        creation = "2026-05-13 10:00:00"

        def __init__(self, payload):
            self.__dict__.update(payload)

        def insert(self, ignore_permissions=False):
            pass

    monkeypatch.setattr(api, "require_login", lambda: "member@example.com")
    monkeypatch.setattr(api, "doctype_exists", lambda doctype: True)
    monkeypatch.setattr(api, "get_current_tenant_name", lambda user=None: "TENANT-1")
    monkeypatch.setattr(api.frappe, "get_doc", lambda payload: Doc(payload))
    monkeypatch.setattr(api, "emit_event_notification", lambda **kwargs: (_ for _ in ()).throw(RuntimeError("boom")))

    result = api.submit_application_interest("CRM")
    assert result["name"] == "RBP-APP-INT-0001"


def test_service_hook_helpers_emit_expected_events(monkeypatch):
    from rbp_app.services import connectivity, decision_desk, marketplace, risk_advisor, the_fixer

    calls = []
    for module in (connectivity, decision_desk, marketplace, risk_advisor, the_fixer):
        monkeypatch.setattr(module, "emit_event_notification", lambda **kwargs: calls.append(kwargs))

    doc = SimpleNamespace(name="REF-1", tenant="TENANT", owner_user="owner@test.com", status="Submitted", doctype="RBP Test")
    decision_desk._emit_notification_event("service.request_submitted", doc, "received", {"reference_id": doc.name})
    connectivity._emit_notification_event("connectivity.nbn_order_submitted", doc, "received", {"reference_id": doc.name})
    risk_advisor._emit_notification_event("risk_advisor.assessment_submitted", doc, "received", {"reference_id": doc.name})
    the_fixer._emit_notification_event("fixer.request_submitted", doc, "received", {"reference_id": doc.name})
    marketplace._emit_notification_event("marketplace.listing_submitted", doc, "received", {"reference_id": doc.name})

    assert [call["event_type"] for call in calls] == [
        "service.request_submitted",
        "connectivity.nbn_order_submitted",
        "risk_advisor.assessment_submitted",
        "fixer.request_submitted",
        "marketplace.listing_submitted",
    ]
    assert all(call["customer_email"] == "owner@test.com" for call in calls)


def test_service_hook_failures_are_fail_open(monkeypatch):
    from rbp_app.services import connectivity

    monkeypatch.setattr(connectivity, "emit_event_notification", lambda **kwargs: (_ for _ in ()).throw(RuntimeError("boom")))
    doc = SimpleNamespace(name="REF-1", tenant="TENANT", owner_user="owner@test.com", status="Submitted", doctype="RBP Test")
    connectivity._emit_notification_event("connectivity.nbn_order_submitted", doc, "received", {"reference_id": doc.name})


def test_docushare_brief_hook_is_not_falsely_claimed():
    from rbp_app.services import docushare

    assert not hasattr(docushare, "submit_brief")
