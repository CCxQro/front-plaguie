import { useMemo, useState } from 'react';
import { SidebarIcon } from '../components/Sidebar/SidebarIcons';
import useAuthStore from '../services/Contexts/useAuthStore';
import { useVigilancias, useValidateVigilancia } from '../hooks/useVigilancia';
import { useAlertas, useValidateAlerta } from '../hooks/useAlertas';
import { useRecomendaciones, useValidateRecomendacion } from '../hooks/useRecomendaciones';
import { ValidationCard } from '../components/ValidationCard/ValidationCard';
import { ValidationCardSkeleton } from '../components/ValidationCard/ValidationCardSkeleton';
import { AdminValidationModal } from '../components/AdminValidationModal/AdminValidationModal';
import type { RecordDetail } from '../components/AdminValidationModal/AdminValidationModal';
import { ToastContainer } from '../components/Toast/Toast';
import { useToast } from '../hooks/useToast';
import type { AlertaDto } from '../services/alertas/alertasService';
import type { RecomendacionDto } from '../services/recomendaciones/recomendacionesService';
import type { VigilanciaFitosanitariaDto } from '../services/vigilancia/vigilanciaService';

type Tab = 'vigilancia' | 'alertas' | 'recomendaciones';
type StatusBucket = 'pending' | 'accepted' | 'rejected';

interface ValidationRecord {
  id?: number;
  type: Tab;
  title: string;
  typeLabel: string;
  statusId: number;
  statusName: string;
  date?: string;
  reporterId?: number;
  description?: string;
  validatedByUserId?: number;
  validatedAt?: string;
  details: RecordDetail[];
  chips: Array<{ label: string; tone: 'emerald' | 'sky' | 'amber' | 'red' | 'slate' }>;
}

const TAB_LABELS: Record<Tab, string> = {
  vigilancia: 'Vigilancia Fitosanitaria',
  alertas: 'Alertas',
  recomendaciones: 'Recomendaciones',
};

const TAB_DESCRIPTIONS: Record<Tab, string> = {
  vigilancia: 'Monitoreos reportados en campo y datos fitosanitarios asociados.',
  alertas: 'Alertas de plaga que requieren control de calidad administrativo.',
  recomendaciones: 'Sugerencias de tratamiento listas para revisión.',
};

const TABS: Tab[] = ['vigilancia', 'alertas', 'recomendaciones'];

const STATUS_LABELS: Record<number, string> = {
  1: 'Accepted',
  2: 'Revision',
  3: 'Rejected',
};

const CHIP_CLASSES: Record<ValidationRecord['chips'][number]['tone'], string> = {
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  sky: 'bg-sky-50 text-sky-700 ring-sky-600/10',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  red: 'bg-red-50 text-red-700 ring-red-600/10',
  slate: 'bg-slate-100 text-slate-700 ring-slate-600/10',
};

function formatValue(value: unknown): string | number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : value.toFixed(2);
  }
  return String(value);
}

function statusBucket(statusId: number, statusName?: string): StatusBucket {
  const normalized = statusName?.trim().toLowerCase();
  if (statusId === 1 || normalized === 'accepted' || normalized === 'aceptado') return 'accepted';
  if (statusId === 3 || normalized === 'rejected' || normalized === 'rechazado') return 'rejected';
  return 'pending';
}

function normalizeStatusName(statusId: number, statusName?: string): string {
  return statusName || STATUS_LABELS[statusId] || 'Revision';
}

function normalizeVigilancia(v: VigilanciaFitosanitariaDto): ValidationRecord {
  const title = v.plagueName ? `Vigilancia: ${v.plagueName}` : 'Vigilancia fitosanitaria';
  const coordinates =
    v.latitude !== undefined && v.longitude !== undefined
      ? `${formatValue(v.latitude)}, ${formatValue(v.longitude)}`
      : undefined;

  return {
    id: v.vigilanciaFitosanitariaId,
    type: 'vigilancia',
    title,
    typeLabel: 'Vigilancia',
    statusId: v.statusId,
    statusName: normalizeStatusName(v.statusId, v.statusName),
    date: v.validatedAt,
    validatedByUserId: v.validatedByUserId,
    validatedAt: v.validatedAt,
    description: v.systemMonitoringName
      ? `Monitoreo registrado mediante ${v.systemMonitoringName.toLowerCase()}.`
      : 'Registro de vigilancia fitosanitaria pendiente de clasificación administrativa.',
    details: [
      { label: 'Plaga', value: v.plagueName },
      { label: 'Sistema', value: v.systemMonitoringName },
      { label: 'Clave', value: v.identificationKeyName },
      { label: 'Hospedante', value: v.hostName },
      { label: 'Variedad', value: v.varietyName },
      { label: 'Especie', value: v.speciesName },
      { label: 'AHOSP', value: formatValue(v.ahosp) },
      { label: 'Ubicación', value: v.locationId },
      { label: 'Coordenadas', value: coordinates },
    ],
    chips: [
      { label: v.plagueName || 'Plaga sin nombre', tone: 'sky' },
      { label: v.hostName || 'Hospedante no definido', tone: 'emerald' },
      { label: v.ahosp !== undefined ? `AHOSP ${formatValue(v.ahosp)}` : 'AHOSP no definido', tone: 'amber' },
    ],
  };
}

