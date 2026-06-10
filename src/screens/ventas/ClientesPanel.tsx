import { useMemo, useState } from 'react';
import { ClientMap } from '../../components/ClientMap/ClientMap';
import { ClientFilters, emptyFilterState, type FilterState } from '../../components/ClientFilters/ClientFilters';
import { ClientDetailDrawer } from '../../components/ClientDetailDrawer/ClientDetailDrawer';
import { useClientsMap } from '../../hooks/useClientsMap';
import { useClientDetail } from '../../hooks/useClientDetail';

function ClientesPanel() {
  const [filters, setFilters] = useState<FilterState>(emptyFilterState);
  const [selectedFarmerId, setSelectedFarmerId] = useState<number | null>(null);

  const { data: allClients = [], isLoading, isError, error, refetch } = useClientsMap();
  const { data: clientDetail, isLoading: detailLoading } = useClientDetail(selectedFarmerId);

  const filteredClients = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return allClients.filter((c) => {
      if (term && !c.name.toLowerCase().includes(term)) return false;
      if (filters.cultivo && !c.cultivos.includes(filters.cultivo)) return false;
      if (filters.estadoParcela && !c.estadosParcela.includes(filters.estadoParcela)) return false;
      if (filters.state && c.state !== filters.state) return false;
      if (filters.onlyWithActiveAlerts && !c.hasActiveAlerts) return false;
      return true;
    });
  }, [allClients, filters.search, filters.cultivo, filters.estadoParcela, filters.state, filters.onlyWithActiveAlerts]);

  const criticosCount = useMemo(
    () => allClients.filter((c) => c.maxAlertSeverity === 'critico').length,
    [allClients],
  );
  const advertenciasCount = useMemo(
    () => allClients.filter((c) => c.maxAlertSeverity === 'advertencia').length,
    [allClients],
  );

  const showDrawer = selectedFarmerId !== null;

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#F9FAFB] font-sans" data-testid="clientes-panel">

      {/* Page header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] bg-white px-8 py-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-semibold text-[#0F172A]">Mapa de Clientes</h1>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-[#64748B]">
              {allClients.length} {allClients.length === 1 ? 'cliente' : 'clientes'} registrados
            </p>
            {criticosCount > 0 && (
              <span className="rounded-full bg-[rgba(251,44,54,0.1)] px-2.5 py-0.5 font-sans text-xs font-semibold text-[#FB2C36]">
                Críticos: {criticosCount}
              </span>
            )}
            {advertenciasCount > 0 && (
              <span className="rounded-full bg-[rgba(255,105,0,0.1)] px-2.5 py-0.5 font-sans text-xs font-semibold text-[#FF6900]">
                Advertencias: {advertenciasCount}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          className="cursor-pointer rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#475569] hover:border-[#2B7FFF] hover:text-[#2B7FFF]"
          data-testid="clientes-panel-refresh"
        >
          Actualizar
        </button>
      </header>

      {/* Three-column body: filters | map | detail */}
      <div className="flex min-h-0 flex-1 gap-4 p-6">

        {/* Left: filters */}
        <ClientFilters
          value={filters}
          clients={allClients}
          totalCount={allClients.length}
          filteredCount={filteredClients.length}
          onChange={setFilters}
          onReset={() => setFilters(emptyFilterState)}
        />

        {/* Center: map */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          {isLoading ? (
            <div
              className="flex h-full items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white"
              data-testid="clientes-panel-loading"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#2B7FFF]" />
                <p className="text-sm text-[#64748B]">Cargando clientes…</p>
              </div>
            </div>
          ) : isError ? (
            <div
              className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-6 text-center"
              data-testid="clientes-panel-error"
            >
              <p className="text-sm font-semibold text-[#B91C1C]">
                No fue posible cargar los clientes
              </p>
              <p className="text-xs text-[#7F1D1D]">
                {(error as Error)?.message ?? 'Intenta de nuevo en unos momentos.'}
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="cursor-pointer rounded-lg bg-[#B91C1C] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#991B1B]"
              >
                Reintentar
              </button>
            </div>
          ) : filteredClients.length === 0 ? (
            <div
              className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-6 text-center"
              data-testid="clientes-panel-empty"
            >
              <p className="text-sm font-semibold text-[#0F172A]">Sin clientes para mostrar</p>
              <p className="text-xs text-[#64748B]">
                Ajusta los filtros o actualiza para ver tus clientes.
              </p>
            </div>
          ) : (
            <ClientMap
              clients={filteredClients}
              selectedClientId={selectedFarmerId}
              onSelectClient={setSelectedFarmerId}
            />
          )}
        </main>

        {/* Right: detail panel */}
        {showDrawer && (
          <ClientDetailDrawer
            client={clientDetail ?? null}
            isLoading={detailLoading}
            onClose={() => setSelectedFarmerId(null)}
          />
        )}
      </div>
    </div>
  );
}

export default ClientesPanel;
