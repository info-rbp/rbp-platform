import frappe


def set_rbp_home_page() -> None:
    """Make the RBP public shell the site homepage.

    Keep this conservative: only replace blank, mail, or /mail homepage values.
    Do not overwrite an explicit custom homepage.
    """

    current_home_page = frappe.db.get_single_value("Website Settings", "home_page")

    if current_home_page and current_home_page not in {"mail", "/mail"}:
        return

    frappe.db.set_single_value("Website Settings", "home_page", "index")
    frappe.clear_cache()


def after_install() -> None:
    set_rbp_home_page()