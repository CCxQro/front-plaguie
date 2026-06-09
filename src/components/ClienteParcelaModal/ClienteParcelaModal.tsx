import { useClientParcelaStatus } from '../../hooks/useClientParcelaStatus';

export interface ClienteParcelaModalProps {
  farmerId: number;
  onClose: () => void;
}

const SEVERITY_ICONS: Record<string, string> = {
  critico: '🔴',
  advertencia: '🟠',
  informacion: '🔵',
};

const SEVERITY_LABEL: Record<string, string> = {
  critico: 'Riesgo Crítico',
  advertencia: 'Riesgo Medio',
  informacion: 'Riesgo Bajo',
};

export function ClienteParcelaModal({ farmerId, onClose }: ClienteParcelaModalProps) {
  const { data, isLoading, isError, error } = useClientParcelaStatus(farmerId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" data-testid="cliente-parcela-modal">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          <h2 className="font-sans text-lg font-semibold text-[#0F172A]">Estado de Parcelas (Últimos 15 días)</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#475569]"
            aria-label="Cerrar modal"
            data-testid="cliente-parcela-modal-close"
          >
            <svg viewBox="0 0 16 16" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M12.78 4.28a.75.75 0 0 0-1.06-1.06L8 6.94 4.28 3.22a.75.75 0 0 0-1.06 1.06L6.94 8l-3.72 3.72a.75.75 0 1 0 1.06 1.06L8 9.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L9.06 8l3.72-3.72Z" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-8" data-testid="cliente-parcela-modal-loading">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E2E8F0] border-t-[#2B7FFF]" />
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-center" data-testid="cliente-parcela-modal-error">
              <p className="text-sm font-semibold text-[#B91C1C]">Error al cargar estado</p>
              <p className="text-xs text-[#7F1D1D]">{(error as Error)?.message}</p>
            </div>
          ) : !data || data.parcelas.length === 0 ? (
            <div className="text-center" data-testid="cliente-parcela-modal-empty">
              <p className="font-sans text-sm text-[#64748B]">Este cliente no tiene parcelas o estado reciente.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.parcelas.map((parcela) => (
                <div key={parcela.parcelaId} className="flex flex-col rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4" data-testid="parcela-status-card">
                  <div className="flex items-center justify-between">
                    <h3 className="font-sans text-base font-semibold text-[#0F172A]">{parcela.nombreParcela}</h3>
                    <div className="flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 shadow-sm">
                      <span className="font-sans text-[10px] font-medium uppercase text-[#64748B]">Salud</span>
                      <span className={`font-sans text-xs font-bold ${parcela.saludCultivo >= 80 ? 'text-[#10B981]' : parcela.saludCultivo >= 50 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                        {parcela.saludCultivo}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex-1">
                    {parcela.alertas.length === 0 ? (
                      <p className="font-sans text-xs italic text-[#94A3B8]">Sin alertas en los últimos 15 días.</p>
                    ) : (
                      <ul className="flex flex-col gap-2">
                        {parcela.alertas.map((alerta) => (
                          <li key={alerta.alertaId} className="flex items-start gap-2 rounded-lg bg-white p-2 shadow-sm border border-[#E2E8F0]">
                            <span className="text-sm" aria-hidden="true" data-testid="alerta-icon">
                              {SEVERITY_ICONS[alerta.severidad] ?? '🔹'}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="font-sans text-[11px] font-semibold text-[#334155]">
                                Alerta {alerta.tipoPlaga ?? 'General'}
                              </p>
                              <p className="font-sans text-[10px] text-[#64748B]">
                                {SEVERITY_LABEL[alerta.severidad] ?? alerta.severidad}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
