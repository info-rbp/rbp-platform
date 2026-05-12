import frappe


def test_membership_plans_are_seeded():
    plans = frappe.get_all(
        "RBP Membership Plan",
        filters={"status": "Active"},
        fields=["plan_code", "plan_name", "stripe_price_id"],
    )

    codes = {plan.plan_code for plan in plans}

    assert "free_account" in codes
    assert "premium_membership" in codes


def test_premium_membership_has_stripe_price_mapping():
    plan = frappe.get_doc("RBP Membership Plan", "premium_membership")

    assert plan.stripe_price_id
    assert plan.stripe_price_id.startswith("price_")
    assert "REPLACE" not in plan.stripe_price_id.upper()


def test_checkout_validation_rejects_free_plan_without_stripe_price():
    from rbp_app.services.membership import validate_membership_plan_for_checkout

    try:
        validate_membership_plan_for_checkout(plan_code="free_account")
    except frappe.ValidationError:
        return

    raise AssertionError("Free Account should not be checkout-ready because it has no Stripe price ID.")


def test_checkout_validation_accepts_premium_plan():
    from rbp_app.services.membership import validate_membership_plan_for_checkout

    plan = validate_membership_plan_for_checkout(plan_code="premium_membership")

    assert plan.plan_code == "premium_membership"
    assert plan.stripe_price_id.startswith("price_")
