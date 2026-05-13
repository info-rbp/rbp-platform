"""Reference ID generation helpers for service request records."""

from frappe.model.naming import make_autoname


def generate_reference_id(prefix: str) -> str:
    """Generate human-readable reference IDs like RBP-DD-2026-0001."""

    clean_prefix = (prefix or "RBP").strip("-")
    return make_autoname(f"{clean_prefix}-.YYYY.-.####")
