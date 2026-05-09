import frappe
from frappe import _
from frappe.utils import flt, nowdate

from rbp_app.rbp_app.doctype.tenant.tenant import get_tenant_for_user
from rbp_app.utils.portal import redirect_to_login
from rbp_app.utils.stripe import create_rbp_account_for_user, get_rbp_account_by_user


def _get_or_create_account(user, tenant):
    account = get_rbp_account_by_user(user)
    if account:
        return account

    email = frappe.db.get_value("User", user, "email") or user
    first_name, last_name = frappe.db.get_value("User", user, ["first_name", "last_name"]) or (None, None)
    return create_rbp_account_for_user(user, email, first_name, last_name, tenant=tenant)


def _get_available_plans():
    if not frappe.db.exists("DocType", "Subscription Plan"):
        return []

    return frappe.get_all(
        "Subscription Plan",
        fields=[
            "name",
            "plan_name",
            "currency",
            "cost",
            "billing_interval",
            "billing_interval_count",
            "payment_gateway",
            "product_price_id",
        ],
        filters={
            "payment_gateway": ["!=", ""],
            "product_price_id": ["!=", ""],
        },
        order_by="cost asc, plan_name asc",
    )


def _get_plan_amount(plan):
    try:
        from erpnext.accounts.doctype.subscription_plan.subscription_plan import get_plan_rate

        return flt(get_plan_rate(plan.name, quantity=1))
    except Exception:
        return flt(plan.cost)


def get_context(context):
    context.no_cache = 1
    context.title = "Billing"
    context.portal_title = "Billing"

    if frappe.session.user == "Guest":
        redirect_to_login("portal/billing")

    tenant = get_tenant_for_user(frappe.session.user)
    if not tenant:
        raise frappe.PermissionError

    context.tenant = tenant
    context.account = _get_or_create_account(frappe.session.user, tenant)
    context.available_plans = _get_available_plans()
    return context


@frappe.whitelist(methods=["POST"])
def start_subscription_checkout(plan: str):
    if frappe.session.user == "Guest":
        raise frappe.PermissionError

    tenant = get_tenant_for_user(frappe.session.user)
    if not tenant:
        raise frappe.PermissionError

    account = _get_or_create_account(frappe.session.user, tenant)
    if not account:
        frappe.throw(_("Unable to find a billing account for this user."))

    if not plan or not frappe.db.exists("Subscription Plan", plan):
        frappe.throw(_("Please choose a valid subscription plan."))

    plan_doc = frappe.get_doc("Subscription Plan", plan)
    if not plan_doc.payment_gateway:
        frappe.throw(_("The selected plan is not linked to a payment gateway account."))

    if not plan_doc.product_price_id:
        frappe.throw(_("The selected plan is missing a Stripe Product Price ID."))

    gateway_account = frappe.get_doc("Payment Gateway Account", plan_doc.payment_gateway)
    payment_gateway = gateway_account.payment_gateway
    gateway = frappe.get_doc("Payment Gateway", payment_gateway)
    if gateway.gateway_settings != "Stripe Settings":
        frappe.throw(_("The selected plan must use a Stripe payment gateway."))

    amount = _get_plan_amount(plan_doc)
    if amount <= 0:
        frappe.throw(_("The selected plan has no billable amount."))

    currency = plan_doc.currency or gateway_account.currency
    subject = _("Subscription checkout for {0}").format(plan_doc.plan_name or plan_doc.name)

    payment_request = frappe.get_doc(
        {
            "doctype": "Payment Request",
            "payment_request_type": "Inward",
            "transaction_date": nowdate(),
            "naming_series": "ACC-PRQ-.YYYY.-",
            "reference_doctype": "RBP Account",
            "reference_name": account.name,
            "company": gateway_account.company,
            "payment_gateway_account": gateway_account.name,
            "payment_gateway": payment_gateway,
            "payment_account": gateway_account.payment_account,
            "payment_channel": gateway_account.payment_channel,
            "currency": currency,
            "party_account_currency": currency,
            "grand_total": amount,
            "outstanding_amount": amount,
            "is_a_subscription": 1,
            "status": "Draft",
            "email_to": account.payer_email or frappe.session.user,
            "subject": subject,
            "message": gateway_account.message,
            "subscription_plans": [{"plan": plan_doc.name, "qty": 1}],
            "payment_reference": [{"description": subject, "amount": amount}],
        }
    )
    payment_request.flags.ignore_permissions = True
    payment_request.insert(ignore_permissions=True)

    stripe_settings = frappe.get_doc("Stripe Settings", gateway.gateway_controller)
    checkout_url = stripe_settings.get_payment_url(
        amount=amount,
        title=gateway_account.company,
        description=subject,
        reference_doctype="Payment Request",
        reference_docname=payment_request.name,
        payer_email=account.payer_email or frappe.session.user,
        payer_name=account.account_name,
        order_id=payment_request.name,
        currency=currency,
        payment_gateway=payment_gateway,
        redirect_to="/portal/billing",
    )

    frappe.db.set_value("Payment Request", payment_request.name, "payment_url", checkout_url, update_modified=False)
    frappe.db.set_value(
        "RBP Account",
        account.name,
        "subscription_status",
        "Checkout Initiated",
        update_modified=False,
    )
    frappe.db.commit()

    return {"redirect_to": checkout_url, "payment_request": payment_request.name}
