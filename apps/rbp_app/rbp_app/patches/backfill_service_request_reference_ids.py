"""Backfill service request reference IDs for Milestone 10 records."""

import frappe

from rbp_app.services.reference_ids import generate_reference_id
from rbp_app.services.tenancy import doctype_exists


SERVICE_REFERENCE_CONFIG = (
    ("RBP Decision Desk Request", "RBP-DD"),
    ("RBP DocuShare Document", "RBP-DOC"),
    ("RBP Connectivity Request", "RBP-NBN"),
    ("RBP Risk Advisor Assessment", "RBP-RISK"),
    ("RBP Fixer Case", "RBP-FIX"),
    ("RBP Marketplace Listing", "RBP-MKT"),
    ("RBP Marketplace Order", "RBP-MKT-ENQ"),
)


def _has_reference_id_field(doctype):
    try:
        return frappe.get_meta(doctype).has_field("reference_id")
    except Exception:
        return False


def backfill_doctype_reference_ids(doctype, prefix):
    if not doctype_exists(doctype) or not _has_reference_id_field(doctype):
        return 0

    rows = frappe.get_all(
        doctype,
        fields=["name", "reference_id"],
    )
    names = [row.get("name") for row in rows if not row.get("reference_id")]
    for name in names:
        frappe.db.set_value(
            doctype,
            name,
            "reference_id",
            generate_reference_id(prefix),
            update_modified=False,
        )
    return len(names)


def execute():
    for doctype, prefix in SERVICE_REFERENCE_CONFIG:
        backfill_doctype_reference_ids(doctype, prefix)
