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

function AlertCard({ alert }: { alert: EarlyAlert }) {
  const s = severityStyle(alert.severidad);
  return (
    <li
      data-testid="early-alert-row"
      className="flex flex-col gap-2 rounded-[10px] border border-[#E5E7EB] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
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
        {alert.descripcion ? (
          <p className="mt-1 text-sm text-[#6A7282]">{alert.descripcion}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full bg-[#F3F4F6] px-2.5 py-1 text-xs font-medium text-[#4A5565]">
          {alert.tipoPlaga}
        </span>
        {alert.hectareas != null ? (
          <span className="text-xs text-[#6A7282]">{alert.hectareas} ha</span>
        ) : null}
      </div>
    </li>
  );
}

function RegionesInteresPanel() {
  const [selectedState, setSelectedState] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const regionesQuery = useRegionesInteres();
  const statesQuery = useStates();
  const alertsQuery = useEarlyAlerts();
  const addMutation = useAddRegionInteres();
  const deleteMutation = useDeleteRegionInteres();

  const regiones = regionesQuery.data ?? [];
  const alerts = alertsQuery.data ?? [];

  // States not yet configured by the seller.
  const availableStates = useMemo(() => {
    const used = new Set((regionesQuery.data ?? []).map((r) => r.stateId));
    return (statesQuery.data ?? []).filter((s) => !used.has(s.stateId));
  }, [regionesQuery.data, statesQuery.data]);

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
          Configura los estados que te interesan y recibe alertas tempranas de plagas en ellos.
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

        {/* Configured regions list */}
        {regionesQuery.isLoading ? (
          <p className="text-sm text-[#6A7282]">Cargando regiones…</p>
        ) : regiones.length === 0 ? (
          <p data-testid="regiones-empty" className="text-sm text-[#6A7282]">
            Aún no has configurado regiones de interés.
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
          {alerts.length > 0 ? (
            <span className="inline-flex items-center rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-semibold text-[#92400E]">
              {alerts.length}
            </span>
          ) : null}
        </div>

        {regiones.length === 0 ? (
          <p data-testid="alerts-need-regions" className="text-sm text-[#6A7282]">
            Configura al menos una región de interés para ver alertas tempranas.
          </p>
        ) : alertsQuery.isLoading ? (
          <p className="text-sm text-[#6A7282]">Cargando alertas…</p>
        ) : alertsQuery.isError ? (
          <p data-testid="alerts-error" className="text-sm text-[#E7000B]">
            {alertsQuery.error instanceof Error
              ? alertsQuery.error.message
              : 'No se pudieron cargar las alertas.'}
          </p>
        ) : alerts.length === 0 ? (
          <p data-testid="alerts-empty" className="text-sm text-[#6A7282]">
            No hay alertas tempranas en tus regiones por ahora.
          </p>
        ) : (
          <ul className="flex flex-col gap-3" data-testid="early-alerts-list">
            {alerts.map((a) => (
              <AlertCard key={a.alertaId} alert={a} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default RegionesInteresPanel;
