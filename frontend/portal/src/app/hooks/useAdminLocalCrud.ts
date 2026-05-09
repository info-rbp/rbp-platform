import { useMemo, useState } from "react";

interface UseAdminLocalCrudOptions<TRecord extends { id: string }, TDraft> {
  initialRecords: TRecord[];
  createDraft: () => TDraft;
  toDraft: (record: TRecord) => TDraft;
  fromDraft: (draft: TDraft, existingRecord?: TRecord | null) => TRecord;
  validateDraft: (draft: TDraft) => boolean;
}

export function useAdminLocalCrud<TRecord extends { id: string }, TDraft>({
  initialRecords,
  createDraft,
  toDraft,
  fromDraft,
  validateDraft,
}: UseAdminLocalCrudOptions<TRecord, TDraft>) {
  const [records, setRecords] = useState<TRecord[]>(initialRecords);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TDraft>(createDraft());

  const editingRecord = useMemo(
    () => records.find((record) => record.id === editingId) ?? null,
    [records, editingId]
  );

  const canSave = validateDraft(draft);

  function updateDraft(patch: Partial<TDraft>) {
    setDraft((current) => ({
      ...current,
      ...patch,
    }));
  }

  function resetForm() {
    setEditingId(null);
    setDraft(createDraft());
  }

  function startEdit(record: TRecord) {
    setEditingId(record.id);
    setDraft(toDraft(record));
  }

  function saveRecord() {
    if (!validateDraft(draft)) return false;

    if (editingRecord) {
      setRecords((current) =>
        current.map((record) =>
          record.id === editingRecord.id ? fromDraft(draft, record) : record
        )
      );
    } else {
      setRecords((current) => [...current, fromDraft(draft, null)]);
    }

    resetForm();
    return true;
  }

  function deleteRecord(id: string) {
    setRecords((current) => current.filter((record) => record.id !== id));

    if (editingId === id) {
      resetForm();
    }
  }

  return {
    records,
    draft,
    editingId,
    editingRecord,
    canSave,
    updateDraft,
    resetForm,
    startEdit,
    saveRecord,
    deleteRecord,
  };
}
