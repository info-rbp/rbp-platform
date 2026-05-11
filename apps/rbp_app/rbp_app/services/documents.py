"""Document services for the RBP platform layer."""

from rbp_app.services.files import (
    create_file_reference,
    get_file_reference,
    get_file_reference_download_url,
    list_file_references,
)


def get_documents(user=None, filters=None):
    """Return tenant-aware file references for the portal."""

    documents = list_file_references(user=user)
    filters = filters or {}
    search = (filters.get("search") or "").strip().lower()
    if filters.get("file_type"):
        documents = [doc for doc in documents if doc.get("file_type") == filters["file_type"]]
    if filters.get("related_doctype"):
        documents = [doc for doc in documents if doc.get("related_doctype") == filters["related_doctype"]]
    if filters.get("status"):
        documents = [doc for doc in documents if doc.get("status") == filters["status"]]
    if search:
        documents = [
            doc
            for doc in documents
            if search in " ".join(str(doc.get(key) or "") for key in ("title", "file_name", "related_doctype", "related_name")).lower()
        ]
    return {
        "documents": documents,
        "count": len(documents),
        "module_enabled": True,
    }


def get_document(user=None, name=None):
    """Return one visible file reference."""

    return get_file_reference(name, user=user)


def get_document_download(user=None, name=None):
    """Return a permission-checked download URL for a file reference."""

    return get_file_reference_download_url(name, user=user)


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
