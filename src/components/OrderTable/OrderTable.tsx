import type { ReactNode } from 'react';

import { OrderTableRow, type OrderTableRowData } from './OrderTableRow';

export interface OrderTableProps {
  rows: OrderTableRowData[];
  title?: string;
  headerActionText?: string;
  pageText?: string;
  previousLabel?: string;
  nextLabel?: string;
  onView?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

function TableHeaderCell({ children }: { children: ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.6px] text-[#64748B]">
      {children}
    </th>
  );
}

function TableHeaderCellRight({ children }: { children: ReactNode }) {
  return (
    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-[0.6px] text-[#64748B]">
      {children}
    </th>
  );
}

export function OrderTable({
  rows,
  title = 'Pedidos Recientes',
  headerActionText = 'Mostrando pedidos',
  pageText = 'Pagina 1 de 1',
  previousLabel = 'Anterior',
  nextLabel = 'Siguiente',
  onView,
  onApprove,
  onReject,
  className,
}: OrderTableProps) {
  return (
    <section className={cx('overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]', className)} aria-label={title}>
      <div className="flex items-center justify-between border-b border-[#F1F5F9] px-6 py-6">
        <h3 className="text-xl font-bold leading-6 text-[#0F172A]">{title}</h3>
        <p className="text-xs font-medium uppercase tracking-[1.2px] text-[#64748B]">{headerActionText}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead className="bg-[#F8FAFC]">
            <tr>
              <TableHeaderCell>ID de pedido</TableHeaderCell>
              <TableHeaderCell>Cliente</TableHeaderCell>
              <TableHeaderCell>Fecha</TableHeaderCell>
              <TableHeaderCell>Total</TableHeaderCell>
              <TableHeaderCell>Estado</TableHeaderCell>
              <TableHeaderCellRight>Acciones</TableHeaderCellRight>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <OrderTableRow
                key={row.id}
                row={row}
                onView={onView}
                onApprove={onApprove}
                onReject={onReject}
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