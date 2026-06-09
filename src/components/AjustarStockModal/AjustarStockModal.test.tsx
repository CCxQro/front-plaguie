import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('../../hooks/useStockMovement', () => ({ useStockMovement: vi.fn() }));

import { useStockMovement } from '../../hooks/useStockMovement';
import { AjustarStockModal } from './AjustarStockModal';

const hook = vi.mocked(useStockMovement);
const mutate = vi.fn();

function setup() {
  const onClose = vi.fn();
  render(
    <AjustarStockModal
      skuSellerId={1}
      productName="Fertilizante NPK"
      currentStock={10}
      unitName="Litro"
      onClose={onClose}
    />,
  );
  return { onClose };
}

beforeEach(() => {
  vi.clearAllMocks();
  hook.mockReturnValue({ mutate, isPending: false, error: null } as never);
});

describe('AjustarStockModal', () => {
  it('renders product and current stock; submit disabled until valid', () => {
    setup();
    expect(screen.getByText('Fertilizante NPK')).toBeInTheDocument();
    expect(screen.getAllByText('10').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Confirmar Ajuste' })).toBeDisabled();
  });

  it('adds stock and submits', () => {
    mutate.mockImplementation((_v, opts) => opts.onSuccess());
    const { onClose } = setup();
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '5' } });
    expect(screen.getByText('15')).toBeInTheDocument(); // projected
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Ajuste' }));
    expect(mutate).toHaveBeenCalledWith(
      { skuSellerId: 1, movement: 'add', cantidad: 5 },
      expect.any(Object),
    );
    expect(onClose).toHaveBeenCalled();
  });

  it('blocks removing more than the current stock', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Quitar' }));
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '20' } });
    expect(screen.getByText(/No puedes quitar más de 10/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar Ajuste' })).toBeDisabled();
  });

  it('removes a valid quantity', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Quitar' }));
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '3' } });
    expect(screen.getByText('7')).toBeInTheDocument(); // projected
    expect(screen.getByRole('button', { name: 'Confirmar Ajuste' })).not.toBeDisabled();
  });

  it('increments and decrements with the +/- buttons', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Sumar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sumar' }));
    expect(screen.getByRole('spinbutton')).toHaveValue(2);
    fireEvent.click(screen.getByRole('button', { name: 'Restar' }));
    expect(screen.getByRole('spinbutton')).toHaveValue(1);
  });

  it('shows the error message', () => {
    hook.mockReturnValue({ mutate, isPending: false, error: new Error('x') } as never);
    setup();
    expect(screen.getByText(/No se pudo registrar el movimiento/i)).toBeInTheDocument();
  });

  it('closes via cancel', () => {
    const { onClose } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalled();
  });
});
