/**
 * Phase 1 backend boundary placeholder.
 *
 * Phase 1 is frontend-only and must not initialise Firebase, Firestore,
 * Storage, Auth, Frappe, payment providers, uploads, or real backend services.
 *
 * This module intentionally preserves the previous helper names so any legacy
 * callers continue to receive safe null/false responses until Phase 2 backend
 * contracts are approved.
 */

export const isFirebaseConfigured = false;

export function getFirebaseApp() {
  return null;
}

export function getFirestoreDb() {
  return null;
}
