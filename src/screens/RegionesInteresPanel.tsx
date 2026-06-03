import { useMemo, useState } from 'react';

import {
  useAddRegionInteres,
  useDeleteRegionInteres,
  useEarlyAlerts,
  useRegionesInteres,
  useStates,
} from '../hooks/useRegionesInteres';
import type { EarlyAlert } from '../types/RegionInteres';

const SEVERITY_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  critico: { bg: 'bg-[#FEF2F2]', text: 'text-[#B91C1C]', dot: 'bg-[#DC2626]', label: 'Crítico' },
  advertencia: { bg: 'bg-[#FEFCE8]', text: 'text-[#92400E]', dot: 'bg-[#D97706]', label: 'Advertencia' },
  informacion: { bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]', dot: 'bg-[#2563EB]', label: 'Información' },
};

const SEVERITY_CHIPS: { value: string; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'critico', label: 'Críticas' },
  { value: 'advertencia', label: 'Advertencias' },
  { value: 'informacion', label: 'Información' },
];

function severityStyle(severidad: string) {
  return (
    SEVERITY_STYLES[severidad] ?? {
      bg: 'bg-[#F3F4F6]',
      text: 'text-[#1E2939]',
      dot: 'bg-[#6A7282]',
      label: severidad,
    }
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function AlertRow({ alert, onClick }: { alert: EarlyAlert; onClick: () => void }) {
  const s = severityStyle(alert.severidad);
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        data-testid="early-alert-row"
        className="flex w-full flex-col gap-2 rounded-[10px] border border-[#E5E7EB] bg-white p-4 text-left transition-colors hover:bg-[#F9FAFB] sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-medium text-[#101828]">{alert.titulo}</p>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#6A7282]">
            {alert.stateName ? (
              <span className="inline-flex items-center gap-1">📍 {alert.stateName}</span>
            ) : null}
            <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-xs font-medium text-[#4A5565]">
              {alert.tipoPlaga}
            </span>
            <span className="text-xs">{formatDate(alert.createdAt)}</span>
          </div>
        </div>
        <span className="shrink-0 text-sm font-medium text-[#155DFC]">Ver detalle →</span>
      </button>
    </li>
  );
}

function AlertDetailModal({ alert, onClose }: { alert: EarlyAlert; onClose: () => void }) {
  const s = severityStyle(alert.severidad);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8">
      <div
        className="w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6"
        data-testid="alert-detail-modal"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-[#101828]">{alert.titulo}</h2>
            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${s.bg} ${s.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
            className="grid h-9 w-9 shrink-0 place-content-center rounded-[10px] hover:bg-[#F3F4F6]"
          >
            ✕
          </button>
        </div>

        {alert.descripcion ? (
          <p className="mb-5 text-sm leading-6 text-[#475569]">{alert.descripcion}</p>
        ) : null}

        <dl className="space-y-3 rounded-[10px] border border-[#E5E7EB] p-4">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm font-medium text-[#6A7282]">Región (estado)</dt>
            <dd className="text-sm text-[#101828]">{alert.stateName ?? '—'}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm font-medium text-[#6A7282]">Tipo de plaga</dt>
            <dd className="text-sm text-[#101828]">{alert.tipoPlaga}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm font-medium text-[#6A7282]">Superficie afectada</dt>
            <dd className="text-sm text-[#101828]">
              {alert.hectareas != null ? `${alert.hectareas} ha` : '—'}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm font-medium text-[#6A7282]">Reportada</dt>
            <dd className="text-sm text-[#101828]">{formatDate(alert.createdAt)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm font-medium text-[#6A7282]">Validada</dt>
            <dd className="text-sm text-[#101828]">{formatDate(alert.validatedAt)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm font-medium text-[#6A7282]">Estado</dt>
            <dd className="text-sm text-[#101828]">{alert.statusName ?? '—'}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className="h-10.5 w-full rounded-[10px] border border-[#D1D5DC] text-base font-medium text-[#364153] hover:bg-[#F9FAFB]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function RegionesInteresPanel() {
  const [selectedState, setSelectedState] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Alert filters
  const [regionFilter, setRegionFilter] = useState('todas'); // 'todas' | 'mis-regiones' | stateId
  const [severityFilter, setSeverityFilter] = useState('todas');
  const [search, setSearch] = useState('');
  const [detailAlert, setDetailAlert] = useState<EarlyAlert | null>(null);

  const regionesQuery = useRegionesInteres();
  const statesQuery = useStates();
  const alertsQuery = useEarlyAlerts();
  const addMutation = useAddRegionInteres();
  const deleteMutation = useDeleteRegionInteres();

  const regiones = regionesQuery.data ?? [];
  const alerts = useMemo(() => alertsQuery.data ?? [], [alertsQuery.data]);

  // States not yet configured by the seller.
  const availableStates = useMemo(() => {
    const used = new Set((regionesQuery.data ?? []).map((r) => r.stateId));
    return (statesQuery.data ?? []).filter((s) => !used.has(s.stateId));
  }, [regionesQuery.data, statesQuery.data]);

  // Distinct states present in the alerts, for the region filter dropdown.
  const alertStates = useMemo(() => {
    const map = new Map<number, string>();
    for (const a of alerts) {
      if (a.stateId != null) map.set(a.stateId, a.stateName ?? `Estado ${a.stateId}`);
    }
    return Array.from(map, ([stateId, name]) => ({ stateId, name })).sort((x, y) =>
      x.name.localeCompare(y.name)
    );
  }, [alerts]);

  const myStateIds = useMemo(
    () => new Set((regionesQuery.data ?? []).map((r) => r.stateId)),
    [regionesQuery.data]
  );

  const filteredAlerts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return alerts.filter((a) => {
      if (severityFilter !== 'todas' && a.severidad !== severityFilter) return false;
      if (regionFilter === 'mis-regiones' && (a.stateId == null || !myStateIds.has(a.stateId)))
        return false;
      if (
        regionFilter !== 'todas' &&
        regionFilter !== 'mis-regiones' &&
        String(a.stateId) !== regionFilter
      )
        return false;
      if (term) {
        const haystack = `${a.titulo} ${a.tipoPlaga} ${a.stateName ?? ''}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [alerts, severityFilter, regionFilter, myStateIds, search]);

  const handleAdd = () => {
    setFormError(null);
    if (!selectedState) {
      setFormError('Selecciona un estado');
      return;
    }
    addMutation.mutate(Number(selectedState), {
      onSuccess: () => setSelectedState(''),
      onError: (e) =>
        setFormError(e instanceof Error ? e.message : 'No se pudo agregar la región'),
    });
  };

  const handleDelete = (regionInteresId: number) => {
    setFormError(null);
    deleteMutation.mutate(regionInteresId, {
      onError: (e) =>
        setFormError(e instanceof Error ? e.message : 'No se pudo eliminar la región'),
    });
  };

  const isMutating = addMutation.isPending || deleteMutation.isPending;

  return (
    <main
      data-testid="regiones-interes-panel"
      className="min-h-full space-y-6 bg-[#F9FAFB] p-6 font-sans"
    >
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-[#101828]">Regiones de interés</h1>
        <p className="text-sm text-[#6B7280]">
          Consulta todas las alertas tempranas de plagas y fíltralas por tus regiones de interés.
        </p>
      </header>

      {/* Configure regions */}
      <section className="space-y-4 rounded-[14px] border border-[#E5E7EB] bg-white p-5">
        <h2 className="text-lg font-semibold text-[#101828]">Configurar regiones</h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            data-testid="state-select"
            disabled={statesQuery.isLoading || isMutating}
            className="h-11 rounded-[10px] border border-[#D1D5DC] bg-white px-3 text-sm text-[#364153] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/15 sm:flex-1"
          >
            <option value="">
              {statesQuery.isLoading ? 'Cargando estados…' : 'Selecciona un estado…'}
            </option>
            {availableStates.map((s) => (
              <option key={s.stateId} value={s.stateId}>
                {s.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAdd}
            data-testid="add-region-button"
            disabled={isMutating || !selectedState}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-[#00A63E] px-6 text-sm font-medium text-white hover:bg-[#008c35] disabled:opacity-50"
          >
            <span className="text-lg leading-none">+</span>
            Agregar región
          </button>
        </div>

        {formError ? (
          <p data-testid="region-form-error" className="text-sm text-[#E7000B]">
            {formError}
          </p>
        ) : null}

        {regionesQuery.isLoading ? (
          <p className="text-sm text-[#6A7282]">Cargando regiones…</p>
        ) : regiones.length === 0 ? (
          <p data-testid="regiones-empty" className="text-sm text-[#6A7282]">
            Aún no has configurado regiones de interés. Puedes ver todas las alertas abajo y
            filtrarlas por región.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2" data-testid="regiones-list">
            {regiones.map((r) => (
              <li
                key={r.regionInteresId}
                data-testid="region-row"
                className="inline-flex items-center gap-2 rounded-full border border-[#D1FAE5] bg-[#ECFDF5] py-1.5 pl-3 pr-1.5 text-sm font-medium text-[#047857]"
              >
                {r.stateName ?? `Estado ${r.stateId}`}
                <button
                  type="button"
                  onClick={() => handleDelete(r.regionInteresId)}
                  data-testid="delete-region-button"
                  aria-label={`Eliminar ${r.stateName ?? 'región'}`}
                  disabled={isMutating}
                  className="grid h-6 w-6 place-content-center rounded-full text-[#047857] hover:bg-[#A7F3D0] disabled:opacity-40"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Early alerts */}
      <section className="space-y-4 rounded-[14px] border border-[#E5E7EB] bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#101828]">Alertas tempranas</h2>
          <span className="inline-flex items-center rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-semibold text-[#92400E]">
            {filteredAlerts.length}
          </span>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, plaga o estado…"
            data-testid="alert-search-input"
            className="h-11 rounded-[10px] border border-[#D1D5DC] bg-white px-4 text-sm text-[#0A0A0A] placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/15 sm:flex-1"
          />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            data-testid="alert-region-filter"
            className="h-11 rounded-[10px] border border-[#D1D5DC] bg-white px-3 text-sm text-[#364153] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/15 sm:w-56"
          >
            <option value="todas">Todas las regiones</option>
            <option value="mis-regiones" disabled={regiones.length === 0}>
              Solo mis regiones
            </option>
            {alertStates.map((s) => (
              <option key={s.stateId} value={String(s.stateId)}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {SEVERITY_CHIPS.map((chip) => {
            const selected = severityFilter === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => setSeverityFilter(chip.value)}
                data-testid={`severity-chip-${chip.value}`}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  selected
                    ? 'border-[#00A63E] bg-[#00A63E] text-white'
                    : 'border-[#D1D5DC] bg-white text-[#475569] hover:bg-[#F3F4F6]'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Alerts list */}
        {alertsQuery.isLoading ? (
          <p className="text-sm text-[#6A7282]">Cargando alertas…</p>
        ) : alertsQuery.isError ? (
          <p data-testid="alerts-error" className="text-sm text-[#E7000B]">
            {alertsQuery.error instanceof Error
              ? alertsQuery.error.message
              : 'No se pudieron cargar las alertas.'}
          </p>
        ) : alerts.length === 0 ? (
          <p data-testid="alerts-empty" className="text-sm text-[#6A7282]">
            No hay alertas tempranas en los últimos 3 meses.
          </p>
        ) : filteredAlerts.length === 0 ? (
          <p data-testid="alerts-no-results" className="text-sm text-[#6A7282]">
            Ninguna alerta coincide con los filtros.
          </p>
        ) : (
          <ul className="flex flex-col gap-3" data-testid="early-alerts-list">
            {filteredAlerts.map((a) => (
              <AlertRow key={a.alertaId} alert={a} onClick={() => setDetailAlert(a)} />
            ))}
          </ul>
        )}
      </section>

      {detailAlert ? (
        <AlertDetailModal alert={detailAlert} onClose={() => setDetailAlert(null)} />
      ) : null}
    </main>
  );
}

export default RegionesInteresPanel;
