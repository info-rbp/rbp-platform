import type { ReactNode } from "react";
import { AdminEmptyState } from "./AdminEmptyState";

export interface AdminTableColumn<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
}

interface AdminTableProps<T extends { id: string }> {
  rows: T[];
  columns: AdminTableColumn<T>[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function AdminTable<T extends { id: string }>({
  rows,
  columns,
  emptyTitle = "No records found",
  emptyDescription = "Records will appear here once this admin area is connected to data.",
}: AdminTableProps<T>) {
  if (rows.length === 0) {
    return <AdminEmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-left text-xs uppercase tracking-widest text-slate-400">
            {columns.map((column) => (
              <th key={column.key} className={`px-5 py-3 font-bold ${column.className ?? ""}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50/70">
              {columns.map((column) => (
                <td key={column.key} className={`px-5 py-4 ${column.className ?? ""}`}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
