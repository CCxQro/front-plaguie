import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SalesTechnicianPanel from './SalesTechnicianPanel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSalesSummary } from '../hooks/useSalesSummary';

vi.mock('../hooks/useSalesSummary', () => ({
  useSalesSummary: vi.fn(),
}));

const mockUseSalesSummary = vi.mocked(useSalesSummary);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('SalesTechnicianPanel', () => {
  beforeEach(() => {
    mockUseSalesSummary.mockReset();
  });

  it('renders loading state for inventory', () => {
    mockUseSalesSummary.mockReturnValue({ data: undefined, isLoading: true } as unknown as ReturnType<typeof useSalesSummary>);
    render(<SalesTechnicianPanel />, { wrapper: createWrapper() });
    expect(screen.getByText(/Cargando inventario.../i)).toBeInTheDocument();
  });

  it('renders sales metrics successfully', async () => {
    mockUseSalesSummary.mockReturnValue({
      isLoading: false,
      data: {
      metrics: {
          totalEarnings: 15000,
          remainingInventory: 200,
          totalOrders: 45,
          newClients: 12,
          earningsTrend: '+10%',
          inventoryTrend: '-2%',
          ordersTrend: '+5%',
          clientsTrend: '+3%',
        },
      inventoryAlerts: [
        {
          id: '1',
          product: 'Fungicida Test',
          sku: 'F-123',
          category: 'Plaguicidas',
          stock: 5,
          lastSaleDate: '2023-10-01T10:00:00Z',
          status: 'Crítico'
        }
      ],
      salesChartData: []
      }
    } as unknown as ReturnType<typeof useSalesSummary>);

    render(<SalesTechnicianPanel />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(new RegExp(String((15000).toLocaleString())))).toBeInTheDocument();
      expect(screen.getByText(/45/)).toBeInTheDocument();
      expect(screen.getByText(/^12$/)).toBeInTheDocument();
      expect(screen.getByText(/Fungicida Test/)).toBeInTheDocument();
    });
  });
});
