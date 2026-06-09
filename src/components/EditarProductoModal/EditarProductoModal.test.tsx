import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

const mutate = vi.fn();
vi.mock('../../hooks/useProduct', () => ({ useProduct: vi.fn() }));
vi.mock('../../hooks/useCategories', () => ({
  useCategories: () => ({ data: [{ categoryId: 1, name: 'Fertilizantes' }] }),
}));
vi.mock('../../hooks/useProviders', () => ({
  useProviders: () => ({ data: [{ providerId: 1, name: 'Proveedor X' }] }),
}));
vi.mock('../../hooks/useUnits', () => ({
  useUnits: () => ({ data: [{ unitId: 1, name: 'Kg' }] }),
}));
vi.mock('../../hooks/useUpdateProduct', () => ({
  useUpdateProduct: () => ({ mutate, isPending: false, isSuccess: false, error: null }),
}));
vi.mock('../../hooks/useFirebaseImageUrl', () => ({ useFirebaseImageUrl: () => ({ data: null }) }));

import { useProduct } from '../../hooks/useProduct';
import { EditarProductoModal } from './EditarProductoModal';

const productHook = vi.mocked(useProduct);

const product = {
  skuSellerId: 1,
  name: 'NPK',
  sku: 'NPK-1',
  categoryId: 1,
  providerId: 1,
  unitValue: 10,
  unitId: 1,
  description: 'desc',
  statusId: 1,
  firebaseImageId: 'img',
  latestPrice: '150',
  stock: 50,
  unitName: 'Kg',
  categoryName: 'Fertilizantes',
  providerName: 'Proveedor X',
  sellerName: 'Vendedor',
};

beforeEach(() => {
  vi.clearAllMocks();
  productHook.mockReturnValue({ data: product, isLoading: false, error: null } as never);
});

describe('EditarProductoModal', () => {
  it('keeps malicious input literal (XSS mitigation, SCRUM-294)', () => {
    productHook.mockReturnValue({
      data: { ...product, name: '<script>alert(1)</script>' },
      isLoading: false,
      error: null,
    } as never);
    render(<EditarProductoModal skuSellerId={1} onClose={() => {}} />);
    expect(screen.getByDisplayValue('<script>alert(1)</script>')).toBeInTheDocument();
  });

  it('shows the loading state', () => {
    productHook.mockReturnValue({ data: undefined, isLoading: true, error: null } as never);
    render(<EditarProductoModal skuSellerId={1} onClose={() => {}} />);
    expect(screen.getByRole('button', { name: 'Guardar Cambios' })).toBeDisabled();
  });

  it('submits the prefilled form', () => {
    render(<EditarProductoModal skuSellerId={1} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate.mock.calls[0][0]).toMatchObject({
      skuSellerId: 1,
      payload: expect.objectContaining({ name: 'NPK', sku: 'NPK-1', categoryId: 1, unitId: 1 }),
    });
  });

  it('submits edited values', async () => {
    render(<EditarProductoModal skuSellerId={1} onClose={() => {}} />);
    const nameInput = screen.getByDisplayValue('NPK');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'NPK v2');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    expect(mutate.mock.calls[0][0].payload).toMatchObject({ name: 'NPK v2' });
  });

  it('rejects an invalid image type', () => {
    const { container } = render(<EditarProductoModal skuSellerId={1} onClose={() => {}} />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(fileInput, 'files', {
      value: [new File(['x'], 'a.gif', { type: 'image/gif' })],
      configurable: true,
    });
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    expect(screen.getByText(/Solo se aceptan archivos/i)).toBeInTheDocument();
  });

  it('closes via cancel', () => {
    const onClose = vi.fn();
    render(<EditarProductoModal skuSellerId={1} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalled();
  });
});
