import { postFrappeMethod } from "./client";

export interface PortalDocument {
  name: string;
  title: string;
  file_name?: string;
  file_type?: string;
  related_doctype?: string;
  related_name?: string;
  related_label?: string;
  visibility?: string;
  status?: string;
  uploaded_by?: string;
  uploaded_on?: string;
  modified?: string;
  download_allowed: boolean;
  preview_allowed: boolean;
  file_size?: number;
  extension?: string;
  mime?: string;
}

export interface PortalDocumentFilters {
  file_type?: string;
  related_doctype?: string;
  status?: string;
  search?: string;
}

export interface PortalDocumentListResponse {
  documents: PortalDocument[];
  count: number;
  module_enabled: boolean;
}

export interface PortalDocumentDownload {
  name: string;
  download_url?: string;
  private: boolean;
}

export function listMyDocuments(filters: PortalDocumentFilters = {}) {
  return postFrappeMethod<PortalDocumentListResponse>("rbp_app.api.documents.list_my_documents", { filters });
}

export function getDocumentReference(name: string) {
  return postFrappeMethod<PortalDocument>("rbp_app.api.documents.get_document_reference", { name });
}

export function getDocumentDownloadUrl(name: string) {
  return postFrappeMethod<PortalDocumentDownload>("rbp_app.api.documents.get_document_download_url", { name });
}