function normalizeAlerta(a: AlertaDto): ValidationRecord {
  return {
    id: a.alertaId,
    type: 'alertas',
    title: a.titulo,
    typeLabel: 'Alerta',
    statusId: a.statusId,
    statusName: normalizeStatusName(a.statusId, a.statusName),
    date: a.createdAt,
    reporterId: a.reportedByUserId,
    description: a.descripcion,
    validatedByUserId: a.validatedByUserId,
    validatedAt: a.validatedAt,
    details: [
      { label: 'Tipo de Plaga', value: a.tipoPlaga },
      { label: 'Hectáreas', value: formatValue(a.hectareas) },
      { label: 'Severidad', value: a.severidad },
      { label: 'Ubicación', value: a.ubicacionId },
    ],
    chips: [
      { label: a.tipoPlaga, tone: 'sky' },
      { label: severityLabel(a.severidad), tone: severityTone(a.severidad) },
      { label: `${formatValue(a.hectareas) ?? 0} ha`, tone: 'emerald' },
    ],
  };
}

function normalizeRecomendacion(r: RecomendacionDto): ValidationRecord {
  return {
    id: r.recomendacionId,
    type: 'recomendaciones',
    title: r.titulo,
    typeLabel: 'Recomendación',
    statusId: r.statusId,
    statusName: normalizeStatusName(r.statusId, r.statusName),
    date: r.createdAt,
    reporterId: r.reportedByUserId,
    description: r.descripcion,
    validatedByUserId: r.validatedByUserId,
    validatedAt: r.validatedAt,
    details: [
      { label: 'Tipo de Plaga', value: r.tipoPlaga },
      { label: 'Productos', value: r.productosRecomendados },
    ],
    chips: [
      { label: r.tipoPlaga, tone: 'sky' },
      { label: r.productosRecomendados, tone: 'emerald' },
    ],
  };
}

function severityLabel(severity: string): string {
  if (severity === 'critico') return 'Crítico';
  if (severity === 'advertencia') return 'Advertencia';
  return 'Información';
}

function severityTone(severity: string): ValidationRecord['chips'][number]['tone'] {
  if (severity === 'critico') return 'red';
  if (severity === 'advertencia') return 'amber';
  return 'sky';
}

function countByStatus(records: ValidationRecord[], bucket: StatusBucket): number {
  return records.filter((record) => statusBucket(record.statusId, record.statusName) === bucket).length;
}

