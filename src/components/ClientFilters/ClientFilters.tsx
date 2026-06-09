import { useId, useMemo } from 'react';
import type { ClientMapItem } from '../../services/sales/salesClientsService';

export interface FilterState {
  search: string;
  cultivo: string;
  estadoParcela: string;
  state: string;
  onlyWithActiveAlerts: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const emptyFilterState: FilterState = {
  search: '',
  cultivo: '',
  estadoParcela: '',
  state: '',
  onlyWithActiveAlerts: false,
};

export interface ClientFiltersProps {
  value: FilterState;
  clients: ClientMapItem[];
  totalCount: number;
  filteredCount: number;
  onChange: (next: FilterState) => void;
  onReset: () => void;
}

const SELECT_CLASS =
  'w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 font-sans text-sm text-[#0F172A] outline-none focus:border-[#2B7FFF] appearance-none cursor-pointer';

export function ClientFilters({
  value,
  clients,
  totalCount,
  filteredCount,
  onChange,
  onReset,
}: ClientFiltersProps) {
  const searchId = useId();
  const cultivoId = useId();
  const estadoParcelaId = useId();
  const stateId = useId();

  const cultivoOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of clients) for (const v of c.cultivos) if (v) set.add(v);
    return Array.from(set).sort();
  }, [clients]);

  const estadoParcelaOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of clients) for (const v of c.estadosParcela) if (v) set.add(v);
    return Array.from(set).sort();
  }, [clients]);

  const stateOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of clients) if (c.state) set.add(c.state);
    return Array.from(set).sort();
  }, [clients]);

  const hasActiveFilters =
    value.search !== '' ||
    value.cultivo !== '' ||
    value.estadoParcela !== '' ||
    value.state !== '' ||
    value.onlyWithActiveAlerts;

  return (
    <aside
      className="flex h-full w-64 shrink-0 flex-col gap-4 overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
      data-testid="client-filters"
    >
      <header className="flex items-center justify-between">
        <h2 className="font-sans text-sm font-semibold text-[#0F172A]">Filtros</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer font-sans text-xs font-medium text-[#2B7FFF] hover:underline"
            data-testid="client-filters-reset"
          >
            Limpiar
          </button>
        )}
      </header>

      <p className="font-sans text-xs text-[#64748B]">
        Mostrando{' '}
        <span className="font-semibold text-[#0F172A]">{filteredCount}</span> de{' '}
        <span className="font-semibold text-[#0F172A]">{totalCount}</span> clientes
      </p>

      {/* Name search */}
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
          className="rounded-md border border-[#E2E8F0] bg-white px-3 py-2 font-sans text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#2B7FFF]"
          data-testid="client-filters-search"
        />
      </div>

      {/* Cultivo */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={cultivoId} className="font-sans text-xs font-medium text-[#334155]">
          Cultivo
        </label>
        <select
          id={cultivoId}
          value={value.cultivo}
          onChange={(e) => onChange({ ...value, cultivo: e.target.value })}
          className={SELECT_CLASS}
          data-testid="client-filters-cultivo"
        >
          <option value="">Todos los cultivos</option>
          {cultivoOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Estado de parcela */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={estadoParcelaId} className="font-sans text-xs font-medium text-[#334155]">
          Estado de parcela
        </label>
        <select
          id={estadoParcelaId}
          value={value.estadoParcela}
          onChange={(e) => onChange({ ...value, estadoParcela: e.target.value })}
          className={SELECT_CLASS}
          data-testid="client-filters-estado-parcela"
        >
          <option value="">Todos los estados</option>
          {estadoParcelaOptions.map((opt) => (
            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Estado / región */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={stateId} className="font-sans text-xs font-medium text-[#334155]">
          Estado (región)
        </label>
        <select
          id={stateId}
          value={value.state}
          onChange={(e) => onChange({ ...value, state: e.target.value })}
          className={SELECT_CLASS}
          data-testid="client-filters-state"
        >
          <option value="">Todos los estados</option>
          {stateOptions.map((opt) => (
            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Only with active alerts */}
      <label className="flex cursor-pointer items-center gap-3">
        <div className="relative">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={value.onlyWithActiveAlerts}
            onChange={(e) => onChange({ ...value, onlyWithActiveAlerts: e.target.checked })}
            data-testid="client-filters-alerts-toggle"
          />
          <div className="h-5 w-9 rounded-full border border-[#E2E8F0] bg-[#F1F5F9] transition-colors peer-checked:border-[#FB2C36] peer-checked:bg-[#FB2C36]" />
          <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
        </div>
        <span className="font-sans text-xs font-medium text-[#334155]">Solo con alertas activas</span>
      </label>
    </aside>
  );
}

export default ClientFilters;
