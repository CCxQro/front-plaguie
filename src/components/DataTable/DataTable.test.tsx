import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('./InventoryTableRow', () => ({
  InventoryTableRow: ({ row }: { row: { id: string; product: string } }) => (
    <tr data-testid="data-row">
      <td>{row.product}</td>
    </tr>
  ),
}));

import { DataTable } from './DataTable';
import type { InventoryTableRowData } from './InventoryTableRow';

const rows = [
  { id: '1', product: 'Fertilizante', sku: 'F-1', category: 'Cat', categoryColor: '#000', price: '$1', stock: 5, stockMax: 10, stockState: 'ok' },
  { id: '2', product: 'Insecticida', sku: 'I-2', category: 'Cat', categoryColor: '#000', price: '$2', stock: 0, stockMax: 10, stockState: 'agotado' },
] as InventoryTableRowData[];

describe('DataTable', () => {
  it('renders the empty state when there are no rows', () => {
    render(<DataTable rows={[]} emptyText="Nada que mostrar" />);
    expect(screen.getByText('Nada que mostrar')).toBeInTheDocument();
    expect(screen.queryByTestId('data-row')).toBeNull();
  });

  it('renders a row per item with header action and pagination', () => {
    render(<DataTable rows={rows} headerActionText="Mostrando 2" pageText="Página 1 de 1" />);
    expect(screen.getAllByTestId('data-row')).toHaveLength(2);
    expect(screen.getByText('Mostrando 2')).toBeInTheDocument();
    expect(screen.getByText('Página 1 de 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeInTheDocument();
  });
});
