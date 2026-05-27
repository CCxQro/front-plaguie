import { useQuery } from '@tanstack/react-query';
import { getInitials } from '../../utils/getInitials';
import { roleBadgeClasses, roleIdToLabel } from './roleUtils';
import { getUserById } from '../../services/admin/users';

interface Props {
  userId: number;
  onClose: () => void;
}

function UserDetailModal({ userId, onClose }: Props) {
  const { data: viewingUser, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    staleTime: 60 * 1000,
  });
  
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
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-content-center rounded-full bg-[linear-gradient(135deg,#05DF72_0%,#00A63E_100%)] text-xl font-semibold text-white">
                {getInitials(viewingUser.name)}
              </div>
              <div>
                <p className="text-lg font-semibold text-[#101828]">{viewingUser.name}</p>
                <p className="text-sm text-[#4A5565]">{viewingUser.email}</p>
              </div>
            </div>

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
                <span className="text-sm font-medium text-[#6A7282]">Estado</span>
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
            </div>

            {(viewingUser.roleId === 2 || viewingUser.roleId === 3) && viewingUser.location ? (
              <div className="space-y-3 rounded-lg border border-[#E5E7EB] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6A7282]">
                  Ubicación
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#6A7282]">Estado</span>
                  <span className="text-sm text-[#101828]">{viewingUser.location.stateName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#6A7282]">Municipio</span>
                  <span className="text-sm text-[#101828]">{viewingUser.location.municipalityName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#6A7282]">Localidad</span>
                  <span className="text-sm text-[#101828]">{viewingUser.location.localityName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#6A7282]">Propiedad</span>
                  <span className="text-sm text-[#101828]">{viewingUser.location.propertyName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#6A7282]">Coordenadas</span>
                  <span className="text-sm text-[#4A5565]">
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
