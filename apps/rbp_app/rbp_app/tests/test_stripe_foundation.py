from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import MagicMock, patch

import frappe

from rbp_app.services import entitlements, payment_events, stripe_gateway


def _raise_frappe_exception(message=None, exc=Exception, *args, **kwargs):
	raise exc(message)


class FakeDoc(SimpleNamespace):
	def insert(self, ignore_permissions=False):
		self.inserted = True
		if not getattr(self, "name", None):
			self.name = "FAKE-DOC"
		return self

	def save(self, ignore_permissions=False):
		self.saved = True
		return self


class StripeFoundationTestCase(TestCase):
	def setUp(self):
		super().setUp()
		throw_patcher = patch.object(stripe_gateway.frappe, "throw", side_effect=_raise_frappe_exception)
		throw_patcher.start()
		self.addCleanup(throw_patcher.stop)


class TestStripeCheckoutFoundation(StripeFoundationTestCase):
	def test_checkout_session_uses_server_side_membership_plan_price(self):
		plan = FakeDoc(
			doctype="RBP Membership Plan",
			name="pro",
			plan_code="pro",
			status="Active",
			billing_cycle="Monthly",
			amount=49,
			currency="AUD",
			stripe_product_id="prod_test",
			stripe_price_id="price_test",
		)
		subscription = FakeDoc(name="RBP-SUB-0001")
		session = {"id": "cs_test_123", "url": "https://checkout.stripe.test/session"}
		stripe = SimpleNamespace(checkout=SimpleNamespace(Session=SimpleNamespace(create=MagicMock(return_value=session))))

		def get_doc(arg, name=None):
			if arg == "RBP Membership Plan":
				return plan
			if isinstance(arg, dict):
				subscription.__dict__.update(arg)
				subscription.name = "RBP-SUB-0001"
				return subscription
			return subscription

		with (
			patch.object(stripe_gateway, "is_stripe_enabled", return_value=True),
			patch.object(stripe_gateway, "get_stripe_module", return_value=stripe),
			patch.object(stripe_gateway, "get_current_tenant_name", return_value="TENANT-1"),
			patch.object(stripe_gateway, "record_audit_event"),
			patch.object(stripe_gateway.frappe, "get_doc", side_effect=get_doc),
			patch.object(
				stripe_gateway.frappe,
				"db",
				SimpleNamespace(
					exists=MagicMock(return_value=True),
					get_value=MagicMock(return_value="member@example.com"),
				),
				create=True,
			),
			patch.object(stripe_gateway.frappe, "get_all", return_value=[]),
		):
			result = stripe_gateway.create_membership_checkout_session(
				"pro",
				user="member@example.com",
				success_url="https://qa.example.test/billing/success",
				cancel_url="https://qa.example.test/billing/cancel",
			)

		self.assertEqual(result["checkout_session_id"], "cs_test_123")
		self.assertEqual(result["checkout_url"], "https://checkout.stripe.test/session")
		call_kwargs = stripe.checkout.Session.create.call_args.kwargs
		self.assertEqual(call_kwargs["mode"], "subscription")
		self.assertEqual(call_kwargs["line_items"], [{"price": "price_test", "quantity": 1}])
		self.assertEqual(call_kwargs["metadata"]["rbp_subscription"], "RBP-SUB-0001")
		self.assertNotIn("secret", result)

	def test_verify_webhook_requires_signature_and_uses_webhook_secret(self):
		construct_event = MagicMock(return_value={"id": "evt_123", "type": "checkout.session.completed"})
		stripe = SimpleNamespace(Webhook=SimpleNamespace(construct_event=construct_event))

		with patch.object(stripe_gateway, "get_stripe_module", return_value=stripe):
			with patch.object(stripe_gateway, "get_stripe_webhook_secret", return_value="whsec_test"):
				event = stripe_gateway.verify_webhook_event(b"{}", "t=1,v1=sig")

		self.assertEqual(event["id"], "evt_123")
		construct_event.assert_called_once_with(b"{}", "t=1,v1=sig", "whsec_test")

		with self.assertRaises(frappe.PermissionError):
			stripe_gateway.verify_webhook_event(b"{}", None)


