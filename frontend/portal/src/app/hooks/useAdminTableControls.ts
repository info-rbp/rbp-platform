import { useMemo, useState } from "react";

export type AdminSortDirection = "asc" | "desc";

export interface AdminSortOption<TRecord> {
  id: string;
  label: string;
  getValue: (record: TRecord) => string | number | boolean | null | undefined;
}

export interface UseAdminTableControlsOptions<TRecord> {
  records: TRecord[];
  getSearchText: (record: TRecord) => string;
  getStatus?: (record: TRecord) => string | null | undefined;
  getCategory?: (record: TRecord) => string | null | undefined;
  sortOptions: AdminSortOption<TRecord>[];
  defaultSortId?: string;
  defaultSortDirection?: AdminSortDirection;
}

export interface AdminTableControlsState<TRecord> {
  rows: TRecord[];
  totalCount: number;
  filteredCount: number;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  sortId: string;
  setSortId: (value: string) => void;
  sortDirection: AdminSortDirection;
  setSortDirection: (value: AdminSortDirection) => void;
  statusOptions: string[];
  categoryOptions: string[];
  sortOptions: AdminSortOption<TRecord>[];
  hasActiveFilters: boolean;
  resetControls: () => void;
}

function normalise(value: unknown) {
  return String(value ?? "").toLowerCase().trim();
}

function uniqueSorted(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
}

function compareValues(a: unknown, b: unknown) {
  const valueA = String(a ?? "").toLowerCase();
  const valueB = String(b ?? "").toLowerCase();

  return valueA.localeCompare(valueB, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function useAdminTableControls<TRecord>({
  records,
  getSearchText,
  getStatus,
  getCategory,
  sortOptions,
  defaultSortId,
  defaultSortDirection = "asc",
}: UseAdminTableControlsOptions<TRecord>): AdminTableControlsState<TRecord> {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortId, setSortId] = useState(defaultSortId ?? sortOptions[0]?.id ?? "");
  const [sortDirection, setSortDirection] = useState<AdminSortDirection>(defaultSortDirection);

  const statusOptions = useMemo(
    () => uniqueSorted(records.map((record) => getStatus?.(record))),
    [records, getStatus]
  );

  const categoryOptions = useMemo(
    () => uniqueSorted(records.map((record) => getCategory?.(record))),
    [records, getCategory]
  );

  const rows = useMemo(() => {
    const query = normalise(searchTerm);
    const activeSort = sortOptions.find((option) => option.id === sortId);

    const filtered = records.filter((record) => {
      const matchesSearch = query
        ? normalise(getSearchText(record)).includes(query)
        : true;

      const matchesStatus =
        statusFilter === "all" ? true : getStatus?.(record) === statusFilter;

      const matchesCategory =
        categoryFilter === "all" ? true : getCategory?.(record) === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    if (!activeSort) {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      const comparison = compareValues(activeSort.getValue(a), activeSort.getValue(b));
      return sortDirection === "asc" ? comparison : comparison * -1;
    });
  }, [
    records,
    searchTerm,
    statusFilter,
    categoryFilter,
    sortId,
    sortDirection,
    sortOptions,
    getSearchText,
    getStatus,
    getCategory,
  ]);

  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    sortId !== (defaultSortId ?? sortOptions[0]?.id ?? "") ||
    sortDirection !== defaultSortDirection;

  function resetControls() {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setSortId(defaultSortId ?? sortOptions[0]?.id ?? "");
    setSortDirection(defaultSortDirection);
  }

  return {
    rows,
    totalCount: records.length,
    filteredCount: rows.length,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    sortId,
    setSortId,
    sortDirection,
    setSortDirection,
    statusOptions,
    categoryOptions,
    sortOptions,
    hasActiveFilters,
    resetControls,
  };
}
