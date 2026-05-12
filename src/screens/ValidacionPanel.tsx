import { useState } from 'react';
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

type Tab = 'vigilancia' | 'alertas' | 'recomendaciones';

const TAB_LABELS: Record<Tab, string> = {
  vigilancia: 'Vigilancia Fitosanitaria',
  alertas: 'Alertas',
  recomendaciones: 'Recomendaciones',
};

// ---------------------------------------------------------------------------
// Empty state component
// ---------------------------------------------------------------------------
function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div
      data-testid="empty-state"
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">Sin registros</h3>
      <p className="mt-1 max-w-xs text-sm text-gray-500">
        No hay registros de {TAB_LABELS[tab].toLowerCase()} por el momento.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error state component
// ---------------------------------------------------------------------------
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      data-testid="error-state"
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50">
        <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">Error al cargar datos</h3>
      <p className="mt-1 max-w-xs text-sm text-gray-500">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 rounded-xl bg-indigo-50 px-5 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
      >
        Reintentar
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton grid
// ---------------------------------------------------------------------------
function SkeletonGrid() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <ValidationCardSkeleton key={i} />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------------
export default function ValidacionPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('vigilancia');
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roleId === 1;

  // Modal state — extended to carry domain-specific details for the modal
  const [selectedRecord, setSelectedRecord] = useState<{
    id: number;
    title: string;
    description?: string;
    type: Tab;
    details: RecordDetail[];
  } | null>(null);

  // Data hooks
  const {
    data: vigilancias,
    isLoading: loadingVig,
    isError: errorVig,
    error: vigError,
    refetch: refetchVig,
  } = useVigilancias();
  const {
    data: alertas,
    isLoading: loadingAlerts,
    isError: errorAlerts,
    error: alertsError,
    refetch: refetchAlerts,
  } = useAlertas();
  const {
    data: recomendaciones,
    isLoading: loadingRec,
    isError: errorRec,
    error: recError,
    refetch: refetchRec,
  } = useRecomendaciones();

  // Mutation hooks
  const validateVigilancia = useValidateVigilancia();
  const validateAlerta = useValidateAlerta();
  const validateRecomendacion = useValidateRecomendacion();

  // Toast
  const toast = useToast();

  // Pending counts for badge
  const pendingVig = vigilancias?.filter(
    (v) => v.statusName === 'Revisión' || v.statusName === 'Revision'
  ).length ?? 0;
  const pendingAlerts = alertas?.filter(
    (a) => a.statusName === 'Revisión' || a.statusName === 'Revision'
  ).length ?? 0;
  const pendingRec = recomendaciones?.filter(
    (r) => r.statusName === 'Revisión' || r.statusName === 'Revision'
  ).length ?? 0;

  const pendingByTab: Record<Tab, number> = {
    vigilancia: pendingVig,
    alertas: pendingAlerts,
    recomendaciones: pendingRec,
  };

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleValidateClick = (
    id: number,
    title: string,
    type: Tab,
    description: string | undefined,
    details: RecordDetail[]
  ) => {
    setSelectedRecord({ id, title, type, description, details });
  };

  const handleValidationAction = async (statusId: number) => {
    if (!selectedRecord) return;
    const actionLabel = statusId === 1 ? 'aprobado' : 'rechazado';

    try {
      const payload = { statusId };

      if (selectedRecord.type === 'vigilancia') {
        await validateVigilancia.mutateAsync({ id: selectedRecord.id, payload });
      } else if (selectedRecord.type === 'alertas') {
        await validateAlerta.mutateAsync({ id: selectedRecord.id, payload });
      } else if (selectedRecord.type === 'recomendaciones') {
        await validateRecomendacion.mutateAsync({ id: selectedRecord.id, payload });
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

  const isSubmitting =
    validateVigilancia.isPending || validateAlerta.isPending || validateRecomendacion.isPending;

  // ---------------------------------------------------------------------------
  // Tab configuration
  // ---------------------------------------------------------------------------
  const tabs: Tab[] = ['vigilancia', 'alertas', 'recomendaciones'];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="flex h-full flex-col p-6 font-sans lg:p-10" data-testid="validacion-panel">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
            <SidebarIcon icon="validacion" className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Validación de Registros</h1>
            <p className="text-sm text-gray-500">
              Revisa y aprueba los reportes de plagas, alertas y recomendaciones.
            </p>
          </div>
        </div>

        {/* Tabs with badges */}
        <div className="mt-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" data-testid="validation-tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              const pending = pendingByTab[tab];

              return (
                <button
                  key={tab}
                  data-testid={`tab-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className={`relative whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {TAB_LABELS[tab]}

                  {pending > 0 && (
                    <span
                      data-testid={`tab-badge-${tab}`}
                      className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {pending}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto pb-8">
        {/* Read-only banner */}
        {!isAdmin && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <svg className="h-5 w-5 shrink-0 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">Modo de sólo lectura</h3>
              <p className="text-sm text-yellow-700">
                No tienes permisos de administrador para validar registros.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {/* ---- VIGILANCIA ---- */}
          {activeTab === 'vigilancia' && loadingVig && <SkeletonGrid />}
          {activeTab === 'vigilancia' && errorVig && (
            <ErrorState
              message={vigError?.message ?? 'No se pudieron cargar los registros de vigilancia.'}
              onRetry={() => refetchVig()}
            />
          )}
          {activeTab === 'vigilancia' &&
            !loadingVig &&
            !errorVig &&
            vigilancias?.length === 0 && <EmptyState tab="vigilancia" />}
          {activeTab === 'vigilancia' &&
            vigilancias?.map((v) => (
              <ValidationCard
                key={v.vigilanciaId}
                title={`Vigilancia: ${v.tipoPlaga}`}
                typeLabel="Vigilancia Fitosanitaria"
                statusName={v.statusName}
                date={v.createdAt}
                reporterId={v.reportedByUserId}
                description={v.descripcion}
                validatedAt={v.validatedAt}
                onValidateClick={
                  isAdmin
                    ? () =>
                        handleValidateClick(
                          v.vigilanciaId,
                          `Vigilancia: ${v.tipoPlaga}`,
                          'vigilancia',
                          v.descripcion,
                          [
                            { label: 'Tipo de Plaga', value: v.tipoPlaga },
                            { label: 'Incidencia', value: `${v.incidencia}%` },
                            { label: 'Severidad', value: v.severidad },
                            { label: 'Ubicación ID', value: v.ubicacionId },
                          ]
                        )
                    : undefined
                }
              >
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    Incidencia: {v.incidencia}%
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-700/10">
                    Severidad: {v.severidad}
                  </span>
                </div>
              </ValidationCard>
            ))}

          {/* ---- ALERTAS ---- */}
          {activeTab === 'alertas' && loadingAlerts && <SkeletonGrid />}
          {activeTab === 'alertas' && errorAlerts && (
            <ErrorState
              message={alertsError?.message ?? 'No se pudieron cargar las alertas.'}
              onRetry={() => refetchAlerts()}
            />
          )}
          {activeTab === 'alertas' &&
            !loadingAlerts &&
            !errorAlerts &&
            alertas?.length === 0 && <EmptyState tab="alertas" />}
          {activeTab === 'alertas' &&
            alertas?.map((a) => (
              <ValidationCard
                key={a.alertaId}
                title={a.titulo}
                typeLabel="Alerta"
                statusName={a.statusName}
                date={a.createdAt}
                reporterId={a.reportedByUserId}
                description={a.descripcion}
                validatedAt={a.validatedAt}
                onValidateClick={
                  isAdmin
                    ? () =>
                        handleValidateClick(a.alertaId, a.titulo, 'alertas', a.descripcion, [
                          { label: 'Tipo de Plaga', value: a.tipoPlaga },
                          { label: 'Hectáreas', value: a.hectareas },
                          {
                            label: 'Severidad',
                            value:
                              a.severidad === 'critico'
                                ? '🔴 Crítico'
                                : a.severidad === 'advertencia'
                                ? '🟡 Advertencia'
                                : '🔵 Información',
                          },
                          { label: 'Ubicación ID', value: a.ubicacionId },
                        ])
                    : undefined
                }
              >
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                    {a.tipoPlaga}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      a.severidad === 'critico'
                        ? 'bg-red-50 text-red-700 ring-red-600/10'
                        : a.severidad === 'advertencia'
                        ? 'bg-amber-50 text-amber-700 ring-amber-600/10'
                        : 'bg-sky-50 text-sky-700 ring-sky-600/10'
                    }`}
                  >
                    {a.severidad === 'critico'
                      ? 'Crítico'
                      : a.severidad === 'advertencia'
                      ? 'Advertencia'
                      : 'Información'}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                    {a.hectareas} ha
                  </span>
                </div>
              </ValidationCard>
            ))}

          {/* ---- RECOMENDACIONES ---- */}
          {activeTab === 'recomendaciones' && loadingRec && <SkeletonGrid />}
          {activeTab === 'recomendaciones' && errorRec && (
            <ErrorState
              message={recError?.message ?? 'No se pudieron cargar las recomendaciones.'}
              onRetry={() => refetchRec()}
            />
          )}
          {activeTab === 'recomendaciones' &&
            !loadingRec &&
            !errorRec &&
            recomendaciones?.length === 0 && <EmptyState tab="recomendaciones" />}
          {activeTab === 'recomendaciones' &&
            recomendaciones?.map((r) => (
              <ValidationCard
                key={r.recomendacionId}
                title={r.titulo}
                typeLabel="Recomendación"
                statusName={r.statusName}
                date={r.createdAt}
                reporterId={r.reportedByUserId}
                description={r.descripcion}
                validatedAt={r.validatedAt}
                onValidateClick={
                  isAdmin
                    ? () =>
                        handleValidateClick(
                          r.recomendacionId,
                          r.titulo,
                          'recomendaciones',
                          r.descripcion,
                          [
                            { label: 'Tipo de Plaga', value: r.tipoPlaga },
                            {
                              label: 'Productos Recomendados',
                              value: r.productosRecomendados,
                            },
                          ]
                        )
                    : undefined
                }
              >
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-700/10">
                    {r.tipoPlaga}
                  </span>
                  {r.productosRecomendados && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                      💊 {r.productosRecomendados}
                    </span>
                  )}
                </div>
              </ValidationCard>
            ))}
        </div>
      </div>

      {/* Validation Modal */}
      <AdminValidationModal
        isOpen={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
        title={selectedRecord?.title ?? ''}
        typeLabel={
          selectedRecord?.type === 'vigilancia'
            ? 'Vigilancia'
            : selectedRecord?.type === 'alertas'
            ? 'Alerta'
            : 'Recomendación'
        }
        recordId={selectedRecord?.id ?? 0}
        description={selectedRecord?.description}
        details={selectedRecord?.details}
        isSubmitting={isSubmitting}
        onAccept={() => handleValidationAction(1)}
        onReject={() => handleValidationAction(3)}
      />

      {/* Toast Notifications */}
      <ToastContainer messages={toast.messages} onDismiss={toast.dismissToast} />
    </div>
  );
}
