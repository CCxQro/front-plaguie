import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

const mutate = vi.fn();
vi.mock('../../hooks/useCategories', () => ({
  useCategories: () => ({ data: [{ categoryId: 1, name: 'Fertilizantes' }], isLoading: false }),
}));
vi.mock('../../hooks/useProviders', () => ({
  useProviders: () => ({ data: [{ providerId: 1, name: 'Proveedor X' }], isLoading: false }),
}));
vi.mock('../../hooks/useUnits', () => ({
  useUnits: () => ({ data: [{ unitId: 1, name: 'Litro' }], isLoading: false }),
}));
vi.mock('../../hooks/useTechnicalSellerId', () => ({
  useTechnicalSellerId: () => ({ data: 7, isLoading: false, error: null }),
}));
vi.mock('../../hooks/useCreateProduct', () => ({
  useCreateProduct: () => ({ mutate, isPending: false, isSuccess: false, error: null }),
}));

import { NuevoProductoModal } from './NuevoProductoModal';

beforeEach(() => vi.clearAllMocks());

function uploadImage(container: HTMLElement) {
  const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
  return userEvent.upload(fileInput, new File(['img'], 'p.png', { type: 'image/png' }));
}

describe('NuevoProductoModal', () => {
  it('keeps input values literal (XSS mitigation, SCRUM-299)', async () => {
    render(<NuevoProductoModal onClose={() => {}} />);
    const nameInput = screen.getAllByRole('textbox')[0];
    await userEvent.type(nameInput, '<script>alert(1)</script>');
    expect(nameInput).toHaveValue('<script>alert(1)</script>');
  });

  it('rejects images with an invalid type', () => {
    const { container } = render(<NuevoProductoModal onClose={() => {}} />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(fileInput, 'files', {
      value: [new File(['x'], 'a.gif', { type: 'image/gif' })],
      configurable: true,
    });
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    expect(screen.getByText(/Solo se aceptan archivos/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting an empty form', async () => {
    const { container } = render(<NuevoProductoModal onClose={() => {}} />);
    await uploadImage(container);

    await userEvent.click(screen.getByRole('button', { name: 'Agregar Producto' }));

    expect(screen.getAllByText('Requerido').length).toBeGreaterThan(0);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('submits the product when the form is valid', async () => {
    const { container } = render(<NuevoProductoModal onClose={() => {}} />);
    await uploadImage(container);

    await userEvent.type(screen.getByPlaceholderText('Ej: Fungicida X-100 Pro'), 'NPK');
    await userEvent.type(screen.getByPlaceholderText('Ej: FG-100-2024'), 'NPK-1');

    const [categorySel, providerSel, unitSel] = screen.getAllByRole('combobox');
    await userEvent.selectOptions(categorySel, '1');
    await userEvent.selectOptions(providerSel, '1');
    await userEvent.selectOptions(unitSel, '1');

    const zeros = screen.getAllByPlaceholderText('0');
    await userEvent.type(zeros[0], '2'); // unit value
    await userEvent.type(zeros[1], '100'); // price
    await userEvent.type(zeros[2], '50'); // stock

    await userEvent.click(screen.getByRole('button', { name: 'Agregar Producto' }));

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate.mock.calls[0][0]).toMatchObject({
      sellerId: 7,
      name: 'NPK',
      sku: 'NPK-1',
      categoryId: 1,
      providerId: 1,
      unitId: 1,
      price: '100.00000',
      stock: 50,
    });
  });
});
