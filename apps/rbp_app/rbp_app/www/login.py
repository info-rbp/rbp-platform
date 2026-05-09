import frappe


def get_context(context):
    context.no_cache = 1
    context.title = "Login"
    context.redirect_to = frappe.local.request.args.get("redirect-to") or "/portal/dashboard"
    return context
