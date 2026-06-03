import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { PestMap } from '../components/PestMap/PestMap';
import { usePestMap } from '../hooks/usePestMap';
import { getUserById } from '../services/admin/users';
import useAuthStore from '../services/Contexts/useAuthStore';
import {
  aggregateByZone,
  distinctPlagues,
  distinctStates,
  filterPoints,
} from '../utils/pestMapAggregation';
import type { PestMapFilters, RiskLevel } from '../types/PestMap';

const EMPTY_FILTERS: PestMapFilters = { plaga: '', estado: '', fechaDesde: '', fechaHasta: '' };

const RISK_BADGE: Record<RiskLevel, { bg: string; text: string }> = {
  Alto: { bg: 'bg-[#FEF2F2]', text: 'text-[#B91C1C]' },
  Medio: { bg: 'bg-[#FEFCE8]', text: 'text-[#92400E]' },
  Bajo: { bg: 'bg-[#F0FDF4]', text: 'text-[#166534]' },
};

function MapaPlagasPanel() {
  const [filters, setFilters] = useState<PestMapFilters>(EMPTY_FILTERS);
  const [selectedZoneKey, setSelectedZoneKey] = useState<string | null>(null);

  const { data, isLoading, isError, error } = usePestMap();
  const points = useMemo(() => data ?? [], [data]);

  // Resolve the seller's own location to center the map there initially.
  const currentUser = useAuthStore((s) => s.user);
  const userQuery = useQuery({
    queryKey: ['user-location', currentUser?.userId],
    queryFn: () => getUserById(currentUser!.userId),
    enabled: !!currentUser?.userId,
    staleTime: 10 * 60 * 1000,
  });
  const center = useMemo<[number, number] | null>(() => {
    const loc = userQuery.data?.location;
    return loc && loc.latitude != null && loc.longitude != null
      ? [loc.latitude, loc.longitude]
      : null;
  }, [userQuery.data]);
  // Wait for the location lookup to settle so the map opens already centered
  // on the seller (avoids a flash of the whole map before recentering).
  const locationSettled = !currentUser?.userId || userQuery.isFetched;

  // Filter options come from the full dataset (so they don't disappear as you filter).
  const plagueOptions = useMemo(() => distinctPlagues(points), [points]);
  const stateOptions = useMemo(() => distinctStates(points), [points]);

  const zones = useMemo(
    () => aggregateByZone(filterPoints(points, filters)),
    [points, filters]
  );

  const selectedZone = useMemo(
    () => zones.find((z) => z.key === selectedZoneKey) ?? null,
    [zones, selectedZoneKey]
  );

  const totalIncidencias = zones.reduce((s, z) => s + z.totalObservaciones, 0);

  const update = (patch: Partial<PestMapFilters>) => setFilters((prev) => ({ ...prev, ...patch }));

  return (
    <main
      data-testid="mapa-plagas-panel"
      className="flex min-h-full flex-col gap-6 bg-[#F9FAFB] p-6 font-sans"
    >
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-[#101828]">Mapa de plagas por zona</h1>
        <p className="text-sm text-[#6B7280]">
          Distribución de incidencias de plagas (vigilancia validada) por zona. Filtra y haz clic en
          una zona para ver el detalle.
        </p>
      </header>

      {/* Filters */}
      <section className="flex flex-col gap-3 rounded-[14px] border border-[#E5E7EB] bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex flex-col gap-1 sm:flex-1">
          <span className="text-xs font-medium text-[#6A7282]">Tipo de plaga</span>
          <select
            value={filters.plaga}
            onChange={(e) => update({ plaga: e.target.value })}
            data-testid="filter-plaga"
            className="h-11 rounded-[10px] border border-[#D1D5DC] bg-white px-3 text-sm text-[#364153] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/15"
          >
            <option value="">Todas las plagas</option>
            {plagueOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 sm:flex-1">
          <span className="text-xs font-medium text-[#6A7282]">Región (estado)</span>
          <select
            value={filters.estado}
            onChange={(e) => update({ estado: e.target.value })}
            data-testid="filter-estado"
            className="h-11 rounded-[10px] border border-[#D1D5DC] bg-white px-3 text-sm text-[#364153] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/15"
          >
            <option value="">Todas las regiones</option>
            {stateOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-[#6A7282]">Desde</span>
          <input
            type="date"
            value={filters.fechaDesde}
            onChange={(e) => update({ fechaDesde: e.target.value })}
            data-testid="filter-desde"
            className="h-11 rounded-[10px] border border-[#D1D5DC] bg-white px-3 text-sm text-[#364153] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/15"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-[#6A7282]">Hasta</span>
          <input
            type="date"
            value={filters.fechaHasta}
            onChange={(e) => update({ fechaHasta: e.target.value })}
            data-testid="filter-hasta"
            className="h-11 rounded-[10px] border border-[#D1D5DC] bg-white px-3 text-sm text-[#364153] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/15"
          />
        </label>

        <button
          type="button"
          onClick={() => setFilters(EMPTY_FILTERS)}
          data-testid="filter-clear"
          className="h-11 rounded-[10px] border border-[#D1D5DC] px-4 text-sm font-medium text-[#364153] hover:bg-[#F3F4F6]"
        >
          Limpiar
        </button>
      </section>

      {/* Summary */}
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-[#475569] shadow-sm">
          <strong>{zones.length}</strong> zona{zones.length !== 1 ? 's' : ''}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-[#475569] shadow-sm">
          <strong>{totalIncidencias}</strong> incidencia{totalIncidencias !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Map + detail */}
      <section className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="h-[460px] lg:h-auto lg:min-h-[460px]">
          {isLoading || !locationSettled ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white text-sm text-[#6A7282]">
              Cargando mapa…
            </div>
          ) : isError ? (
            <div
              data-testid="mapa-error"
              className="flex h-full items-center justify-center rounded-2xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#991B1B]"
            >
              {error?.message ?? 'No se pudo cargar el mapa.'}
            </div>
          ) : zones.length === 0 ? (
            <div
              data-testid="mapa-empty"
              className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-6 text-center text-sm text-[#6B7280]"
            >
              No hay incidencias de plagas que coincidan con los filtros.
            </div>
          ) : (
            <PestMap zones={zones} center={center} onSelectZone={setSelectedZoneKey} />
          )}
        </div>

        {/* Zone detail */}
        <aside
          data-testid="zone-detail"
          className="rounded-2xl border border-[#E5E7EB] bg-white p-5"
        >
          {selectedZone ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-[#101828]">
                  {selectedZone.municipio ?? 'Zona'}
                </h2>
                <p className="text-sm text-[#6A7282]">{selectedZone.estado ?? ''}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${RISK_BADGE[selectedZone.nivelRiesgo].bg} ${RISK_BADGE[selectedZone.nivelRiesgo].text}`}
                >
                  Riesgo {selectedZone.nivelRiesgo}
                </span>
                <span className="text-sm text-[#475569]">
                  {selectedZone.totalObservaciones} incidencia
                  {selectedZone.totalObservaciones !== 1 ? 's' : ''}
                </span>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6A7282]">
                  Plagas registradas
                </p>
                <ul className="flex flex-col gap-2" data-testid="zone-plagues">
                  {selectedZone.plagas.map((p) => (
                    <li
                      key={p.nombre}
                      className="flex items-center justify-between rounded-[10px] border border-[#E5E7EB] px-3 py-2"
                    >
                      <span className="text-sm text-[#101828]">{p.nombre}</span>
                      <span className="rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-xs font-medium text-[#4A5565]">
                        {p.observaciones}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
              <span className="mb-2 text-2xl">🗺️</span>
              <p className="text-sm text-[#6B7280]">
                Selecciona una zona en el mapa para ver el detalle de plagas.
              </p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

export default MapaPlagasPanel;
