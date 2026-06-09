import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { OrderTableRow, type OrderTableRowData } from './OrderTableRow';

function renderRow(row: OrderTableRowData, handlers = {}) {
  return render(
    <table>
      <tbody>
        <OrderTableRow row={row} {...handlers} />
      </tbody>
    </table>,
  );
}

const base: OrderTableRowData = {
  id: 'ORD-1',
  customer: 'Cliente A',
  date: '2026-06-01',
  total: '$1,200',
  status: 'pendiente',
};

describe('OrderTableRow', () => {
  it('renders order data and the Pendiente badge with decision actions', () => {
    renderRow(base);
    expect(screen.getByText('ORD-1')).toBeInTheDocument();
    expect(screen.getByText('Cliente A')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    // view + approve + reject
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it.each([
    ['aceptado', 'Aceptado'],
    ['rechazado', 'Rechazado'],
    ['desconocido', 'Pendiente'],
  ])('normalizes status %s to label %s', (status, label) => {
    renderRow({ ...base, status });
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('hides decision actions for non-pending orders', () => {
    renderRow({ ...base, status: 'aceptado' });
    expect(screen.getAllByRole('button')).toHaveLength(1); // only the view button
  });

  it('respects an explicit showDecisionActions=false', () => {
    renderRow({ ...base, showDecisionActions: false });
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('fires view, approve and reject callbacks', () => {
    const onView = vi.fn();
    const onApprove = vi.fn();
    const onReject = vi.fn();
    renderRow(base, { onView, onApprove, onReject });
    const [view, approve, reject] = screen.getAllByRole('button');
    fireEvent.click(view);
    fireEvent.click(approve);
    fireEvent.click(reject);
    expect(onView).toHaveBeenCalledWith('ORD-1');
    expect(onApprove).toHaveBeenCalledWith('ORD-1');
    expect(onReject).toHaveBeenCalledWith('ORD-1');
  });
});
