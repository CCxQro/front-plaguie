import { useMemo, useState } from 'react';
import { ClientMap } from '../components/ClientMap/ClientMap';
import { ClientFilters } from '../components/ClientFilters/ClientFilters';
import { ClientDetailDrawer } from '../components/ClientDetailDrawer/ClientDetailDrawer';
import { useClientsWithOrders } from '../hooks/useClientsWithOrders';
import {
  applyFilters,
  emptyFilters,
  type ClientFilters as ClientFiltersValue,
} from '../services/clients/clientsAggregator';

function ClientesPanel() {
  const { clients, isLoading, isError, error, refetch } = useClientsWithOrders();
  const [filters, setFilters] = useState<ClientFiltersValue>(emptyFilters);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const availableStatuses = useMemo(() => {
    const set = new Set<string>();
    for (const c of clients) for (const s of c.statuses) set.add(s);
    return Array.from(set).sort();
  }, [clients]);

  const filteredClients = useMemo(
    () => applyFilters(clients, filters),
    [clients, filters],
  );

  const selectedClient = useMemo(
    () => filteredClients.find((c) => c.clientId === selectedClientId) ?? null,
    [filteredClients, selectedClientId],
  );

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#F9FAFB] font-sans" data-testid="clientes-panel">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] bg-white px-8 py-5">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A]">Mapa de Clientes</h1>
          <p className="text-sm text-[#64748B]">
            Visualiza y filtra a los agricultores con los que has trabajado.
          </p>
        </div>
        <button
          type="button"
          onClick={refetch}
          className="cursor-pointer rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#475569] hover:border-[#16A34A] hover:text-[#15803D]"
          data-testid="clientes-panel-refresh"
        >
          Actualizar
        </button>
      </header>

      <div className="flex min-h-0 flex-1 gap-4 p-6">
        <ClientFilters
          value={filters}
          availableStatuses={availableStatuses}
          totalClients={clients.length}
          filteredCount={filteredClients.length}
          onChange={setFilters}
          onReset={() => setFilters(emptyFilters)}
        />

        <main className="relative flex min-h-0 flex-1 flex-col">
          {isLoading ? (
            <div
              className="flex h-full items-center justify-center rounded-lg border border-[#E2E8F0] bg-white"
              data-testid="clientes-panel-loading"
            >
              <p className="text-sm text-[#64748B]">Cargando ubicaciones de clientes…</p>
            </div>
          ) : isError ? (
            <div
              className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-6 text-center"
              data-testid="clientes-panel-error"
            >
              <p className="text-sm font-semibold text-[#B91C1C]">
                No fue posible cargar los clientes
              </p>
              <p className="text-xs text-[#7F1D1D]">
                {error?.message ?? 'Intenta de nuevo en unos momentos.'}
              </p>
              <button
                type="button"
                onClick={refetch}
                className="cursor-pointer rounded-md bg-[#B91C1C] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#991B1B]"
              >
                Reintentar
              </button>
            </div>
          ) : filteredClients.length === 0 ? (
            <div
              className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 text-center"
              data-testid="clientes-panel-empty"
            >
              <p className="text-sm font-semibold text-[#0F172A]">Sin clientes para mostrar</p>
              <p className="text-xs text-[#64748B]">
                Ajusta los filtros o vuelve a cargar para ver tus clientes.
              </p>
            </div>
          ) : (
            <ClientMap
              clients={filteredClients}
              selectedClientId={selectedClientId}
              onSelectClient={setSelectedClientId}
            />
          )}
        </main>
      </div>

      <ClientDetailDrawer
        client={selectedClient}
        isOpen={!!selectedClient}
        onClose={() => setSelectedClientId(null)}
      />
    </div>
  );
}

export default ClientesPanel;
