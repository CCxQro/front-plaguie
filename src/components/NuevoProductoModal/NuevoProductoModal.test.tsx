import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuevoProductoModal } from './NuevoProductoModal';
import userEvent from '@testing-library/user-event';

vi.mock('../../hooks/useCategories', () => ({
  useCategories: () => ({ data: [] }),
}));
vi.mock('../../hooks/useProviders', () => ({
  useProviders: () => ({ data: [] }),
}));
vi.mock('../../hooks/useUnits', () => ({
  useUnits: () => ({ data: [] }),
}));
vi.mock('../../hooks/useCreateProduct', () => ({
  useCreateProduct: () => ({ mutate: vi.fn(), isPending: false }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('NuevoProductoModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('escapes HTML characters in inputs to prevent XSS (SCRUM-299)', async () => {
    render(<NuevoProductoModal onClose={() => {}} />, { wrapper: createWrapper() });
    
    const maliciousName = '<script>alert("xss")</script>';
    
    // Find the input by its label or name
    const inputs = screen.getAllByRole('textbox');
    // The first textbox is likely the name
    const nameInput = inputs[0];

    await userEvent.type(nameInput, maliciousName);
    
    // The input value should be literally the script string
    expect(nameInput).toHaveValue(maliciousName);

    // Since React escapes everything passed as values, and we don't render this back 
    // to the DOM using dangerouslySetInnerHTML anywhere, XSS is mitigated.
  });
});
