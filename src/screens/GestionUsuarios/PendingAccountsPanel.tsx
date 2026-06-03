import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getPendingFarmers, approveFarmer, rejectFarmer } from '../../services/admin/users';
import type { PendingFarmer } from '../../types/DataUser';
import { getInitials } from '../../utils/getInitials';

type PendingAction = 'approve' | 'reject';

/**
 * Admin queue of farmer accounts pending approval (status = Revision).
 * Approving sets the account to Accepted (can log in); rejecting sets it to
 * Rejected (access denied). Renders nothing when there are no pending accounts.
 * HU-23 / SRS §1.4.1.
 */
function PendingAccountsPanel() {
  const queryClient = useQueryClient();
  const [confirm, setConfirm] = useState<{ farmer: PendingFarmer; action: PendingAction } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: pending = [], isLoading } = useQuery({
    queryKey: ['pendingFarmers'],
    queryFn: getPendingFarmers,
    staleTime: 60 * 1000,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['pendingFarmers'] });
    void queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const approveMutation = useMutation({
    mutationFn: (userId: number) => approveFarmer(userId),
    onSuccess: () => {
      invalidate();
      setConfirm(null);
    },
    onError: (e) => setError(e instanceof Error ? e.message : 'No se pudo aprobar la cuenta'),
  });

  const rejectMutation = useMutation({
    mutationFn: (userId: number) => rejectFarmer(userId),
    onSuccess: () => {
      invalidate();
      setConfirm(null);
    },
    onError: (e) => setError(e instanceof Error ? e.message : 'No se pudo rechazar la cuenta'),
  });

  if (isLoading || pending.length === 0) {
    return null;
  }

  const isMutating = approveMutation.isPending || rejectMutation.isPending;

  const handleConfirm = () => {
    if (!confirm?.farmer.user) return;
    const userId = confirm.farmer.user.userId;
    if (confirm.action === 'approve') {
      approveMutation.mutate(userId);
    } else {
      rejectMutation.mutate(userId);
    }
  };

  return (
    <section
      data-testid="pending-accounts-panel"
      className="mb-6 rounded-[14px] border border-[#FEF08A] bg-[#FEFCE8] p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl">⏳</span>
        <h2 className="text-lg font-bold text-[#101828]">Cuentas pendientes de aprobación</h2>
        <span
          data-testid="pending-accounts-count"
          className="ml-1 inline-flex items-center rounded-full bg-[#FACC15] px-2.5 py-0.5 text-xs font-semibold text-[#713F12]"
        >
          {pending.length}
        </span>
      </div>

      {error ? <p className="mb-3 text-sm text-[#E7000B]">{error}</p> : null}

      <ul className="flex flex-col gap-3">
        {pending.map((farmer) => (
          <li
            key={farmer.farmerId}
            data-testid="pending-account-row"
            className="flex flex-col gap-3 rounded-[10px] border border-[#FDE68A] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-content-center rounded-full bg-[linear-gradient(135deg,#FDE047_0%,#F59E0B_100%)] text-base font-medium text-white">
                {getInitials(farmer.user?.name ?? '?')}
              </div>
              <div>
                <p className="text-base font-medium text-[#101828]">
                  {farmer.user?.name ?? 'Sin nombre'}
                </p>
                <p className="text-sm text-[#6A7282]">{farmer.user?.email ?? ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid="approve-account-button"
                aria-label={`Aprobar ${farmer.user?.name ?? ''}`}
                disabled={isMutating}
                onClick={() => {
                  setError(null);
                  setConfirm({ farmer, action: 'approve' });
                }}
                className="h-9 rounded-[10px] bg-[#00A63E] px-4 text-sm font-medium text-white hover:bg-[#008c35] disabled:opacity-50"
              >
                Aprobar
              </button>
              <button
                type="button"
                data-testid="reject-account-button"
                aria-label={`Rechazar ${farmer.user?.name ?? ''}`}
                disabled={isMutating}
                onClick={() => {
                  setError(null);
                  setConfirm({ farmer, action: 'reject' });
                }}
                className="h-9 rounded-[10px] border border-[#E7000B] px-4 text-sm font-medium text-[#E7000B] hover:bg-[#FEF2F2] disabled:opacity-50"
              >
                Rechazar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {confirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6"
            data-testid="confirm-account-modal"
          >
            <h2 className="text-[20px] font-bold leading-7 text-[#101828]">
              {confirm.action === 'approve' ? 'Aprobar cuenta' : 'Rechazar cuenta'}
            </h2>
            <p className="mt-4 text-base text-[#4A5565]">
              ¿Está seguro que desea {confirm.action === 'approve' ? 'aprobar' : 'rechazar'} la cuenta de{' '}
              <span className="font-medium text-[#101828]">{confirm.farmer.user?.name}</span>?{' '}
              {confirm.action === 'approve'
                ? 'El agricultor podrá iniciar sesión.'
                : 'Se le negará el acceso a la plataforma.'}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirm(null)}
                className="h-10.5 flex-1 rounded-[10px] border border-[#D1D5DC] text-base font-medium text-[#364153]"
              >
                Cancelar
              </button>
              <button
                type="button"
                data-testid="confirm-account-action"
                onClick={handleConfirm}
                disabled={isMutating}
                className={`h-10.5 flex-1 rounded-[10px] text-base font-medium text-white disabled:opacity-60 ${
                  confirm.action === 'approve'
                    ? 'bg-[#00A63E] hover:bg-[#008c35]'
                    : 'bg-[#E7000B] hover:bg-[#c40009]'
                }`}
              >
                {isMutating ? 'Procesando...' : confirm.action === 'approve' ? 'Aprobar' : 'Rechazar'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default PendingAccountsPanel;
