import { useEffect } from 'react';
import type { EnrichedClient } from '../../services/clients/clientsAggregator';

export interface ClientDetailDrawerProps {
  client: EnrichedClient | null;
  isOpen: boolean;
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
  if (normalized.includes('proces') || normalized.includes('envío') || normalized.includes('envio')) {
    return { bg: '#DBEAFE', text: '#1D4ED8' };
  }
  return { bg: '#F1F5F9', text: '#475569' };
}

export function ClientDetailDrawer({ client, isOpen, onClose }: ClientDetailDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen || !client) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-pointer bg-black/30"
        data-testid="client-detail-overlay"
      />
      <div
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        data-testid="client-detail-drawer"
      >
        <header className="flex items-start justify-between border-b border-[#E2E8F0] px-6 py-5">
          <div>
            <p className="font-sans text-xs uppercase tracking-wide text-[#64748B]">Cliente</p>
            <h2 className="font-sans text-xl font-semibold text-[#0F172A]">{client.clientName}</h2>
            <p className="mt-1 font-sans text-xs text-[#64748B]">
              ID #{client.farmerId} · {client.lat.toFixed(4)}, {client.lng.toFixed(4)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md p-1 font-sans text-sm text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
            data-testid="client-detail-close"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F9FAFB] p-4">
              <p className="font-sans text-xs text-[#64748B]">Pedidos totales</p>
              <p className="font-sans text-2xl font-semibold text-[#0F172A]">{client.totalOrders}</p>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F9FAFB] p-4">
              <p className="font-sans text-xs text-[#64748B]">Total acumulado</p>
              <p className="font-sans text-2xl font-semibold text-[#0F172A]">
                {formatCurrency(client.totalSpent)}
              </p>
            </div>
          </section>

          <section className="mt-4 rounded-lg border border-[#E2E8F0] bg-[#F9FAFB] p-4">
            <p className="font-sans text-xs text-[#64748B]">Último pedido</p>
            <p className="font-sans text-sm font-medium text-[#0F172A]">
              {formatDate(client.lastOrderDate)}
            </p>
            {client.lastOrderStatus ? (
              <p className="mt-1 font-sans text-xs text-[#64748B]">
                Estado: {client.lastOrderStatus}
              </p>
            ) : null}
          </section>

          <section className="mt-6">
            <h3 className="font-sans text-sm font-semibold text-[#0F172A]">Historial de pedidos</h3>
            {client.orders.length === 0 ? (
              <p className="mt-2 font-sans text-sm italic text-[#94A3B8]">
                Este cliente aún no tiene pedidos registrados contigo.
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {client.orders.map((order) => {
                  const colors = statusColor(order.orderStatusName);
                  return (
                    <li
                      key={order.orderId}
                      className="flex items-center justify-between rounded-md border border-[#E2E8F0] bg-white px-3 py-2.5"
                      data-testid="client-detail-order"
                    >
                      <div>
                        <p className="font-sans text-sm font-medium text-[#0F172A]">
                          Pedido #{order.orderId}
                        </p>
                        <p className="font-sans text-xs text-[#64748B]">
                          {formatDate(order.orderDate)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold text-(--st-text) bg-(--st-bg) [--st-bg:${colors.bg}] [--st-text:${colors.text}]`}
                        >
                          {order.orderStatusName}
                        </span>
                        <span className="font-sans text-sm font-semibold text-[#0F172A]">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default ClientDetailDrawer;
