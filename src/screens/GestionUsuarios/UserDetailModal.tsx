import { useQuery } from '@tanstack/react-query';
import { getInitials } from '../../utils/getInitials';
import { roleBadgeClasses, roleIdToLabel } from './roleUtils';
import { getUserById, getFarmerByUserId } from '../../services/admin/users';

interface Props {
  userId: number;
  onClose: () => void;
}

const ROLE_FARMER = 2;
/** AccountStatusConstants from the backend (Status catalog). */
const STATUS_ACCEPTED  = 1;
const STATUS_REVISION  = 2;
const STATUS_REJECTED  = 3;

function farmerStatusBadge(statusId: number | null | undefined) {
  switch (statusId) {
    case STATUS_ACCEPTED:
      return { label: 'Aceptado', bg: 'bg-[#DCFCE7]', text: 'text-[#016630]', dot: 'bg-[#00C950]' };
    case STATUS_REVISION:
      return { label: 'En revisión', bg: 'bg-[#FEF9C3]', text: 'text-[#854D0E]', dot: 'bg-[#FACC15]' };
    case STATUS_REJECTED:
      return { label: 'Rechazado', bg: 'bg-[#FEF2F2]', text: 'text-[#B91C1C]', dot: 'bg-[#DC2626]' };
    default:
      return null;
  }
}

const LOCATION_ROWS = [
  ['Estado', 'stateName'],
  ['Municipio', 'municipalityName'],
  ['Localidad', 'localityName'],
  ['Propiedad', 'propertyName'],
] as const;

function UserDetailModal({ userId, onClose }: Props) {
  const { data: viewingUser, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    staleTime: 60 * 1000,
  });

  /** Only fetched for agricultores (roleId 2). Gives us statusId/statusName which
   *  GET /api/users/{id} does not return. Enabled only once the base user is loaded. */
  const { data: farmerStatus } = useQuery({
    queryKey: ['farmer', userId],
    queryFn: () => getFarmerByUserId(userId),
    enabled: viewingUser?.roleId === ROLE_FARMER,
    staleTime: 60 * 1000,
  });

  const statusBadge = farmerStatusBadge(farmerStatus?.statusId);
  const isRejected = farmerStatus?.statusId === STATUS_REJECTED;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8">
      <div
        className="w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6"
        data-testid="user-detail-modal"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#101828]">Detalle del Usuario</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
            className="grid h-9 w-9 place-content-center rounded-[10px] hover:bg-[#F3F4F6]"
          >
            ✕
          </button>
        </div>

        {isLoadingDetail || !viewingUser ? (
          <p className="py-8 text-center text-sm text-[#6A7282]">Cargando...</p>
        ) : (
          <div className="space-y-5">
            {/* Avatar + nombre */}
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-content-center rounded-full bg-[linear-gradient(135deg,#05DF72_0%,#00A63E_100%)] text-xl font-semibold text-white">
                {getInitials(viewingUser.name)}
              </div>
              <div>
                <p className="text-lg font-semibold text-[#101828]">{viewingUser.name}</p>
                <p className="text-sm text-[#4A5565]">{viewingUser.email}</p>
              </div>
            </div>

            {/* Rechazo banner */}
            {isRejected ? (
              <div className="flex items-start gap-2 rounded-[10px] bg-[#FEF2F2] p-3">
                <span className="mt-0.5 text-base">🚫</span>
                <p className="text-sm leading-5 text-[#B91C1C]">
                  Esta cuenta fue <strong>rechazada</strong>. El agricultor no puede iniciar sesión.
                  Para rehabilitarla, apruébala desde el panel de cuentas pendientes (cambia su estado en la BD a{' '}
                  <em>En revisión</em> primero).
                </p>
              </div>
            ) : null}

            {/* Info general */}
            <div className="space-y-3 rounded-[10px] border border-[#E5E7EB] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#6A7282]">Rol</span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${roleBadgeClasses(viewingUser.roleId)}`}
                >
                  {roleIdToLabel(viewingUser.roleId)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#6A7282]">Estado de cuenta</span>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                    viewingUser.isActive
                      ? 'bg-[#DCFCE7] text-[#016630]'
                      : 'bg-[#F3F4F6] text-[#1E2939]'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${viewingUser.isActive ? 'bg-[#00C950]' : 'bg-[#6A7282]'}`}
                  />
                  {viewingUser.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              {/* Approval status — only for farmers */}
              {statusBadge ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#6A7282]">Estado de revisión</span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusBadge.dot}`} />
                    {statusBadge.label}
                  </span>
                </div>
              ) : null}
            </div>

            {/* Ubicación */}
            {(viewingUser.roleId === 2 || viewingUser.roleId === 3) && viewingUser.location ? (
              <div className="space-y-3 rounded-lg border border-[#E5E7EB] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6A7282]">
                  Ubicación
                </p>
                {LOCATION_ROWS.map(([label, key]) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <span className="shrink-0 text-sm font-medium text-[#6A7282]">{label}</span>
                    <span className="truncate text-right text-sm text-[#101828]">
                      {viewingUser.location![key]}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-4">
                  <span className="shrink-0 text-sm font-medium text-[#6A7282]">Coordenadas</span>
                  <span className="truncate text-right font-mono text-xs text-[#4A5565]">
                    {viewingUser.location.latitude}, {viewingUser.location.longitude}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        )}

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

export default UserDetailModal;
