import type { ReactNode } from 'react';

import { InventoryTableRow, type InventoryTableRowData } from './InventoryTableRow';

export interface DataTableProps {
  rows: InventoryTableRowData[];
  title?: string;
  headerActionText?: string;
  pageText?: string;
  previousLabel?: string;
  nextLabel?: string;
  emptyText?: string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

function Th({ children, align = 'left' }: { children: ReactNode; align?: 'left' | 'right' }) {
  return (
    <th
      className={`px-6 py-3 text-xs font-normal uppercase tracking-wider text-[#62748E] ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      {children}
    </th>
  );
}

export function DataTable({
  rows,
  title = 'Inventario',
  headerActionText,
  pageText,
  previousLabel = 'Anterior',
  nextLabel = 'Siguiente',
  emptyText = 'No hay productos para mostrar.',
  onView,
  onEdit,
  onDelete,
  className = '',
}: DataTableProps) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${className}`}
      aria-label={title}
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#F1F5F9] bg-[#F8FAFC] px-6 py-3">
        <h3 className="text-sm font-medium uppercase tracking-widest text-[#0F172A]">{title}</h3>
        {headerActionText && (
          <p className="text-xs font-medium uppercase tracking-widest text-[#64748B]">
            {headerActionText}
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-separate border-spacing-0">
          <colgroup>
            <col className="w-1/12" />
            <col className="w-3/12" />
            <col className="w-2/12" />
            <col className="w-2/12" />
            <col className="w-2/12" />
            <col className="w-2/12" />
          </colgroup>
          <thead className="bg-[#F8FAFC]">
            <tr>
              <Th>Imagen</Th>
              <Th>Producto</Th>
              <Th>Categoría</Th>
              <Th>Precio</Th>
              <Th>Stock</Th>
              <Th align="right">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#64748B]">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <InventoryTableRow
                  key={row.id}
                  row={row}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {(pageText || previousLabel || nextLabel) && (
        <div className="flex items-center justify-between border-t border-[#F1F5F9] px-6 py-6">
          <p className="text-sm leading-5 text-[#64748B]">{pageText}</p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded border border-[#E2E8F0] px-3 py-1.5 text-sm leading-5 text-[#0F172A] opacity-50"
            >
              {previousLabel}
            </button>
            <button
              type="button"
              className="rounded border border-[#E2E8F0] px-3 py-1.5 text-sm leading-5 text-[#0F172A]"
            >
              {nextLabel}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
