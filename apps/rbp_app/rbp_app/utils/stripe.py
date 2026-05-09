# Copyright (c) 2026, Remote Business Partner
# For license information, please see license.txt

import frappe
from datetime import datetime
from frappe.utils.data import getdate


def _rbp_account_installed():
    return frappe.db.exists("DocType", "RBP Account")


def get_rbp_account_by_email(email: str):
    if not email or not _rbp_account_installed():
        return None

    email = email.strip().lower()
    account_name = frappe.db.get_value("RBP Account", {"payer_email": email}, "name")
    if account_name:
        return frappe.get_doc("RBP Account", account_name)

    if frappe.db.exists("User", email):
        account_name = frappe.db.get_value("RBP Account", {"website_user": email}, "name")
        if account_name:
            return frappe.get_doc("RBP Account", account_name)

    return None


def get_rbp_account_by_user(user: str):
    if not user or not _rbp_account_installed():
        return None

    account_name = frappe.db.get_value("RBP Account", {"website_user": user}, "name")
    if account_name:
        return frappe.get_doc("RBP Account", account_name)

    if frappe.db.exists("User", user):
        user_email = frappe.db.get_value("User", user, "email") or user
        return get_rbp_account_by_email(user_email)

    return None


def create_rbp_account_for_user(user: str, email: str, first_name: str = None, last_name: str = None, tenant=None):
    if not user or not email or not _rbp_account_installed():
        return None

    if not tenant:
        return None

    existing_account = get_rbp_account_by_user(user)
    if existing_account:
        return existing_account

    account_data = {
        "doctype": "RBP Account",
        "account_name": user,
        "website_user": user,
        "payer_email": email.strip().lower(),
        "subscription_status": "No Subscription",
    }

    account_data["tenant"] = tenant.name

    account = frappe.get_doc(account_data)
    account.flags.ignore_permissions = True
    account.insert(ignore_permissions=True)
    return account


def get_rbp_account_by_stripe_customer_id(customer_id: str):
    if not customer_id or not _rbp_account_installed():
        return None

    account_name = frappe.db.get_value("RBP Account", {"stripe_customer_id": customer_id}, "name")
    if account_name:
        return frappe.get_doc("RBP Account", account_name)

    return None


def get_rbp_account_by_stripe_subscription_id(subscription_id: str):
    if not subscription_id or not _rbp_account_installed():
        return None

    account_name = frappe.db.get_value("RBP Account", {"stripe_subscription_id": subscription_id}, "name")
    if account_name:
        return frappe.get_doc("RBP Account", account_name)

    return None


def update_rbp_account(account, **kwargs):
    if not account:
        return

    updates = {}
    if kwargs.get("stripe_customer_id"):
        updates["stripe_customer_id"] = kwargs["stripe_customer_id"]
    if kwargs.get("stripe_subscription_id"):
        updates["stripe_subscription_id"] = kwargs["stripe_subscription_id"]
    if kwargs.get("subscription_status") is not None:
        updates["subscription_status"] = kwargs["subscription_status"]
    if kwargs.get("current_period_end") is not None:
        updates["current_period_end"] = kwargs["current_period_end"]
    if kwargs.get("next_payment_due") is not None:
        updates["next_payment_due"] = kwargs["next_payment_due"]
    if kwargs.get("notes") is not None:
        updates["notes"] = kwargs["notes"]

    if updates:
        for field, value in updates.items():
            frappe.db.set_value("RBP Account", account.name, field, value, update_modified=False)


def normalize_stripe_timestamp(timestamp):
    if not timestamp:
        return None

    try:
        if isinstance(timestamp, (int, float)) or (isinstance(timestamp, str) and timestamp.isdigit()):
            return getdate(datetime.utcfromtimestamp(int(timestamp)))

        return getdate(timestamp)
    except Exception:
        return None