class TestStripeWebhookProcessing(StripeFoundationTestCase):
	def test_webhook_replay_returns_existing_payment_event_without_processing_again(self):
		existing_event = FakeDoc(name="RBP-PAY-0001")
		with (
			patch.object(
				payment_events.frappe,
				"db",
				SimpleNamespace(
					exists=MagicMock(return_value=True),
					get_value=MagicMock(return_value="RBP-PAY-0001"),
				),
				create=True,
			),
			patch.object(payment_events.frappe, "get_doc", return_value=existing_event),
		):
			result = payment_events.process_stripe_webhook_event({"id": "evt_1", "type": "invoice.paid", "data": {"object": {}}})

		self.assertEqual(result, {"status": "duplicate", "payment_event": "RBP-PAY-0001"})

	def test_checkout_completed_activates_subscription_and_syncs_entitlements(self):
		subscription = FakeDoc(
			name="RBP-SUB-0001",
			tenant="TENANT-1",
			member="member@example.com",
			status="Draft",
			payment_status="Pending",
			provider_customer_id=None,
			provider_subscription_id=None,
			provider_payment_id=None,
			provider_product_id=None,
			provider_price_id=None,
		)
		payment_event = FakeDoc(
			name="RBP-PAY-0001",
			related_doctype=None,
			related_name=None,
			tenant=None,
			user=None,
		)
		event = {
			"id": "evt_checkout",
			"type": "checkout.session.completed",
			"data": {
				"object": {
					"id": "cs_test",
					"customer": "cus_test",
					"subscription": "sub_test",
					"payment_intent": "pi_test",
					"payment_status": "paid",
					"amount_total": 4900,
					"currency": "aud",
					"metadata": {
						"rbp_subscription": "RBP-SUB-0001",
						"rbp_plan_code": "pro",
						"rbp_tenant": "TENANT-1",
						"rbp_user": "member@example.com",
					},
				}
			},
		}

		def exists(doctype, filters=None):
			if doctype == "RBP Payment Event":
				return None
			if doctype == "RBP Subscription" and filters == "RBP-SUB-0001":
				return True
			return True

		with (
			patch.object(payment_events, "doctype_exists", return_value=True),
			patch.object(payment_events, "record_payment_event", return_value=payment_event) as record_event,
			patch.object(payment_events, "sync_entitlements_for_subscription") as sync_entitlements,
			patch.object(payment_events, "create_notification"),
			patch.object(payment_events, "record_audit_event"),
			patch.object(
				payment_events.frappe,
				"db",
				SimpleNamespace(exists=MagicMock(side_effect=exists), get_value=MagicMock(return_value=None)),
				create=True,
			),
			patch.object(payment_events.frappe, "get_doc", return_value=subscription),
		):
			result = payment_events.process_stripe_webhook_event(event)

		self.assertEqual(result["status"], "processed")
		self.assertEqual(subscription.status, "Active")
		self.assertEqual(subscription.payment_status, "Paid")
		self.assertEqual(subscription.provider_customer_id, "cus_test")
		self.assertEqual(subscription.provider_subscription_id, "sub_test")
		self.assertEqual(subscription.provider_payment_id, "pi_test")
		self.assertEqual(payment_event.related_name, "RBP-SUB-0001")
		record_event.assert_called_once()
		sync_entitlements.assert_called_once_with(subscription, active=True)


class TestSubscriptionEntitlementSync(StripeFoundationTestCase):
	def test_subscription_entitlements_are_created_and_revoked_from_plan_apps(self):
		plan = FakeDoc(name="pro", plan_code="pro", included_apps="documents\nanalytics")
		subscription = FakeDoc(
			name="RBP-SUB-0001",
			tenant="TENANT-1",
			member="member@example.com",
			plan="pro",
			current_period_start=None,
			current_period_end=None,
		)
		created = []

		def get_doc(arg, name=None):
			if arg == "RBP Membership Plan":
				return plan
			if isinstance(arg, dict):
				doc = FakeDoc(**arg)
				doc.name = f"ENT-{len(created) + 1}"
				created.append(doc)
				return doc
			return created[0]

		with (
			patch.object(entitlements, "doctype_exists", return_value=True),
			patch.object(entitlements, "record_audit_event"),
			patch.object(
				entitlements.frappe,
				"db",
				SimpleNamespace(
					exists=MagicMock(return_value=True),
					get_value=MagicMock(return_value=None),
				),
				create=True,
			),
			patch.object(entitlements.frappe, "get_doc", side_effect=get_doc),
		):
			result = entitlements.sync_entitlements_for_subscription(subscription, active=True)

		self.assertEqual(result, ["ENT-1", "ENT-2"])
		self.assertEqual({doc.app_key for doc in created}, {"documents", "analytics"})
		self.assertTrue(all(doc.enabled == 1 for doc in created))
		self.assertTrue(all(doc.status == "Active" for doc in created))