function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div
      data-testid="empty-state"
      className="col-span-full flex min-h-[340px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"
    >
      <div className="grid h-16 w-16 place-items-center rounded-xl bg-slate-100 text-slate-400">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.63a3.38 3.38 0 00-3.38-3.37h-1.5a1.13 1.13 0 01-1.12-1.13v-1.5a3.38 3.38 0 00-3.38-3.37H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.63c-.62 0-1.13.5-1.13 1.13v17.24c0 .63.5 1.13 1.13 1.13h12.74c.63 0 1.13-.5 1.13-1.13V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-950">Sin registros</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
        No hay registros de {TAB_LABELS[tab].toLowerCase()} para revisar en este momento.
      </p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      data-testid="error-state"
      className="col-span-full flex min-h-[340px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center"
    >
      <div className="grid h-16 w-16 place-items-center rounded-xl bg-white text-red-500 ring-1 ring-inset ring-red-100">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.3 3.38c-.87 1.5.21 3.37 1.94 3.37h14.72c1.73 0 2.81-1.87 1.94-3.37L13.95 3.38c-.87-1.5-3.03-1.5-3.9 0L2.7 16.13zM12 15.75h.01v.01H12v-.01z" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-950">Error al cargar datos</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-600">{message}</p>
      <button
        onClick={onRetry}
        className="mt-5 rounded-lg bg-red-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-red-500"
      >
        Reintentar
      </button>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <ValidationCardSkeleton key={i} />
      ))}
    </>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'slate' | 'amber' | 'emerald' | 'red';
}) {
  const toneClasses = {
    slate: 'bg-slate-950 text-white',
    amber: 'bg-amber-500 text-white',
    emerald: 'bg-emerald-600 text-white',
    red: 'bg-red-600 text-white',
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`inline-flex rounded-lg px-2 py-1 text-xs font-bold ${toneClasses[tone]}`}>
        {label}
      </div>
      <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function RecordChips({ chips }: { chips: ValidationRecord['chips'] }) {
  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {chips.map((chip) => (
        <span
          key={`${chip.label}-${chip.tone}`}
          className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${CHIP_CLASSES[chip.tone]}`}
        >
          {chip.label}
        </span>
      ))}
    </div>
  );
}

export default function ValidacionPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('vigilancia');
  const [selectedRecord, setSelectedRecord] = useState<ValidationRecord | null>(null);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roleId === 1;

  const {
    data: vigilancias = [],
    isLoading: loadingVig,
    isError: errorVig,
    error: vigError,
    refetch: refetchVig,
  } = useVigilancias();
  const {
    data: alertas = [],
    isLoading: loadingAlerts,
    isError: errorAlerts,
    error: alertsError,
    refetch: refetchAlerts,
  } = useAlertas();
  const {
    data: recomendaciones = [],
    isLoading: loadingRec,
    isError: errorRec,
    error: recError,
    refetch: refetchRec,
  } = useRecomendaciones();

  const validateVigilancia = useValidateVigilancia();
  const validateAlerta = useValidateAlerta();
  const validateRecomendacion = useValidateRecomendacion();
  const toast = useToast();

  const recordsByTab = useMemo<Record<Tab, ValidationRecord[]>>(
    () => ({
      vigilancia: vigilancias.map(normalizeVigilancia),
      alertas: alertas.map(normalizeAlerta),
      recomendaciones: recomendaciones.map(normalizeRecomendacion),
    }),
    [alertas, recomendaciones, vigilancias]
  );

  const allRecords = useMemo(
    () => [...recordsByTab.vigilancia, ...recordsByTab.alertas, ...recordsByTab.recomendaciones],
    [recordsByTab]
  );

  const activeRecords = recordsByTab[activeTab];
  const pendingByTab = useMemo(
    () =>
      TABS.reduce(
        (acc, tab) => ({
          ...acc,
          [tab]: countByStatus(recordsByTab[tab], 'pending'),
        }),
        {} as Record<Tab, number>
      ),
    [recordsByTab]
  );

  const isSubmitting =
    validateVigilancia.isPending || validateAlerta.isPending || validateRecomendacion.isPending;

  const handleValidationAction = async (statusId: number) => {
    if (!selectedRecord) return;
    const id = selectedRecord.id;

    if (typeof id !== 'number' || !Number.isFinite(id) || id <= 0) {
      toast.error(
        'Registro sin ID válido',
        'No se envió la validación porque el registro no tiene un identificador numérico.'
      );
      return;
    }

    const actionLabel = statusId === 1 ? 'aprobado' : 'rechazado';
    const payload = { statusId };

    try {
      if (selectedRecord.type === 'vigilancia') {
        await validateVigilancia.mutateAsync({ id, payload });
      } else if (selectedRecord.type === 'alertas') {
        await validateAlerta.mutateAsync({ id, payload });
      } else {
        await validateRecomendacion.mutateAsync({ id, payload });
      }

      setSelectedRecord(null);
      toast.success(
        `Registro ${actionLabel}`,
        `"${selectedRecord.title}" ha sido ${actionLabel} correctamente.`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      toast.error('Error al validar', message);
    }
  };

  const loadingByTab: Record<Tab, boolean> = {
    vigilancia: loadingVig,
    alertas: loadingAlerts,
    recomendaciones: loadingRec,
  };
  const errorByTab: Record<Tab, { hasError: boolean; message: string; retry: () => void }> = {
    vigilancia: {
      hasError: errorVig,
      message: vigError?.message ?? 'No se pudieron cargar los registros de vigilancia.',
      retry: () => void refetchVig(),
    },
    alertas: {
      hasError: errorAlerts,
      message: alertsError?.message ?? 'No se pudieron cargar las alertas.',
      retry: () => void refetchAlerts(),
    },
    recomendaciones: {
      hasError: errorRec,
      message: recError?.message ?? 'No se pudieron cargar las recomendaciones.',
      retry: () => void refetchRec(),
    },
  };

  return (
    <div className="flex h-full flex-col bg-slate-50 p-5 font-sans lg:p-8" data-testid="validacion-panel">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <SidebarIcon icon="validacion" className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 lg:text-3xl">
                Validación de Registros
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Consola administrativa para revisar, aprobar y rechazar registros de plagas,
                alertas y recomendaciones antes de publicarlos en el sistema.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[520px]">
            <MetricCard label="Actual" value={activeRecords.length} tone="slate" />
            <MetricCard label="Pendientes" value={countByStatus(allRecords, 'pending')} tone="amber" />
            <MetricCard label="Aprobados" value={countByStatus(allRecords, 'accepted')} tone="emerald" />
            <MetricCard label="Rechazados" value={countByStatus(allRecords, 'rejected')} tone="red" />
          </div>
        </div>

        <div className="mt-7 grid gap-3 lg:grid-cols-3" data-testid="validation-tabs">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            const total = recordsByTab[tab].length;

            return (
              <button
                key={tab}
                data-testid={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  isActive
                    ? 'border-emerald-300 bg-emerald-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-sm font-black ${isActive ? 'text-emerald-900' : 'text-slate-900'}`}>
                    {TAB_LABELS[tab]}
                  </span>
                  <span
                    data-testid={`tab-badge-${tab}`}
                    className={`rounded-full px-2 py-1 text-xs font-black ${
                      pendingByTab[tab] > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {pendingByTab[tab]} pendientes
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-600">{TAB_DESCRIPTIONS[tab]}</p>
                <p className="mt-3 text-xs font-bold text-slate-500">{total} registros totales</p>
              </button>
            );
          })}
        </div>
      </div>

      {!isAdmin && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <svg className="h-5 w-5 shrink-0 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.49 2.5c.67-1.17 2.35-1.17 3.02 0l6.28 10.87c.68 1.17-.17 2.63-1.51 2.63H3.72c-1.35 0-2.19-1.46-1.52-2.63L8.49 2.5zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-sm font-bold text-amber-900">Modo de solo lectura</h3>
            <p className="text-sm text-amber-800">
              No tienes permisos de administrador para validar registros.
            </p>
          </div>
        </div>
      )}

      <div className="mt-5 flex-1 overflow-auto pb-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {loadingByTab[activeTab] && <SkeletonGrid />}

          {!loadingByTab[activeTab] && errorByTab[activeTab].hasError && (
            <ErrorState
              message={errorByTab[activeTab].message}
              onRetry={errorByTab[activeTab].retry}
            />
          )}

          {!loadingByTab[activeTab] &&
            !errorByTab[activeTab].hasError &&
            activeRecords.length === 0 && <EmptyState tab={activeTab} />}

          {!loadingByTab[activeTab] &&
            !errorByTab[activeTab].hasError &&
            activeRecords.map((record, index) => (
              <ValidationCard
                key={`${record.type}-${record.id ?? index}`}
                recordId={record.id}
                title={record.title}
                typeLabel={record.typeLabel}
                statusName={record.statusName}
                date={record.date ?? ''}
                reporterId={record.reporterId}
                description={record.description}
                validatedByName={
                  record.validatedByUserId ? `Usuario #${record.validatedByUserId}` : undefined
                }
                validatedAt={record.validatedAt}
                onValidateClick={isAdmin ? () => setSelectedRecord(record) : undefined}
              >
                <RecordChips chips={record.chips} />
              </ValidationCard>
            ))}
        </div>
      </div>

      <AdminValidationModal
        isOpen={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
        title={selectedRecord?.title ?? ''}
        typeLabel={selectedRecord?.typeLabel ?? 'Registro'}
        recordId={selectedRecord?.id ?? 0}
        description={selectedRecord?.description}
        details={selectedRecord?.details}
        isSubmitting={isSubmitting}
        onAccept={() => handleValidationAction(1)}
        onReject={() => handleValidationAction(3)}
      />

      <ToastContainer messages={toast.messages} onDismiss={toast.dismissToast} />
    </div>
  );
}
