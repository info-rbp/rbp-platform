import frappe
from frappe import _
from frappe.auth import LoginManager
from frappe.utils import validate_email_address

from rbp_app.rbp_app.doctype.tenant.tenant import create_tenant_for_user
from rbp_app.utils.stripe import create_rbp_account_for_user


@frappe.whitelist(allow_guest=True, methods=["POST"])
def signup(email: str, password: str, first_name: str = None, last_name: str = None, redirect_to: str = "/portal/dashboard"):
    """Create a website user and log them in immediately."""
    email = (email or "").strip().lower()
    password = (password or "").strip()
    first_name = (first_name or "").strip()
    last_name = (last_name or "").strip()

    if not email or not password:
        frappe.throw(_("Email and password are required."), frappe.ValidationError)

    try:
        email = validate_email_address(email, throw=True)
    except Exception:
        frappe.throw(_("Please enter a valid email address."), frappe.ValidationError)

    if frappe.db.exists("User", email):
        frappe.throw(_("A user with this email already exists."), frappe.DuplicateEntryError)

    if not first_name:
        first_name = email.split("@", 1)[0]

    try:
        user = frappe.get_doc(
            {
                "doctype": "User",
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
                "enabled": 1,
                "user_type": "Website User",
                "new_password": password,
                "send_welcome_email": 0,
            }
        )
        user.flags.ignore_permissions = True
        user.insert(ignore_permissions=True)

        tenant = create_tenant_for_user(user.name, email, first_name, last_name)
        account = create_rbp_account_for_user(user.name, email, first_name, last_name, tenant=tenant)

        if not tenant or not account:
            frappe.throw(_("Unable to create the tenant billing profile."), frappe.ValidationError)

        frappe.db.commit()
    except Exception:
        frappe.db.rollback()
        raise

    # Log the new user in only after all onboarding records are durable.
    frappe.local.form_dict.usr = email
    frappe.local.form_dict.pwd = password
    frappe.local.login_manager = LoginManager()
    frappe.local.login_manager.login()

    return {"message": _("Signup successful."), "redirect_to": redirect_to}
