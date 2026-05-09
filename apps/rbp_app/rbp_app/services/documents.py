"""Document services for the RBP platform layer."""

from rbp_app.services.files import create_file_reference, list_file_references


def get_documents(user=None):
    """Return tenant-aware file references for the portal."""

    documents = list_file_references(user=user)
    return {
        "documents": documents,
        "count": len(documents),
        "module_enabled": True,
    }


def attach_document_reference(user=None, **payload):
    """Attach an existing Frappe File to an RBP record."""

    doc = create_file_reference(user=user, **payload)
    return {
        "name": doc.name,
        "file": doc.file,
        "related_doctype": doc.related_doctype,
        "related_name": doc.related_name,
        "visibility": doc.visibility,
        "status": doc.status,
    }


def get_documents_payload():
    """Backward-compatible alias for documents payload."""

    return get_documents()
