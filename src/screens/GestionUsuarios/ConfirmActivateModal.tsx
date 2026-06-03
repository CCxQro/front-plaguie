import type { DataUser } from '../../types/DataUser';

interface Props {
  target: DataUser;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

function ConfirmActivateModal({ target, isPending, onConfirm, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6"
        data-testid="confirm-activate-modal"
      >
        <h2 className="text-[20px] font-bold leading-7 text-[#101828]">Aprobar Usuario</h2>
        <p className="mt-4 text-base text-[#4A5565]">
          ¿Está seguro que desea aprobar a{' '}
          <span className="font-medium text-[#101828]">{target.name}</span>? El usuario podrá
          acceder a la plataforma.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10.5 flex-1 rounded-[10px] border border-[#D1D5DC] text-base font-medium text-[#364153]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="h-10.5 flex-1 rounded-[10px] bg-[#00A63E] text-base font-medium text-white hover:bg-[#008c35] disabled:opacity-60"
          >
            {isPending ? 'Aprobando...' : 'Aprobar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmActivateModal;
