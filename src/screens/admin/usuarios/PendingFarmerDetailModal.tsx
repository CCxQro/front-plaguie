import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getInitials } from '../../../utils/getInitials';
import { getUserById, approveFarmer, rejectFarmer } from '../../../services/admin/users';
import type { PendingFarmer } from '../../../types/DataUser';

interface Props {
  farmer: PendingFarmer;
  onClose: () => void;
}

const LOCATION_ROWS = [
  ['Estado', 'stateName'],
  ['Municipio', 'municipalityName'],
  ['Localidad', 'localityName'],
  ['Propiedad', 'propertyName'],
] as const;

function PendingFarmerDetailModal({ farmer, onClose }: Props) {
  const queryClient = useQueryClient();
  const userId = farmer.user?.userId;

  const { data: detail, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId!),
    enabled: userId != null,
    staleTime: 60 * 1000,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['pendingFarmers'] });
    void queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const approveMutation = useMutation({
    mutationFn: () => approveFarmer(userId!),
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectFarmer(userId!),
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });

  const isMutating = approveMutation.isPending || rejectMutation.isPending;
  const mutationError = approveMutation.error ?? rejectMutation.error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8">
      <div
        className="w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        data-testid="pending-farmer-detail-modal"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#101828]">Detalle del Agricultor</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
            className="grid h-9 w-9 place-content-center rounded-[10px] hover:bg-[#F3F4F6]"
          >
            ✕
          </button>
        </div>

        {isLoading || !detail ? (
          <p className="py-8 text-center text-sm text-[#6A7282]">Cargando información...</p>
        ) : (
          <div className="space-y-5">
            {/* Avatar + nombre + IDs */}
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-content-center rounded-full bg-[linear-gradient(135deg,#FDE047_0%,#F59E0B_100%)] text-xl font-semibold text-white">
                {getInitials(detail.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-[#101828]">{detail.name}</p>
                <p className="truncate text-sm text-[#4A5565]">{detail.email}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-[#F3F4F6] px-2 py-0.5 font-mono text-xs font-medium text-[#4A5565]">
                    #U{detail.userId}
                  </span>
                  <span className="rounded-md bg-[#FEF9C3] px-2 py-0.5 font-mono text-xs font-medium text-[#854D0E]">
                    #F{farmer.farmerId}
                  </span>
                </div>
              </div>
            </div>

            {/* Info general */}
            <div className="space-y-3 rounded-[10px] border border-[#E5E7EB] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6A7282]">
                Información general
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#6A7282]">Rol</span>
                <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-medium text-[#1D4ED8]">
                  Agricultor
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#6A7282]">Estado de cuenta</span>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                    detail.isActive
                      ? 'bg-[#DCFCE7] text-[#016630]'
                      : 'bg-[#F3F4F6] text-[#1E2939]'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      detail.isActive ? 'bg-[#00C950]' : 'bg-[#6A7282]'
                    }`}
                  />
                  {detail.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              {farmer.statusName ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#6A7282]">Estado de revisión</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF9C3] px-3 py-1 text-xs font-medium text-[#854D0E]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FACC15]" />
                    {farmer.statusName}
                  </span>
                </div>
              ) : null}
            </div>

            {/* Ubicación */}
            {detail.location ? (
              <div className="space-y-3 rounded-[10px] border border-[#E5E7EB] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6A7282]">
                  Ubicación
                </p>

                {LOCATION_ROWS.map(([label, key]) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <span className="shrink-0 text-sm font-medium text-[#6A7282]">{label}</span>
                    <span className="truncate text-right text-sm text-[#101828]">
                      {detail.location![key]}
                    </span>
                  </div>
                ))}

                <div className="flex items-center justify-between gap-4">
                  <span className="shrink-0 text-sm font-medium text-[#6A7282]">Coordenadas</span>
                  <span className="truncate text-right font-mono text-xs text-[#4A5565]">
                    {detail.location.latitude.toFixed(6)}, {detail.location.longitude.toFixed(6)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="rounded-[10px] border border-dashed border-[#E5E7EB] p-4 text-center text-sm text-[#6A7282]">
                Sin información de ubicación registrada
              </p>
            )}
          </div>
        )}

        {mutationError ? (
          <p className="mt-4 text-sm text-[#E7000B]">
            {mutationError instanceof Error
              ? mutationError.message
              : 'Error al procesar la solicitud'}
          </p>
        ) : null}

        {/* Acciones */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isMutating}
            className="h-10.5 flex-1 rounded-[10px] border border-[#D1D5DC] text-sm font-medium text-[#364153] hover:bg-[#F9FAFB] disabled:opacity-40"
          >
            Cerrar
          </button>
          <button
            type="button"
            data-testid="detail-reject-button"
            onClick={() => rejectMutation.mutate()}
            disabled={isMutating || userId == null}
            className="h-10.5 flex-1 rounded-[10px] border border-[#E7000B] text-sm font-medium text-[#E7000B] hover:bg-[#FEF2F2] disabled:opacity-50"
          >
            {rejectMutation.isPending ? 'Rechazando…' : 'Rechazar'}
          </button>
          <button
            type="button"
            data-testid="detail-approve-button"
            onClick={() => approveMutation.mutate()}
            disabled={isMutating || userId == null}
            className="h-10.5 flex-1 rounded-[10px] bg-[#00A63E] text-sm font-medium text-white hover:bg-[#008c35] disabled:opacity-50"
          >
            {approveMutation.isPending ? 'Aprobando…' : 'Aprobar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PendingFarmerDetailModal;
