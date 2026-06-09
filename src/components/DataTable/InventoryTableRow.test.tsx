import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('../../hooks/useFirebaseImageUrl', () => ({ useFirebaseImageUrl: () => ({ data: undefined }) }));

import { InventoryTableRow, type InventoryTableRowData } from './InventoryTableRow';

const base: InventoryTableRowData = {
  id: '1',
  product: 'Fertilizante NPK',
  sku: 'NPK-1',
  category: 'Fertilizantes',
  categoryColor: '#10B981',
  price: '$100.00',
  stock: 50,
  stockMax: 100,
  stockState: 'ok',
  stockLabel: 'Stock normal',
};

function renderRow(row: InventoryTableRowData, handlers = {}) {
  return render(
    <table>
      <tbody>
        <InventoryTableRow row={row} {...handlers} />
      </tbody>
    </table>,
  );
}

describe('InventoryTableRow', () => {
  it('renders product, sku, price and stock label', () => {
    renderRow(base);
    expect(screen.getByText('Fertilizante NPK')).toBeInTheDocument();
    expect(screen.getByText('SKU: NPK-1')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('Stock normal')).toBeInTheDocument();
  });

  it.each([['ok'], ['bajo'], ['agotado']] as const)('renders the %s stock state', (stockState) => {
    renderRow({ ...base, stockState });
    expect(screen.getByTestId('inventory-table-row')).toBeInTheDocument();
  });

  it('renders the image when an imageUrl is given, fallback otherwise', () => {
    const { rerender } = renderRow({ ...base, imageUrl: 'https://img/x.png' });
    expect(screen.getByRole('img', { name: 'Fertilizante NPK' })).toBeInTheDocument();

    rerender(
      <table>
        <tbody>
          <InventoryTableRow row={base} />
        </tbody>
      </table>,
    );
    expect(screen.getByText('📦')).toBeInTheDocument();
  });

  it('handles zero stockMax without dividing by zero', () => {
    renderRow({ ...base, stock: 0, stockMax: 0 });
    expect(screen.getByTestId('inventory-table-row')).toBeInTheDocument();
  });

  it('fires view, edit and delete callbacks', () => {
    const onView = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    renderRow(base, { onView, onEdit, onDelete });
    const [view, edit, del] = screen.getAllByRole('button');
    fireEvent.click(view);
    fireEvent.click(edit);
    fireEvent.click(del);
    expect(onView).toHaveBeenCalledWith('1');
    expect(onEdit).toHaveBeenCalledWith('1');
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
