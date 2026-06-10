import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import PendingAccountsPanel from './PendingAccountsPanel';
import type { PendingFarmer } from '../../../types/DataUser';

vi.mock('../../../services/admin/users', () => ({
  getPendingFarmers: vi.fn(),
  approveFarmer: vi.fn(),
  rejectFarmer: vi.fn(),
}));

import { getPendingFarmers, approveFarmer, rejectFarmer } from '../../../services/admin/users';

const mockGetPendingFarmers = vi.mocked(getPendingFarmers);
const mockApproveFarmer = vi.mocked(approveFarmer);
const mockRejectFarmer = vi.mocked(rejectFarmer);

const PENDING: PendingFarmer = {
  farmerId: 1,
  active: true,
  statusId: 2,
  statusName: 'Revision',
  user: { userId: 6, name: 'Pedro Campos', email: 'pedro@example.com', roleId: 2 },
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PendingAccountsPanel', () => {
  it('shows an empty state when there are no pending accounts', async () => {
    mockGetPendingFarmers.mockResolvedValue([]);
    render(<PendingAccountsPanel />, { wrapper: createWrapper() });
    await waitFor(() =>
      expect(screen.getByTestId('pending-accounts-empty')).toBeInTheDocument(),
    );
    expect(screen.getByTestId('pending-accounts-count')).toHaveTextContent('0');
  });

  it('lists pending farmers with a count', async () => {
    mockGetPendingFarmers.mockResolvedValue([PENDING]);
    render(<PendingAccountsPanel />, { wrapper: createWrapper() });
    await waitFor(() => expect(screen.getByText('Pedro Campos')).toBeInTheDocument());
    expect(screen.getByTestId('pending-accounts-count')).toHaveTextContent('1');
    expect(screen.getByText('pedro@example.com')).toBeInTheDocument();
  });

  it('approves a farmer after confirmation', async () => {
    mockGetPendingFarmers.mockResolvedValue([PENDING]);
    mockApproveFarmer.mockResolvedValue(undefined);
    render(<PendingAccountsPanel />, { wrapper: createWrapper() });

    await userEvent.click(await screen.findByTestId('approve-account-button'));
    expect(screen.getByTestId('confirm-account-modal')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('confirm-account-action'));

    await waitFor(() => expect(mockApproveFarmer).toHaveBeenCalledWith(6));
    expect(mockRejectFarmer).not.toHaveBeenCalled();
  });

  it('rejects a farmer after confirmation', async () => {
    mockGetPendingFarmers.mockResolvedValue([PENDING]);
    mockRejectFarmer.mockResolvedValue(undefined);
    render(<PendingAccountsPanel />, { wrapper: createWrapper() });

    await userEvent.click(await screen.findByTestId('reject-account-button'));
    expect(screen.getByTestId('confirm-account-modal')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('confirm-account-action'));

    await waitFor(() => expect(mockRejectFarmer).toHaveBeenCalledWith(6));
    expect(mockApproveFarmer).not.toHaveBeenCalled();
  });

  it('cancels the confirmation without acting', async () => {
    mockGetPendingFarmers.mockResolvedValue([PENDING]);
    render(<PendingAccountsPanel />, { wrapper: createWrapper() });

    await userEvent.click(await screen.findByTestId('approve-account-button'));
    await userEvent.click(screen.getByText('Cancelar'));

    expect(screen.queryByTestId('confirm-account-modal')).not.toBeInTheDocument();
    expect(mockApproveFarmer).not.toHaveBeenCalled();
  });
});
