import { useMemo, useState } from 'react';

import { useNearbyAlerts } from '../../hooks/useNearbyAlerts';
import type { EarlyAlert } from '../../types/EarlyAlert';

const RADIUS_OPTIONS = [50, 100, 200];
const DEFAULT_RADIUS = 100;

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

function formatDistance(km: number | null | undefined) {
  if (km == null) return '—';
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
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
            <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-xs font-medium text-[#4A5565]">
              {alert.tipoPlaga}
            </span>
            {alert.stateName ? <span className="text-xs">📍 {alert.stateName}</span> : null}
            <span className="text-xs">{formatDate(alert.createdAt)}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span
            data-testid="alert-distance"
            className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-xs font-semibold text-[#047857]"
          >
            {formatDistance(alert.distanceKm)}
          </span>
          <span className="text-sm font-medium text-[#155DFC]">Ver detalle →</span>
        </div>
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
            <dt className="text-sm font-medium text-[#6A7282]">Distancia</dt>
            <dd className="text-sm font-semibold text-[#047857]">{formatDistance(alert.distanceKm)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm font-medium text-[#6A7282]">Estado</dt>
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

function AlertasCercanasPanel() {
  const [radioKm, setRadioKm] = useState(DEFAULT_RADIUS);
  const [severityFilter, setSeverityFilter] = useState('todas');
  const [search, setSearch] = useState('');
  const [detailAlert, setDetailAlert] = useState<EarlyAlert | null>(null);

  const alertsQuery = useNearbyAlerts(radioKm);
  const alerts = useMemo(() => alertsQuery.data ?? [], [alertsQuery.data]);

  const noLocation =
    alertsQuery.isError && /ubicaci[oó]n/i.test(alertsQuery.error?.message ?? '');

  const filteredAlerts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return alerts.filter((a) => {
      if (severityFilter !== 'todas' && a.severidad !== severityFilter) return false;
      if (term) {
        const haystack = `${a.titulo} ${a.tipoPlaga} ${a.stateName ?? ''}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [alerts, severityFilter, search]);

  return (
    <main
      data-testid="alertas-cercanas-panel"
      className="min-h-full space-y-6 bg-[#F9FAFB] p-6 font-sans"
    >
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-[#101828]">Alertas cercanas</h1>
        <p className="text-sm text-[#6B7280]">
          Alertas tempranas de plagas validadas (últimos 3 meses) dentro del radio elegido desde tu
          ubicación.
        </p>
      </header>

      <section className="space-y-4 rounded-[14px] border border-[#E5E7EB] bg-white p-5">
        {/* Radius + count */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#6A7282]">Radio:</span>
            {RADIUS_OPTIONS.map((option) => {
              const selected = radioKm === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRadioKm(option)}
                  data-testid={`radius-option-${option}`}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    selected
                      ? 'border-[#00A63E] bg-[#00A63E] text-white'
                      : 'border-[#D1D5DC] bg-white text-[#475569] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {option} km
                </button>
              );
            })}
          </div>
          <span className="inline-flex items-center self-start rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-semibold text-[#92400E]">
            {filteredAlerts.length} alerta{filteredAlerts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Search + severity */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, plaga o estado…"
            data-testid="alert-search-input"
            className="h-11 rounded-[10px] border border-[#D1D5DC] bg-white px-4 text-sm text-[#0A0A0A] placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/15 sm:flex-1"
          />
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
        </div>

        {/* List */}
        {alertsQuery.isLoading ? (
          <p className="text-sm text-[#6A7282]">Cargando alertas…</p>
        ) : noLocation ? (
          <p data-testid="alerts-no-location" className="text-sm text-[#B45309]">
            No tienes una ubicación configurada en tu perfil, por lo que no se pueden calcular
            alertas cercanas.
          </p>
        ) : alertsQuery.isError ? (
          <p data-testid="alerts-error" className="text-sm text-[#E7000B]">
            {alertsQuery.error?.message ?? 'No se pudieron cargar las alertas.'}
          </p>
        ) : alerts.length === 0 ? (
          <p data-testid="alerts-empty" className="text-sm text-[#6A7282]">
            No hay alertas tempranas a {radioKm} km en los últimos 3 meses.
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

export default AlertasCercanasPanel;
