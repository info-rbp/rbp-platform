"""Reference ID generation helpers for service request records."""

import frappe
from frappe.model.naming import make_autoname


def generate_reference_id(prefix: str) -> str:
    """Generate human-readable reference IDs like RBP-DD-2026-0001."""

    clean_prefix = (prefix or "RBP").strip("-")
    return make_autoname(f"{clean_prefix}-.YYYY.-.####")


def ensure_reference_id(doc, doctype: str, prefix: str, generator=None) -> None:
    """Populate a document reference ID when the DocType supports it."""

    if getattr(doc, "reference_id", None):
        return

    try:
        has_reference_id = frappe.get_meta(doctype).has_field("reference_id")
    except Exception:
        has_reference_id = True

    if has_reference_id:
        doc.reference_id = (generator or generate_reference_id)(prefix)
