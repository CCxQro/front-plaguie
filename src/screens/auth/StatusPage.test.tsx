import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../hooks/useStatus', () => ({ useStatus: vi.fn() }));

import { useStatus } from '../../hooks/useStatus';
import StatusPage from './StatusPage';
import { createQueryWrapper } from '../../test/queryWrapper';

const mocked = vi.mocked(useStatus);

function renderPage() {
  return render(<StatusPage />, { wrapper: createQueryWrapper() });
}

beforeEach(() => vi.clearAllMocks());

describe('StatusPage', () => {
  it('shows the loading state', () => {
    mocked.mockReturnValue({ isLoading: true, isError: false, data: undefined, dataUpdatedAt: 0 } as never);
    renderPage();
    expect(screen.getByTestId('status-loading')).toBeInTheDocument();
  });

  it('shows the error state', () => {
    mocked.mockReturnValue({ isLoading: false, isError: true, data: undefined, dataUpdatedAt: 0 } as never);
    renderPage();
    expect(screen.getByTestId('status-error')).toBeInTheDocument();
  });

  it('renders the metrics when data is available and refresh works', () => {
    mocked.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { status: 'UP', database: 'UP', service: 'plaguie-api', timestamp: '2026-06-09T00:00:00Z' },
      dataUpdatedAt: Date.now(),
    } as never);

    renderPage();

    expect(screen.getByTestId('status-data')).toBeInTheDocument();
    expect(screen.getByText('plaguie-api')).toBeInTheDocument();
    expect(screen.getByText('MySQL')).toBeInTheDocument();

    // Refresh button should be clickable without throwing.
    fireEvent.click(screen.getByRole('button', { name: /actualizar/i }));
  });
});
