import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { PendingProductsPanel } from './PendingProductsPanel';
import { getProducts, validateProduct } from '../../services/products/productsService';

vi.mock('../../services/products/productsService');

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('PendingProductsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when there are no pending products', async () => {
    vi.mocked(getProducts).mockResolvedValueOnce([]);

    const { container } = render(<PendingProductsPanel />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('renders the list of pending products', async () => {
    vi.mocked(getProducts).mockResolvedValueOnce([
      {
        skuSellerId: 101,
        name: 'Producto A',
        sku: 'SKU-A',
        categoryId: 1,
        categoryName: 'Insecticidas',
        providerId: 1,
        providerName: 'Prov A',
        unitValue: 10,
        unitId: 1,
        unitName: 'L',
        description: 'Desc',
        statusId: 2,
        statusName: 'Revision',
        firebaseImageId: '',
        latestPrice: 100,
        latestPriceDate: '2026-01-01',
        stock: 50,
        isActive: true,
        sellerId: 1,
        sellerName: 'Vendedor 1',
      },
    ]);

    render(<PendingProductsPanel />, { wrapper: createWrapper() });

    expect(await screen.findByText('Productos pendientes de aprobación')).toBeInTheDocument();
    expect(await screen.findByText('Producto A')).toBeInTheDocument();
    expect(screen.getByText('SKU: SKU-A')).toBeInTheDocument();
  });

  it('allows approving a product', async () => {
    vi.mocked(getProducts).mockResolvedValueOnce([
      {
        skuSellerId: 101,
        name: 'Producto A',
        sku: 'SKU-A',
        categoryId: 1,
        categoryName: 'Insecticidas',
        providerId: 1,
        providerName: 'Prov A',
        unitValue: 10,
        unitId: 1,
        unitName: 'L',
        description: 'Desc',
        statusId: 2,
        statusName: 'Revision',
        firebaseImageId: '',
        latestPrice: 100,
        latestPriceDate: '2026-01-01',
        stock: 50,
        isActive: true,
        sellerId: 1,
        sellerName: 'Vendedor 1',
      },
    ]);
    vi.mocked(validateProduct).mockResolvedValueOnce({} as unknown as import('../../types/Product').Product);

    render(<PendingProductsPanel />, { wrapper: createWrapper() });

    const approveBtn = await screen.findByTestId('approve-product-button');
    await userEvent.click(approveBtn);

    const confirmBtn = await screen.findByTestId('confirm-product-action');
    await userEvent.click(confirmBtn);

    await waitFor(() => {
      expect(validateProduct).toHaveBeenCalledWith(101, 1);
    });
  });

  it('allows rejecting a product', async () => {
    vi.mocked(getProducts).mockResolvedValueOnce([
      {
        skuSellerId: 101,
        name: 'Producto A',
        sku: 'SKU-A',
        categoryId: 1,
        categoryName: 'Insecticidas',
        providerId: 1,
        providerName: 'Prov A',
        unitValue: 10,
        unitId: 1,
        unitName: 'L',
        description: 'Desc',
        statusId: 2,
        statusName: 'Revision',
        firebaseImageId: '',
        latestPrice: 100,
        latestPriceDate: '2026-01-01',
        stock: 50,
        isActive: true,
        sellerId: 1,
        sellerName: 'Vendedor 1',
      },
    ]);
    vi.mocked(validateProduct).mockResolvedValueOnce({} as unknown as import('../../types/Product').Product);

    render(<PendingProductsPanel />, { wrapper: createWrapper() });

    const rejectBtn = await screen.findByTestId('reject-product-button');
    await userEvent.click(rejectBtn);

    const confirmBtn = await screen.findByTestId('confirm-product-action');
    await userEvent.click(confirmBtn);

    await waitFor(() => {
      expect(validateProduct).toHaveBeenCalledWith(101, 3);
    });
  });
});
