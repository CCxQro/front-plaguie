import { useEffect } from 'react';
import type { EnrichedClient } from '../../services/clients/clientsAggregator';

export interface ClientDetailDrawerProps {
  client: EnrichedClient | null;
  onClose: () => void;
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  });
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function statusColor(status: string): { bg: string; text: string } {
  const normalized = status.toLowerCase();
  if (normalized.includes('entreg')) return { bg: '#DCFCE7', text: '#15803D' };
  if (normalized.includes('cancel')) return { bg: '#FEE2E2', text: '#B91C1C' };
  if (normalized.includes('pend')) return { bg: '#FEF3C7', text: '#B45309' };
  if (
    normalized.includes('proces') ||
    normalized.includes('envío') ||
    normalized.includes('envio')
  ) {
    return { bg: '#DBEAFE', text: '#1D4ED8' };
  }
  return { bg: '#F1F5F9', text: '#475569' };
}

export function ClientDetailDrawer({ client, onClose }: ClientDetailDrawerProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!client) return null;

  return (
    <aside
      className="flex h-full w-80 shrink-0 flex-col overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-md"
      data-testid="client-detail-drawer"
    >
      {/* Header */}
      <header className="flex items-start justify-between border-b border-[#E2E8F0] px-5 py-4">
        <div className="min-w-0 flex-1 pr-3">
          <p className="font-sans text-[10px] uppercase tracking-wide text-[#64748B]">Cliente</p>
          <h2 className="truncate font-sans text-base font-semibold text-[#0F172A]">
            {client.clientName}
          </h2>
          <p className="mt-0.5 font-sans text-[11px] text-[#94A3B8]">
            ID #{client.farmerId}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 cursor-pointer rounded-md p-1.5 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#475569]"
          aria-label="Cerrar detalle"
          data-testid="client-detail-close"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M12.78 4.28a.75.75 0 0 0-1.06-1.06L8 6.94 4.28 3.22a.75.75 0 0 0-1.06 1.06L6.94 8l-3.72 3.72a.75.75 0 1 0 1.06 1.06L8 9.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L9.06 8l3.72-3.72Z" />
          </svg>
        </button>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4">

        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-[#E2E8F0] bg-[#F9FAFB] p-3">
            <p className="font-sans text-[11px] text-[#64748B]">Pedidos</p>
            <p className="font-sans text-2xl font-bold text-[#0F172A]">{client.totalOrders}</p>
          </div>
          <div className="rounded-lg border border-[#E2E8F0] bg-[#F9FAFB] p-3">
            <p className="font-sans text-[11px] text-[#64748B]">Acumulado</p>
            <p className="truncate font-sans text-lg font-bold text-[#0F172A]">
              {formatCurrency(client.totalSpent)}
            </p>
          </div>
        </div>

        {/* Last order summary */}
        <div className="mt-3 rounded-lg border border-[#E2E8F0] bg-[#F9FAFB] p-3">
          <p className="font-sans text-[11px] text-[#64748B]">Último pedido</p>
          <p className="font-sans text-sm font-medium text-[#0F172A]">
            {formatDate(client.lastOrderDate)}
          </p>
          {client.lastOrderStatus ? (
            <p className="mt-0.5 font-sans text-[11px] text-[#64748B]">
              {client.lastOrderStatus}
            </p>
          ) : null}
        </div>

        {/* Order history */}
        <div className="mt-4">
          <h3 className="font-sans text-xs font-semibold uppercase tracking-wide text-[#475569]">
            Historial de pedidos
          </h3>

          {client.orders.length === 0 ? (
            <p className="mt-3 font-sans text-sm italic text-[#94A3B8]">
              Sin pedidos registrados.
            </p>
          ) : (
            <ul className="mt-2 flex flex-col gap-2">
              {client.orders.map((order) => {
                const colors = statusColor(order.orderStatusName);
                return (
                  <li
                    key={order.orderId}
                    className="rounded-md border border-[#E2E8F0] bg-white px-3 py-2.5"
                    data-testid="client-detail-order"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-medium text-[#0F172A]">
                          Pedido #{order.orderId}
                        </p>
                        <p className="font-sans text-[11px] text-[#94A3B8]">
                          {formatDate(order.orderDate)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold text-(--st-text) bg-(--st-bg) [--st-bg:${colors.bg}] [--st-text:${colors.text}]`}
                      >
                        {order.orderStatusName}
                      </span>
                    </div>
                    <p className="mt-1 font-sans text-sm font-semibold text-[#0F172A]">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}

export default ClientDetailDrawer;
