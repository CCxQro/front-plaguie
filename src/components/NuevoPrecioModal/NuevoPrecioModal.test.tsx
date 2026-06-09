import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('../../hooks/useRegisterPrice', () => ({ useRegisterPrice: vi.fn() }));

import { useRegisterPrice } from '../../hooks/useRegisterPrice';
import { NuevoPrecioModal } from './NuevoPrecioModal';

const hook = vi.mocked(useRegisterPrice);
const mutate = vi.fn();

function setup(props?: Partial<Parameters<typeof NuevoPrecioModal>[0]>) {
  const onClose = vi.fn();
  render(
    <NuevoPrecioModal
      skuSellerId={1}
      productName="Fertilizante NPK"
      currentPrice={100}
      unitName="Litro"
      onClose={onClose}
      {...props}
    />,
  );
  return { onClose };
}

beforeEach(() => {
  vi.clearAllMocks();
  hook.mockReturnValue({ mutate, isPending: false, error: null } as never);
});

describe('NuevoPrecioModal', () => {
  it('renders the product and current price; submit disabled until valid', () => {
    setup();
    expect(screen.getByText('Fertilizante NPK')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Actualizar Precio' })).toBeDisabled();
  });

  it('shows a price increase summary', () => {
    setup();
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '150' } });
    expect(screen.getByText('Subida')).toBeInTheDocument();
    expect(screen.getByText('+$50.00')).toBeInTheDocument();
  });

  it('shows a price decrease summary', () => {
    setup();
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '50' } });
    expect(screen.getByText('Bajada')).toBeInTheDocument();
  });

  it('shows "Sin cambio" when the price is equal', () => {
    setup();
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '100' } });
    expect(screen.getByText('Sin cambio')).toBeInTheDocument();
  });

  it('submits a valid price and closes on success', () => {
    mutate.mockImplementation((_vars, opts) => opts.onSuccess());
    const { onClose } = setup();
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '120' } });
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar Precio' }));
    expect(mutate).toHaveBeenCalledWith({ skuSellerId: 1, price: '120.00000' }, expect.any(Object));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders the error message', () => {
    hook.mockReturnValue({ mutate, isPending: false, error: new Error('x') } as never);
    setup();
    expect(screen.getByText(/No se pudo actualizar el precio/i)).toBeInTheDocument();
  });

  it('closes via cancel and backdrop', () => {
    const { onClose } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows the saving state while pending', () => {
    hook.mockReturnValue({ mutate, isPending: true, error: null } as never);
    setup();
    expect(screen.getByRole('button', { name: 'Guardando…' })).toBeInTheDocument();
  });
});
