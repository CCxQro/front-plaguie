import { useState, useEffect } from 'react';
import type {
  ClientDetail,
  ClientParcelaSummary,
  ClientAlertaSummary,
} from '../../services/sales/salesClientsService';
import { ClienteParcelaModal } from '../ClienteParcelaModal';

export interface ClientDetailDrawerProps {
  client: ClientDetail | null;
  isLoading?: boolean;
  onClose: () => void;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  });
}

const SEVERITY_LABEL: Record<string, string> = {
  critico: 'Crítico',
  advertencia: 'Advertencia',
  informacion: 'Información',
};

const SEVERITY_CLASS: Record<string, string> = {
  critico: '[--sb:rgba(251,44,54,0.1)] [--st:#FB2C36]',
  advertencia: '[--sb:rgba(255,105,0,0.1)] [--st:#FF6900]',
  informacion: '[--sb:rgba(43,127,255,0.1)] [--st:#2B7FFF]',
};

function AlertaBadge({ severidad }: { severidad: ClientAlertaSummary['severidad'] }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold bg-(--sb) text-(--st) ${SEVERITY_CLASS[severidad] ?? ''}`}
    >
      {SEVERITY_LABEL[severidad] ?? severidad}
    </span>
  );
}

function ParcelaCard({ parcela }: { parcela: ClientParcelaSummary }) {
  return (
    <div
      className="rounded-xl border border-[#E2E8F0] bg-[#F9FAFB] p-3"
      data-testid="client-detail-parcela"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-sans text-sm font-semibold text-[#0F172A]">{parcela.nombreParcela}</p>
        {parcela.estadoParcela && (
          <span className="shrink-0 rounded-full border border-[#E2E8F0] bg-white px-2 py-0.5 font-sans text-[10px] font-medium text-[#64748B]">
            {parcela.estadoParcela.toUpperCase()}
          </span>
        )}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
        {parcela.tipoCultivo && (
          <DataRow label="Cultivo" value={parcela.tipoCultivo} />
        )}
        <DataRow label="Tamaño" value={`${parcela.tamanoHectareas} ha`} />
        {parcela.sistemaRiego && (
          <DataRow label="Riego" value={parcela.sistemaRiego} />
        )}
        {parcela.phSuelo != null && (
          <DataRow label="pH suelo" value={String(parcela.phSuelo)} />
        )}
        {parcela.fechaSiembra && (
          <DataRow label="Siembra" value={formatDate(parcela.fechaSiembra)} />
        )}
        {parcela.fechaCosecha && (
          <DataRow label="Cosecha" value={formatDate(parcela.fechaCosecha)} />
        )}
      </div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-sans text-[10px] text-[#94A3B8]">{label}</span>
      <span className="font-sans text-xs font-medium text-[#334155]">{value}</span>
    </div>
  );
}

export function ClientDetailDrawer({ client, isLoading, onClose }: ClientDetailDrawerProps) {
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!client && !isLoading) return null;

  return (
    <aside
      className="flex h-full w-80 shrink-0 flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_2px_4px_-2px_rgba(0,0,0,0.05)]"
      data-testid="client-detail-drawer"
    >
      {/* Header */}
      <header className="flex items-start justify-between border-b border-[#E2E8F0] px-5 py-4">
        <div className="min-w-0 flex-1 pr-3">
          <p className="font-sans text-[10px] uppercase tracking-wide text-[#94A3B8]">Cliente</p>
          {isLoading && !client ? (
            <div className="mt-1 h-4 w-36 animate-pulse rounded bg-[#E2E8F0]" />
          ) : (
            <h2 className="truncate font-sans text-base font-semibold text-[#0F172A]">
              {client!.name}
            </h2>
          )}
          {client && (
            <p className="mt-0.5 font-sans text-[11px] text-[#94A3B8]">ID #{client.farmerId}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 cursor-pointer rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#475569]"
          aria-label="Cerrar detalle"
          data-testid="client-detail-close"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M12.78 4.28a.75.75 0 0 0-1.06-1.06L8 6.94 4.28 3.22a.75.75 0 0 0-1.06 1.06L6.94 8l-3.72 3.72a.75.75 0 1 0 1.06 1.06L8 9.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L9.06 8l3.72-3.72Z" />
          </svg>
        </button>
      </header>

      {isLoading && !client ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#2B7FFF]" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* Location */}
          {(client!.state || client!.municipality) && (
            <p className="mb-3 font-sans text-xs text-[#64748B]">
              {[client!.municipality, client!.state?.toUpperCase()].filter(Boolean).join(', ')}
            </p>
          )}

          {/* Order summary */}
          {client!.orderSummary && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F9FAFB] p-3">
                <p className="font-sans text-[11px] text-[#64748B]">Pedidos</p>
                <p className="font-sans text-2xl font-bold text-[#0F172A]">
                  {client!.orderSummary.totalOrders}
                </p>
              </div>
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F9FAFB] p-3">
                <p className="font-sans text-[11px] text-[#64748B]">Acumulado</p>
                <p className="truncate font-sans text-lg font-bold text-[#0F172A]">
                  {formatCurrency(Number(client!.orderSummary.totalAmount ?? 0))}
                </p>
              </div>
              {client!.orderSummary.lastOrderDate && (
                <div className="col-span-2 rounded-xl border border-[#E2E8F0] bg-[#F9FAFB] p-3">
                  <p className="font-sans text-[11px] text-[#64748B]">Último pedido</p>
                  <p className="font-sans text-sm font-medium text-[#0F172A]">
                    {formatDate(client!.orderSummary.lastOrderDate)}
                  </p>
                  {client!.orderSummary.lastOrderStatus && (
                    <p className="mt-0.5 font-sans text-[11px] text-[#64748B]">
                      {client!.orderSummary.lastOrderStatus.toUpperCase()}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Alertas */}
          {client!.alertas.length > 0 && (
            <section className="mb-4">
              <h3 className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-[#475569]">
                Alertas activas
              </h3>
              <ul className="flex flex-col gap-2">
                {client!.alertas.map((alerta) => (
                  <li
                    key={alerta.alertaId}
                    className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5"
                    data-testid="client-detail-alerta"
                  >
                    <div className="flex items-start gap-2">
                      <AlertaBadge severidad={alerta.severidad} />
                      <div className="min-w-0">
                        <p className="font-sans text-xs font-medium text-[#0F172A]">
                          {alerta.titulo}
                        </p>
                        {alerta.tipoPlaga && (
                          <p className="font-sans text-[11px] text-[#64748B]">{alerta.tipoPlaga}</p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Parcelas */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wide text-[#475569]">
                Parcelas ({client!.parcelas.length})
              </h3>
              {client!.parcelas.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowStatusModal(true)}
                  className="rounded-lg border border-[#E2E8F0] bg-white px-2 py-1 text-[10px] font-medium text-[#2B7FFF] hover:bg-[#F8FAFC]"
                  data-testid="btn-ver-estado-parcelas"
                >
                  Ver Estado
                </button>
              )}
            </div>
            {client!.parcelas.length === 0 ? (
              <p className="font-sans text-sm italic text-[#94A3B8]">Sin parcelas registradas.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {client!.parcelas.map((p) => (
                  <li key={p.parcelaId}>
                    <ParcelaCard parcela={p} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {showStatusModal && client && (
        <ClienteParcelaModal 
          farmerId={client.farmerId} 
          onClose={() => setShowStatusModal(false)} 
        />
      )}
    </aside>
  );
}

export default ClientDetailDrawer;
