import { useId } from 'react';
import type { ClientFilters as ClientFiltersValue } from '../../services/clients/clientsAggregator';

export interface ClientFiltersProps {
  value: ClientFiltersValue;
  availableStatuses: string[];
  totalClients: number;
  filteredCount: number;
  onChange: (next: ClientFiltersValue) => void;
  onReset: () => void;
}

export function ClientFilters({
  value,
  availableStatuses,
  totalClients,
  filteredCount,
  onChange,
  onReset,
}: ClientFiltersProps) {
  const searchId = useId();
  const minOrdersId = useId();
  const minSpentId = useId();

  const toggleStatus = (status: string) => {
    const next = value.statuses.includes(status)
      ? value.statuses.filter((s) => s !== status)
      : [...value.statuses, status];
    onChange({ ...value, statuses: next });
  };

  return (
    <aside
      className="flex h-full w-72 shrink-0 flex-col gap-4 overflow-y-auto rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
      data-testid="client-filters"
    >
      <header className="flex items-center justify-between">
        <h2 className="font-sans text-base font-semibold text-[#0F172A]">Filtros</h2>
        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer font-sans text-xs font-medium text-[#16A34A] hover:underline"
          data-testid="client-filters-reset"
        >
          Limpiar
        </button>
      </header>

      <p className="font-sans text-xs text-[#64748B]">
        Mostrando <span className="font-semibold text-[#0F172A]">{filteredCount}</span> de{' '}
        <span className="font-semibold text-[#0F172A]">{totalClients}</span> clientes
      </p>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={searchId} className="font-sans text-xs font-medium text-[#334155]">
          Buscar cliente
        </label>
        <input
          id={searchId}
          type="search"
          placeholder="Nombre del agricultor"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          className="rounded-md border border-[#E2E8F0] bg-white px-3 py-2 font-sans text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#16A34A]"
          data-testid="client-filters-search"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-sans text-xs font-medium text-[#334155]">Estado de pedido</span>
        {availableStatuses.length === 0 ? (
          <p className="font-sans text-xs italic text-[#94A3B8]">Sin estados disponibles</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableStatuses.map((status) => {
              const active = value.statuses.includes(status);
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => toggleStatus(status)}
                  className={
                    active
                      ? 'cursor-pointer rounded-full border border-[#16A34A] bg-[#DCFCE7] px-3 py-1 font-sans text-xs font-medium text-[#15803D]'
                      : 'cursor-pointer rounded-full border border-[#E2E8F0] bg-white px-3 py-1 font-sans text-xs font-medium text-[#475569] hover:border-[#16A34A] hover:text-[#15803D]'
                  }
                  data-testid={`client-filters-status-${status}`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={minOrdersId} className="font-sans text-xs font-medium text-[#334155]">
          Mínimo de pedidos
        </label>
        <input
          id={minOrdersId}
          type="number"
          min={0}
          placeholder="Ej. 1"
          value={value.minOrders ?? ''}
          onChange={(e) =>
            onChange({
              ...value,
              minOrders: e.target.value === '' ? null : Number(e.target.value),
            })
          }
          className="rounded-md border border-[#E2E8F0] bg-white px-3 py-2 font-sans text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#16A34A]"
          data-testid="client-filters-min-orders"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={minSpentId} className="font-sans text-xs font-medium text-[#334155]">
          Monto mínimo gastado (MXN)
        </label>
        <input
          id={minSpentId}
          type="number"
          min={0}
          placeholder="Ej. 500"
          value={value.minSpent ?? ''}
          onChange={(e) =>
            onChange({
              ...value,
              minSpent: e.target.value === '' ? null : Number(e.target.value),
            })
          }
          className="rounded-md border border-[#E2E8F0] bg-white px-3 py-2 font-sans text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#16A34A]"
          data-testid="client-filters-min-spent"
        />
      </div>
    </aside>
  );
}

export default ClientFilters;
