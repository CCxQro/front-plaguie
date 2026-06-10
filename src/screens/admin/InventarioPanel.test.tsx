import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('../../hooks/useProducts', () => ({ useProducts: vi.fn() }));
vi.mock('../../hooks/useCategories', () => ({ useCategories: vi.fn() }));
vi.mock('../../hooks/useDeleteProduct', () => ({ useDeleteProduct: vi.fn() }));

vi.mock('../../components/MetricCard', () => ({
  MetricCard: ({ data }: { data: { title: string; value: number } }) => (
    <div data-testid="metric">{data.title}: {data.value}</div>
  ),
}));
vi.mock('../../components/PendingProductsPanel/PendingProductsPanel', () => ({
  PendingProductsPanel: () => <div data-testid="pending" />,
}));
vi.mock('../../components/VerProductoModal/VerProductoModal', () => ({
  VerProductoModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="ver-modal"><button onClick={onClose}>cerrar</button></div>
  ),
}));
vi.mock('../../components/EditarProductoModal/EditarProductoModal', () => ({
  EditarProductoModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="editar-modal"><button onClick={onClose}>cerrar</button></div>
  ),
}));
vi.mock('../../components/DataTable/DataTable', () => ({
  DataTable: ({ rows, onView, onEdit, onDelete }: {
    rows: { id: string }[];
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
  }) => (
    <div data-testid="data-table">
      <span data-testid="row-count">{rows.length}</span>
      <button onClick={() => onView('1')}>view</button>
      <button onClick={() => onEdit('1')}>edit</button>
      <button onClick={() => onDelete('1')}>delete</button>
    </div>
  ),
}));

import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useDeleteProduct } from '../../hooks/useDeleteProduct';
import InventarioPanel from './InventarioPanel';

const productsHook = vi.mocked(useProducts);
const categoriesHook = vi.mocked(useCategories);
const deleteHook = vi.mocked(useDeleteProduct);
const mutate = vi.fn();

const products = [
  { skuSellerId: 1, name: 'Fertilizante NPK', sku: 'NPK-1', categoryName: 'Fertilizantes', categoryId: 1, stock: 50, unitValue: 1, unitName: 'Litro', latestPrice: 100 },
  { skuSellerId: 2, name: 'Insecticida', sku: 'INS-2', categoryName: 'Insecticidas', categoryId: 2, stock: 15, unitValue: 2, latestPrice: 80 },
  { skuSellerId: 3, name: 'Herbicida', sku: 'HRB-3', categoryName: 'Herbicidas', categoryId: 3, stock: 5, unitValue: 1, latestPrice: 50 },
  { skuSellerId: 4, name: 'Agotado', sku: 'AGT-4', categoryName: 'Fertilizantes', categoryId: 1, stock: 0, unitValue: 1, latestPrice: 0 },
];
const categories = [
  { categoryId: 1, name: 'Fertilizantes', colorHexa: '#10B981' },
  { categoryId: 2, name: 'Insecticidas', colorHexa: '#F59E0B' },
  { categoryId: 3, name: 'Herbicidas', colorHexa: '#EF4444' },
];

beforeEach(() => {
  vi.clearAllMocks();
  productsHook.mockReturnValue({ data: products, isLoading: false, error: null } as never);
  categoriesHook.mockReturnValue({ data: categories } as never);
  deleteHook.mockReturnValue({ mutate } as never);
});
afterEach(() => vi.restoreAllMocks());

describe('InventarioPanel', () => {
  it('renders stat cards, pending panel and the table', () => {
    render(<InventarioPanel />);
    expect(screen.getByTestId('inventario-panel')).toBeInTheDocument();
    expect(screen.getByTestId('pending')).toBeInTheDocument();
    expect(screen.getByText('Total Productos: 4')).toBeInTheDocument();
    expect(screen.getByTestId('row-count')).toHaveTextContent('4');
  });

  it('filters by search and stock state', () => {
    render(<InventarioPanel />);
    fireEvent.change(screen.getByPlaceholderText(/Buscar productos/i), { target: { value: 'Herbicida' } });
    expect(screen.getByTestId('row-count')).toHaveTextContent('1');

    fireEvent.change(screen.getByPlaceholderText(/Buscar productos/i), { target: { value: '' } });
    const [, stockSelect] = screen.getAllByRole('combobox');
    fireEvent.change(stockSelect, { target: { value: 'agotado' } });
    expect(screen.getByTestId('row-count')).toHaveTextContent('1');
  });

  it('opens view/edit modals', () => {
    render(<InventarioPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'view' }));
    expect(screen.getByTestId('ver-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'edit' }));
    expect(screen.getByTestId('editar-modal')).toBeInTheDocument();
  });

  it('deletes only after the user confirms', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<InventarioPanel />);

    fireEvent.click(screen.getByRole('button', { name: 'delete' }));
    expect(mutate).not.toHaveBeenCalled();

    confirmSpy.mockReturnValue(true);
    fireEvent.click(screen.getByRole('button', { name: 'delete' }));
    expect(mutate).toHaveBeenCalledWith(1);
  });

  it('shows the error empty text when the query fails', () => {
    productsHook.mockReturnValue({ data: [], isLoading: false, error: new Error('x') } as never);
    render(<InventarioPanel />);
    expect(screen.getByTestId('row-count')).toHaveTextContent('0');
  });
});
