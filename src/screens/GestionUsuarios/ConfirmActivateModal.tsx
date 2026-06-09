import { useQuery } from '@tanstack/react-query';

import { getFarmerByUserId } from '../../services/admin/users';
import type { DataUser } from '../../types/DataUser';

interface Props {
  target: DataUser;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ROLE_FARMER  = 2;
const STATUS_REJECTED = 3;

function ConfirmActivateModal({ target, isPending, onConfirm, onClose }: Props) {
  /** For farmers, check approval status so we can block re-activation of rejected accounts. */
  const { data: farmerStatus, isLoading: isCheckingStatus } = useQuery({
    queryKey: ['farmer', target.userId],
    queryFn: () => getFarmerByUserId(target.userId),
    enabled: target.roleId === ROLE_FARMER,
    staleTime: 60 * 1000,
  });

  const isRejected = farmerStatus?.statusId === STATUS_REJECTED;
  const isDisabled  = isPending || isCheckingStatus || isRejected;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6"
        data-testid="confirm-activate-modal"
      >
        <h2 className="text-[20px] font-bold leading-7 text-[#101828]">
          {isRejected ? 'Cuenta rechazada' : 'Activar usuario'}
        </h2>

        {isRejected ? (
          <div className="mt-4 flex items-start gap-2 rounded-[10px] bg-[#FEF2F2] p-3">
            <span className="mt-0.5 text-base">🚫</span>
            <p className="text-sm leading-5 text-[#B91C1C]">
              <span className="font-semibold">{target.name}</span> fue rechazado y no puede
              reactivarse directamente. Para rehabilitar la cuenta, cambia primero su estado
              de revisión a <em>En revisión</em> desde la base de datos y vuelve a aprobarlo.
            </p>
          </div>
        ) : (
          <p className="mt-4 text-base text-[#4A5565]">
            ¿Está seguro que desea activar a{' '}
            <span className="font-medium text-[#101828]">{target.name}</span>? El usuario
            podrá acceder a la plataforma.
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10.5 flex-1 rounded-[10px] border border-[#D1D5DC] text-base font-medium text-[#364153] hover:bg-[#F9FAFB]"
          >
            {isRejected ? 'Cerrar' : 'Cancelar'}
          </button>

          {!isRejected ? (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDisabled}
              className="h-10.5 flex-1 rounded-[10px] bg-[#00A63E] text-base font-medium text-white hover:bg-[#008c35] disabled:opacity-60"
            >
              {isPending ? 'Activando…' : isCheckingStatus ? 'Verificando…' : 'Activar'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ConfirmActivateModal;
