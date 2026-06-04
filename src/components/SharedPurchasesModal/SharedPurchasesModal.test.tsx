import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SharedPurchasesModal } from './SharedPurchasesModal';
import { useSharedPurchases } from '../../hooks/useSharedPurchases';

vi.mock('../../hooks/useSharedPurchases');

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('SharedPurchasesModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    vi.mocked(useSharedPurchases).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useSharedPurchases>);

    const { container } = render(<SharedPurchasesModal isOpen={false} onClose={() => {}} />, {
      wrapper: createWrapper(),
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal content and tests data-testid', () => {
    vi.mocked(useSharedPurchases).mockReturnValue({
      data: [
        {
          orderId: 1,
          orderDate: '2023-10-10T10:00:00Z',
          totalAmount: 1500,
          farmer: { farmerId: 1, name: 'Juan Perez', email: 'juan@test.com' },
          orderStatus: { orderStatusId: 1, name: 'Pendiente' },
          details: [{ productId: 1, productName: 'Fertilizante', quantity: 2, unitPrice: 750 }],
          providerShared: true,
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useSharedPurchases>);

    render(<SharedPurchasesModal isOpen={true} onClose={() => {}} />, {
      wrapper: createWrapper(),
    });

    const modal = screen.getByTestId('shared-purchases-modal');
    expect(modal).toBeInTheDocument();

    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    expect(screen.getByText('2x Fertilizante')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    vi.mocked(useSharedPurchases).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useSharedPurchases>);

    const onClose = vi.fn();
    render(<SharedPurchasesModal isOpen={true} onClose={onClose} />, {
      wrapper: createWrapper(),
    });

    const closeBtn = screen.getByRole('button', { name: /cerrar/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
