import type { ReactNode } from 'react';

import { InventoryTableRow, type InventoryTableRowData, type InventoryTableRowVariant } from './InventoryTableRow';

export type DataTableVariant = InventoryTableRowVariant;

export interface DataTableProps {
  variant: DataTableVariant;
  rows: InventoryTableRowData[];
  title?: string;
  headerActionText?: string;
  pageText?: string;
  previousLabel?: string;
  nextLabel?: string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

function TableHeaderCell({ children }: { children: ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-normal uppercase tracking-[0.6px] text-[#62748E]">
      {children}
    </th>
  );
}

function TableHeaderCellRight({ children }: { children: ReactNode }) {
  return (
    <th className="px-6 py-3 text-right text-xs font-normal uppercase tracking-[0.6px] text-[#62748E]">
      {children}
    </th>
  );
}

export function DataTable({
  variant,
  rows,
  title = 'Inventario',
  headerActionText = 'Mostrando productos',
  pageText = 'Pagina 1 de 1',
  previousLabel = 'Anterior',
  nextLabel = 'Siguiente',
  onView,
  onEdit,
  onDelete,
  className,
}: DataTableProps) {
  const showImageColumn = variant === 'completa';

  return (
    <section className={cx('overflow-hidden rounded-[14px] border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]', className)} aria-label={title}>
      <div className="border-b border-[#F1F5F9] bg-[#F8FAFC] px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-medium uppercase tracking-[1.2px] text-[#0F172A]">
            {title}
          </h3>
          <p className="text-xs font-medium uppercase tracking-[1.2px] text-[#64748B]">
            {headerActionText}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead className="bg-[#F8FAFC]">
            <tr>
              {showImageColumn ? <TableHeaderCell>Imagen</TableHeaderCell> : null}
              <TableHeaderCell>Producto</TableHeaderCell>
              <TableHeaderCell>Categoría</TableHeaderCell>
              <TableHeaderCell>Precio</TableHeaderCell>
              <TableHeaderCell>Stock</TableHeaderCell>
              <TableHeaderCellRight>Acciones</TableHeaderCellRight>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <InventoryTableRow
                key={row.id}
                row={row}
                variant={variant}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#F1F5F9] px-6 py-6">
        <p className="text-sm leading-5 text-[#64748B]">{pageText}</p>
        <div className="flex gap-2">
          <button type="button" className="h-7.5 rounded border border-[#E2E8F0] px-3 text-sm leading-5 text-[#0F172A] opacity-50">
            {previousLabel}
          </button>
          <button type="button" className="h-7.5 rounded border border-[#E2E8F0] px-3 text-sm leading-5 text-[#0F172A]">
            {nextLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
