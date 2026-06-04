import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EditarProductoModal } from './EditarProductoModal';
import { useProduct } from '../../hooks/useProduct';

vi.mock('../../hooks/useProduct');
vi.mock('../../hooks/useCategories', () => ({
  useCategories: () => ({ data: [] }),
}));
vi.mock('../../hooks/useProviders', () => ({
  useProviders: () => ({ data: [] }),
}));
vi.mock('../../hooks/useUnits', () => ({
  useUnits: () => ({ data: [] }),
}));
vi.mock('../../hooks/useUpdateProduct', () => ({
  useUpdateProduct: () => ({ mutate: vi.fn(), isPending: false }),
}));
vi.mock('../../hooks/useFirebaseImageUrl', () => ({
  useFirebaseImageUrl: () => ({ data: null }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('EditarProductoModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('escapes HTML characters to prevent XSS (SCRUM-294)', async () => {
    // Return a product with a malicious script payload in the name and sku
    const maliciousName = '<script>alert("xss")</script>';
    vi.mocked(useProduct).mockReturnValue({
      data: {
        skuSellerId: 1,
        name: maliciousName,
        sku: '<img src=x onerror=alert(1)>',
        categoryId: 1,
        providerId: 1,
        unitValue: 10,
        unitId: 1,
        description: 'Test description',
        statusId: 1,
        firebaseImageId: '123',
        latestPrice: '150',
        stock: 50,
        unitName: 'Kg',
      },
      isLoading: false,
      error: null,
    } as unknown as import('@tanstack/react-query').UseQueryResult<import('../../types/Product').Product, Error>);

    render(<EditarProductoModal skuSellerId={1} onClose={() => {}} />, { wrapper: createWrapper() });
    
    // The input value should be literally the script string
    const nameInput = screen.getByDisplayValue(maliciousName);
    expect(nameInput).toBeInTheDocument();
    
    // Check that it's rendered in the sub-header properly escaped, we check by text content
    const subheader = screen.getByText((content) => {
      return content.includes('<img src=x onerror=alert(1)>');
    });
    expect(subheader).toBeInTheDocument();

    // Since React escapes everything passed as children, the fact that we can find it as plain text
    // and that dangerouslySetInnerHTML is not used proves that XSS is mitigated.
  });
});
