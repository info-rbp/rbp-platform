import { ArrowDownAZ, ArrowUpAZ, RotateCcw, Search } from "lucide-react";

import type {
  AdminSortDirection,
  AdminTableControlsState,
} from "../../hooks/useAdminTableControls";

interface AdminTableControlsProps<TRecord> {
  controls: AdminTableControlsState<TRecord>;
  searchPlaceholder?: string;
}

export function AdminTableControls<TRecord>({
  controls,
  searchPlaceholder = "Search records",
}: AdminTableControlsProps<TRecord>) {
  return (
    <div className="px-5 py-4 border-b border-slate-100 bg-white">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">Table Controls</h3>
          <p className="text-xs text-slate-500 mt-1">
            Showing {controls.filteredCount} of {controls.totalCount} records
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[260px_170px_170px_180px_120px_auto] gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={controls.searchTerm}
              onChange={(event) => controls.setSearchTerm(event.target.value)}
              placeholder={searchPlaceholder}
            />
          </div>

          <select
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={controls.statusFilter}
            onChange={(event) => controls.setStatusFilter(event.target.value)}
          >
            <option value="all">All statuses</option>
            {controls.statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={controls.categoryFilter}
            onChange={(event) => controls.setCategoryFilter(event.target.value)}
          >
            <option value="all">All categories</option>
            {controls.categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={controls.sortId}
            onChange={(event) => controls.setSortId(event.target.value)}
          >
            {controls.sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                Sort: {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() =>
              controls.setSortDirection(
                controls.sortDirection === "asc" ? "desc" : "asc"
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
          >
            {controls.sortDirection === "asc" ? (
              <ArrowUpAZ className="w-4 h-4" />
            ) : (
              <ArrowDownAZ className="w-4 h-4" />
            )}
            {controls.sortDirection.toUpperCase() as Uppercase<AdminSortDirection>}
          </button>

          <button
            type="button"
            onClick={controls.resetControls}
            disabled={!controls.hasActiveFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
