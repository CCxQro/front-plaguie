import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminOverviewPanel from './AdminOverviewPanel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as adminMetricsService from '../services/admin/adminMetricsService';

vi.mock('../services/admin/adminMetricsService', () => ({
  getAdminMetrics: vi.fn(),
}));

import { getAdminMetrics } from '../services/admin/adminMetricsService';

const mockGetAdminMetrics = vi.mocked(getAdminMetrics);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('AdminOverviewPanel', () => {
  beforeEach(() => {
    mockGetAdminMetrics.mockReset();
  });

  it('shows loading state initially', () => {
    mockGetAdminMetrics.mockReturnValue(new Promise(() => {}));
    render(<AdminOverviewPanel />, { wrapper: createWrapper() });
    expect(screen.getByText(/Cargando métricas.../i)).toBeInTheDocument();
  });

  it('renders metrics when data is loaded successfully', async () => {
    const mockData: adminMetricsService.AdminMetrics = {
      totalUsers: 1500,
      newUsersThisWeek: 42,
      totalProducts: 350,
      pendingValidations: 12,
      totalSurveillanceRecords: 8000,
      recordsThisMonth: 150,
      totalOrders: 4200,
      ordersThisWeek: 85,
    };

    mockGetAdminMetrics.mockResolvedValue(mockData);
    render(<AdminOverviewPanel />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(new RegExp(mockData.totalUsers.toLocaleString()))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(mockData.totalProducts.toLocaleString()))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(mockData.pendingValidations.toLocaleString()))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(mockData.totalSurveillanceRecords.toLocaleString()))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(mockData.totalOrders.toLocaleString()))).toBeInTheDocument();
    });
  });

  it('shows error state when fetching fails', async () => {
    mockGetAdminMetrics.mockRejectedValue(new Error('Network Error'));
    render(<AdminOverviewPanel />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar métricas/i)).toBeInTheDocument();
      expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
    });
  });

  it('refetches metrics when the retry button is clicked', async () => {
    mockGetAdminMetrics.mockRejectedValueOnce(new Error('Network Error'));
    render(<AdminOverviewPanel />, { wrapper: createWrapper() });
    await screen.findByText(/Error al cargar métricas/i);

    mockGetAdminMetrics.mockResolvedValueOnce({
      totalUsers: 1,
      newUsersThisWeek: 0,
      totalProducts: 0,
      pendingValidations: 0,
      totalSurveillanceRecords: 0,
      recordsThisMonth: 0,
      totalOrders: 0,
      ordersThisWeek: 0,
    });
    fireEvent.click(screen.getByRole('button', { name: /Reintentar/i }));

    await waitFor(() => expect(mockGetAdminMetrics).toHaveBeenCalledTimes(2));
  });
});
